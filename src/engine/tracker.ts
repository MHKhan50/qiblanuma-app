// Daily deen tracker: the five prayers plus Quran and dhikr, kept on the phone.
export const TRACK_ITEMS = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha', 'quran', 'dhikr'] as const;
export type TrackItem = (typeof TRACK_ITEMS)[number];
export type DayLog = Partial<Record<TrackItem, boolean>>;
export type TrackerLog = Record<string, DayLog>;

const PRAYERS: TrackItem[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

export function dateKey(d: { year: number; month: number; day: number }): string {
  return `${d.year}-${String(d.month).padStart(2, '0')}-${String(d.day).padStart(2, '0')}`;
}

function prevKey(key: string): string {
  const [y, m, d] = key.split('-').map(Number);
  const t = new Date(Date.UTC(y, m - 1, d) - 86400000);
  return dateKey({ year: t.getUTCFullYear(), month: t.getUTCMonth() + 1, day: t.getUTCDate() });
}

export const allPrayers = (day: DayLog | undefined): boolean => PRAYERS.every((p) => day?.[p]);

/** Days in a row, ending today (or yesterday if today is not finished yet), with all five prayers marked. */
export function prayerStreak(log: TrackerLog, todayKey: string): number {
  let key = allPrayers(log[todayKey]) ? todayKey : prevKey(todayKey);
  let n = 0;
  while (allPrayers(log[key])) { n++; key = prevKey(key); }
  return n;
}

/** Toggle one item for a day and keep only the last 90 days. */
export function toggle(log: TrackerLog, key: string, item: TrackItem): TrackerLog {
  const next: TrackerLog = { ...log, [key]: { ...log[key], [item]: !log[key]?.[item] } };
  const keys = Object.keys(next).sort();
  for (const k of keys.slice(0, Math.max(0, keys.length - 90))) delete next[k];
  return next;
}

/** The last `n` day keys ending today, oldest first. */
export function lastDays(todayKey: string, n: number): string[] {
  const out = [todayKey];
  while (out.length < n) out.unshift(prevKey(out[0]));
  return out;
}
