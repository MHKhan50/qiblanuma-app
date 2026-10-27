import type { LocalDate } from './prayerTimes';

// Time zone rules come from the IANA tz database through the platform's
// Intl implementation (ICU on Android, the system database on iOS), so
// daylight saving changes such as the UK clock change are handled for us.

interface Parts {
  year: number; month: number; day: number; hour: number; minute: number; second: number;
}

const formatterCache: Record<string, Intl.DateTimeFormat> = {};

function formatter(timeZone: string): Intl.DateTimeFormat {
  if (!formatterCache[timeZone]) {
    formatterCache[timeZone] = new Intl.DateTimeFormat('en-GB', {
      timeZone,
      hourCycle: 'h23',
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    });
  }
  return formatterCache[timeZone];
}

export function zonedParts(instant: Date, timeZone: string): Parts {
  const out: Record<string, number> = {};
  for (const p of formatter(timeZone).formatToParts(instant)) {
    if (p.type !== 'literal') out[p.type] = Number(p.value);
  }
  return {
    year: out.year, month: out.month, day: out.day,
    hour: out.hour === 24 ? 0 : out.hour, minute: out.minute, second: out.second,
  };
}

/** Offset of the zone from UTC at that instant, in minutes. */
export function offsetMinutes(instant: Date, timeZone: string): number {
  const p = zonedParts(instant, timeZone);
  const asUTC = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  return Math.round((asUTC - Math.floor(instant.getTime() / 1000) * 1000) / 60000);
}

export function localDateIn(instant: Date, timeZone: string): LocalDate {
  const p = zonedParts(instant, timeZone);
  return { year: p.year, month: p.month, day: p.day };
}

export function formatClock(instant: Date, timeZone: string, use24h: boolean): string {
  const p = zonedParts(instant, timeZone);
  const mm = String(p.minute).padStart(2, '0');
  if (use24h) return `${String(p.hour).padStart(2, '0')}:${mm}`;
  const h12 = p.hour % 12 === 0 ? 12 : p.hour % 12;
  return `${h12}:${mm} ${p.hour < 12 ? 'AM' : 'PM'}`;
}

/** Device time zone, for example "Europe/London". */
export function deviceTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}

export function formatCountdown(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
