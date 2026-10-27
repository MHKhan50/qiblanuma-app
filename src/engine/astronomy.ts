// Solar position from the low precision formulas published by the US Naval
// Observatory ("Approximate Solar Coordinates"). Accuracy is about one
// arcminute between 1950 and 2050, which is well below one minute of time.

const RAD = Math.PI / 180;

export const sinD = (d: number): number => Math.sin(d * RAD);
export const cosD = (d: number): number => Math.cos(d * RAD);
export const tanD = (d: number): number => Math.tan(d * RAD);
export const asinD = (x: number): number => Math.asin(x) / RAD;
export const acosD = (x: number): number => Math.acos(x) / RAD;
export const atan2D = (y: number, x: number): number => Math.atan2(y, x) / RAD;
export const acotD = (x: number): number => Math.atan(1 / x) / RAD;

export function fixAngle(a: number): number {
  const r = a % 360;
  return r < 0 ? r + 360 : r;
}

export function fixHour(h: number): number {
  const r = h % 24;
  return r < 0 ? r + 24 : r;
}

/** Julian day at 0h UT of a Gregorian calendar date. */
export function julianDay(year: number, month: number, day: number): number {
  return Date.UTC(year, month - 1, day) / 86400000 + 2440587.5;
}

export interface SunPosition {
  /** Declination in degrees. */
  declination: number;
  /** Equation of time in hours (apparent minus mean solar time). */
  equationOfTime: number;
}

export function sunPosition(jd: number): SunPosition {
  const d = jd - 2451545.0;
  const g = fixAngle(357.529 + 0.98560028 * d);
  const q = fixAngle(280.459 + 0.98564736 * d);
  const l = fixAngle(q + 1.915 * sinD(g) + 0.02 * sinD(2 * g));
  const e = 23.439 - 0.00000036 * d;
  const ra = fixHour(atan2D(cosD(e) * sinD(l), cosD(l)) / 15);
  let eqt = q / 15 - ra;
  if (eqt > 12) eqt -= 24;
  if (eqt < -12) eqt += 24;
  return { declination: asinD(sinD(e) * sinD(l)), equationOfTime: eqt };
}
