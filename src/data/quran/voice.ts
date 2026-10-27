// Turns a spoken or typed request ("Surah Yaseen", "پارہ بیس", "para 2",
// "surah baqarah ayat 255") into a place in the Quran. This is plain rule-based
// matching over known names and numbers: it never generates or changes text.

export type VoiceTarget =
  | { type: 'sura'; sura: number; aya?: number }
  | { type: 'juz'; juz: number }
  | { type: 'control'; action: 'stop' | 'pause' | 'resume' | 'next' | 'previous' | 'repeat' };

/** Fold Urdu/Arabic script and Latin text into one comparable form. */
export function fold(s: string): string {
  return s
    .toLowerCase()
    .replace(/[ؐ-ًؚ-ٰٟۖ-ۭـ]/g, '')
    .replace(/[ٱأإآ]/g, 'ا')
    .replace(/[ىيی]/g, 'ي')
    .replace(/[ةۃہھ]/g, 'ه')
    .replace(/[كک]/g, 'ك')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
}

/** Latin names: drop "al-" style prefixes and collapse doubled vowels. */
function latinKey(s: string): string {
  return s.toLowerCase()
    .replace(/^(al|an|ar|as|at|ad|adh|az|ash|aal|ash)[- ']/, '')
    .replace(/[^a-z]/g, '')
    .replace(/(.)\1+/g, '$1')
    .replace(/ee/g, 'i').replace(/oo/g, 'u');
}

// Common Urdu names of the surahs, as Pakistani readers say them.
const URDU_SURA: string[] = [
  'فاتحہ', 'بقرہ', 'آل عمران', 'نساء', 'مائدہ', 'انعام', 'اعراف', 'انفال', 'توبہ', 'یونس',
  'ہود', 'یوسف', 'رعد', 'ابراہیم', 'حجر', 'نحل', 'بنی اسرائیل', 'کہف', 'مریم', 'طہ',
  'انبیاء', 'حج', 'مومنون', 'نور', 'فرقان', 'شعراء', 'نمل', 'قصص', 'عنکبوت', 'روم',
  'لقمان', 'سجدہ', 'احزاب', 'سبا', 'فاطر', 'یاسین', 'صافات', 'ص', 'زمر', 'مومن',
  'حم سجدہ', 'شوری', 'زخرف', 'دخان', 'جاثیہ', 'احقاف', 'محمد', 'فتح', 'حجرات', 'ق',
  'ذاریات', 'طور', 'نجم', 'قمر', 'رحمن', 'واقعہ', 'حدید', 'مجادلہ', 'حشر', 'ممتحنہ',
  'صف', 'جمعہ', 'منافقون', 'تغابن', 'طلاق', 'تحریم', 'ملک', 'قلم', 'حاقہ', 'معارج',
  'نوح', 'جن', 'مزمل', 'مدثر', 'قیامہ', 'دہر', 'مرسلات', 'نبا', 'نازعات', 'عبس',
  'تکویر', 'انفطار', 'مطففین', 'انشقاق', 'بروج', 'طارق', 'اعلی', 'غاشیہ', 'فجر', 'بلد',
  'شمس', 'لیل', 'ضحی', 'الم نشرح', 'تین', 'علق', 'قدر', 'بینہ', 'زلزال', 'عادیات',
  'قارعہ', 'تکاثر', 'عصر', 'ہمزہ', 'فیل', 'قریش', 'ماعون', 'کوثر', 'کافرون', 'نصر',
  'لہب', 'اخلاص', 'فلق', 'ناس',
];

// Extra spoken forms that differ from the list above.
const EXTRA_ALIASES: [string, number][] = [
  ['یٰسین', 36], ['یس', 36], ['yasin', 36], ['yaseen', 36], ['rahman', 55], ['rehman', 55], ['mulk', 67],
  ['kahf', 18], ['waqia', 56], ['waqiah', 56], ['muzammil', 73], ['fatiha', 1], ['baqarah', 2], ['baqara', 2],
  ['imran', 3], ['nisa', 4], ['kausar', 108], ['kawsar', 108], ['ikhlas', 112], ['falaq', 113], ['nas', 114],
  ['اسراء', 17], ['غافر', 40], ['فصلت', 41], ['انسان', 76], ['انشراح', 94], ['مسد', 111], ['تبت', 111],
  ['dukhan', 44], ['jumuah', 62], ['juma', 62], ['taha', 20], ['sajda', 32], ['luqman', 31], ['maryam', 19],
];

// Para (juz) names as commonly used in Pakistani mushafs, by their opening words.
const PARA_NAMES: string[] = [
  'الم', 'سیقول', 'تلک الرسل', 'لن تنالوا', 'والمحصنات', 'لا یحب اللہ', 'واذا سمعوا', 'ولو اننا', 'قال الملا', 'واعلموا',
  'یعتذرون', 'وما من دابہ', 'وما ابرئ', 'ربما', 'سبحن الذی', 'قال الم', 'اقترب', 'قد افلح', 'وقال الذین', 'امن خلق',
  'اتل ما اوحی', 'ومن یقنت', 'ومالی', 'فمن اظلم', 'الیہ یرد', 'حم', 'قال فما خطبکم', 'قد سمع اللہ', 'تبرک الذی', 'عم',
];
const PARA_ROMAN: string[] = [
  'alif lam meem', 'sayaqool', 'tilkar rusul', 'lan tanaloo', 'wal muhsanat', 'la yuhibbullah', 'wa iza samiu', 'wa lau annana',
  'qalal mala', 'wa alamu', 'yatazeroon', 'wa ma min dabbah', 'wa ma ubarri', 'rubama', 'subhanallazi', 'qal alam',
  'iqtaraba', 'qad aflaha', 'wa qalallazina', 'amman khalaq', 'utlu ma oohi', 'wa man yaqnut', 'wa mali', 'fa man azlam',
  'ilaihi yuraddu', 'ha meem', 'qala fama khatbukum', 'qad sami allah', 'tabarakallazi', 'amma',
];

const NUMBER_WORDS: Record<string, number> = {};
[
  ['ایک', 'ek', 'one', 'pehla', 'پہلا'], ['دو', 'do', 'two', 'doosra', 'dusra', 'دوسرا'], ['تین', 'teen', 'three', 'teesra', 'تیسرا'],
  ['چار', 'char', 'four', 'chautha', 'چوتھا'], ['پانچ', 'panch', 'five', 'panchwan', 'پانچواں'], ['چھ', 'chay', 'chhe', 'six', 'چھٹا'],
  ['سات', 'saat', 'seven'], ['آٹھ', 'aath', 'eight'], ['نو', 'nau', 'nine'], ['دس', 'das', 'ten'], ['گیارہ', 'gyarah', 'eleven'],
  ['بارہ', 'barah', 'twelve'], ['تیرہ', 'terah', 'thirteen'], ['چودہ', 'chaudah', 'fourteen'], ['پندرہ', 'pandrah', 'fifteen'],
  ['سولہ', 'solah', 'sixteen'], ['سترہ', 'satrah', 'seventeen'], ['اٹھارہ', 'atharah', 'eighteen'], ['انیس', 'unnees', 'nineteen'],
  ['بیس', 'bees', 'twenty'], ['اکیس', 'ikkees', 'twentyone'], ['بائیس', 'baees', 'twentytwo'], ['تئیس', 'teis', 'twentythree'],
  ['چوبیس', 'chaubees', 'twentyfour'], ['پچیس', 'pachees', 'twentyfive'], ['چھبیس', 'chhabbees', 'twentysix'],
  ['ستائیس', 'sattaees', 'twentyseven'], ['اٹھائیس', 'athaees', 'twentyeight'], ['انتیس', 'untees', 'twentynine'], ['تیس', 'tees', 'thirty'],
].forEach((words, i) => words.forEach((w) => { NUMBER_WORDS[fold(w)] = i + 1; }));

const PARA_WORDS = ['پارہ', 'پارے', 'سپارہ', 'para', 'parah', 'sipara', 'siparah', 'juz', 'jooz', 'جز', 'جزء'].map(fold);
const SURA_WORDS = ['سورہ', 'سورت', 'سورۃ', 'surah', 'surat', 'sura', 'soorah', 'chapter'].map(fold);
const AYA_WORDS = ['آیت', 'آیات', 'ayat', 'ayah', 'aya', 'ayet', 'verse'].map(fold);

const FILLER = ['نمبر', 'number', 'nambar', 'no', 'num', 'نمبر کا'].map(fold);

function numberAfter(tokens: string[], keys: string[]): number | null {
  for (let i = 0; i < tokens.length; i++) {
    if (!keys.includes(tokens[i])) continue;
    const next = FILLER.includes(tokens[i + 1]) ? tokens[i + 2] : tokens[i + 1];
    for (const tok of [next, tokens[i - 1]]) {
      if (!tok) continue;
      if (/^\d+$/.test(tok)) return Number(tok);
      if (NUMBER_WORDS[tok]) return NUMBER_WORDS[tok];
    }
  }
  return null;
}

interface Alias { key: string; sura: number; latin: boolean }
let aliases: Alias[] | null = null;

/** `names` are the Tanzil sura names (Arabic and transliterated) in order. */
function buildAliases(names: { name: string; tname: string }[]): Alias[] {
  const out: Alias[] = [];
  names.forEach((s, i) => {
    out.push({ key: fold(s.name).replace(/^ال/, ''), sura: i + 1, latin: false });
    out.push({ key: latinKey(s.tname), sura: i + 1, latin: true });
  });
  URDU_SURA.forEach((u, i) => out.push({ key: fold(u), sura: i + 1, latin: false }));
  EXTRA_ALIASES.forEach(([a, n]) => out.push({ key: /[a-z]/.test(a) ? latinKey(a) : fold(a), sura: n, latin: /[a-z]/.test(a) }));
  return out.filter((a) => a.key.length > 0);
}

// Spoken player controls, for people who cannot see the screen.
const CONTROLS: [VoiceTarget & { type: 'control' }, string[]][] = [
  [{ type: 'control', action: 'stop' }, ['بند کرو', 'بند', 'ختم', 'band karo', 'band', 'stop']],
  [{ type: 'control', action: 'pause' }, ['روکو', 'رک جاؤ', 'ruko', 'ruk jao', 'pause']],
  [{ type: 'control', action: 'resume' }, ['جاری رکھو', 'آگے چلاؤ', 'jari rakho', 'resume', 'continue']],
  [{ type: 'control', action: 'next' }, ['اگلی آیت', 'اگلی', 'اگلا', 'agli ayat', 'agli', 'next']],
  [{ type: 'control', action: 'previous' }, ['پچھلی آیت', 'پچھلی', 'pichli ayat', 'pichli', 'previous', 'back']],
  [{ type: 'control', action: 'repeat' }, ['دوبارہ', 'پھر سے', 'dobara', 'phir se', 'repeat', 'again']],
];

export function parseVoiceCommand(text: string, names: { name: string; tname: string }[]): VoiceTarget | null {
  const f = fold(text);
  if (!f) return null;
  const tokens = f.split(' ');

  // A short phrase that is only a control word ("روکو", "agli ayat", "stop").
  if (tokens.length <= 3) {
    for (const [target, words] of CONTROLS) {
      if (words.some((w) => fold(w) === f)) return target;
    }
  }

  // "para 20", "پارہ بیس", "bees para"
  const juz = numberAfter(tokens, PARA_WORDS);
  if (juz !== null && juz >= 1 && juz <= 30) return { type: 'juz', juz };

  // Para by name, when the word para is said ("para sayaqool", "پارہ عم").
  if (tokens.some((t) => PARA_WORDS.includes(t))) {
    const rest = tokens.filter((t) => !PARA_WORDS.includes(t)).join(' ');
    const byUrdu = PARA_NAMES.findIndex((p) => fold(p) === rest);
    if (byUrdu >= 0) return { type: 'juz', juz: byUrdu + 1 };
    const byRoman = PARA_ROMAN.findIndex((p) => latinKey(p) === latinKey(rest));
    if (byRoman >= 0) return { type: 'juz', juz: byRoman + 1 };
  }

  const aya = numberAfter(tokens, AYA_WORDS) ?? undefined;

  // "surah 36", "سورت 2"
  const suraNum = numberAfter(tokens, SURA_WORDS);
  if (suraNum !== null && suraNum >= 1 && suraNum <= 114) return { type: 'sura', sura: suraNum, aya };

  // Surah by name: the longest alias that matches whole words wins.
  aliases ??= buildAliases(names);
  const words = tokens.filter((t) => !SURA_WORDS.includes(t) && !AYA_WORDS.includes(t) && !FILLER.includes(t) && !/^\d+$/.test(t) && !NUMBER_WORDS[t]);
  const urduPhrase = ` ${words.join(' ')} `;
  // Latin names may span up to three words ("aal imran", "al mulk").
  const latinWindows = new Set<string>();
  for (let i = 0; i < words.length; i++) {
    for (let n = 1; n <= 3 && i + n <= words.length; n++) latinWindows.add(latinKey(words.slice(i, i + n).join('')));
  }
  let best: Alias | null = null;
  for (const a of aliases) {
    const hit = a.latin ? latinWindows.has(a.key) : urduPhrase.includes(` ${a.key} `) || urduPhrase.includes(` ال${a.key} `);
    if (hit && (!best || a.key.length > best.key.length)) best = a;
  }
  return best ? { type: 'sura', sura: best.sura, aya } : null;
}
