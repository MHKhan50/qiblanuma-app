// Counted adhkar for the tasbeeh counter, in six groups. The count and source are
// shown with each one. Where a number comes from the practice of elders rather
// than a hadith, the note says so. To be checked by the reviewing ulama.
import { KALIMAS } from './kalimas';

export type AdhkarGroup = 'afterSalah' | 'morningEvening' | 'kalimas' | 'relief' | 'tawbah' | 'heavy';

export const ADHKAR_GROUPS: { id: AdhkarGroup; ur: string; roman: string; en: string; emoji: string }[] = [
  { id: 'afterSalah', ur: 'نماز کے بعد', roman: 'Namaz ke baad', en: 'After salah', emoji: '🕌' },
  { id: 'morningEvening', ur: 'صبح و شام', roman: 'Subah o shaam', en: 'Morning and evening', emoji: '🌅' },
  { id: 'kalimas', ur: 'چھ کلمے', roman: 'Chhe kalime', en: 'Six kalimas', emoji: '☝️' },
  { id: 'relief', ur: 'مشکل اور پریشانی', roman: 'Mushkil aur pareshani', en: 'Relief', emoji: '🤲' },
  { id: 'tawbah', ur: 'توبہ و استغفار', roman: 'Tauba o istighfar', en: 'Repentance', emoji: '💧' },
  { id: 'heavy', ur: 'وزنی تسبیحات', roman: 'Wazni tasbeehat', en: 'Heavy on the scale', emoji: '⚖️' },
];

export interface Dhikr {
  id: string;
  group: AdhkarGroup;
  /** Arabic text, or empty when `quran` is given (then it is read from the bundled Quran). */
  ar: string;
  quran?: { sura: number; from: number; to: number };
  roman: string;
  /** Short Urdu note: meaning, when to read and why. */
  ur: string;
  target: number;
  source: string;
}

const x = (group: AdhkarGroup, id: string, ar: string, roman: string, target: number, ur: string, source: string, quran?: Dhikr['quran']): Dhikr => ({ group, id, ar, roman, target, ur, source, quran });

export const ADHKAR: Dhikr[] = [
  // 1. After salah
  x('afterSalah', 'subhanallah', 'سُبْحَانَ اللّٰهِ', 'SubhanAllah', 33, 'تسبیحِ فاطمی: ہر فرض نماز کے بعد 33 بار', 'Bukhari, Muslim'),
  x('afterSalah', 'alhamdulillah', 'اَلْحَمْدُ لِلّٰهِ', 'Alhamdulillah', 33, 'تسبیحِ فاطمی: 33 بار', 'Bukhari, Muslim'),
  x('afterSalah', 'allahuakbar', 'اَللّٰهُ أَكْبَرُ', 'Allahu Akbar', 34, 'تسبیحِ فاطمی: 34 بار (یا 33 بار اور پھر چوتھا کلمہ ایک بار)', 'Bukhari, Muslim'),
  x('afterSalah', 'ayatulKursi', '', 'Ayat-ul-Kursi', 1, 'ہر فرض نماز کے بعد ایک بار؛ جنت میں داخلے میں صرف موت رکاوٹ ہے', 'Nasai (Al-Kubra)', { sura: 2, from: 255, to: 255 }),
  x('afterSalah', 'ikhlas', '', 'Surah Al-Ikhlas', 3, 'فجر اور مغرب کے بعد 3 بار، باقی نمازوں کے بعد 1 بار', 'Abu Dawud, Tirmidhi', { sura: 112, from: 1, to: 4 }),
  x('afterSalah', 'falaq', '', 'Surah Al-Falaq', 3, 'فجر اور مغرب کے بعد 3 بار، باقی نمازوں کے بعد 1 بار', 'Abu Dawud, Tirmidhi', { sura: 113, from: 1, to: 5 }),
  x('afterSalah', 'nas', '', 'Surah An-Nas', 3, 'فجر اور مغرب کے بعد 3 بار، باقی نمازوں کے بعد 1 بار', 'Abu Dawud, Tirmidhi', { sura: 114, from: 1, to: 6 }),
  x('afterSalah', 'istighfar3', 'أَسْتَغْفِرُ اللّٰهَ', 'Astaghfirullah', 3, 'سلام پھیرتے ہی 3 بار', 'Muslim'),
  x('afterSalah', 'antasSalam', 'اَللّٰهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ', 'Allahumma antas-salam wa minkas-salam, tabarakta ya Dhal-Jalali wal-Ikram', 1, 'فرض کے فوراً بعد ایک بار', 'Muslim'),
  x('afterSalah', 'tahleelAfter', 'لَا إِلٰهَ إِلَّا اللّٰهُ وَحْدَهٗ لَا شَرِيْكَ لَهٗ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلٰى كُلِّ شَيْءٍ قَدِيْرٌ', 'La ilaha illallahu wahdahu la shareeka lah, lahul-mulku wa lahul-hamd, wa huwa ala kulli shay-in qadeer', 1, 'ہر نماز کے بعد؛ تسبیحِ فاطمی کے بعد پڑھنے سے گناہ معاف ہوتے ہیں', 'Muslim'),
  x('afterSalah', 'ajirni', 'اَللّٰهُمَّ أَجِرْنِيْ مِنَ النَّارِ', 'Allahumma ajirni minan-nar', 7, 'فجر اور مغرب کے بعد 7 بار: جہنم سے پناہ', 'Abu Dawud'),
  x('afterSalah', 'tahleel10', 'لَا إِلٰهَ إِلَّا اللّٰهُ وَحْدَهٗ لَا شَرِيْكَ لَهٗ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ يُحْيِيْ وَيُمِيْتُ وَهُوَ عَلٰى كُلِّ شَيْءٍ قَدِيْرٌ', 'La ilaha illallahu wahdahu ... yuhyi wa yumit ...', 10, 'فجر اور مغرب کے بعد جگہ بدلے بغیر 10 بار', 'Tirmidhi'),
  x('afterSalah', 'witrQuddus', 'سُبْحَانَ الْمَلِكِ الْقُدُّوْسِ', 'Subhanal-Malikil-Quddus', 3, 'وتر کے سلام کے بعد 3 بار، تیسری بار آواز ذرا بلند', 'Nasai, Abu Dawud'),

  // 2. Morning and evening
  x('morningEvening', 'subhanBihamdihi100', 'سُبْحَانَ اللّٰهِ وَبِحَمْدِهٖ', 'SubhanAllahi wa bihamdihi', 100, 'صبح و شام 100 بار: گناہ معاف ہو جاتے ہیں چاہے سمندر کی جھاگ کے برابر ہوں', 'Bukhari, Muslim'),
  x('morningEvening', 'istighfar100', 'أَسْتَغْفِرُ اللّٰهَ وَأَتُوْبُ إِلَيْهِ', 'Astaghfirullaha wa atubu ilayh', 100, 'روزانہ 100 بار (نبی ﷺ کا معمول)', 'Bukhari, Muslim'),
  x('morningEvening', 'durood100', 'اَللّٰهُمَّ صَلِّ عَلٰى مُحَمَّدٍ وَّعَلٰى آلِ مُحَمَّدٍ', 'Allahumma salli ala Muhammadin wa ala aali Muhammad', 100, 'روزانہ اور خاص طور پر جمعہ کو کثرت سے؛ ایک درود پر دس رحمتیں', 'Muslim; Abu Dawud'),
  x('morningEvening', 'kalima4x', 'لَا إِلٰهَ إِلَّا اللّٰهُ وَحْدَهٗ لَا شَرِيْكَ لَهٗ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلٰى كُلِّ شَيْءٍ قَدِيْرٌ', 'La ilaha illallahu wahdahu la shareeka lah ...', 100, 'دن میں 100 بار: دس غلام آزاد کرنے کا ثواب، سو نیکیاں', 'Bukhari, Muslim'),
  x('morningEvening', 'raditu', 'رَضِيْتُ بِاللّٰهِ رَبًّا وَّبِالْإِسْلَامِ دِيْنًا وَّبِمُحَمَّدٍ صَلَّى اللّٰهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا', 'Raditu billahi Rabban ...', 3, 'صبح و شام 3 بار', 'Abu Dawud, Tirmidhi'),
  x('morningEvening', 'laYadurru', 'بِسْمِ اللّٰهِ الَّذِيْ لَا يَضُرُّ مَعَ اسْمِهٖ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيْعُ الْعَلِيْمُ', 'Bismillahil-ladhi la yadurru ...', 3, 'صبح و شام 3 بار: اچانک مصیبت سے حفاظت', 'Abu Dawud, Tirmidhi'),
  x('morningEvening', 'hasbiyallah7', 'حَسْبِيَ اللّٰهُ لَا إِلٰهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيْمِ', 'Hasbiyallahu la ilaha illa huwa ...', 7, 'صبح و شام 7 بار: دنیا و آخرت کی فکروں کے لیے کافی', 'Abu Dawud'),
  x('morningEvening', 'kalimatTammah', 'أَعُوْذُ بِكَلِمَاتِ اللّٰهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ', "A'udhu bi kalimatillahit-tammati min sharri ma khalaq", 3, 'شام کو 3 بار: زہریلی چیزوں سے حفاظت', 'Muslim, Tirmidhi'),
  x('morningEvening', 'afwAfiyah', 'اَللّٰهُمَّ إِنِّيْ أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ', "Allahumma inni as'alukal-'afwa wal-'afiyah fid-dunya wal-akhirah", 1, 'صبح و شام: عافیت کی جامع دعا', 'Abu Dawud, Ibn Majah'),

  // 3. Six kalimas (taken from the kalimas file)
  ...KALIMAS.map((k, i) => x('kalimas', `k${i + 1}`, k.arabic, k.title.roman, i < 2 ? 100 : 33, k.title.ur, 'Madrasa curriculum')),

  // 4. Relief
  x('relief', 'hawqala', 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللّٰهِ', 'La hawla wa la quwwata illa billah', 100, 'جنت کے خزانوں میں سے ایک خزانہ؛ 99 بیماریوں کی دوا جن میں سب سے ہلکی فکر ہے (روایت میں ضعف ہے)', 'Bukhari, Muslim; Tabarani'),
  x('relief', 'ayatKarima', 'لَا إِلٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّيْ كُنْتُ مِنَ الظَّالِمِيْنَ', 'La ilaha illa anta subhanaka inni kuntu minaz-zalimin', 100, 'آیتِ کریمہ: مشکل میں جو مسلمان یہ دعا کرے قبول ہوتی ہے۔ 313 یا سوا لاکھ بزرگوں کا معمول ہے، حدیث میں تعداد مقرر نہیں', 'Tirmidhi; Quran 21:87'),
  x('relief', 'yaHayyu', 'يَا حَيُّ يَا قَيُّوْمُ بِرَحْمَتِكَ أَسْتَغِيْثُ', 'Ya Hayyu ya Qayyumu bi rahmatika astagheeth', 100, 'پریشانی میں نبی ﷺ یہی پڑھتے', 'Tirmidhi'),
  x('relief', 'hasbunallah', 'حَسْبُنَا اللّٰهُ وَنِعْمَ الْوَكِيْلُ', 'Hasbunallahu wa ni\'mal-wakeel', 100, 'آزمائش اور دشمن کے خوف میں (ابراہیم علیہ السلام نے آگ میں پڑھا)۔ 450 بار بزرگوں کا معمول ہے', 'Bukhari; Quran 3:173'),
  x('relief', 'yaDhalJalal', 'يَا ذَا الْجَلَالِ وَالْإِكْرَامِ', 'Ya Dhal-Jalali wal-Ikram', 100, 'اسے لازم پکڑو (نبی ﷺ کا حکم)', 'Tirmidhi'),
  x('relief', 'yaArham', 'يَا أَرْحَمَ الرَّاحِمِيْنَ', 'Ya Arhamar-Rahimin', 3, 'تین بار کہنے پر فرشتہ کہتا ہے: ارحم الراحمین تیری طرف متوجہ ہے، مانگ (روایت میں ضعف ہے)', 'Hakim'),

  // 5. Repentance
  x('tawbah', 'sayyidIstighfar', 'اَللّٰهُمَّ أَنْتَ رَبِّيْ لَا إِلٰهَ إِلَّا أَنْتَ خَلَقْتَنِيْ وَأَنَا عَبْدُكَ وَأَنَا عَلٰى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ أَعُوْذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ أَبُوْءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوْءُ بِذَنْبِيْ فَاغْفِرْ لِيْ فَإِنَّهٗ لَا يَغْفِرُ الذُّنُوْبَ إِلَّا أَنْتَ', 'Sayyid-ul-Istighfar', 1, 'صبح یقین کے ساتھ پڑھے اور شام سے پہلے فوت ہو، یا رات کو پڑھے اور صبح سے پہلے، تو جنتی ہے', 'Bukhari'),
  x('tawbah', 'astaghfirullahAzeem', 'أَسْتَغْفِرُ اللّٰهَ الْعَظِيْمَ الَّذِيْ لَا إِلٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّوْمُ وَأَتُوْبُ إِلَيْهِ', "Astaghfirullahal-'azeem alladhi la ilaha illa huwal-Hayyul-Qayyumu wa atubu ilayh", 3, 'گناہ معاف ہوتے ہیں چاہے میدانِ جنگ سے بھاگا ہو', 'Abu Dawud, Tirmidhi'),
  x('tawbah', 'muqallib', 'يَا مُقَلِّبَ الْقُلُوْبِ ثَبِّتْ قَلْبِيْ عَلٰى دِيْنِكَ', 'Ya Muqallibal-qulub thabbit qalbi ala deenik', 33, 'ایمان پر ثابت قدمی (نبی ﷺ کی اکثر دعا)', 'Tirmidhi'),
  x('tawbah', 'rabbighfir', 'رَبِّ اغْفِرْ وَارْحَمْ وَأَنْتَ خَيْرُ الرَّاحِمِيْنَ', 'Rabbighfir warham wa anta khairur-rahimin', 33, 'قرآنی دعا', 'Quran 23:118'),

  // 6. Heavy on the scale
  x('heavy', 'adadaKhalqihi', 'سُبْحَانَ اللّٰهِ وَبِحَمْدِهٖ عَدَدَ خَلْقِهٖ وَرِضَا نَفْسِهٖ وَزِنَةَ عَرْشِهٖ وَمِدَادَ كَلِمَاتِهٖ', 'SubhanAllahi wa bihamdihi, adada khalqihi, wa rida nafsihi, wa zinata arshihi, wa midada kalimatih', 3, 'چند سیکنڈ کی تسبیح جو صبح سے دوپہر تک کے ذکر سے وزنی ہے', 'Muslim'),
  x('heavy', 'subhanAzeem', 'سُبْحَانَ اللّٰهِ الْعَظِيْمِ وَبِحَمْدِهٖ', 'SubhanAllahil-azeemi wa bihamdihi', 100, 'ہر بار کہنے پر جنت میں کھجور کا ایک درخت', 'Tirmidhi'),
  x('heavy', 'baqiyat', 'سُبْحَانَ اللّٰهِ وَالْحَمْدُ لِلّٰهِ وَلَا إِلٰهَ إِلَّا اللّٰهُ وَاللّٰهُ أَكْبَرُ', 'SubhanAllah, walhamdulillah, wa la ilaha illallah, wallahu akbar', 100, 'اللہ کو سب سے پیارے کلمات', 'Muslim'),
  x('heavy', 'malikulHaq', 'لَا إِلٰهَ إِلَّا اللّٰهُ الْمَلِكُ الْحَقُّ الْمُبِيْنُ', 'La ilaha illallahul-Malikul-Haqqul-Mubeen', 100, 'روزانہ 100 بار: رزق اور قبر کی وحشت سے حفاظت (روایت میں ضعف ہے، بزرگوں کا معمول)', 'Abu Nu\'aym (weak)'),
  x('heavy', 'subbuhun', 'سُبُّوْحٌ قُدُّوْسٌ رَبُّ الْمَلَائِكَةِ وَالرُّوْحِ', 'Subbuhun Quddusun Rabbul-mala-ikati war-ruh', 33, 'رکوع اور سجدے میں نبی ﷺ پڑھتے (نفل میں)', 'Muslim'),
  x('heavy', 'twoLight', 'سُبْحَانَ اللّٰهِ وَبِحَمْدِهٖ سُبْحَانَ اللّٰهِ الْعَظِيْمِ', 'SubhanAllahi wa bihamdihi, SubhanAllahil-azeem', 100, 'زبان پر ہلکے، میزان میں بھاری، رحمٰن کو پیارے', 'Bukhari, Muslim'),
];
