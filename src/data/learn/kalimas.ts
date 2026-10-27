// The six kalimas and Iman-e-Mujmal / Iman-e-Mufassal, in the wording used in
// Pakistani and Indian madaris. To be checked by the reviewing ulama before release.
import type { Recitation } from './types';

export const KALIMAS: Recitation[] = [
  {
    id: 'kalima1',
    title: { ur: 'پہلا کلمہ: طیب', roman: 'Pehla Kalima: Tayyab', en: 'First Kalima: Tayyib (Purity)' },
    arabic: 'لَا إِلٰهَ إِلَّا اللّٰهُ مُحَمَّدٌ رَّسُوْلُ اللّٰهِ',
    meaning: {
      ur: 'اللہ کے سوا کوئی معبود نہیں، محمد ﷺ اللہ کے رسول ہیں۔',
      roman: 'Allah ke siwa koi mabood nahi, Muhammad ﷺ Allah ke Rasool hain.',
      en: 'There is no god but Allah; Muhammad ﷺ is the Messenger of Allah.',
    },
  },
  {
    id: 'kalima2',
    title: { ur: 'دوسرا کلمہ: شہادت', roman: 'Doosra Kalima: Shahadat', en: 'Second Kalima: Shahadah (Testimony)' },
    arabic: 'أَشْهَدُ أَنْ لَّا إِلٰهَ إِلَّا اللّٰهُ وَحْدَهُ لَا شَرِيْكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُوْلُهُ',
    meaning: {
      ur: 'میں گواہی دیتا ہوں کہ اللہ کے سوا کوئی معبود نہیں، وہ اکیلا ہے، اس کا کوئی شریک نہیں، اور میں گواہی دیتا ہوں کہ محمد ﷺ اس کے بندے اور رسول ہیں۔',
      roman: 'Main gawahi deta hoon ke Allah ke siwa koi mabood nahi, woh akela hai, us ka koi shareek nahi, aur main gawahi deta hoon ke Muhammad ﷺ us ke bande aur Rasool hain.',
      en: 'I bear witness that there is no god but Allah, alone, without partner, and I bear witness that Muhammad ﷺ is His servant and Messenger.',
    },
  },
  {
    id: 'kalima3',
    title: { ur: 'تیسرا کلمہ: تمجید', roman: 'Teesra Kalima: Tamjeed', en: 'Third Kalima: Tamjid (Glorification)' },
    arabic: 'سُبْحَانَ اللّٰهِ وَالْحَمْدُ لِلّٰهِ وَلَا إِلٰهَ إِلَّا اللّٰهُ وَاللّٰهُ أَكْبَرُ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللّٰهِ الْعَلِيِّ الْعَظِيْمِ',
    meaning: {
      ur: 'اللہ پاک ہے، اور سب تعریفیں اللہ کے لیے ہیں، اور اللہ کے سوا کوئی معبود نہیں، اور اللہ سب سے بڑا ہے، اور گناہوں سے بچنے کی طاقت اور نیکی کرنے کی قوت نہیں مگر اللہ کی طرف سے جو بلند اور عظمت والا ہے۔',
      roman: 'Allah paak hai, aur sab tareefein Allah ke liye hain, aur Allah ke siwa koi mabood nahi, aur Allah sab se bara hai, aur gunahon se bachne ki taqat aur neki karne ki quwwat nahi magar Allah ki taraf se jo buland aur azmat wala hai.',
      en: 'Glory be to Allah, all praise is for Allah, there is no god but Allah, and Allah is the Greatest. There is no power and no strength except with Allah, the Most High, the Most Great.',
    },
  },
  {
    id: 'kalima4',
    title: { ur: 'چوتھا کلمہ: توحید', roman: 'Chautha Kalima: Tauheed', en: 'Fourth Kalima: Tawhid (Oneness)' },
    arabic: 'لَا إِلٰهَ إِلَّا اللّٰهُ وَحْدَهُ لَا شَرِيْكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ يُحْيِيْ وَيُمِيْتُ وَهُوَ حَيٌّ لَّا يَمُوْتُ أَبَدًا أَبَدًا ذُو الْجَلَالِ وَالْإِكْرَامِ بِيَدِهِ الْخَيْرُ وَهُوَ عَلٰى كُلِّ شَيْءٍ قَدِيْرٌ',
    meaning: {
      ur: 'اللہ کے سوا کوئی معبود نہیں، وہ اکیلا ہے، اس کا کوئی شریک نہیں، اسی کی بادشاہی ہے اور اسی کے لیے سب تعریف ہے، وہی زندہ کرتا اور مارتا ہے، اور وہ زندہ ہے، کبھی نہیں مرے گا، جلال اور بزرگی والا ہے، اسی کے ہاتھ میں بھلائی ہے، اور وہ ہر چیز پر قادر ہے۔',
      roman: 'Allah ke siwa koi mabood nahi, woh akela hai, us ka koi shareek nahi, usi ki badshahi hai aur usi ke liye sab tareef hai, wahi zinda karta aur maarta hai, aur woh zinda hai, kabhi nahi marega, jalal aur buzurgi wala hai, usi ke haath mein bhalai hai, aur woh har cheez par qadir hai.',
      en: 'There is no god but Allah, alone, without partner. His is the dominion and His is the praise. He gives life and causes death, and He is Ever-Living and will never die. Owner of majesty and honour; in His hand is all good, and He has power over everything.',
    },
  },
  {
    id: 'kalima5',
    title: { ur: 'پانچواں کلمہ: استغفار', roman: 'Panchwan Kalima: Istighfar', en: 'Fifth Kalima: Istighfar (Seeking forgiveness)' },
    arabic: 'أَسْتَغْفِرُ اللّٰهَ رَبِّيْ مِنْ كُلِّ ذَنْبٍ أَذْنَبْتُهُ عَمَدًا أَوْ خَطَأً سِرًّا أَوْ عَلَانِيَةً وَأَتُوْبُ إِلَيْهِ مِنَ الذَّنْبِ الَّذِيْ أَعْلَمُ وَمِنَ الذَّنْبِ الَّذِيْ لَا أَعْلَمُ إِنَّكَ أَنْتَ عَلَّامُ الْغُيُوْبِ وَسَتَّارُ الْعُيُوْبِ وَغَفَّارُ الذُّنُوْبِ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللّٰهِ الْعَلِيِّ الْعَظِيْمِ',
    meaning: {
      ur: 'میں اللہ سے معافی مانگتا ہوں جو میرا رب ہے، ہر گناہ سے جو میں نے جان بوجھ کر یا بھول کر، چھپ کر یا کھلم کھلا کیا، اور میں اس کی طرف توبہ کرتا ہوں اس گناہ سے جو میں جانتا ہوں اور اس گناہ سے جو میں نہیں جانتا۔ بیشک تو غیبوں کا جاننے والا، عیبوں کا چھپانے والا اور گناہوں کا بخشنے والا ہے، اور گناہوں سے بچنے کی طاقت اور نیکی کرنے کی قوت نہیں مگر اللہ کی طرف سے جو بلند اور عظمت والا ہے۔',
      roman: 'Main Allah se maafi maangta hoon jo mera Rab hai, har gunah se jo main ne jaan boojh kar ya bhool kar, chhup kar ya khullam khulla kiya, aur main us ki taraf tauba karta hoon us gunah se jo main jaanta hoon aur us gunah se jo main nahi jaanta. Beshak tu ghaibon ka jaanne wala, aibon ka chhupane wala aur gunahon ka bakhshne wala hai, aur gunahon se bachne ki taqat aur neki karne ki quwwat nahi magar Allah ki taraf se jo buland aur azmat wala hai.',
      en: 'I seek forgiveness from Allah, my Lord, for every sin I committed knowingly or unknowingly, secretly or openly, and I turn to Him in repentance from the sin I know and the sin I do not know. You are the Knower of the unseen, the Concealer of faults and the Forgiver of sins. There is no power and no strength except with Allah, the Most High, the Most Great.',
    },
  },
  {
    id: 'kalima6',
    title: { ur: 'چھٹا کلمہ: ردِ کفر', roman: 'Chhata Kalima: Radd-e-Kufr', en: 'Sixth Kalima: Radd-e-Kufr (Rejecting disbelief)' },
    arabic: 'اَللّٰهُمَّ إِنِّيْ أَعُوْذُ بِكَ مِنْ أَنْ أُشْرِكَ بِكَ شَيْئًا وَّأَنَا أَعْلَمُ بِهٖ وَأَسْتَغْفِرُكَ لِمَا لَا أَعْلَمُ بِهٖ تُبْتُ عَنْهُ وَتَبَرَّأْتُ مِنَ الْكُفْرِ وَالشِّرْكِ وَالْكِذْبِ وَالْغِيْبَةِ وَالْبِدْعَةِ وَالنَّمِيْمَةِ وَالْفَوَاحِشِ وَالْبُهْتَانِ وَالْمَعَاصِيْ كُلِّهَا وَأَسْلَمْتُ وَأَقُوْلُ لَا إِلٰهَ إِلَّا اللّٰهُ مُحَمَّدٌ رَّسُوْلُ اللّٰهِ',
    meaning: {
      ur: 'اے اللہ! میں تیری پناہ مانگتا ہوں اس بات سے کہ میں جان بوجھ کر کسی چیز کو تیرا شریک بناؤں، اور تجھ سے معافی مانگتا ہوں اس سے جو میں نہیں جانتا۔ میں نے اس سے توبہ کی، اور میں کفر، شرک، جھوٹ، غیبت، بدعت، چغلی، بے حیائی، بہتان اور ہر گناہ سے بیزار ہوا، اور میں اسلام لایا اور کہتا ہوں: اللہ کے سوا کوئی معبود نہیں، محمد ﷺ اللہ کے رسول ہیں۔',
      roman: 'Aye Allah! Main teri panah maangta hoon is baat se ke main jaan boojh kar kisi cheez ko tera shareek banaun, aur tujh se maafi maangta hoon us se jo main nahi jaanta. Main ne us se tauba ki, aur main kufr, shirk, jhoot, gheebat, bidat, chughli, be-hayai, buhtan aur har gunah se bezaar hua, aur main Islam laya aur kehta hoon: Allah ke siwa koi mabood nahi, Muhammad ﷺ Allah ke Rasool hain.',
      en: 'O Allah, I seek Your protection from knowingly associating anything with You, and I ask Your forgiveness for what I do not know. I repent of it and declare myself free of disbelief, shirk, lying, backbiting, innovation, tale-bearing, indecency, slander and all sins. I submit, and I say: there is no god but Allah; Muhammad ﷺ is the Messenger of Allah.',
    },
  },
];

export const IMAN: Recitation[] = [
  {
    id: 'imanMujmal',
    title: { ur: 'ایمانِ مجمل', roman: 'Iman-e-Mujmal', en: 'Iman-e-Mujmal (Faith in brief)' },
    arabic: 'آمَنْتُ بِاللّٰهِ كَمَا هُوَ بِأَسْمَائِهٖ وَصِفَاتِهٖ وَقَبِلْتُ جَمِيْعَ أَحْكَامِهٖ',
    meaning: {
      ur: 'میں ایمان لایا اللہ پر جیسا کہ وہ اپنے ناموں اور صفتوں کے ساتھ ہے، اور میں نے اس کے تمام احکام قبول کیے۔',
      roman: 'Main iman laya Allah par jaisa ke woh apne naamon aur sifaton ke saath hai, aur main ne us ke tamam ahkam qubool kiye.',
      en: 'I believe in Allah as He is, with His names and attributes, and I accept all His commands.',
    },
  },
  {
    id: 'imanMufassal',
    title: { ur: 'ایمانِ مفصل', roman: 'Iman-e-Mufassal', en: 'Iman-e-Mufassal (Faith in detail)' },
    arabic: 'آمَنْتُ بِاللّٰهِ وَمَلَائِكَتِهٖ وَكُتُبِهٖ وَرُسُلِهٖ وَالْيَوْمِ الْآخِرِ وَالْقَدْرِ خَيْرِهٖ وَشَرِّهٖ مِنَ اللّٰهِ تَعَالٰى وَالْبَعْثِ بَعْدَ الْمَوْتِ',
    meaning: {
      ur: 'میں ایمان لایا اللہ پر، اور اس کے فرشتوں پر، اور اس کی کتابوں پر، اور اس کے رسولوں پر، اور قیامت کے دن پر، اور اس پر کہ اچھی اور بری تقدیر اللہ کی طرف سے ہے، اور موت کے بعد اٹھائے جانے پر۔',
      roman: 'Main iman laya Allah par, aur us ke farishton par, aur us ki kitabon par, aur us ke rasoolon par, aur qayamat ke din par, aur is par ke achhi aur buri taqdeer Allah ki taraf se hai, aur maut ke baad uthaye jaane par.',
      en: 'I believe in Allah, His angels, His books, His messengers, the Last Day, and that destiny, its good and bad, is from Allah the Exalted, and in being raised after death.',
    },
  },
];
