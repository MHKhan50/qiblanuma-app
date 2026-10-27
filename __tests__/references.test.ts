import { DEFAULT_SETTINGS } from '../src/engine/methods';
import { computePrayerTimes } from '../src/engine/prayerTimes';
import { qiblaBearing } from '../src/engine/qibla';
import { GLASGOW_SUN, KARACHI_IHADIS, QIBLA_BEARINGS } from './fixtures/externalReferences';
import { diffMinutes } from './helpers';

describe('Karachi method against a published Karachi timetable', () => {
  const settings = { ...DEFAULT_SETTINGS, method: 'karachi' as const, asrSchool: 'shafi' as const };
  for (const row of KARACHI_IHADIS.rows) {
    it(`matches 2026-10-${row.day} within 1 minute`, () => {
      const r = computePrayerTimes({ year: 2026, month: 10, day: row.day }, KARACHI_IHADIS, settings);
      for (const p of ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const) {
        expect(Math.abs(diffMinutes(r.times[p], KARACHI_IHADIS.timeZone, row[p]))).toBeLessThanOrEqual(1);
      }
    });
  }
});

// This source gives days about 3 minutes longer than the NOAA solar
// calculator formulas, which agree with our values to the minute, so the
// tolerance here is 3 minutes. The likely cause is a different horizon or
// elevation assumption on the website.
describe('Sunrise and sunset in Glasgow, across the UK clock change', () => {
  for (const row of GLASGOW_SUN.rows) {
    it(`matches 2026-10-${row.day} within 3 minutes`, () => {
      const r = computePrayerTimes({ year: 2026, month: 10, day: row.day }, GLASGOW_SUN, DEFAULT_SETTINGS);
      expect(Math.abs(diffMinutes(r.times.sunrise, GLASGOW_SUN.timeZone, row.sunrise))).toBeLessThanOrEqual(3);
      expect(Math.abs(diffMinutes(r.times.maghrib, GLASGOW_SUN.timeZone, row.sunset))).toBeLessThanOrEqual(3);
    });
  }
});

describe('Qibla bearing against published values', () => {
  for (const c of QIBLA_BEARINGS) {
    it(`${c.city} is ${c.bearing}°`, () => {
      expect(Math.abs(qiblaBearing(c) - c.bearing)).toBeLessThanOrEqual(0.1);
    });
  }
});
