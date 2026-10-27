import { CITY_CATALOG, type City } from '../data/cities';
import { CITY_GROUPS, type CityGroup } from '../data/groups';

// Pure helpers for the user's own list of world-clock cities.

export function toggleCity(list: string[], id: string): string[] {
  return list.includes(id) ? list.filter((c) => c !== id) : [...list, id];
}

export function moveCity(list: string[], id: string, delta: -1 | 1): string[] {
  const i = list.indexOf(id);
  const j = i + delta;
  if (i < 0 || j < 0 || j >= list.length) return list;
  const next = [...list];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}

/** Drop ids that are no longer in the catalog (for example after an update). */
export function cleanList(list: unknown, fallback: string[]): string[] {
  if (!Array.isArray(list)) return fallback;
  const known = new Set(CITY_CATALOG.map((c) => c.id));
  const out = list.filter((x): x is string => typeof x === 'string' && known.has(x));
  return Array.from(new Set(out));
}

const normalise = (s: string): string =>
  s.toLocaleLowerCase('en').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ı/g, 'i');

export interface GroupSection {
  group: CityGroup;
  data: City[];
}

/**
 * Groups filtered by a search query. A query matches a city's English or
 * Urdu name, or the group's name in any language (showing the whole group).
 */
export function searchGroups(query: string): GroupSection[] {
  const q = normalise(query.trim());
  const byId = new Map(CITY_CATALOG.map((c) => [c.id, c]));
  const sections: GroupSection[] = [];
  for (const group of CITY_GROUPS) {
    const cities = group.cityIds.map((id) => byId.get(id)).filter((c): c is City => !!c);
    if (!q) {
      sections.push({ group, data: cities });
      continue;
    }
    const groupHit = [group.name.en, group.name.roman, group.name.ur].some((n) => normalise(n).includes(q));
    const data = groupHit ? cities : cities.filter((c) => normalise(c.name.en).includes(q) || c.name.ur.includes(query.trim()));
    if (data.length > 0) sections.push({ group, data });
  }
  return sections;
}
