import { DEFAULT_SETTINGS, PRAYER_ORDER, type Settings } from '../src/engine/methods';
import { addDays, computePrayerTimes, nextPrayer } from '../src/engine/prayerTimes';
import { distanceToKaabaKm, greatCirclePath, KAABA, qiblaBearing, turnAngle } from '../src/engine/qibla';
import { formatClock, formatCountdown, localDateIn, offsetMinutes } from '../src/engine/timezone';

const GLASGOW = { latitude: 55.8642, longitude: -4.2518 };
const LAHORE = { latitude: 31.5204, longitude: 74.3587 };
const day = { year: 2026, month: 10, day: 27 };

describe('prayer time engine', () => {
  it('returns prayers in order', () => {
    const r = computePrayerTimes(day, LAHORE, DEFAULT_SETTINGS);
    const t = PRAYER_ORDER.map((p) => r.times[p].getTime());
    expect([...t].sort((a, b) => a - b)).toEqual(t);
  });

  it('puts Hanafi Asr after Shafi Asr', () => {
    const h = computePrayerTimes(day, LAHORE, { ...DEFAULT_SETTINGS, asrSchool: 'hanafi' });
    const s = computePrayerTimes(day, LAHORE, { ...DEFAULT_SETTINGS, asrSchool: 'shafi' });
    expect(h.times.asr.getTime()).toBeGreaterThan(s.times.asr.getTime() + 20 * 60000);
  });

  it('applies per-prayer minute adjustments', () => {
    const base = computePrayerTimes(day, LAHORE, DEFAULT_SETTINGS);
    const adj: Settings = { ...DEFAULT_SETTINGS, adjustments: { ...DEFAULT_SETTINGS.adjustments, isha: 5, fajr: -3 } };
    const r = computePrayerTimes(day, LAHORE, adj);
    expect(r.times.isha.getTime() - base.times.isha.getTime()).toBe(5 * 60000);
    expect(r.times.fajr.getTime() - base.times.fajr.getTime()).toBe(-3 * 60000);
  });

  it('gives Glasgow a usable Fajr and Isha at midsummer with a high latitude rule', () => {
    const r = computePrayerTimes({ year: 2026, month: 6, day: 21 }, GLASGOW, DEFAULT_SETTINGS);
    expect(r.estimated).toEqual(expect.arrayContaining(['fajr', 'isha']));
    expect(r.times.fajr.getTime()).toBeLessThan(r.times.sunrise.getTime());
    expect(r.times.isha.getTime()).toBeGreaterThan(r.times.maghrib.getTime());
  });

  it('refuses to invent Glasgow midsummer Isha when the rule is none', () => {
    expect(() =>
      computePrayerTimes({ year: 2026, month: 6, day: 21 }, GLASGOW, { ...DEFAULT_SETTINGS, highLatitudeRule: 'none' }),
    ).toThrow();
  });

  it('uses 90 minutes after Maghrib for Umm al-Qura Isha', () => {
    const r = computePrayerTimes(day, KAABA, { ...DEFAULT_SETTINGS, method: 'makkah' });
    expect(r.times.isha.getTime() - r.times.maghrib.getTime()).toBe(90 * 60000);
  });

  it('sets makruh windows around sunrise, zawal and sunset', () => {
    const r = computePrayerTimes(day, LAHORE, DEFAULT_SETTINGS);
    expect(r.makruh.map((m) => m.label)).toEqual(['sunrise', 'zawal', 'sunset']);
    for (const m of r.makruh) expect(m.end.getTime()).toBeGreaterThan(m.start.getTime());
  });

  it('lines makruh windows up with the rounded prayer times', () => {
    const r = computePrayerTimes(day, LAHORE, DEFAULT_SETTINGS);
    expect(r.makruh[0].start.getTime()).toBe(r.times.sunrise.getTime());
    expect(r.makruh[1].end.getTime()).toBe(r.times.dhuhr.getTime());
    expect(r.makruh[2].end.getTime()).toBe(r.times.maghrib.getTime());
  });

  it('finds the next prayer and rolls over to tomorrow after Isha', () => {
    const today = computePrayerTimes(day, LAHORE, DEFAULT_SETTINGS);
    const tomorrow = computePrayerTimes(addDays(day, 1), LAHORE, DEFAULT_SETTINGS);
    const afterAsr = new Date(today.times.asr.getTime() + 60000);
    expect(nextPrayer(today, tomorrow, afterAsr).name).toBe('maghrib');
    const lateNight = new Date(today.times.isha.getTime() + 60000);
    expect(nextPrayer(today, tomorrow, lateNight)).toEqual({ name: 'fajr', time: tomorrow.times.fajr });
  });

  it('adds days across month and year ends', () => {
    expect(addDays({ year: 2026, month: 12, day: 31 }, 1)).toEqual({ year: 2027, month: 1, day: 1 });
    expect(addDays({ year: 2028, month: 2, day: 28 }, 1)).toEqual({ year: 2028, month: 2, day: 29 });
  });
});

describe('qibla', () => {
  it('turns the shortest way', () => {
    expect(turnAngle(119, 100)).toBeCloseTo(19);
    expect(turnAngle(10, 350)).toBeCloseTo(20);
    expect(turnAngle(350, 10)).toBeCloseTo(-20);
  });

  it('gives a sensible distance from Glasgow', () => {
    const km = distanceToKaabaKm(GLASGOW);
    expect(km).toBeGreaterThan(4900);
    expect(km).toBeLessThan(5300);
  });

  it('draws a path that starts here and ends at the Kaaba', () => {
    const path = greatCirclePath(GLASGOW, 32);
    expect(path[0].latitude).toBeCloseTo(GLASGOW.latitude, 4);
    expect(path[32].latitude).toBeCloseTo(KAABA.latitude, 4);
    expect(path[32].longitude).toBeCloseTo(KAABA.longitude, 4);
  });

  it('keeps bearings in 0 to 360', () => {
    const b = qiblaBearing({ latitude: -33.87, longitude: 151.21 });
    expect(b).toBeGreaterThanOrEqual(0);
    expect(b).toBeLessThan(360);
  });
});

describe('time zones', () => {
  it('follows the UK clock change', () => {
    expect(offsetMinutes(new Date('2026-10-24T12:00:00Z'), 'Europe/London')).toBe(60);
    expect(offsetMinutes(new Date('2026-10-26T12:00:00Z'), 'Europe/London')).toBe(0);
  });

  it('handles Kabul half hour offset and Pakistan', () => {
    expect(offsetMinutes(new Date('2026-10-27T12:00:00Z'), 'Asia/Kabul')).toBe(270);
    expect(offsetMinutes(new Date('2026-10-27T12:00:00Z'), 'Asia/Karachi')).toBe(300);
  });

  it('gives the local date at a location', () => {
    expect(localDateIn(new Date('2026-10-27T20:30:00Z'), 'Asia/Karachi')).toEqual({ year: 2026, month: 10, day: 28 });
  });

  it('formats clocks and countdowns', () => {
    const d = new Date('2026-10-27T13:05:00Z');
    expect(formatClock(d, 'UTC', true)).toBe('13:05');
    expect(formatClock(d, 'UTC', false)).toBe('1:05 PM');
    expect(formatClock(new Date('2026-10-27T00:07:00Z'), 'UTC', false)).toBe('12:07 AM');
    expect(formatCountdown(3723000)).toBe('1:02:03');
  });
});
