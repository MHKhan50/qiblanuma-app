import { acosD, acotD, cosD, julianDay, sinD, sunPosition, tanD } from './astronomy';
import { METHODS, PRAYER_ORDER, type PrayerName, type Settings } from './methods';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

/** A calendar date as seen at the location (not a UTC instant). */
export interface LocalDate {
  year: number;
  month: number; // 1-12
  day: number;
}

export interface MakruhWindow {
  label: 'sunrise' | 'zawal' | 'sunset';
  start: Date;
  end: Date;
}

export interface PrayerTimes {
  date: LocalDate;
  times: Record<PrayerName, Date>;
  /** Prayers whose time came from a high latitude rule, not the angle. */
  estimated: PrayerName[];
  makruh: MakruhWindow[];
}

const SUN_HORIZON = 0.833; // refraction plus solar semi-diameter
const MINUTE = 60000;

/** Hours UT, from 0h UT of the date, at which the sun's centre crosses the meridian. */
function transitUT(jd0: number, lon: number): number {
  let t = 12 - lon / 15;
  for (let i = 0; i < 3; i++) {
    t = 12 - lon / 15 - sunPosition(jd0 + t / 24).equationOfTime;
  }
  return t;
}

/**
 * Hour angle (in hours) at which the sun reaches `altitude` degrees.
 * Returns NaN when the sun never reaches that altitude on this day.
 */
function hourAngle(altitude: number, lat: number, decl: number): number {
  const c = (sinD(altitude) - sinD(lat) * sinD(decl)) / (cosD(lat) * cosD(decl));
  if (c < -1 || c > 1) return NaN;
  return acosD(c) / 15;
}

/** Event time in hours UT, iterating so declination is taken at the event itself. */
function eventUT(
  jd0: number,
  coords: Coordinates,
  side: 'before' | 'after',
  altitudeOf: (decl: number) => number,
): number {
  const noon = transitUT(jd0, coords.longitude);
  let t = noon;
  for (let i = 0; i < 3; i++) {
    const { declination } = sunPosition(jd0 + t / 24);
    const h = hourAngle(altitudeOf(declination), coords.latitude, declination);
    if (Number.isNaN(h)) return NaN;
    const transit = 12 - coords.longitude / 15 - sunPosition(jd0 + t / 24).equationOfTime;
    t = side === 'before' ? transit - h : transit + h;
  }
  return t;
}

function toDate(jd0: number, hoursUT: number): Date {
  const ms = (jd0 - 2440587.5) * 86400000 + hoursUT * 3600000;
  return new Date(Math.round(ms / 1000) * 1000);
}

export function computePrayerTimes(date: LocalDate, coords: Coordinates, settings: Settings): PrayerTimes {
  const method = METHODS[settings.method];
  const jd0 = julianDay(date.year, date.month, date.day);
  const horizon = SUN_HORIZON + 0.0347 * Math.sqrt(Math.max(0, settings.elevation));
  const shadow = settings.asrSchool === 'hanafi' ? 2 : 1;
  const lat = coords.latitude;

  const dhuhr = transitUT(jd0, coords.longitude);
  const sunrise = eventUT(jd0, coords, 'before', () => -horizon);
  const sunset = eventUT(jd0, coords, 'after', () => -horizon);
  let fajr = eventUT(jd0, coords, 'before', () => -method.fajrAngle);
  const asr = eventUT(jd0, coords, 'after', (decl) => acotD(shadow + tanD(Math.abs(lat - decl))));
  const maghrib =
    method.maghribAngle !== undefined
      ? eventUT(jd0, coords, 'after', () => -(method.maghribAngle as number))
      : sunset;
  let isha =
    method.ishaMinutes !== undefined
      ? maghrib + method.ishaMinutes / 60
      : eventUT(jd0, coords, 'after', () => -method.ishaAngle);

  const estimated: PrayerName[] = [];
  if (Number.isNaN(sunrise) || Number.isNaN(sunset)) {
    throw new Error('The sun does not rise or set at this location on this date.');
  }

  // High latitude rule: cap the twilight to a portion of the night.
  const night = 24 - (sunset - sunrise);
  const portion = (angle: number): number => {
    switch (settings.highLatitudeRule) {
      case 'middleOfNight': return night / 2;
      case 'seventhOfNight': return night / 7;
      case 'angleBased': return (angle / 60) * night;
      default: return Infinity;
    }
  };
  if (settings.highLatitudeRule !== 'none') {
    const fp = portion(method.fajrAngle);
    if (Number.isNaN(fajr) || sunrise - fajr > fp) {
      fajr = sunrise - fp;
      estimated.push('fajr');
    }
    if (method.ishaMinutes === undefined) {
      const ip = portion(method.ishaAngle);
      if (Number.isNaN(isha) || isha - sunset > ip) {
        isha = sunset + ip;
        estimated.push('isha');
      }
    }
  }

  const raw: Record<PrayerName, number> = { fajr, sunrise, dhuhr, asr, maghrib, isha };
  const times = {} as Record<PrayerName, Date>;
  for (const p of PRAYER_ORDER) {
    if (Number.isNaN(raw[p])) {
      throw new Error(`No ${p} time at this location; choose a high latitude rule.`);
    }
    const exact = toDate(jd0, raw[p]).getTime() + settings.adjustments[p] * MINUTE;
    times[p] = new Date(Math.round(exact / MINUTE) * MINUTE);
  }

  // Times when salah is makruh (Hanafi): from sunrise until the sun has
  // risen (about 15 minutes), a short window before zawal, and the last
  // minutes before sunset. Durations are conventional approximations.
  const noonDate = toDate(jd0, dhuhr);
  const riseDate = toDate(jd0, sunrise);
  const setDate = toDate(jd0, sunset);
  const makruh: MakruhWindow[] = [
    { label: 'sunrise', start: riseDate, end: new Date(riseDate.getTime() + 15 * MINUTE) },
    { label: 'zawal', start: new Date(noonDate.getTime() - 5 * MINUTE), end: noonDate },
    { label: 'sunset', start: new Date(setDate.getTime() - 15 * MINUTE), end: setDate },
  ];

  return { date, times, estimated, makruh };
}

export interface NextPrayer {
  name: PrayerName;
  time: Date;
}

/** The next salah (sunrise excluded) after `now`, looking into tomorrow if needed. */
export function nextPrayer(today: PrayerTimes, tomorrow: PrayerTimes, now: Date): NextPrayer {
  for (const p of PRAYER_ORDER) {
    if (p === 'sunrise') continue;
    if (today.times[p].getTime() > now.getTime()) return { name: p, time: today.times[p] };
  }
  return { name: 'fajr', time: tomorrow.times.fajr };
}

export function addDays(d: LocalDate, n: number): LocalDate {
  const t = new Date(Date.UTC(d.year, d.month - 1, d.day + n));
  return { year: t.getUTCFullYear(), month: t.getUTCMonth() + 1, day: t.getUTCDate() };
}
