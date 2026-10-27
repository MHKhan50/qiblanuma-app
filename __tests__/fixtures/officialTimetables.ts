// Official timetables, entered by hand from the publishing body's own page or
// printed calendar. Each entry must name its source. Leave empty until real
// values are copied; the test suite skips this file while it is empty.
//
// Example shape:
// {
//   source: 'Name of masjid or authority, URL or printed calendar, year',
//   latitude: 55.8642, longitude: -4.2518, timeZone: 'Europe/London',
//   method: 'karachi', asrSchool: 'hanafi', highLatitudeRule: 'angleBased',
//   date: { year: 2026, month: 11, day: 1 },
//   times: { fajr: '05:31', dhuhr: '12:05', asr: '14:10', maghrib: '16:35', isha: '18:30' },
//   toleranceMinutes: 2,
// }
import type { AsrSchool, HighLatitudeRule, MethodId } from '../../src/engine/methods';

export interface OfficialEntry {
  source: string;
  latitude: number;
  longitude: number;
  timeZone: string;
  method: MethodId;
  asrSchool: AsrSchool;
  highLatitudeRule: HighLatitudeRule;
  date: { year: number; month: number; day: number };
  times: Partial<Record<'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha', string>>;
  toleranceMinutes: number;
}

export const OFFICIAL: OfficialEntry[] = [];
