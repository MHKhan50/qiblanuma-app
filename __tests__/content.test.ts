import landmarks from '../scripts/city-landmarks.json';
import { CITY_CATALOG } from '../src/data/cities';
import { CITY_PHOTOS } from '../src/data/cityPhotos';
import { CITY_GROUPS } from '../src/data/groups';
import { GROUP_FLAGS } from '../src/data/groupFlags';
import { arabicNumber, QURAN } from '../src/data/quran';

describe('bundled content', () => {
  it('has a photo search entry for every city', () => {
    for (const c of CITY_CATALOG) expect((landmarks as Record<string, unknown>)[c.id]).toBeDefined();
  });

  it('only credits free licences for photos and flags', () => {
    const ids = new Set(CITY_CATALOG.map((c) => c.id));
    for (const [id, p] of Object.entries(CITY_PHOTOS)) {
      expect(ids.has(id)).toBe(true);
      expect(p.licence).toMatch(/^(CC0|CC BY|CC-BY|Public domain|PD)/i);
      expect(p.licence).not.toMatch(/\b(NC|ND)\b/);
      expect(p.artist.length).toBeGreaterThan(0);
    }
    const groups = new Set(CITY_GROUPS.map((g) => g.id));
    for (const id of Object.keys(GROUP_FLAGS)) expect(groups.has(id)).toBe(true);
  });

  it('is either empty or the complete Quran', () => {
    if (QURAN.suras.length === 0) return;
    expect(QURAN.suras.length).toBe(114);
    expect(QURAN.suras.reduce((n, s) => n + s.ayahs.length, 0)).toBe(6236);
    expect(QURAN.suras[0].ayahs.length).toBe(7);
    expect(QURAN.suras[1].ayahs.length).toBe(286);
    expect(QURAN.suras[113].ayahs.length).toBe(6);
    expect(QURAN.notice).toMatch(/Tanzil/);
  });

  it('writes ayah numbers in Arabic digits', () => {
    expect(arabicNumber(286)).toBe('٢٨٦');
  });
});
