import { DEFAULT_SETTINGS } from '../src/engine/methods';
import { computePrayerTimes } from '../src/engine/prayerTimes';
import { OFFICIAL } from './fixtures/officialTimetables';
import { diffMinutes } from './helpers';

const run = OFFICIAL.length > 0 ? describe : describe.skip;

run('official timetables', () => {
  for (const e of OFFICIAL) {
    it(`${e.source} ${e.date.year}-${e.date.month}-${e.date.day}`, () => {
      const r = computePrayerTimes(e.date, e, {
        ...DEFAULT_SETTINGS,
        method: e.method,
        asrSchool: e.asrSchool,
        highLatitudeRule: e.highLatitudeRule,
      });
      for (const [p, hhmm] of Object.entries(e.times)) {
        const d = diffMinutes(r.times[p as keyof typeof r.times], e.timeZone, hhmm as string);
        expect(Math.abs(d)).toBeLessThanOrEqual(e.toleranceMinutes);
      }
    });
  }
});

// Keeps Jest from failing on an empty file while OFFICIAL is empty.
it('loads the official timetable fixture', () => {
  expect(Array.isArray(OFFICIAL)).toBe(true);
});
