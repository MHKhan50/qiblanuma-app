import { atan2D, cosD, fixAngle, sinD } from './astronomy';
import type { Coordinates } from './prayerTimes';

/** Centre of the Kaaba, Masjid al-Haram. */
export const KAABA: Coordinates = { latitude: 21.4225, longitude: 39.8262 };

const EARTH_RADIUS_KM = 6371.0088;

/** Great-circle initial bearing to the Kaaba, degrees clockwise from true north. */
export function qiblaBearing(from: Coordinates): number {
  const dLon = KAABA.longitude - from.longitude;
  const y = sinD(dLon) * cosD(KAABA.latitude);
  const x =
    cosD(from.latitude) * sinD(KAABA.latitude) -
    sinD(from.latitude) * cosD(KAABA.latitude) * cosD(dLon);
  return fixAngle(atan2D(y, x));
}

/** Great-circle distance to the Kaaba in kilometres (haversine). */
export function distanceToKaabaKm(from: Coordinates): number {
  const rad = Math.PI / 180;
  const dLat = (KAABA.latitude - from.latitude) * rad;
  const dLon = (KAABA.longitude - from.longitude) * rad;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(from.latitude * rad) * Math.cos(KAABA.latitude * rad) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a));
}

/**
 * Angle to turn the phone so its top points at the Qibla.
 * heading: the device's true heading in degrees. Result in (-180, 180].
 */
export function turnAngle(qibla: number, heading: number): number {
  let d = fixAngle(qibla - heading);
  if (d > 180) d -= 360;
  return d;
}

/** Points along the great circle to the Kaaba, for drawing a map line. */
export function greatCirclePath(from: Coordinates, steps = 64): Coordinates[] {
  const rad = Math.PI / 180;
  const f1 = from.latitude * rad, l1 = from.longitude * rad;
  const f2 = KAABA.latitude * rad, l2 = KAABA.longitude * rad;
  const d = distanceToKaabaKm(from) / EARTH_RADIUS_KM;
  if (d === 0) return [from];
  const out: Coordinates[] = [];
  for (let i = 0; i <= steps; i++) {
    const f = i / steps;
    const a = Math.sin((1 - f) * d) / Math.sin(d);
    const b = Math.sin(f * d) / Math.sin(d);
    const x = a * Math.cos(f1) * Math.cos(l1) + b * Math.cos(f2) * Math.cos(l2);
    const y = a * Math.cos(f1) * Math.sin(l1) + b * Math.cos(f2) * Math.sin(l2);
    const z = a * Math.sin(f1) + b * Math.sin(f2);
    out.push({
      latitude: Math.atan2(z, Math.sqrt(x * x + y * y)) / rad,
      longitude: Math.atan2(y, x) / rad,
    });
  }
  return out;
}
