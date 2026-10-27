import type { PrayerName, Settings } from './methods';
import { addDays, computePrayerTimes, type Coordinates, type LocalDate } from './prayerTimes';

export type AdhanPrayer = Exclude<PrayerName, 'sunrise'>;
export const ADHAN_PRAYERS: AdhanPrayer[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

export interface Reminder { prayer: AdhanPrayer; date: Date }

/**
 * Upcoming prayer reminders for the next `days` days, in time order. iOS keeps
 * at most 64 pending local notifications, so the list is capped below that and
 * rebuilt every time the app opens.
 */
export function upcomingReminders(
  from: LocalDate, coords: Coordinates, settings: Settings,
  enabled: Record<AdhanPrayer, boolean>, now: Date, days = 4, cap = 60,
): Reminder[] {
  const out: Reminder[] = [];
  for (let i = 0; i < days; i++) {
    const t = computePrayerTimes(addDays(from, i), coords, settings).times;
    for (const p of ADHAN_PRAYERS) {
      if (enabled[p] && t[p].getTime() > now.getTime()) out.push({ prayer: p, date: t[p] });
    }
  }
  return out.sort((a, b) => a.date.getTime() - b.date.getTime()).slice(0, cap);
}
