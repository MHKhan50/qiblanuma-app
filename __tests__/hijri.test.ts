import { DEFAULT_SETTINGS } from '../src/engine/methods';
import { addDays, computePrayerTimes, currentPrayer } from '../src/engine/prayerTimes';
import { hijriDate, tabularHijri } from '../src/engine/hijri';

describe('hijri date', () => {
  it('tabular calendar starts 1 Muharram 1 AH on 16 July 622 (Julian)', () => {
    expect(tabularHijri(1948439.5)).toEqual({ year: 1, month: 1, day: 1 });
  });

  it('tabular and Umm al-Qura agree within two days over a year', () => {
    for (let i = 0; i < 365; i += 7) {
      const d = new Date(Date.UTC(2026, 0, 1) + i * 86400000);
      const a = hijriDate(d, 'UTC');
      const b = tabularHijri(d.getTime() / 86400000 + 2440587.5);
      const days = (h: { year: number; month: number; day: number }) => h.year * 354.367 + (h.month - 1) * 29.53 + h.day;
      expect(Math.abs(days(a) - days(b))).toBeLessThanOrEqual(2.5);
    }
  });

  it('applies the user offset', () => {
    const d = new Date('2026-10-27T12:00:00Z');
    const a = hijriDate(d, 'UTC', 0);
    const b = hijriDate(d, 'UTC', 1);
    expect(b.day === a.day + 1 || b.day === 1).toBe(true);
  });
});

describe('current prayer', () => {
  const day = { year: 2026, month: 10, day: 27 };
  const c = { latitude: 31.5204, longitude: 74.3587 };
  const today = computePrayerTimes(day, c, DEFAULT_SETTINGS);
  const tomorrow = computePrayerTimes(addDays(day, 1), c, DEFAULT_SETTINGS);
  const at = (d: Date, mins: number) => new Date(d.getTime() + mins * 60000);

  it('ends Fajr at sunrise and has no prayer before Dhuhr', () => {
    expect(currentPrayer(today, tomorrow, at(today.times.fajr, 1))).toEqual({ name: 'fajr', endsAt: today.times.sunrise });
    expect(currentPrayer(today, tomorrow, at(today.times.sunrise, 1))).toBeNull();
  });

  it('runs Asr until Maghrib and Isha until tomorrow Fajr', () => {
    expect(currentPrayer(today, tomorrow, at(today.times.asr, 1))?.endsAt).toEqual(today.times.maghrib);
    expect(currentPrayer(today, tomorrow, at(today.times.isha, 1))).toEqual({ name: 'isha', endsAt: tomorrow.times.fajr });
  });
});
