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
