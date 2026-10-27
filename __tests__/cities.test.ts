import { CITY_CATALOG, findCity, MANUAL_LOCATIONS } from '../src/data/cities';
import { CITY_GROUPS, DEFAULT_WORLD_CITIES } from '../src/data/groups';
import { DEFAULT_SETTINGS } from '../src/engine/methods';
import { addDays, computePrayerTimes, nextPrayer } from '../src/engine/prayerTimes';
import { localDateIn, offsetMinutes } from '../src/engine/timezone';
import { cleanList, moveCity, searchGroups, toggleCity } from '../src/state/cityList';

describe('city catalog', () => {
  it('has unique ids', () => {
    const ids = CITY_CATALOG.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has valid coordinates, names and time zones', () => {
    for (const c of CITY_CATALOG) {
      expect(Math.abs(c.latitude)).toBeLessThanOrEqual(90);
      expect(Math.abs(c.longitude)).toBeLessThanOrEqual(180);
      expect(c.name.en.length).toBeGreaterThan(0);
      expect(c.name.ur.length).toBeGreaterThan(0);
      expect(() => offsetMinutes(new Date('2026-10-27T12:00:00Z'), c.timeZone)).not.toThrow();
    }
  });

  it('only groups cities that exist, with no repeats inside a group', () => {
    for (const g of CITY_GROUPS) {
      expect(new Set(g.cityIds).size).toBe(g.cityIds.length);
      for (const id of g.cityIds) expect(findCity(id)).toBeDefined();
    }
  });

  it('puts every catalog city in at least one group', () => {
    const grouped = new Set(CITY_GROUPS.flatMap((g) => g.cityIds));
    for (const c of CITY_CATALOG) expect(grouped.has(c.id)).toBe(true);
  });

  it('lets a city belong to several groups', () => {
    const damascus = CITY_GROUPS.filter((g) => g.cityIds.includes('damascus')).map((g) => g.id);
    expect(damascus).toEqual(expect.arrayContaining(['umayyad', 'zengid', 'ayyubid', 'mamluk', 'ottoman']));
  });

  it('puts Khilafat-e-Rashida first, the Ottoman state second and world cities last', () => {
    expect(CITY_GROUPS[0].id).toBe('rashidun');
    expect(CITY_GROUPS[1].id).toBe('ottoman');
    expect(CITY_GROUPS[CITY_GROUPS.length - 1].id).toBe('world');
  });

  it('includes Chishtian Sharif in the defaults, Mughal and Auliya groups', () => {
    expect(DEFAULT_WORLD_CITIES).toContain('chishtian');
    const groups = CITY_GROUPS.filter((g) => g.cityIds.includes('chishtian')).map((g) => g.id);
    expect(groups).toEqual(expect.arrayContaining(['mughal', 'auliya']));
  });

  it('resolves every default and manual location', () => {
    for (const id of DEFAULT_WORLD_CITIES) expect(findCity(id)).toBeDefined();
    for (const c of MANUAL_LOCATIONS) expect(c).toBeDefined();
  });

  it('computes a next prayer for every city', () => {
    const now = new Date('2026-10-27T12:00:00Z');
    for (const c of CITY_CATALOG) {
      const s = { ...DEFAULT_SETTINGS, method: c.method };
      const d = localDateIn(now, c.timeZone);
      const np = nextPrayer(computePrayerTimes(d, c, s), computePrayerTimes(addDays(d, 1), c, s), now);
      expect(np.time.getTime()).toBeGreaterThan(now.getTime());
    }
  });
});

describe('user city list', () => {
  it('adds and removes a city', () => {
    expect(toggleCity(['makkah'], 'bursa')).toEqual(['makkah', 'bursa']);
    expect(toggleCity(['makkah', 'bursa'], 'makkah')).toEqual(['bursa']);
  });

  it('moves a city up and down within bounds', () => {
    expect(moveCity(['a', 'b', 'c'], 'b', -1)).toEqual(['b', 'a', 'c']);
    expect(moveCity(['a', 'b', 'c'], 'c', 1)).toEqual(['a', 'b', 'c']);
  });

  it('cleans stored lists', () => {
    expect(cleanList(['makkah', 'nowhere', 'makkah', 5], [])).toEqual(['makkah']);
    expect(cleanList('bad', ['konya'])).toEqual(['konya']);
  });

  it('searches by city, accents and empire name', () => {
    expect(searchGroups('sogut').flatMap((s) => s.data.map((c) => c.id))).toContain('sogut');
    const ottoman = searchGroups('usmania');
    expect(ottoman.map((s) => s.group.id)).toEqual(['ottoman']);
    expect(ottoman[0].data.length).toBeGreaterThan(20);
    const chishtian = searchGroups('chisht');
    expect(chishtian.map((s) => s.group.id)).toEqual(['mughal', 'bahawalpur', 'auliya']);
    expect(searchGroups('').length).toBe(CITY_GROUPS.length);
  });
});
