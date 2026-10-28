// Children's learning and parenting (Halima Children's Academy).
// To be checked by the reviewing ulama before release.
import type { Topic, Tri } from './types';

const L = (ur: string, roman: string, en: string): Tri => ({ ur, roman, en });
const list = (heading: Tri, items: Tri[]) => ({ heading, items });

export const ISLAM_BASICS: Topic = {
  id: 'basics',
  title: L('اسلام کی بنیادی باتیں', 'Islam ki bunyadi baatein', 'Islam basics'),
  lists: [
    list(L('اسلام کے پانچ ارکان', 'Islam ke paanch arkan', 'Five pillars of Islam'), [
      L('کلمہ: اللہ کو ایک اور محمد ﷺ کو اس کا رسول ماننا', 'Kalima: Allah ko ek aur Muhammad ﷺ ko us ka Rasool maanna', 'Shahadah: Allah is One and Muhammad ﷺ is His Messenger'),
      L('نماز: دن میں پانچ وقت', 'Namaz: din mein paanch waqt', 'Salah five times a day'),
      L('روزہ: رمضان کے مہینے میں', 'Roza: Ramazan ke mahine mein', 'Fasting in Ramadan'),
      L('زکوٰۃ: مال کا ڈھائی فیصد غریبوں کو', 'Zakat: maal ka dhai feesad ghareebon ko', 'Zakat: 2.5% of wealth to the needy'),
      L('حج: زندگی میں ایک بار، اگر طاقت ہو', 'Hajj: zindagi mein ek baar, agar taqat ho', 'Hajj once in a lifetime if able'),
    ]),
    list(L('ایمان کی چھ باتیں', 'Iman ki chhe baatein', 'Six articles of faith'), [
      L('اللہ پر', 'Allah par', 'In Allah'),
      L('فرشتوں پر', 'Farishton par', 'In His angels'),
      L('آسمانی کتابوں پر (تورات، زبور، انجیل، قرآن)', 'Aasmani kitabon par (Taurat, Zabur, Injeel, Quran)', 'In His books (Torah, Zabur, Injil, Quran)'),
      L('رسولوں پر', 'Rasoolon par', 'In His messengers'),
      L('قیامت کے دن پر', 'Qayamat ke din par', 'In the Last Day'),
      L('اچھی بری تقدیر اللہ کی طرف سے ہے', 'Achhi buri taqdeer Allah ki taraf se hai', 'In destiny, good and bad, from Allah'),
    ]),
    list(L('چار مشہور فرشتے', 'Chaar mashhoor farishte', 'Four great angels'), [
      L('حضرت جبرائیل علیہ السلام: وحی لاتے تھے', 'Hazrat Jibrail AS: wahi laate the', 'Jibril: brought the revelation'),
      L('حضرت میکائیل علیہ السلام: بارش اور رزق', 'Hazrat Mikail AS: barish aur rizq', 'Mikail: rain and provision'),
      L('حضرت اسرافیل علیہ السلام: قیامت کا صور', 'Hazrat Israfil AS: qayamat ka soor', 'Israfil: will blow the trumpet'),
      L('حضرت عزرائیل علیہ السلام: روح قبض کرتے ہیں', 'Hazrat Izrail AS: rooh qabz karte hain', 'The Angel of Death'),
    ]),
  ],
};

export const PROPHETS: Topic = {
  id: 'prophets',
  title: L('قرآن میں 25 انبیاء کے نام', 'Quran mein 25 anbiya ke naam', 'The 25 prophets named in the Quran'),
  lists: [list(L('ترتیب سے', 'Tarteeb se', 'In order'), [
    L('آدم', 'Adam', 'Adam'), L('ادریس', 'Idrees', 'Idris'), L('نوح', 'Nooh', 'Nuh'), L('ہود', 'Hud', 'Hud'), L('صالح', 'Saleh', 'Salih'),
    L('ابراہیم', 'Ibrahim', 'Ibrahim'), L('لوط', 'Loot', 'Lut'), L('اسماعیل', 'Ismail', 'Ismail'), L('اسحاق', 'Ishaq', 'Ishaq'), L('یعقوب', 'Yaqoob', 'Yaqub'),
    L('یوسف', 'Yusuf', 'Yusuf'), L('ایوب', 'Ayyub', 'Ayyub'), L('شعیب', 'Shoaib', 'Shuaib'), L('موسیٰ', 'Musa', 'Musa'), L('ہارون', 'Haroon', 'Harun'),
    L('ذوالکفل', 'Zul-Kifl', 'Dhul-Kifl'), L('داؤد', 'Dawood', 'Dawud'), L('سلیمان', 'Sulaiman', 'Sulaiman'), L('الیاس', 'Ilyas', 'Ilyas'), L('الیسع', 'Al-Yasa', 'Al-Yasa'),
    L('یونس', 'Younus', 'Yunus'), L('زکریا', 'Zakariya', 'Zakariya'), L('یحییٰ', 'Yahya', 'Yahya'), L('عیسیٰ', 'Isa', 'Isa'), L('محمد ﷺ (آخری نبی)', 'Muhammad ﷺ (aakhri Nabi)', 'Muhammad ﷺ, the last prophet'),
  ])],
};

export const KIDS_ADAB: Topic = {
  id: 'adab',
  title: L('بچوں کے اسلامی آداب', 'Bachon ke Islami adaab', 'Islamic manners for children'),
  lists: [
    list(L('روزانہ کے آداب', 'Rozana ke adaab', 'Daily manners'), [
      L('ملتے وقت السلام علیکم کہیں', 'Milte waqt Assalamu alaikum kahein', 'Say Assalamu alaikum when you meet'),
      L('بسم اللہ پڑھ کر دائیں ہاتھ سے کھائیں پئیں، بیٹھ کر پئیں', 'Bismillah parh kar dayen haath se khayen piyein, baith kar piyein', 'Say Bismillah, eat and drink with the right hand, sit to drink'),
      L('سچ بولیں، وعدہ پورا کریں', 'Sach bolein, wada poora karein', 'Speak the truth, keep promises'),
      L('ماں باپ کی بات مانیں، بڑوں کا ادب اور چھوٹوں پر شفقت', 'Maa baap ki baat maanein, baron ka adab aur chhoton par shafqat', 'Obey parents, respect elders, be kind to younger ones'),
      L('صفائی آدھا ایمان ہے: ہاتھ دھونا، دانت صاف کرنا، استنجا', 'Safai aadha iman hai: haath dhona, daant saaf karna, istinja', 'Cleanliness is half of faith'),
      L('دائیں کروٹ پر سوئیں اور سونے کی دعا پڑھیں', 'Dayen karwat par soyen aur sone ki dua parhein', 'Sleep on the right side and read the sleeping dua'),
      L('کسی کا مذاق نہ اڑائیں، کسی کو تکلیف نہ دیں', 'Kisi ka mazaq na urayen, kisi ko takleef na dein', 'Do not mock or hurt anyone'),
    ]),
  ],
};

export const PARENTING: Topic = {
  id: 'parenting',
  title: L('والدین کے لیے: اولاد کی تربیت', 'Walidain ke liye: aulad ki tarbiyat', 'For parents: raising children'),
  intro: L('پیدائش سے بلوغت تک مسنون طریقے', 'Paidaish se baloghat tak masnoon tareeqe', 'Sunnah practices from birth to adulthood'),
  lists: [
    list(L('پیدائش کے وقت', 'Paidaish ke waqt', 'At birth'), [
      L('دائیں کان میں اذان اور بائیں میں اقامت', 'Dayen kaan mein azan aur baayen mein iqamat', 'Adhan in the right ear, iqamah in the left (Abu Dawud, Tirmidhi)'),
      L('تحنیک: کھجور چبا کر تالو پر لگانا اور برکت کی دعا (بخاری)', 'Tahneek: khajoor chaba kar taalu par lagana aur barkat ki dua (Bukhari)', 'Tahnik: a chewed date on the palate, with a dua for blessing (Bukhari)'),
      L('ساتویں دن: اچھا نام، عقیقہ، سر منڈوانا اور بالوں کے وزن کے برابر چاندی صدقہ', 'Saatwen din: achha naam, aqeeqa, sar mundwana aur baalon ke wazan ke barabar chandi sadqa', 'On the 7th day: a good name, aqiqah, shaving the head and giving its weight in silver'),
      L('لڑکوں کا ختنہ سنت ہے', 'Larkon ka khatna sunnat hai', 'Circumcision for boys is sunnah'),
      L('ماں کا دودھ دو سال تک (البقرہ 233)', 'Maa ka doodh do saal tak (Al-Baqarah 233)', 'Breastfeeding up to two years (2:233)'),
    ]),
    list(L('بچپن میں', 'Bachpan mein', 'In childhood'), [
      L('سب سے پہلے کلمہ اور اللہ کا نام سکھائیں', 'Sab se pehle kalima aur Allah ka naam sikhayen', 'Teach the kalimah and the name of Allah first'),
      L('سات سال کی عمر میں نماز کا حکم دیں، دس سال پر سختی کریں، اور بستر الگ کر دیں (ابو داؤد)', 'Saat saal ki umar mein namaz ka hukm dein, das saal par sakhti karein, aur bistar alag kar dein (Abu Dawud)', 'Tell them to pray at seven, be firm at ten, and separate their beds (Abu Dawud)'),
      L('قاعدہ اور ناظرہ قرآن، پھر حفظ کی ترغیب', 'Qaida aur nazra Quran, phir hifz ki targheeb', 'Qaida and Quran reading, then encourage memorisation'),
      L('سب بچوں سے برابر سلوک کریں (بخاری)', 'Sab bachon se barabar sulook karein (Bukhari)', 'Treat all children equally (Bukhari)'),
      L('محبت اور شفقت: نبی ﷺ بچوں کو چومتے اور گود میں اٹھاتے (بخاری)', 'Mohabbat aur shafqat: Nabi ﷺ bachon ko choomte aur god mein uthate (Bukhari)', 'Love and affection: the Prophet ﷺ kissed and carried children (Bukhari)'),
      L('بیٹیوں کی اچھی پرورش پر جنت کی خوشخبری (مسلم)', 'Betiyon ki achhi parwarish par jannat ki khushkhabri (Muslim)', 'Raising daughters well brings the promise of Paradise (Muslim)'),
      L('خود نمونہ بنیں: بچے دیکھ کر سیکھتے ہیں', 'Khud namoona banein: bachay dekh kar seekhte hain', 'Be the example: children learn by watching'),
    ]),
    list(L('اولاد کے لیے دعائیں', 'Aulad ke liye duain', 'Duas for children'), [
      L('رَبِّ اجْعَلْنِيْ مُقِيْمَ الصَّلَاةِ وَمِنْ ذُرِّيَّتِيْ (ابراہیم 40): اے رب! مجھے اور میری اولاد کو نماز قائم کرنے والا بنا', 'Rabbij-alni muqeemas-salati wa min zurriyyati (Ibrahim 40): Aye Rab! Mujhe aur meri aulad ko namaz qaim karne wala bana', 'Rabbij\'alni muqimas-salati wa min dhurriyyati (14:40): make me and my children establish prayer'),
      L('رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ (الفرقان 74)', 'Rabbana hab lana min azwajina wa zurriyyatina qurrata a\'yun (Al-Furqan 74)', 'Rabbana hab lana min azwajina wa dhurriyyatina qurrata a\'yun (25:74)'),
      L('وَأَصْلِحْ لِيْ فِيْ ذُرِّيَّتِيْ (الاحقاف 15): میری اولاد کو نیک بنا', 'Wa aslih li fi zurriyyati (Al-Ahqaf 15): meri aulad ko nek bana', 'Wa aslih li fi dhurriyyati (46:15): make my children righteous'),
    ]),
  ],
};

export const KIDS_TOPICS: Topic[] = [ISLAM_BASICS, PROPHETS, KIDS_ADAB, PARENTING];
