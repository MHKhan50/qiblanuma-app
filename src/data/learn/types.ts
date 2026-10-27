import type { Language } from '../../i18n/strings';

/** Text in the three languages the learning content is written in. */
export interface Tri { ur: string; roman: string; en: string }

/** Persian and Turkish screens show the English text until a scholar-checked translation is added. */
export function pick(t: Tri, lang: Language): string {
  if (lang === 'ur') return t.ur;
  if (lang === 'roman') return t.roman;
  return t.en;
}

/** A text to recite: Arabic with its meaning and where it comes from. */
export interface Recitation {
  id: string;
  title: Tri;
  arabic: string;
  meaning: Tri;
  /** Hadith or Quran reference. */
  source?: string;
  /** How many times it is usually read. */
  times?: number;
}

/** A Quran passage taken from the bundled Tanzil text, so it is never retyped. */
export interface QuranPart {
  id: string;
  title: Tri;
  sura: number;
  from: number;
  to: number;
  times?: number;
}

export interface Topic {
  id: string;
  title: Tri;
  /** Short line under the title. */
  intro?: Tri;
  /** Numbered points (fara'iz, sunnatein ...). */
  lists?: { heading: Tri; items: Tri[] }[];
  recitations?: Recitation[];
  quran?: QuranPart[];
  /** Rows of a table, e.g. rakats of each prayer. */
  table?: { head: Tri[]; rows: { label: Tri; cells: string[] }[] };
}
