// Published values from independent sources, copied by hand on 27 Oct 2026.
// These are third-party calculated timetables, not official timetables, so
// they check that our astronomy agrees with other implementations.

/**
 * ihadis.com, Karachi page, October 2026, method "Karachi" (University of
 * Islamic Sciences). The site does not state its Asr school; its Asr values
 * match the standard (Shafi) shadow. 24 h clock, Asia/Karachi.
 * https://ihadis.com/en/countries/pakistan/prayer-times-karachi
 */
export const KARACHI_IHADIS = {
  latitude: 24.8607,
  longitude: 67.0011,
  timeZone: 'Asia/Karachi',
  rows: [
    { day: 17, fajr: '05:15', dhuhr: '12:18', asr: '15:35', maghrib: '18:03', isha: '19:20' },
    { day: 18, fajr: '05:15', dhuhr: '12:18', asr: '15:35', maghrib: '18:03', isha: '19:19' },
    { day: 19, fajr: '05:16', dhuhr: '12:18', asr: '15:34', maghrib: '18:02', isha: '19:18' },
    { day: 20, fajr: '05:16', dhuhr: '12:18', asr: '15:34', maghrib: '18:01', isha: '19:17' },
    { day: 21, fajr: '05:16', dhuhr: '12:18', asr: '15:33', maghrib: '18:00', isha: '19:16' },
    { day: 22, fajr: '05:17', dhuhr: '12:17', asr: '15:33', maghrib: '17:59', isha: '19:16' },
    { day: 23, fajr: '05:17', dhuhr: '12:17', asr: '15:32', maghrib: '17:58', isha: '19:15' },
    { day: 24, fajr: '05:18', dhuhr: '12:17', asr: '15:32', maghrib: '17:58', isha: '19:14' },
    { day: 25, fajr: '05:18', dhuhr: '12:17', asr: '15:31', maghrib: '17:57', isha: '19:13' },
    { day: 26, fajr: '05:19', dhuhr: '12:17', asr: '15:30', maghrib: '17:56', isha: '19:13' },
  ],
};

/**
 * sunrisesunset.io, Glasgow (55.8651, -4.2576), October 2026, Europe/London.
 * Includes days on both sides of the 25 Oct clock change.
 * https://sunrisesunset.io/gb/scotland/glasgow/
 */
export const GLASGOW_SUN = {
  latitude: 55.8651,
  longitude: -4.2576,
  timeZone: 'Europe/London',
  rows: [
    { day: 1, sunrise: '07:18', sunset: '18:54' },
    { day: 8, sunrise: '07:32', sunset: '18:35' },
    { day: 15, sunrise: '07:46', sunset: '18:18' },
    { day: 22, sunrise: '08:00', sunset: '18:01' },
    { day: 24, sunrise: '08:04', sunset: '17:56' },
    { day: 25, sunrise: '07:07', sunset: '16:54' },
    { day: 27, sunrise: '07:11', sunset: '16:49' },
    { day: 31, sunrise: '07:19', sunset: '16:40' },
  ],
};

/**
 * Qibla bearings (degrees from true north) listed by makkahlive.net.
 * https://makkahlive.net/en/tools/qibla/united-kingdom/glasgow
 */
export const QIBLA_BEARINGS = [
  { city: 'London', latitude: 51.5072, longitude: -0.1276, bearing: 119.0 },
  { city: 'New York', latitude: 40.7128, longitude: -74.006, bearing: 58.5 },
  { city: 'Istanbul', latitude: 41.0082, longitude: 28.9784, bearing: 151.6 },
  { city: 'Karachi', latitude: 24.8607, longitude: 67.0011, bearing: 267.7 },
  { city: 'Sydney', latitude: -33.8688, longitude: 151.2093, bearing: 277.5 },
  { city: 'Cairo', latitude: 30.0444, longitude: 31.2357, bearing: 136.1 },
];
