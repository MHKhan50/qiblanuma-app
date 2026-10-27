// Hijri date for display. Uses the phone's Umm al-Qura calendar when the
// platform provides it, otherwise the tabular (arithmetical) Islamic calendar.
// Both are calculated calendars; the local moon-sighting date can differ by a
// day, so users can shift it with `offsetDays`.

export interface HijriDate {
  year: number;
  month: number; // 1-12
  day: number;
}

const EPOCH = 1948439.5;

function islamicToJD(y: number, m: number, d: number): number {
  return d + Math.ceil(29.5 * (m - 1)) + (y - 1) * 354 + Math.floor((3 + 11 * y) / 30) + EPOCH - 1;
}

/** Tabular Islamic calendar from a Julian day number. */
export function tabularHijri(jd: number): HijriDate {
  const j = Math.floor(jd) + 0.5;
  const year = Math.floor((30 * (j - EPOCH) + 10646) / 10631);
  const month = Math.min(12, Math.ceil((j - (29 + islamicToJD(year, 1, 1))) / 29.5) + 1);
  const day = j - islamicToJD(year, month, 1) + 1;
  return { year, month, day };
}

function fromIntl(date: Date, timeZone: string): HijriDate | null {
  try {
    const parts = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', {
      timeZone, year: 'numeric', month: 'numeric', day: 'numeric',
    }).formatToParts(date);
    const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
    const h = { year: get('year'), month: get('month'), day: get('day') };
    return Number.isFinite(h.year) && h.month >= 1 && h.month <= 12 && h.day >= 1 ? h : null;
  } catch {
    return null;
  }
}

export function hijriDate(date: Date, timeZone: string, offsetDays = 0): HijriDate {
  const shifted = new Date(date.getTime() + offsetDays * 86400000);
  const intl = fromIntl(shifted, timeZone);
  if (intl) return intl;
  const jd = shifted.getTime() / 86400000 + 2440587.5;
  return tabularHijri(jd);
}

export const HIJRI_MONTHS = {
  en: ['Muharram', 'Safar', "Rabi' al-Awwal", "Rabi' al-Thani", 'Jumada al-Ula', 'Jumada al-Akhirah', 'Rajab', "Sha'ban", 'Ramadan', 'Shawwal', "Dhu al-Qa'dah", 'Dhu al-Hijjah'],
  roman: ['Muharram', 'Safar', 'Rabi-ul-Awwal', 'Rabi-us-Sani', 'Jumada-al-Ula', 'Jumada-al-Ukhra', 'Rajab', 'Shaban', 'Ramazan', 'Shawwal', 'Zul-Qadah', 'Zul-Hijjah'],
  ur: ['محرم', 'صفر', 'ربیع الاول', 'ربیع الثانی', 'جمادی الاولیٰ', 'جمادی الآخرہ', 'رجب', 'شعبان', 'رمضان', 'شوال', 'ذوالقعدہ', 'ذوالحجہ'],
  fa: ['محرم', 'صفر', 'ربیع‌الاول', 'ربیع‌الثانی', 'جمادی‌الاول', 'جمادی‌الثانی', 'رجب', 'شعبان', 'رمضان', 'شوال', 'ذی‌القعده', 'ذی‌الحجه'],
  tr: ['Muharrem', 'Safer', "Rebiülevvel", 'Rebiülahir', 'Cemaziyelevvel', 'Cemaziyelahir', 'Recep', 'Şaban', 'Ramazan', 'Şevval', 'Zilkade', 'Zilhicce'],
};
