import { QURAN } from './index';

/**
 * Folds Arabic text for searching only (the displayed text is never changed):
 * removes harakat and Quranic marks, and unifies letter forms.
 */
export function foldArabic(s: string): string {
  return s
    .replace(/[ؐ-ًؚ-ٰٟۖ-ۭـ]/g, '')
    .replace(/[ٱأإآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .replace(/\s+/g, ' ')
    .trim();
}

export interface SearchHit { sura: number; aya: number; text: string }

let folded: string[][] | null = null;

/** Ayahs whose text contains the query (Arabic, with or without harakat). */
export function searchQuran(query: string, limit = 50): SearchHit[] {
  const q = foldArabic(query);
  if (q.length < 2 || !/[؀-ۿ]/.test(q)) return [];
  folded ??= QURAN.suras.map((s) => s.ayahs.map(foldArabic));
  const hits: SearchHit[] = [];
  for (let s = 0; s < folded.length && hits.length < limit; s++) {
    for (let a = 0; a < folded[s].length && hits.length < limit; a++) {
      if (folded[s][a].includes(q)) hits.push({ sura: s + 1, aya: a + 1, text: QURAN.suras[s].ayahs[a] });
    }
  }
  return hits;
}

/** Bismillah as it appears at the start of Al-Fatiha in the bundled text. */
export function bismillah(): string | null {
  return QURAN.suras[0]?.ayahs[0] ?? null;
}

/**
 * If a sura's first ayah begins with the Bismillah (as in the Tanzil text for
 * every sura except Al-Fatiha and At-Tawbah), split it off for display.
 */
export function splitBismillah(sura: number, firstAyah: string): { bismillah: string | null; rest: string } {
  const b = bismillah();
  if (sura === 1 || sura === 9 || !b || !firstAyah.startsWith(b)) return { bismillah: null, rest: firstAyah };
  return { bismillah: b, rest: firstAyah.slice(b.length).trimStart() };
}
