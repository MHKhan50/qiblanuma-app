// Basic Hanafi masail for adults: wudu, ghusl, tayammum, salah and its rakats.
// Written from the common Urdu primers (Taleem-ul-Islam, Bahar-e-Shariat
// summaries). To be checked by the reviewing ulama before release.
import type { Recitation, Topic, Tri } from './types';

const L = (ur: string, roman: string, en: string): Tri => ({ ur, roman, en });

export const WUDU: Topic = {
  id: 'wudu',
  title: L('وضو', 'Wuzu', 'Wudu'),
  intro: L('حنفی فقہ کے مطابق', 'Hanafi fiqh ke mutabiq', 'According to Hanafi fiqh'),
  lists: [
    {
      heading: L('وضو کے فرائض (4)', 'Wuzu ke faraiz (4)', 'Obligatory acts of wudu (4)'),
      items: [
        L('پورا چہرہ ایک بار دھونا (پیشانی کے بالوں سے ٹھوڑی کے نیچے تک، ایک کان کی لو سے دوسرے کان کی لو تک)', 'Poora chehra ek baar dhona (peshani ke baalon se thodi ke neeche tak, ek kaan ki lau se doosre kaan ki lau tak)', 'Washing the whole face once (hairline to below the chin, ear lobe to ear lobe)'),
        L('دونوں ہاتھ کہنیوں سمیت دھونا', 'Dono haath kohniyon samait dhona', 'Washing both arms including the elbows'),
        L('چوتھائی سر کا مسح کرنا', 'Chauthai sar ka masah karna', 'Wiping a quarter of the head'),
        L('دونوں پاؤں ٹخنوں سمیت دھونا', 'Dono paaon takhnon samait dhona', 'Washing both feet including the ankles'),
      ],
    },
    {
      heading: L('وضو کی سنتیں', 'Wuzu ki sunnatein', 'Sunnahs of wudu'),
      items: [
        L('نیت کرنا', 'Niyyat karna', 'Making the intention'),
        L('بسم اللہ پڑھ کر شروع کرنا', 'Bismillah parh kar shuru karna', 'Beginning with Bismillah'),
        L('دونوں ہاتھ کلائیوں تک تین بار دھونا', 'Dono haath kalaiyon tak teen baar dhona', 'Washing both hands to the wrists three times'),
        L('مسواک کرنا', 'Miswak karna', 'Using the miswak'),
        L('تین بار کلی کرنا', 'Teen baar kulli karna', 'Rinsing the mouth three times'),
        L('تین بار ناک میں پانی ڈالنا اور صاف کرنا', 'Teen baar naak mein paani daalna aur saaf karna', 'Rinsing the nose three times'),
        L('داڑھی کا خلال کرنا', 'Daarhi ka khilal karna', 'Passing wet fingers through the beard'),
        L('ہاتھ پاؤں کی انگلیوں کا خلال کرنا', 'Haath paaon ki ungliyon ka khilal karna', 'Passing water between the fingers and toes'),
        L('ہر عضو تین بار دھونا', 'Har uzv teen baar dhona', 'Washing each part three times'),
        L('پورے سر کا ایک بار مسح کرنا', 'Poore sar ka ek baar masah karna', 'Wiping the whole head once'),
        L('کانوں کا مسح کرنا', 'Kaanon ka masah karna', 'Wiping the ears'),
        L('ترتیب سے وضو کرنا', 'Tarteeb se wuzu karna', 'Keeping the order'),
        L('پے در پے دھونا کہ پہلا عضو سوکھنے نہ پائے', 'Pe dar pe dhona ke pehla uzv sookhne na paye', 'Washing one part after another without a pause'),
      ],
    },
    {
      heading: L('وضو توڑنے والی چیزیں', 'Wuzu torne wali cheezein', 'What breaks wudu'),
      items: [
        L('پیشاب، پاخانہ یا ہوا کا نکلنا', 'Peshab, pakhana ya hawa ka nikalna', 'Passing urine, stool or wind'),
        L('خون یا پیپ کا نکل کر بہہ جانا', 'Khoon ya peep ka nikal kar beh jana', 'Blood or pus flowing out of the body'),
        L('منہ بھر کر قے آنا', 'Munh bhar kar qay aana', 'Vomiting a mouthful'),
        L('لیٹ کر یا ٹیک لگا کر سو جانا', 'Let kar ya tek laga kar so jana', 'Sleeping lying down or leaning'),
        L('بے ہوش ہو جانا یا نشہ آ جانا', 'Be-hosh ho jana ya nasha aa jana', 'Fainting or intoxication'),
        L('رکوع سجدے والی نماز میں قہقہہ لگانا', 'Ruku sajde wali namaz mein qehqaha lagana', 'Laughing aloud in a salah with ruku and sajdah'),
      ],
    },
  ],
};

export const GHUSL: Topic = {
  id: 'ghusl',
  title: L('غسل', 'Ghusl', 'Ghusl'),
  intro: L('حنفی فقہ کے مطابق', 'Hanafi fiqh ke mutabiq', 'According to Hanafi fiqh'),
  lists: [
    {
      heading: L('غسل کے فرائض (3)', 'Ghusl ke faraiz (3)', 'Obligatory acts of ghusl (3)'),
      items: [
        L('اس طرح کلی کرنا کہ پورے منہ میں پانی پہنچ جائے', 'Is tarah kulli karna ke poore munh mein paani pohanch jaye', 'Rinsing the whole mouth'),
        L('ناک میں نرم ہڈی تک پانی پہنچانا', 'Naak mein narm haddi tak paani pohanchana', 'Taking water into the nose up to the soft bone'),
        L('پورے بدن پر اس طرح پانی بہانا کہ بال برابر جگہ بھی خشک نہ رہے', 'Poore badan par is tarah paani bahana ke baal barabar jagah bhi khushk na rahe', 'Pouring water over the whole body so that not a hair\'s breadth stays dry'),
      ],
    },
    {
      heading: L('غسل کی سنتیں', 'Ghusl ki sunnatein', 'Sunnahs of ghusl'),
      items: [
        L('نیت کرنا', 'Niyyat karna', 'Making the intention'),
        L('دونوں ہاتھ کلائیوں تک دھونا', 'Dono haath kalaiyon tak dhona', 'Washing both hands to the wrists'),
        L('استنجا کرنا اور بدن پر لگی نجاست دھونا', 'Istinja karna aur badan par lagi najasat dhona', 'Washing the private parts and any impurity on the body'),
        L('پہلے وضو کرنا', 'Pehle wuzu karna', 'Performing wudu first'),
        L('تین بار پورے بدن پر پانی بہانا: پہلے سر، پھر دائیں کندھے، پھر بائیں کندھے پر', 'Teen baar poore badan par paani bahana: pehle sar, phir daayen kandhe, phir baayen kandhe par', 'Pouring water over the body three times: head, right shoulder, then left shoulder'),
        L('بدن کو ملنا', 'Badan ko malna', 'Rubbing the body'),
      ],
    },
  ],
};

export const TAYAMMUM: Topic = {
  id: 'tayammum',
  title: L('تیمم', 'Tayammum', 'Tayammum'),
  intro: L('جب پانی نہ ملے یا اس کے استعمال سے بیماری کا خطرہ ہو', 'Jab paani na mile ya us ke istemal se beemari ka khatra ho', 'When water is not available or using it would cause harm'),
  lists: [
    {
      heading: L('تیمم کے فرائض (3)', 'Tayammum ke faraiz (3)', 'Obligatory acts of tayammum (3)'),
      items: [
        L('نیت کرنا', 'Niyyat karna', 'Making the intention'),
        L('پاک مٹی پر ہاتھ مار کر پورے چہرے کا مسح کرنا', 'Paak mitti par haath maar kar poore chehre ka masah karna', 'Striking clean earth and wiping the whole face'),
        L('دوبارہ ہاتھ مار کر دونوں ہاتھوں کا کہنیوں سمیت مسح کرنا', 'Dobara haath maar kar dono haathon ka kohniyon samait masah karna', 'Striking again and wiping both arms including the elbows'),
      ],
    },
  ],
};

export const NAMAZ: Topic = {
  id: 'namaz',
  title: L('نماز کے فرائض و واجبات', 'Namaz ke faraiz o wajibat', 'Salah: obligations'),
  intro: L('نماز کے 13 فرائض: 7 نماز سے باہر (شرائط) اور 6 نماز کے اندر (ارکان)', 'Namaz ke 13 faraiz: 7 namaz se bahar (sharait) aur 6 namaz ke andar (arkan)', '13 obligations: 7 conditions before salah and 6 pillars within it'),
  lists: [
    {
      heading: L('نماز کی شرائط (نماز سے باہر کے 7 فرائض)', 'Namaz ki sharait (namaz se bahar ke 7 faraiz)', 'Conditions (7)'),
      items: [
        L('بدن کا پاک ہونا', 'Badan ka paak hona', 'Purity of the body'),
        L('کپڑوں کا پاک ہونا', 'Kapron ka paak hona', 'Purity of the clothes'),
        L('نماز کی جگہ کا پاک ہونا', 'Namaz ki jagah ka paak hona', 'Purity of the place'),
        L('ستر چھپانا', 'Satr chhupana', 'Covering the awrah'),
        L('قبلہ رخ ہونا', 'Qibla rukh hona', 'Facing the Qibla'),
        L('نماز کا وقت ہونا', 'Namaz ka waqt hona', 'The time of the prayer having begun'),
        L('نیت کرنا', 'Niyyat karna', 'Intention'),
      ],
    },
    {
      heading: L('نماز کے ارکان (نماز کے اندر کے 6 فرائض)', 'Namaz ke arkan (namaz ke andar ke 6 faraiz)', 'Pillars (6)'),
      items: [
        L('تکبیرِ تحریمہ (اللہ اکبر کہہ کر نماز شروع کرنا)', 'Takbeer-e-tahreema (Allahu Akbar keh kar namaz shuru karna)', 'Opening takbir'),
        L('قیام (کھڑا ہونا)', 'Qiyam (khara hona)', 'Standing'),
        L('قراءت (قرآن پڑھنا)', 'Qirat (Quran parhna)', 'Recitation of the Quran'),
        L('رکوع', 'Ruku', 'Bowing'),
        L('دونوں سجدے', 'Dono sajde', 'Both prostrations'),
        L('قعدۂ اخیرہ (تشہد کی مقدار بیٹھنا)', 'Qada-e-akheera (tashahhud ki miqdar baithna)', 'Final sitting for the length of the tashahhud'),
      ],
    },
    {
      heading: L('نماز کے اہم واجبات', 'Namaz ke aham wajibat', 'Main wajib acts'),
      items: [
        L('ہر رکعت میں سورۂ فاتحہ پڑھنا (فرض کی پہلی دو رکعتوں میں، باقی نمازوں کی ہر رکعت میں)', 'Har rakat mein Surah Fatiha parhna (farz ki pehli do rakaton mein, baqi namazon ki har rakat mein)', 'Reciting Al-Fatiha in each required rakat'),
        L('فاتحہ کے بعد کوئی سورت یا تین چھوٹی آیات ملانا', 'Fatiha ke baad koi surat ya teen chhoti ayaat milana', 'Adding a surah or three short ayahs after Al-Fatiha'),
        L('رکوع اور سجدے اطمینان سے کرنا (تعدیلِ ارکان)', 'Ruku aur sajde itminan se karna (tadeel-e-arkan)', 'Performing ruku and sajdah calmly'),
        L('قعدۂ اولیٰ کرنا اور دونوں قعدوں میں تشہد پڑھنا', 'Qada-e-oola karna aur dono qadon mein tashahhud parhna', 'The first sitting and tashahhud in both sittings'),
        L('سلام کے لفظ سے نماز ختم کرنا', 'Salam ke lafz se namaz khatam karna', 'Ending the salah with salam'),
        L('وتر میں دعائے قنوت پڑھنا', 'Witr mein Dua-e-Qunoot parhna', 'Dua al-Qunut in witr'),
        L('جہری اور سری نمازوں میں اسی طرح قراءت کرنا', 'Jahri aur sirri namazon mein isi tarah qirat karna', 'Reciting aloud or silently in the right prayers'),
      ],
    },
    {
      heading: L('سجدۂ سہو', 'Sajda-e-sahw', 'Sajdah of forgetfulness'),
      items: [
        L('بھول کر کوئی واجب چھوٹ جائے تو آخری قعدے میں تشہد کے بعد ایک طرف سلام پھیر کر دو سجدے کریں، پھر تشہد، درود اور دعا پڑھ کر سلام پھیریں۔', 'Bhool kar koi wajib chhoot jaye to aakhri qade mein tashahhud ke baad ek taraf salam pher kar do sajde karein, phir tashahhud, durood aur dua parh kar salam pherein.', 'If a wajib act is missed by mistake: after the tashahhud of the last sitting, give one salam, make two sajdahs, then read tashahhud, durood and dua and end with salam.'),
        L('اگر کوئی فرض چھوٹ جائے تو نماز دوبارہ پڑھنی ہو گی۔', 'Agar koi farz chhoot jaye to namaz dobara parhni hogi.', 'If a fard act is missed, the salah must be repeated.'),
      ],
    },
    {
      heading: L('نماز توڑنے والی چیزیں', 'Namaz torne wali cheezein', 'What breaks the salah'),
      items: [
        L('نماز میں بات کرنا', 'Namaz mein baat karna', 'Talking'),
        L('کھانا پینا', 'Khana peena', 'Eating or drinking'),
        L('بلا عذر قبلہ سے سینہ پھیر لینا', 'Bila uzr qibla se seena pher lena', 'Turning the chest away from the Qibla without excuse'),
        L('عملِ کثیر (ایسا کام کہ دیکھنے والا سمجھے یہ نماز میں نہیں)', 'Amal-e-kaseer (aisa kaam ke dekhne wala samjhe yeh namaz mein nahi)', 'Much movement that makes an onlooker think one is not praying'),
        L('وضو ٹوٹ جانا', 'Wuzu toot jana', 'Losing wudu'),
        L('آواز سے ہنسنا', 'Awaz se hansna', 'Laughing audibly'),
      ],
    },
  ],
};

export const RAKAAT: Topic = {
  id: 'rakaat',
  title: L('نمازوں کی رکعتیں', 'Namazon ki rakatein', 'Rakats of each prayer'),
  intro: L('حنفی فقہ کے مطابق۔ س م = سنتِ مؤکدہ، س غ = سنتِ غیر مؤکدہ', 'Hanafi fiqh ke mutabiq. SM = sunnat-e-muakkadah, SG = sunnat-e-ghair-muakkadah', 'Hanafi. SM = emphasised sunnah, SG = non-emphasised sunnah'),
  table: {
    head: [L('سنت (پہلے)', 'Sunnat (pehle)', 'Sunnah before'), L('فرض', 'Farz', 'Fard'), L('سنت (بعد)', 'Sunnat (baad)', 'Sunnah after'), L('نفل', 'Nafl', 'Nafl'), L('وتر', 'Witr', 'Witr'), L('کل', 'Kul', 'Total')],
    rows: [
      { label: L('فجر', 'Fajr', 'Fajr'), cells: ['2 SM', '2', '—', '—', '—', '4'] },
      { label: L('ظہر', 'Zuhr', 'Dhuhr'), cells: ['4 SM', '4', '2 SM', '2', '—', '12'] },
      { label: L('عصر', 'Asr', 'Asr'), cells: ['4 SG', '4', '—', '—', '—', '8'] },
      { label: L('مغرب', 'Maghrib', 'Maghrib'), cells: ['—', '3', '2 SM', '2', '—', '7'] },
      { label: L('عشاء', 'Isha', 'Isha'), cells: ['4 SG', '4', '2 SM', '2 + 2', '3', '17'] },
      { label: L('جمعہ', 'Jumuah', "Jumu'ah"), cells: ['4 SM', '2', '4 SM + 2', '2', '—', '14'] },
    ],
  },
  lists: [
    {
      heading: L('یاد رکھیں', 'Yaad rakhein', 'Remember'),
      items: [
        L('عشاء کے بعد وتر کی 3 رکعتیں واجب ہیں، تیسری رکعت میں دعائے قنوت پڑھی جاتی ہے۔', 'Isha ke baad witr ki 3 rakatein wajib hain, teesri rakat mein Dua-e-Qunoot parhi jati hai.', 'Three rakats of witr after Isha are wajib, with Dua al-Qunut in the third.'),
        L('عشاء میں وتر کے بعد 2 نفل بھی پڑھے جاتے ہیں۔', 'Isha mein witr ke baad 2 nafl bhi parhe jate hain.', 'Two nafl are also prayed after witr.'),
      ],
    },
  ],
};

export const MAKRUH: Topic = {
  id: 'makruh',
  title: L('ممنوع اور مکروہ اوقات', 'Mamnoo aur makruh auqat', 'Forbidden and disliked times'),
  intro: L('آج کے اوقات "نماز کے اوقات" والے صفحے پر ہیں۔', 'Aaj ke auqat "Namaz ke auqat" wale safhe par hain.', 'Today\'s times are on the Prayer times page.'),
  lists: [
    {
      heading: L('تین اوقات جن میں کوئی نماز جائز نہیں', 'Teen auqat jin mein koi namaz jaiz nahi', 'Three times when no salah is allowed'),
      items: [
        L('سورج نکلتے وقت، جب تک وہ اچھی طرح بلند نہ ہو جائے (تقریباً 15 سے 20 منٹ)', 'Sooraj nikalte waqt, jab tak woh achhi tarah buland na ho jaye (taqreeban 15 se 20 minute)', 'At sunrise until the sun has risen well (about 15 to 20 minutes)'),
        L('زوال، یعنی ٹھیک دوپہر کے وقت', 'Zawal, yani theek dopahar ke waqt', 'At zawal, when the sun is at its highest'),
        L('سورج ڈوبتے وقت جب وہ زرد ہو جائے (اس دن کی عصر اس وقت بھی ادا ہو جاتی ہے مگر مکروہ ہے)', 'Sooraj doobte waqt jab woh zard ho jaye (us din ki Asr us waqt bhi ada ho jati hai magar makruh hai)', 'At sunset once the sun turns yellow (that day\'s Asr is still valid but disliked)'),
      ],
    },
    {
      heading: L('دو اوقات جن میں نفل مکروہ ہیں', 'Do auqat jin mein nafl makruh hain', 'Two times when nafl are disliked'),
      items: [
        L('فجر کی نماز کے بعد سورج نکلنے تک', 'Fajr ki namaz ke baad sooraj nikalne tak', 'After the Fajr prayer until sunrise'),
        L('عصر کی نماز کے بعد سورج ڈوبنے تک', 'Asr ki namaz ke baad sooraj doobne tak', 'After the Asr prayer until sunset'),
      ],
    },
  ],
};

// The fixed words of salah, in the order they are said.
const r = (id: string, title: [string, string, string], arabic: string, meaning: [string, string, string], times?: number): Recitation => ({
  id, title: { ur: title[0], roman: title[1], en: title[2] }, arabic,
  meaning: { ur: meaning[0], roman: meaning[1], en: meaning[2] }, times,
});

export const DUROOD_IBRAHIMI = 'اَللّٰهُمَّ صَلِّ عَلٰى مُحَمَّدٍ وَّعَلٰى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلٰى إِبْرَاهِيْمَ وَعَلٰى آلِ إِبْرَاهِيْمَ إِنَّكَ حَمِيْدٌ مَّجِيْدٌ ۔ اَللّٰهُمَّ بَارِكْ عَلٰى مُحَمَّدٍ وَّعَلٰى آلِ مُحَمَّدٍ كَمَا بَارَكْتَ عَلٰى إِبْرَاهِيْمَ وَعَلٰى آلِ إِبْرَاهِيْمَ إِنَّكَ حَمِيْدٌ مَّجِيْدٌ';

export const DUROOD_MEANING: Tri = L(
  'اے اللہ! محمد ﷺ اور آلِ محمد پر رحمت نازل فرما جیسے تو نے ابراہیم علیہ السلام اور آلِ ابراہیم پر رحمت نازل فرمائی، بیشک تو تعریف والا، بزرگی والا ہے۔ اے اللہ! محمد ﷺ اور آلِ محمد پر برکت نازل فرما جیسے تو نے ابراہیم علیہ السلام اور آلِ ابراہیم پر برکت نازل فرمائی، بیشک تو تعریف والا، بزرگی والا ہے۔',
  'Aye Allah! Muhammad ﷺ aur Aal-e-Muhammad par rehmat nazil farma jaise tu ne Ibrahim علیہ السلام aur Aal-e-Ibrahim par rehmat nazil farmai, beshak tu tareef wala, buzurgi wala hai. Aye Allah! Muhammad ﷺ aur Aal-e-Muhammad par barkat nazil farma jaise tu ne Ibrahim علیہ السلام aur Aal-e-Ibrahim par barkat nazil farmai, beshak tu tareef wala, buzurgi wala hai.',
  'O Allah, send blessings upon Muhammad ﷺ and the family of Muhammad as You sent blessings upon Ibrahim and the family of Ibrahim; You are Praiseworthy, Glorious. O Allah, bless Muhammad ﷺ and the family of Muhammad as You blessed Ibrahim and the family of Ibrahim; You are Praiseworthy, Glorious.',
);

export const NAMAZ_AZKAR: Recitation[] = [
  r('sana', ['ثناء', 'Sana', 'Thana (opening praise)'],
    'سُبْحَانَكَ اللّٰهُمَّ وَبِحَمْدِكَ وَتَبَارَكَ اسْمُكَ وَتَعَالٰى جَدُّكَ وَلَا إِلٰهَ غَيْرُكَ',
    ['اے اللہ! تو پاک ہے اور تیری ہی تعریف ہے، تیرا نام برکت والا ہے، تیری شان بلند ہے، اور تیرے سوا کوئی معبود نہیں۔', 'Aye Allah! Tu paak hai aur teri hi tareef hai, tera naam barkat wala hai, teri shaan buland hai, aur tere siwa koi mabood nahi.', 'Glory be to You, O Allah, and praise; blessed is Your name, exalted is Your majesty, and there is no god but You.']),
  r('taawwuz', ['تعوذ', 'Taawwuz', "Ta'awwudh"],
    'أَعُوْذُ بِاللّٰهِ مِنَ الشَّيْطَانِ الرَّجِيْمِ',
    ['میں اللہ کی پناہ مانگتا ہوں شیطان مردود سے۔', 'Main Allah ki panah maangta hoon Shaitan mardood se.', 'I seek refuge in Allah from Satan, the accursed.']),
  r('tasmiya', ['تسمیہ', 'Tasmiya', 'Tasmiyah'],
    'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ',
    ['اللہ کے نام سے جو بہت مہربان، نہایت رحم والا ہے۔', 'Allah ke naam se jo bohat meharban, nihayat reham wala hai.', 'In the name of Allah, the Most Gracious, the Most Merciful.']),
  r('ruku', ['رکوع کی تسبیح', 'Ruku ki tasbeeh', 'In ruku'],
    'سُبْحَانَ رَبِّيَ الْعَظِيْمِ',
    ['پاک ہے میرا رب جو عظمت والا ہے۔', 'Paak hai mera Rab jo azmat wala hai.', 'Glory be to my Lord, the Most Great.'], 3),
  r('qauma', ['رکوع سے اٹھتے ہوئے', 'Ruku se uthte hue', 'Rising from ruku'],
    'سَمِعَ اللّٰهُ لِمَنْ حَمِدَهُ ۔ رَبَّنَا لَكَ الْحَمْدُ',
    ['اللہ نے اس کی سن لی جس نے اس کی تعریف کی۔ اے ہمارے رب! تیرے ہی لیے سب تعریف ہے۔', 'Allah ne us ki sun li jis ne us ki tareef ki. Aye hamare Rab! Tere hi liye sab tareef hai.', 'Allah hears the one who praises Him. Our Lord, to You is all praise.']),
  r('sajda', ['سجدے کی تسبیح', 'Sajde ki tasbeeh', 'In sajdah'],
    'سُبْحَانَ رَبِّيَ الْأَعْلٰى',
    ['پاک ہے میرا رب جو سب سے بلند ہے۔', 'Paak hai mera Rab jo sab se buland hai.', 'Glory be to my Lord, the Most High.'], 3),
  r('tashahhud', ['تشہد (التحیات)', 'Tashahhud (Attahiyyat)', 'Tashahhud'],
    'اَلتَّحِيَّاتُ لِلّٰهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ اَلسَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللّٰهِ وَبَرَكَاتُهُ اَلسَّلَامُ عَلَيْنَا وَعَلٰى عِبَادِ اللّٰهِ الصَّالِحِيْنَ أَشْهَدُ أَنْ لَّا إِلٰهَ إِلَّا اللّٰهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُوْلُهُ',
    ['تمام زبانی، بدنی اور مالی عبادتیں اللہ ہی کے لیے ہیں۔ اے نبی! آپ پر سلام ہو اور اللہ کی رحمت اور برکتیں۔ ہم پر اور اللہ کے نیک بندوں پر سلام ہو۔ میں گواہی دیتا ہوں کہ اللہ کے سوا کوئی معبود نہیں اور گواہی دیتا ہوں کہ محمد ﷺ اس کے بندے اور رسول ہیں۔', 'Tamam zabani, badani aur maali ibadatein Allah hi ke liye hain. Aye Nabi! Aap par salam ho aur Allah ki rehmat aur barkatein. Hum par aur Allah ke nek bandon par salam ho. Main gawahi deta hoon ke Allah ke siwa koi mabood nahi aur gawahi deta hoon ke Muhammad ﷺ us ke bande aur Rasool hain.', 'All greetings, prayers and good things are for Allah. Peace be upon you, O Prophet, and the mercy of Allah and His blessings. Peace be upon us and upon the righteous servants of Allah. I bear witness that there is no god but Allah, and that Muhammad ﷺ is His servant and Messenger.']),
  {
    id: 'durood', title: L('درودِ ابراہیمی', 'Durood-e-Ibrahimi', 'Durood Ibrahimi'), arabic: DUROOD_IBRAHIMI, meaning: DUROOD_MEANING,
  },
  r('masura', ['دعائے ماثورہ', 'Dua-e-Masura', 'Dua after durood'],
    'اَللّٰهُمَّ إِنِّيْ ظَلَمْتُ نَفْسِيْ ظُلْمًا كَثِيْرًا وَّلَا يَغْفِرُ الذُّنُوْبَ إِلَّا أَنْتَ فَاغْفِرْ لِيْ مَغْفِرَةً مِّنْ عِنْدِكَ وَارْحَمْنِيْ إِنَّكَ أَنْتَ الْغَفُوْرُ الرَّحِيْمُ',
    ['اے اللہ! میں نے اپنی جان پر بہت ظلم کیا، اور تیرے سوا کوئی گناہوں کو نہیں بخشتا، تو اپنی طرف سے مجھے بخش دے اور مجھ پر رحم فرما، بیشک تو بخشنے والا، رحم کرنے والا ہے۔', 'Aye Allah! Main ne apni jaan par bohat zulm kiya, aur tere siwa koi gunahon ko nahi bakhshta, to apni taraf se mujhe bakhsh de aur mujh par reham farma, beshak tu bakhshne wala, reham karne wala hai.', 'O Allah, I have wronged myself greatly and none forgives sins but You, so forgive me with forgiveness from You and have mercy on me; You are the Forgiving, the Merciful.']),
  r('salam', ['سلام', 'Salam', 'Salam'],
    'اَلسَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللّٰهِ',
    ['تم پر سلامتی ہو اور اللہ کی رحمت۔ (پہلے دائیں، پھر بائیں)', 'Tum par salamati ho aur Allah ki rehmat. (Pehle daayen, phir baayen)', 'Peace be upon you and the mercy of Allah. (Right, then left)']),
  r('qunoot', ['دعائے قنوت (وتر)', 'Dua-e-Qunoot (Witr)', 'Dua al-Qunut (witr)'],
    'اَللّٰهُمَّ إِنَّا نَسْتَعِيْنُكَ وَنَسْتَغْفِرُكَ وَنُؤْمِنُ بِكَ وَنَتَوَكَّلُ عَلَيْكَ وَنُثْنِيْ عَلَيْكَ الْخَيْرَ وَنَشْكُرُكَ وَلَا نَكْفُرُكَ وَنَخْلَعُ وَنَتْرُكُ مَنْ يَّفْجُرُكَ ۔ اَللّٰهُمَّ إِيَّاكَ نَعْبُدُ وَلَكَ نُصَلِّيْ وَنَسْجُدُ وَإِلَيْكَ نَسْعٰى وَنَحْفِدُ وَنَرْجُوْ رَحْمَتَكَ وَنَخْشٰى عَذَابَكَ إِنَّ عَذَابَكَ بِالْكُفَّارِ مُلْحِقٌ',
    ['اے اللہ! ہم تجھ سے مدد اور معافی مانگتے ہیں، تجھ پر ایمان لاتے اور بھروسہ کرتے ہیں، تیری اچھی تعریف کرتے ہیں، تیرا شکر کرتے ہیں اور ناشکری نہیں کرتے، اور جو تیری نافرمانی کرے اسے چھوڑتے ہیں۔ اے اللہ! ہم تیری ہی عبادت کرتے ہیں، تیرے لیے نماز پڑھتے اور سجدہ کرتے ہیں، تیری طرف دوڑتے ہیں، تیری رحمت کی امید رکھتے اور تیرے عذاب سے ڈرتے ہیں، بیشک تیرا عذاب کافروں کو پہنچنے والا ہے۔', 'Aye Allah! Hum tujh se madad aur maafi maangte hain, tujh par iman laate aur bharosa karte hain, teri achhi tareef karte hain, tera shukr karte hain aur nashukri nahi karte, aur jo teri nafarmani kare usay chhorte hain. Aye Allah! Hum teri hi ibadat karte hain, tere liye namaz parhte aur sajda karte hain, teri taraf daurte hain, teri rehmat ki umeed rakhte aur tere azaab se darte hain, beshak tera azaab kafiron ko pohanchne wala hai.', 'O Allah, we seek Your help and forgiveness, believe in You and rely on You, praise You, thank You and are not ungrateful, and we leave whoever disobeys You. O Allah, You alone we worship, to You we pray and prostrate, to You we hasten; we hope for Your mercy and fear Your punishment, which will surely reach the disbelievers.']),
];

export const NAMAZ_WORDS: Topic = {
  id: 'namazWords',
  title: L('نماز میں پڑھی جانے والی دعائیں', 'Namaz mein parhi jane wali duain', 'What is said in salah'),
  intro: L('ترتیب سے: ثناء سے سلام تک', 'Tarteeb se: Sana se Salam tak', 'In order, from thana to salam'),
  recitations: NAMAZ_AZKAR,
};

export const TAJWEED: Topic = {
  id: 'tajweed',
  title: L('تجوید کے بنیادی قواعد', 'Tajweed ke bunyadi qawaid', 'Basic tajweed rules'),
  intro: L('صحیح تلفظ کسی قاری سے سن کر سیکھیں؛ یہ صرف یاد دہانی ہے۔', 'Sahih talaffuz kisi qari se sun kar seekhein; yeh sirf yaad dihani hai.', 'Learn pronunciation by listening to a qari; this is only a reminder.'),
  lists: [
    {
      heading: L('نون ساکن اور تنوین کے 4 قاعدے', 'Noon sakin aur tanween ke 4 qaide', 'Noon sakinah and tanween (4 rules)'),
      items: [
        L('اظہار: حروفِ حلقی (ء ہ ع ح غ خ) سے پہلے نون صاف پڑھیں', 'Izhar: huroof-e-halqi (ء ہ ع ح غ خ) se pehle noon saaf parhein', 'Izhar: pronounce the noon clearly before the throat letters ء ه ع ح غ خ'),
        L('ادغام: یرملون (ی ر م ل و ن) میں نون ملا دیں؛ ی ن م و میں غنہ کے ساتھ', 'Idgham: yarmaloon (ی ر م ل و ن) mein noon mila dein; ی ن م و mein ghunna ke saath', 'Idgham: merge into ي ر م ل و ن; with nasal sound in ي ن م و'),
        L('اقلاب: ب سے پہلے نون کو میم سے بدل کر غنہ کریں', 'Iqlab: ب se pehle noon ko meem se badal kar ghunna karein', 'Iqlab: before ب the noon becomes a meem with nasal sound'),
        L('اخفاء: باقی 15 حروف سے پہلے نون کو چھپا کر غنہ کے ساتھ پڑھیں', 'Ikhfa: baqi 15 huroof se pehle noon ko chhupa kar ghunna ke saath parhein', 'Ikhfa: before the other 15 letters, hide the noon with a nasal sound'),
      ],
    },
    {
      heading: L('میم ساکن کے 3 قاعدے', 'Meem sakin ke 3 qaide', 'Meem sakinah (3 rules)'),
      items: [
        L('اخفائے شفوی: ب سے پہلے غنہ کے ساتھ', 'Ikhfa-e-shafawi: ب se pehle ghunna ke saath', 'Ikhfa shafawi: before ب, with nasal sound'),
        L('ادغامِ شفوی: م سے پہلے ملا کر غنہ', 'Idgham-e-shafawi: م se pehle mila kar ghunna', 'Idgham shafawi: merged into a following م'),
        L('اظہارِ شفوی: باقی حروف سے پہلے صاف، خاص طور پر و اور ف سے پہلے', 'Izhar-e-shafawi: baqi huroof se pehle saaf, khaas taur par و aur ف se pehle', 'Izhar shafawi: clear before all other letters, especially و and ف'),
      ],
    },
    {
      heading: L('قلقلہ اور مد', 'Qalqala aur madd', 'Qalqalah and madd'),
      items: [
        L('قلقلہ کے حروف: ق ط ب ج د (قُطْبُ جَدٍّ)؛ ساکن ہوں تو آواز میں ہلکی جنبش', 'Qalqala ke huroof: ق ط ب ج د (qutbu jad); sakin hon to awaz mein halki jumbish', 'Qalqalah letters ق ط ب ج د: a slight echo when they have sukun'),
        L('مدِ طبعی: الف، واؤ، یاء مدہ کو دو حرکت کھینچیں', 'Madd-e-tabai: alif, waw, ya madda ko do harkat khenchein', 'Natural madd: stretch the long vowels for two counts'),
        L('مدِ متصل اور منفصل: مد کے بعد ہمزہ ہو تو چار سے پانچ حرکت', 'Madd-e-muttasil aur munfasil: madd ke baad hamza ho to chaar se paanch harkat', 'Muttasil and munfasil: before a hamzah, four to five counts'),
        L('غنہ: نون اور میم مشدد پر دو حرکت غنہ', 'Ghunna: noon aur meem mushaddad par do harkat ghunna', 'Ghunnah: two counts of nasal sound on doubled noon and meem'),
      ],
    },
  ],
};

export const TARBIYAT_TOPICS: Topic[] = [WUDU, GHUSL, TAYAMMUM, NAMAZ, NAMAZ_WORDS, RAKAAT, MAKRUH, TAJWEED];
