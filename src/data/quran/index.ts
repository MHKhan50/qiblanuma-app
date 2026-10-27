import recitersData from './reciters.json';
import data from './quran.json';
import indopak from './quran-indopak.json';
import { INDOPAK_FONT } from './fonts';

export interface Sura {
  n: number;
  /** Arabic name, as in Tanzil metadata. */
  name: string;
  /** Transliterated name. */
  tname: string;
  /** English meaning. */
  ename: string;
  type: string;
  /** Ayah texts, verbatim from Tanzil. Index 0 is ayah 1. */
  ayahs: string[];
}

export interface QuranData {
  source: string;
  notice: string;
  suras: Sura[];
  /** Start of each of the 30 paras, from Tanzil metadata. */
  juz?: { sura: number; aya: number }[];
}

export type QuranScript = 'uthmani' | 'indopak';

export const QURAN = data as QuranData;

/** IndoPak (Nastaleeq) text: one array of ayah strings per sura, verbatim from its source. */
export const QURAN_INDOPAK = indopak as { source: string; licence: string; suras: string[][] };

export const INDOPAK_AVAILABLE = QURAN_INDOPAK.suras.length === 114 && INDOPAK_FONT !== null;

/** Font family names registered in App.tsx. */
export const QURAN_FONT: Record<QuranScript, string> = {
  uthmani: 'AmiriQuran',
  indopak: 'IndoPakNastaleeq',
};

export function ayahText(script: QuranScript, sura: number, aya: number): string {
  if (script === 'indopak' && INDOPAK_AVAILABLE) return QURAN_INDOPAK.suras[sura - 1][aya - 1];
  return QURAN.suras[sura - 1].ayahs[aya - 1];
}

const ARABIC_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

export function arabicNumber(n: number): string {
  return String(n).replace(/\d/g, (d) => ARABIC_DIGITS[Number(d)]);
}


/** Reciters checked by scripts/fetch-content.mjs; `base` + global ayah number + ".mp3". */
export const RECITERS = recitersData as { id: string; name: string; base: string }[];

/** 1-based position of an ayah in the whole Quran (1..6236), used by audio files. */
export function globalAyah(sura: number, aya: number): number {
  let n = 0;
  for (let i = 0; i < sura - 1; i++) n += QURAN.suras[i].ayahs.length;
  return n + aya;
}

/** The ayah after (sura, aya), or null at the end of the Quran. */
export function nextAyah(sura: number, aya: number): { sura: number; aya: number } | null {
  if (aya < QURAN.suras[sura - 1].ayahs.length) return { sura, aya: aya + 1 };
  return sura < 114 ? { sura: sura + 1, aya: 1 } : null;
}

export function prevAyah(sura: number, aya: number): { sura: number; aya: number } | null {
  if (aya > 1) return { sura, aya: aya - 1 };
  return sura > 1 ? { sura: sura - 1, aya: QURAN.suras[sura - 2].ayahs.length } : null;
}

/** Last ayah of a para (the ayah before the next para starts). */
export function juzEnd(juz: number): { sura: number; aya: number } {
  const next = QURAN.juz?.[juz];
  if (!next) return { sura: 114, aya: QURAN.suras[113]?.ayahs.length ?? 6 };
  return prevAyah(next.sura, next.aya) ?? { sura: 1, aya: 1 };
}
