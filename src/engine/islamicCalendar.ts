// Islamic calendar helpers built on hijriDate(): the days of a Hijri month
// with their Gregorian dates, and the important days of the year.
import { hijriDate, type HijriDate } from './hijri';

const DAY = 86400000;

export interface CalendarDay {
  hijri: HijriDate;
  /** Midday of that day, so time zones never shift the date. */
  date: Date;
}

function noon(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 12));
}

/** Midday UTC of a local calendar date. Every lookup below then uses UTC, so the date never shifts. */
export function dayOf(local: { year: number; month: number; day: number }): Date {
  return new Date(Date.UTC(local.year, local.month - 1, local.day, 12));
}

/**
 * All days of the Hijri month that `anchor` (from dayOf) falls in, shifted by `monthShift`
 * months (−1 for the previous month, +1 for the next).
 */
export function hijriMonth(anchor: Date, offsetDays = 0, monthShift = 0): CalendarDay[] {
  let d = noon(anchor);
  const h = (x: Date) => hijriDate(x, 'UTC', offsetDays);
  // Move to day 1 of the current month, then step whole months.
  d = new Date(d.getTime() - (h(d).day - 1) * DAY);
  for (let i = 0; i < Math.abs(monthShift); i++) {
    if (monthShift > 0) d = new Date(d.getTime() + 30 * DAY);
    else d = new Date(d.getTime() - 2 * DAY);
    d = new Date(d.getTime() - (h(d).day - 1) * DAY);
  }
  const first = h(d);
  const days: CalendarDay[] = [];
  for (let i = 0; i < 31; i++) {
    const x = new Date(d.getTime() + i * DAY);
    const hx = h(x);
    if (hx.month !== first.month) break;
    days.push({ hijri: hx, date: x });
  }
  return days;
}

export type EventCategory = 'festival' | 'sahaba' | 'auliya' | 'hero' | 'turk' | 'pakistan';

export interface IslamicEvent {
  id: string;
  /** 'hijri' events follow the moon; 'gregorian' ones (battles, births) are fixed solar dates. */
  kind: 'hijri' | 'gregorian';
  category: EventCategory;
  month: number;
  day: number;
  name: { en: string; ur: string; roman: string };
  /** Year of the original event, for display ("1453"). */
  year?: string;
}

export const EVENT_CATEGORIES: { id: EventCategory; emoji: string; en: string; ur: string; roman: string }[] = [
  { id: 'festival', emoji: '🌙', en: 'Islamic days', ur: 'اسلامی ایام', roman: 'Islami ayyam' },
  { id: 'sahaba', emoji: '⭐', en: 'Ahl-e-Bait and Sahaba', ur: 'اہلِ بیت و صحابہ', roman: 'Ahl-e-Bait o Sahaba' },
  { id: 'auliya', emoji: '🕌', en: 'Imams and Auliya', ur: 'ائمہ و اولیاء', roman: 'Aimma o Auliya' },
  { id: 'hero', emoji: '⚔️', en: 'Islamic heroes', ur: 'اسلامی ہیرو', roman: 'Islami hero' },
  { id: 'turk', emoji: '🇹🇷', en: 'Turkish heroes', ur: 'ترک ہیرو', roman: 'Turk hero' },
  { id: 'pakistan', emoji: '🇵🇰', en: 'Pakistan', ur: 'پاکستان', roman: 'Pakistan' },
];

const H = (category: EventCategory, id: string, month: number, day: number, en: string, ur: string, roman: string, year?: string): IslamicEvent => ({ id, kind: 'hijri', category, month, day, name: { en, ur, roman }, year });
const G = (category: EventCategory, id: string, month: number, day: number, en: string, ur: string, roman: string, year?: string): IslamicEvent => ({ id, kind: 'gregorian', category, month, day, name: { en, ur, roman }, year });

// Hijri dates are those traditionally observed in Pakistan and India; for many
// historical events the sources differ by a day or more.
export const ISLAMIC_EVENTS: IslamicEvent[] = [
  // ----- Islamic days and festivals -----
  H('festival', 'newYear', 1, 1, 'Islamic New Year', 'اسلامی نیا سال', 'Islami naya saal'),
  H('festival', 'tasua', 1, 9, '9 Muharram (fast with Ashura)', '9 محرم (عاشورہ کے ساتھ روزہ)', '9 Muharram (Ashura ke saath roza)'),
  H('festival', 'ashura', 1, 10, 'Ashura', 'یومِ عاشورہ', 'Youm-e-Ashura'),
  H('festival', 'mawlid', 3, 12, '12 Rabi al-Awwal (Mawlid)', '12 ربیع الاول (عید میلاد النبی ﷺ)', '12 Rabi-ul-Awwal (Eid Milad-un-Nabi ﷺ)'),
  H('festival', 'rajab', 7, 1, 'Rajab begins (sacred month)', 'رجب کا آغاز (حرمت والا مہینہ)', 'Rajab ka aaghaz'),
  H('festival', 'miraj', 7, 27, "Shab-e-Mi'raj", 'شبِ معراج', 'Shab-e-Meraj'),
  H('festival', 'baraat', 8, 15, "15 Sha'ban (Shab-e-Barat)", '15 شعبان (شبِ برات)', '15 Shaban (Shab-e-Baraat)'),
  H('festival', 'ramadan', 9, 1, 'First of Ramadan', 'یکم رمضان', 'Yakum Ramazan'),
  H('festival', 'badr', 9, 17, 'Battle of Badr', 'غزوۂ بدر', 'Ghazwa-e-Badr', '2 AH'),
  H('festival', 'fathMakkah', 9, 20, 'Conquest of Makkah', 'فتحِ مکہ', 'Fatah-e-Makkah', '8 AH'),
  H('festival', 'qadr21', 9, 21, 'Laylat al-Qadr is sought (21st night)', 'شبِ قدر کی تلاش (21ویں رات)', 'Shab-e-Qadr ki talash (21vi raat)'),
  H('festival', 'itikaf', 9, 20, "I'tikaf begins (evening of the 20th)", 'اعتکاف کا آغاز (20 رمضان کی شام)', 'Aitikaf ka aaghaz'),
  H('festival', 'qadr', 9, 27, '27 Ramadan (Laylat al-Qadr)', '27 رمضان (شبِ قدر)', '27 Ramazan (Shab-e-Qadr)'),
  H('festival', 'jumatulWida', 9, 29, "Last days of Ramadan (Jumu'at-ul-Wida on the last Friday)", 'رمضان کے آخری دن (جمعۃ الوداع)', 'Ramazan ke aakhri din (Jumat-ul-Wida)'),
  H('festival', 'fitr', 10, 1, 'Eid al-Fitr', 'عید الفطر', 'Eid-ul-Fitr'),
  H('festival', 'shawwal6', 10, 2, 'Six fasts of Shawwal begin', 'شوال کے چھ روزے', 'Shawwal ke chhe roze'),
  H('festival', 'dhulHijjah', 12, 1, 'First ten days of Dhul-Hijjah', 'ذوالحجہ کے پہلے دس دن', 'Zul-Hijjah ke pehle das din'),
  H('festival', 'tarwiyah', 12, 8, 'Hajj begins (Day of Tarwiyah)', 'حج کا آغاز (یومِ ترویہ)', 'Hajj ka aaghaz'),
  H('festival', 'arafah', 12, 9, 'Day of Arafah', 'یومِ عرفہ', 'Youm-e-Arafa'),
  H('festival', 'adha', 12, 10, 'Eid al-Adha', 'عید الاضحیٰ', 'Eid-ul-Azha'),
  H('festival', 'tashreeq', 12, 13, 'Last day of Takbir-e-Tashreeq', 'تکبیرِ تشریق کا آخری دن', 'Takbeer-e-Tashreeq ka aakhri din'),
  H('sahaba', 'usman', 12, 18, 'Shahadat of Hazrat Usman (RA)', 'شہادتِ حضرت عثمان غنی رضی اللہ عنہ', 'Shahadat-e-Hazrat Usman (RA)', '35 AH'),

  // ----- Ahl-e-Bait and Sahaba -----
  H('sahaba', 'umar', 1, 1, 'Shahadat of Hazrat Umar Farooq (RA)', 'شہادتِ حضرت عمر فاروق رضی اللہ عنہ', 'Shahadat-e-Hazrat Umar Farooq (RA)', '23 AH'),
  H('sahaba', 'husain', 1, 10, 'Shahadat of Imam Husain (RA), Karbala', 'شہادتِ امام حسین رضی اللہ عنہ (کربلا)', 'Shahadat-e-Imam Husain (RA)', '61 AH'),
  H('sahaba', 'hasan', 2, 28, 'Wafat of Imam Hasan (RA)', 'وصالِ امام حسن رضی اللہ عنہ', 'Wisal-e-Imam Hasan (RA)', '50 AH'),
  H('sahaba', 'fatima', 6, 3, 'Wafat of Sayyida Fatima (RA)', 'وصالِ سیدہ فاطمۃ الزہراء رضی اللہ عنہا', 'Wisal-e-Sayyida Fatima (RA)', '11 AH'),
  H('sahaba', 'abuBakr', 6, 22, 'Wafat of Hazrat Abu Bakr Siddiq (RA)', 'وصالِ حضرت ابوبکر صدیق رضی اللہ عنہ', 'Wisal-e-Hazrat Abu Bakr Siddiq (RA)', '13 AH'),
  H('sahaba', 'khadija', 9, 10, 'Wafat of Sayyida Khadija (RA)', 'وصالِ ام المومنین سیدہ خدیجہ رضی اللہ عنہا', 'Wisal-e-Sayyida Khadija (RA)'),
  H('sahaba', 'aisha', 9, 17, 'Wafat of Sayyida Aisha (RA)', 'وصالِ ام المومنین سیدہ عائشہ رضی اللہ عنہا', 'Wisal-e-Sayyida Aisha (RA)', '58 AH'),
  H('sahaba', 'ali', 9, 21, 'Shahadat of Hazrat Ali (RA)', 'شہادتِ حضرت علی المرتضیٰ رضی اللہ عنہ', 'Shahadat-e-Hazrat Ali (RA)', '40 AH'),
  H('sahaba', 'hamza', 10, 15, 'Battle of Uhud, Shahadat of Hazrat Hamza (RA)', 'غزوۂ احد، شہادتِ سیدنا حمزہ رضی اللہ عنہ', 'Ghazwa-e-Uhud, Shahadat-e-Hazrat Hamza (RA)', '3 AH'),
  H('sahaba', 'muawiya', 7, 22, 'Wafat of Hazrat Amir Muawiya (RA)', 'وصالِ حضرت امیر معاویہ رضی اللہ عنہ', 'Wisal-e-Hazrat Amir Muawiya (RA)', '60 AH'),

  // ----- Imams and Auliya -----
  H('auliya', 'babaFarid', 1, 5, 'Urs of Baba Fariduddin Ganjshakar (Pakpattan)', 'عرس بابا فرید الدین گنج شکر (پاکپتن)', 'Urs Baba Farid Ganjshakar'),
  H('auliya', 'dataSahib', 2, 20, 'Urs of Data Ganj Bakhsh Ali Hujwiri (Lahore)', 'عرس داتا گنج بخش علی ہجویری (لاہور)', 'Urs Data Ganj Bakhsh'),
  H('auliya', 'ghausPak', 4, 11, 'Gyarhween Sharif: Shaikh Abdul Qadir Jilani', 'گیارہویں شریف: شیخ عبدالقادر جیلانی', 'Gyarhween Sharif: Ghaus-e-Azam'),
  H('auliya', 'gharibNawaz', 7, 6, 'Urs of Khwaja Moinuddin Chishti (Ajmer)', 'عرس خواجہ معین الدین چشتی (اجمیر)', 'Urs Khwaja Gharib Nawaz'),
  H('auliya', 'imamAzam', 8, 2, 'Wafat of Imam Abu Hanifa', 'وصالِ امام اعظم ابو حنیفہ', 'Wisal-e-Imam Azam Abu Hanifa', '150 AH'),
  H('auliya', 'mujaddid', 2, 28, 'Urs of Mujaddid Alf Sani (Sirhind)', 'عرس مجدد الف ثانی شیخ احمد سرہندی', 'Urs Mujaddid Alf Sani'),
  H('auliya', 'nizamuddin', 4, 18, 'Urs of Hazrat Nizamuddin Auliya (Delhi)', 'عرس حضرت نظام الدین اولیاء (دہلی)', 'Urs Nizamuddin Auliya'),
  H('auliya', 'chishtianSharif', 3, 27, 'Urs of Khwaja Noor Muhammad Maharvi (Chishtian Sharif)', 'عرس خواجہ نور محمد مہاروی (چشتیاں شریف)', 'Urs Khwaja Noor Muhammad Maharvi (Chishtian)'),

  // ----- Islamic heroes (solar dates of the historical event) -----
  G('hero', 'tariq', 4, 29, 'Tariq bin Ziyad lands in Spain', 'طارق بن زیاد اندلس میں', 'Tariq bin Ziyad Andalus mein', '711'),
  G('hero', 'qasim', 6, 20, 'Muhammad bin Qasim conquers Sindh (Battle of Aror)', 'محمد بن قاسم: فتحِ سندھ', 'Muhammad bin Qasim: Fatah-e-Sindh', '712'),
  G('hero', 'hattin', 7, 4, 'Salahuddin Ayyubi wins at Hattin', 'جنگِ حطین: صلاح الدین ایوبی کی فتح', 'Jang-e-Hattin: Salahuddin Ayyubi', '1187'),
  G('hero', 'quds', 10, 2, 'Salahuddin frees Al-Quds', 'صلاح الدین ایوبی کے ہاتھوں بیت المقدس کی آزادی', 'Baitul Muqaddas ki azadi', '1187'),
  G('hero', 'ainJalut', 9, 3, 'Battle of Ain Jalut: Baibars stops the Mongols', 'جنگِ عین جالوت: منگولوں کی شکست', 'Jang-e-Ain Jalut', '1260'),
  G('hero', 'nuruddin', 5, 15, 'Wafat of Nuruddin Zangi', 'وفات نور الدین زنگی', 'Wafat Nuruddin Zangi', '1174'),
  G('hero', 'salahuddinWafat', 3, 4, 'Wafat of Salahuddin Ayyubi', 'وفات صلاح الدین ایوبی', 'Wafat Salahuddin Ayyubi', '1193'),
  G('hero', 'tipu', 5, 4, 'Shahadat of Tipu Sultan', 'شہادتِ ٹیپو سلطان', 'Shahadat-e-Tipu Sultan', '1799'),
  G('hero', 'omarMukhtar', 9, 16, 'Shahadat of Omar Mukhtar', 'شہادتِ عمر مختار', 'Shahadat-e-Omar Mukhtar', '1931'),

  // ----- Turkish heroes -----
  G('turk', 'manzikert', 8, 26, 'Battle of Malazgirt: Alp Arslan', 'جنگِ ملازکرد: الپ ارسلان کی فتح', 'Jang-e-Malazgirt: Alp Arslan', '1071'),
  G('turk', 'fetih', 5, 29, 'Conquest of Istanbul: Sultan Mehmed Fatih', 'فتحِ قسطنطنیہ: سلطان محمد فاتح', 'Fatah-e-Qustuntuniya: Sultan Mehmed Fatih', '1453'),
  G('turk', 'mohacs', 8, 29, 'Battle of Mohács: Suleiman the Magnificent', 'جنگِ موہاچ: سلطان سلیمان', 'Jang-e-Mohacs: Sultan Suleiman', '1526'),
  G('turk', 'preveze', 9, 28, 'Battle of Preveza: Barbaros Hayreddin Pasha', 'جنگِ پریویزا: خیر الدین باربروسا', 'Jang-e-Preveza: Barbarossa', '1538'),
  G('turk', 'canakkale', 3, 18, 'Çanakkale (Gallipoli) naval victory', 'چناق قلعہ کی فتح', 'Canakkale ki fatah', '1915'),
  G('turk', 'kut', 4, 29, 'Siege of Kut ends in Ottoman victory', 'کوت العمارہ کی فتح', 'Kut-al-Amara ki fatah', '1916'),
  G('turk', 'malazgirtDay', 7, 15, 'Turkey: Democracy and National Unity Day', 'ترکی: یومِ جمہوریت و قومی اتحاد', 'Turkey: Democracy aur qaumi ittehad ka din', '2016'),

  // ----- Pakistan -----
  G('pakistan', 'pakistanDay', 3, 23, 'Pakistan Day (Lahore Resolution)', 'یومِ پاکستان (قراردادِ لاہور)', 'Youm-e-Pakistan', '1940'),
  G('pakistan', 'independence', 8, 14, 'Independence Day of Pakistan', 'یومِ آزادی پاکستان', 'Youm-e-Azadi Pakistan', '1947'),
  G('pakistan', 'defence', 9, 6, 'Defence Day', 'یومِ دفاع', 'Youm-e-Difa', '1965'),
  G('pakistan', 'iqbal', 11, 9, 'Birth of Allama Iqbal', 'یومِ اقبال (ولادت علامہ اقبال)', 'Youm-e-Iqbal', '1877'),
  G('pakistan', 'quaid', 12, 25, 'Birth of Quaid-e-Azam Muhammad Ali Jinnah', 'یومِ قائدِ اعظم', 'Youm-e-Quaid-e-Azam', '1876'),
  G('pakistan', 'quaidWafat', 9, 11, 'Wafat of Quaid-e-Azam', 'وفاتِ قائدِ اعظم', 'Wafat-e-Quaid-e-Azam', '1948'),
];

/** Events falling on a given day (midday UTC of the local date). */
export function eventsOn(date: Date, offsetDays = 0): IslamicEvent[] {
  const h = hijriDate(date, 'UTC', offsetDays);
  const gm = date.getUTCMonth() + 1;
  const gd = date.getUTCDate();
  return ISLAMIC_EVENTS.filter((e) => (e.kind === 'hijri' ? e.month === h.month && e.day === h.day : e.month === gm && e.day === gd));
}

/** The next occurrence of each event from `from` (inclusive), soonest first. */
export function upcomingEvents(from: Date, offsetDays = 0, categories?: EventCategory[]): { event: IslamicEvent; date: Date; hijri: HijriDate }[] {
  const out: { event: IslamicEvent; date: Date; hijri: HijriDate }[] = [];
  const pool = ISLAMIC_EVENTS.filter((e) => !categories || categories.includes(e.category));
  const seen = new Set<string>();
  const start = noon(from);
  for (let i = 0; i < 390 && seen.size < pool.length; i++) {
    const d = new Date(start.getTime() + i * DAY);
    const h = hijriDate(d, 'UTC', offsetDays);
    for (const e of pool) {
      if (seen.has(e.id)) continue;
      const hit = e.kind === 'hijri' ? e.month === h.month && e.day === h.day : e.month === d.getUTCMonth() + 1 && e.day === d.getUTCDate();
      if (hit) { seen.add(e.id); out.push({ event: e, date: d, hijri: h }); }
    }
  }
  return out;
}

export interface EventReminder { id: string; at: Date; event: IslamicEvent; sameDay: boolean }

/**
 * Notification times for upcoming events: 7 pm the evening before and 7 am on
 * the day, in the phone's local time. Capped, because iOS keeps at most 64
 * pending notifications and prayer reminders need most of them.
 */
export function eventReminders(today: Date, now: Date, offsetDays = 0, days = 40, cap = 14, categories?: EventCategory[]): EventReminder[] {
  const out: EventReminder[] = [];
  for (const u of upcomingEvents(today, offsetDays, categories)) {
    if ((u.date.getTime() - noon(today).getTime()) / DAY > days) continue;
    const y = u.date.getUTCFullYear(); const m = u.date.getUTCMonth(); const d = u.date.getUTCDate();
    const eve = new Date(y, m, d - 1, 19, 0, 0);
    const morning = new Date(y, m, d, 7, 0, 0);
    if (eve.getTime() > now.getTime()) out.push({ id: `${u.event.id}-eve`, at: eve, event: u.event, sameDay: false });
    if (morning.getTime() > now.getTime()) out.push({ id: `${u.event.id}-day`, at: morning, event: u.event, sameDay: true });
  }
  return out.sort((a, b) => a.at.getTime() - b.at.getTime()).slice(0, cap);
}

/** Days from `from` to `to`, counting calendar days. */
export function daysUntil(from: Date, to: Date): number {
  return Math.round((noon(to).getTime() - noon(from).getTime()) / DAY);
}
