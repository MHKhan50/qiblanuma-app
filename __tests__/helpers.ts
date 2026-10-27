import { formatClock } from '../src/engine/timezone';

export function minutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

/** Signed difference in minutes between a computed instant and an HH:MM clock value. */
export function diffMinutes(instant: Date, timeZone: string, expected: string): number {
  return minutes(formatClock(instant, timeZone, true)) - minutes(expected);
}
