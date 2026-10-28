// More Hanafi masail for adults (Halima Institute) and a separate women's
// section. Written from the common Urdu primers (Taleem-ul-Islam, Bahishti
// Zewar, Bahar-e-Shariat summaries). To be checked by the reviewing ulama.
import type { Recitation, Topic, Tri } from './types';

const L = (ur: string, roman: string, en: string): Tri => ({ ur, roman, en });
const list = (heading: Tri, items: Tri[]) => ({ heading, items });

export const NAMAZ_TAREEQA: Topic = {
  id: 'namazTareeqa',
  title: L('نماز کا مکمل طریقہ', 'Namaz ka mukammal tareeqa', 'How to pray, step by step'),
  intro: L('حنفی طریقہ (مرد)؛ خواتین کے فرق "خواتین" کے حصے میں ہیں', 'Hanafi tareeqa (mard); khawateen ke farq "Khawateen" ke hisse mein hain', 'Hanafi method (men); differences for women are in the Women section'),
  lists: [list(L('ترتیب', 'Tarteeb', 'Steps'), [
    L('باوضو ہو کر قبلہ رخ کھڑے ہوں اور دل میں نیت کریں', 'Ba-wuzu ho kar qibla rukh khare hon aur dil mein niyyat karein', 'With wudu, face the Qibla and make the intention in your heart'),
    L('دونوں ہاتھ کانوں تک اٹھا کر "اللہ اکبر" کہیں اور ناف کے نیچے ہاتھ باندھیں، دایاں ہاتھ بائیں پر', 'Dono haath kaanon tak utha kar "Allahu Akbar" kahein aur naaf ke neeche haath bandhein, dayan haath baayen par', 'Raise both hands to the ears, say Allahu Akbar, and fold the right hand over the left below the navel'),
    L('ثناء، تعوذ، تسمیہ، پھر سورۃ الفاتحہ اور آہستہ آمین، پھر کوئی سورت', 'Sana, taawwuz, tasmiya, phir Surah Fatiha aur aahista Ameen, phir koi surat', 'Thana, ta\'awwudh, bismillah, Al-Fatiha, a quiet Ameen, then a surah'),
    L('"اللہ اکبر" کہہ کر رکوع: کمر سیدھی، گھٹنے ہاتھوں سے پکڑیں، تین بار سبحان ربی العظیم', '"Allahu Akbar" keh kar ruku: kamar seedhi, ghutne haathon se pakrein, teen baar Subhana Rabbiyal Azeem', 'Ruku with a straight back, hands on the knees: Subhana Rabbiyal-Azim three times'),
    L('"سمع اللہ لمن حمدہ" کہتے ہوئے سیدھے کھڑے ہوں، پھر "ربنا لک الحمد"', '"Sami Allahu liman hamidah" kehte hue seedhe khare hon, phir "Rabbana lakal hamd"', 'Rise saying Sami\'Allahu liman hamidah, then Rabbana lakal-hamd'),
    L('"اللہ اکبر" کہہ کر سجدہ: پہلے گھٹنے، پھر ہاتھ، پھر ناک اور پیشانی؛ تین بار سبحان ربی الاعلیٰ', '"Allahu Akbar" keh kar sajda: pehle ghutne, phir haath, phir naak aur peshani; teen baar Subhana Rabbiyal Aala', 'Sajdah: knees, then hands, then nose and forehead; Subhana Rabbiyal-A\'la three times'),
    L('اطمینان سے بیٹھیں (جلسہ)، پھر دوسرا سجدہ اسی طرح', 'Itminan se baithein (jalsa), phir doosra sajda isi tarah', 'Sit calmly, then the second sajdah the same way'),
    L('دوسری رکعت میں ثناء اور تعوذ نہیں؛ بسم اللہ، فاتحہ اور سورت', 'Doosri rakat mein sana aur taawwuz nahi; Bismillah, Fatiha aur surat', 'In the second rakat no thana; bismillah, Al-Fatiha and a surah'),
    L('دوسری رکعت کے بعد قعدہ: التحیات؛ "اشہد ان لا الٰہ" پر شہادت کی انگلی اٹھائیں', 'Doosri rakat ke baad qada: Attahiyyat; "Ashhadu an la ilaha" par shahadat ki ungli uthayen', 'Sit after the second rakat for the tashahhud; raise the index finger at "ashhadu an la ilaha"'),
    L('آخری قعدے میں التحیات، درودِ ابراہیمی اور دعا، پھر دائیں اور بائیں سلام', 'Aakhri qade mein Attahiyyat, Durood-e-Ibrahimi aur dua, phir daayen aur baayen salam', 'In the last sitting: tashahhud, Durood Ibrahimi and a dua, then salam right and left'),
    L('فرض کی تیسری اور چوتھی رکعت میں صرف سورۃ الفاتحہ', 'Farz ki teesri aur chauthi rakat mein sirf Surah Fatiha', 'In the third and fourth rakats of fard, only Al-Fatiha'),
  ])],
};

export const WITR_EID_JANAZA: Topic = {
  id: 'witrEidJanaza',
  title: L('وتر، عید اور جنازہ کا طریقہ', 'Witr, Eid aur Janaza ka tareeqa', 'Witr, Eid and Janazah'),
  lists: [
    list(L('وتر (3 رکعت، واجب)', 'Witr (3 rakat, wajib)', 'Witr (3 rakats, wajib)'), [
      L('دو رکعت کے بعد قعدہ اور التحیات، پھر تیسری کے لیے کھڑے ہوں', 'Do rakat ke baad qada aur Attahiyyat, phir teesri ke liye khare hon', 'Sit after two rakats for tashahhud, then stand for the third'),
      L('تیسری رکعت میں فاتحہ اور سورت کے بعد "اللہ اکبر" کہہ کر ہاتھ کانوں تک اٹھائیں، پھر باندھ کر دعائے قنوت پڑھیں', 'Teesri rakat mein Fatiha aur surat ke baad "Allahu Akbar" keh kar haath kaanon tak uthayen, phir bandh kar Dua-e-Qunoot parhein', 'In the third rakat, after the surah say Allahu Akbar raising the hands, fold them and recite Dua al-Qunut'),
      L('قنوت یاد نہ ہو تو "ربنا آتنا فی الدنیا حسنۃ…" پڑھ لیں', 'Qunoot yaad na ho to "Rabbana aatina fid-dunya hasanah…" parh lein', 'If you do not know Qunut, read "Rabbana atina fid-dunya hasanah..."'),
    ]),
    list(L('عید کی نماز (2 رکعت، 6 زائد تکبیریں)', 'Eid ki namaz (2 rakat, 6 zaid takbeerein)', 'Eid prayer (2 rakats, 6 extra takbirs)'), [
      L('نیت اور تکبیرِ تحریمہ کے بعد ثناء، پھر تین زائد تکبیریں: پہلی دو میں ہاتھ اٹھا کر چھوڑ دیں، تیسری کے بعد باندھ لیں', 'Niyyat aur takbeer-e-tahreema ke baad sana, phir teen zaid takbeerein: pehli do mein haath utha kar chhor dein, teesri ke baad bandh lein', 'After the opening takbir and thana, three extra takbirs: drop the hands after the first two, fold after the third'),
      L('امام قراءت کرے، رکوع سجدہ', 'Imam qirat kare, ruku sajda', 'The imam recites; ruku and sajdah'),
      L('دوسری رکعت میں قراءت کے بعد تین زائد تکبیریں، ہر بار ہاتھ چھوڑ دیں، چوتھی تکبیر پر رکوع', 'Doosri rakat mein qirat ke baad teen zaid takbeerein, har baar haath chhor dein, chauthi takbeer par ruku', 'In the second rakat, after the recitation three extra takbirs with hands dropped, the fourth takes you to ruku'),
      L('نماز کے بعد خطبہ سننا سنت ہے', 'Namaz ke baad khutba sunna sunnat hai', 'Listening to the khutbah after the prayer is sunnah'),
    ]),
    list(L('نمازِ جنازہ (فرضِ کفایہ، 4 تکبیریں)', 'Namaz-e-Janaza (farz-e-kifaya, 4 takbeerein)', 'Janazah prayer (4 takbirs)'), [
      L('پہلی تکبیر کے بعد ثناء', 'Pehli takbeer ke baad sana', 'After the first takbir: thana'),
      L('دوسری تکبیر کے بعد درودِ ابراہیمی', 'Doosri takbeer ke baad Durood-e-Ibrahimi', 'After the second: Durood Ibrahimi'),
      L('تیسری تکبیر کے بعد میت کے لیے دعا (بالغ، نابالغ لڑکا یا لڑکی کی الگ دعا، دعاؤں کی لائبریری میں)', 'Teesri takbeer ke baad mayyit ke liye dua (baaligh, nabaligh larka ya larki ki alag dua, duaon ki library mein)', 'After the third: the dua for the deceased (adult, boy or girl; see the dua library)'),
      L('چوتھی تکبیر کے بعد دونوں طرف سلام؛ رکوع سجدہ نہیں، صرف پہلی تکبیر میں ہاتھ اٹھائیں', 'Chauthi takbeer ke baad dono taraf salam; ruku sajda nahi, sirf pehli takbeer mein haath uthayen', 'After the fourth: salam on both sides; no ruku or sajdah, hands raised only at the first takbir'),
    ]),
  ],
};

export const SAFAR_QAZA: Topic = {
  id: 'safarQaza',
  title: L('سفر، قضا، جمعہ اور سجدۂ تلاوت', 'Safar, qaza, Juma aur sajda-e-tilawat', 'Travel, missed prayers, Jumu\'ah, sajdah of recitation'),
  lists: [
    list(L('مسافر کی نماز (قصر)', 'Musafir ki namaz (qasr)', 'The traveller\'s prayer (qasr)'), [
      L('تقریباً 77 کلومیٹر (48 میل) یا زیادہ کے سفر کی نیت سے شہر سے نکلیں تو مسافر ہیں', 'Taqreeban 77 km (48 meel) ya zyada ke safar ki niyyat se shehar se niklein to musafir hain', 'Leaving town intending about 77 km (48 miles) or more makes you a traveller'),
      L('چار رکعت والے فرض (ظہر، عصر، عشاء) دو پڑھیں؛ فجر، مغرب اور وتر پورے', 'Chaar rakat wale farz (Zuhr, Asr, Isha) do parhein; Fajr, Maghrib aur witr poore', 'Pray two instead of four in Dhuhr, Asr and Isha; Fajr, Maghrib and witr stay whole'),
      L('کہیں 15 دن یا زیادہ ٹھہرنے کی نیت ہو تو پوری نماز', 'Kahin 15 din ya zyada thehrne ki niyyat ho to poori namaz', 'Intending to stay 15 days or more: pray in full'),
      L('مقیم امام کے پیچھے پوری پڑھیں', 'Muqeem imam ke peeche poori parhein', 'Behind a resident imam, pray in full'),
    ]),
    list(L('قضا نماز', 'Qaza namaz', 'Making up missed prayers'), [
      L('چھوٹی ہوئی فرض نمازیں اور وتر کی قضا لازم ہے، سنتوں کی نہیں (فجر کی سنتیں اسی دن زوال سے پہلے)', 'Chhooti hui farz namazein aur witr ki qaza lazim hai, sunnaton ki nahi (Fajr ki sunnatein usi din zawal se pehle)', 'Missed fard prayers and witr must be made up, not the sunnahs (Fajr sunnah only before midday the same day)'),
      L('مکروہ اوقات کے سوا کسی بھی وقت پڑھ سکتے ہیں', 'Makruh auqat ke siwa kisi bhi waqt parh sakte hain', 'At any time except the forbidden times'),
      L('بہت سی قضا ہوں تو اندازہ لگا کر روزانہ کچھ ادا کرتے رہیں', 'Bohat si qaza hon to andaza laga kar rozana kuch ada karte rahein', 'If many are owed, estimate and pray some every day'),
    ]),
    list(L('جمعہ', 'Juma', 'Jumu\'ah'), [
      L('جمعہ کی دو رکعت فرض ہیں اور خطبہ شرط؛ ظہر کی جگہ', 'Juma ki do rakat farz hain aur khutba shart; Zuhr ki jagah', 'Two fard rakats with the khutbah, in place of Dhuhr'),
      L('پہلے 4 سنت، بعد میں 4 سنت اور 2 سنت', 'Pehle 4 sunnat, baad mein 4 sunnat aur 2 sunnat', '4 sunnah before, 4 and 2 sunnah after'),
      L('سنتیں: غسل، صاف کپڑے، خوشبو، جلدی جانا، سورۃ الکہف، کثرت سے درود', 'Sunnatein: ghusl, saaf kapre, khushboo, jaldi jana, Surah Kahf, kasrat se durood', 'Sunnahs: ghusl, clean clothes, perfume, going early, Surah Al-Kahf, much durood'),
    ]),
    list(L('سجدۂ تلاوت', 'Sajda-e-tilawat', 'Sajdah of recitation'), [
      L('قرآن میں 14 آیاتِ سجدہ ہیں؛ پڑھنے یا سننے والے پر ایک سجدہ واجب', 'Quran mein 14 ayaat-e-sajda hain; parhne ya sunne wale par ek sajda wajib', 'There are 14 ayahs of sajdah; one sajdah is wajib on the reader and listener'),
      L('طریقہ: "اللہ اکبر" کہہ کر سجدہ، تین بار سبحان ربی الاعلیٰ، "اللہ اکبر" کہہ کر اٹھیں؛ ہاتھ اٹھانا، التحیات اور سلام نہیں', 'Tareeqa: "Allahu Akbar" keh kar sajda, teen baar Subhana Rabbiyal Aala, "Allahu Akbar" keh kar uthein; haath uthana, Attahiyyat aur salam nahi', 'Say Allahu Akbar, one sajdah with tasbih three times, rise with Allahu Akbar; no raising hands, tashahhud or salam'),
    ]),
  ],
};

export const ROZA: Topic = {
  id: 'roza',
  title: L('روزے کے مسائل', 'Roze ke masail', 'Fasting'),
  lists: [
    list(L('روزہ توڑنے والی چیزیں (قضا لازم)', 'Roza torne wali cheezein (qaza lazim)', 'What breaks the fast (make up later)'), [
      L('جان بوجھ کر کھانا پینا یا دوا کھانا', 'Jaan boojh kar khana peena ya dawa khana', 'Deliberately eating, drinking or taking medicine by mouth'),
      L('جان بوجھ کر منہ بھر کر قے کرنا', 'Jaan boojh kar munh bhar kar qay karna', 'Deliberately vomiting a mouthful'),
      L('ناک یا کان میں دوا ڈالنا، حقنہ', 'Naak ya kaan mein dawa daalna, huqna', 'Medicine in the nose or ear, or an enema'),
      L('رمضان کا روزہ جان بوجھ کر کھانے پینے یا جماع سے توڑنے پر قضا کے ساتھ کفارہ (60 روزے لگاتار) بھی', 'Ramazan ka roza jaan boojh kar khane peene ya jima se torne par qaza ke saath kaffara (60 roze lagatar) bhi', 'Deliberately breaking a Ramadan fast by eating, drinking or intercourse also requires kaffarah (60 days in a row)'),
    ]),
    list(L('جن سے روزہ نہیں ٹوٹتا', 'Jin se roza nahi toot-ta', 'What does not break the fast'), [
      L('بھول کر کھا پی لینا', 'Bhool kar kha pi lena', 'Eating or drinking by mistake'),
      L('خود بخود قے آنا، مسواک، سرمہ، خوشبو سونگھنا، انجکشن (رگ میں غذا کے بغیر)', 'Khud ba khud qay aana, miswak, surma, khushboo soonghna, injection (rag mein ghiza ke baghair)', 'Involuntary vomiting, miswak, kohl, smelling perfume, an injection that is not nourishment'),
      L('احتلام، خون ٹیسٹ', 'Ehtilam, khoon test', 'A wet dream, a blood test'),
    ]),
    list(L('سحری، افطار اور فدیہ', 'Sehri, iftar aur fidya', 'Sehri, iftar and fidyah'), [
      L('سحری سنت ہے اور برکت والی؛ فجر کا وقت شروع ہونے سے پہلے ختم کریں', 'Sehri sunnat hai aur barkat wali; Fajr ka waqt shuru hone se pehle khatam karein', 'Sehri is a blessed sunnah; stop before Fajr begins'),
      L('غروب ہوتے ہی کھجور یا پانی سے جلدی افطار سنت', 'Ghuroob hote hi khajoor ya pani se jaldi iftar sunnat', 'Break the fast promptly at sunset with dates or water'),
      L('بہت بوڑھا یا دائمی مریض جو کبھی روزہ نہ رکھ سکے، ہر روزے کے بدلے فدیہ (صدقۂ فطر کے برابر) دے', 'Bohat boorha ya daimi mareez jo kabhi roza na rakh sake, har roze ke badle fidya (sadqa-e-fitr ke barabar) de', 'The very old or permanently ill who can never fast give fidyah (like sadaqat al-fitr) for each day'),
      L('صدقۂ فطر عید کی نماز سے پہلے ادا کریں: ہر فرد کی طرف سے آدھا صاع (تقریباً 2 کلو) گندم یا اس کی قیمت', 'Sadqa-e-fitr Eid ki namaz se pehle ada karein: har fard ki taraf se aadha saa (taqreeban 2 kg) gandum ya us ki qeemat', 'Pay sadaqat al-fitr before the Eid prayer: half a sa\' (about 2 kg) of wheat or its value for each person'),
    ]),
  ],
};

export const QURBANI_NIKAH: Topic = {
  id: 'qurbaniNikah',
  title: L('قربانی، عقیقہ اور نکاح', 'Qurbani, aqeeqa aur nikah', 'Qurbani, aqiqah and nikah'),
  lists: [
    list(L('قربانی', 'Qurbani', 'Qurbani'), [
      L('ہر عاقل بالغ مقیم مسلمان پر واجب جو عید کے دنوں میں نصاب کا مالک ہو', 'Har aaqil baaligh muqeem Musalman par wajib jo Eid ke dinon mein nisab ka malik ho', 'Wajib on every sane adult resident Muslim who owns the nisab during the Eid days'),
      L('وقت: 10 ذوالحجہ کی عید نماز کے بعد سے 12 ذوالحجہ کے غروب تک', 'Waqt: 10 Zul-Hijjah ki Eid namaz ke baad se 12 Zul-Hijjah ke ghuroob tak', 'Time: from after the Eid prayer on the 10th until sunset on the 12th'),
      L('بکری یا دنبہ ایک سال، گائے دو سال، اونٹ پانچ سال؛ گائے اور اونٹ میں سات حصے', 'Bakri ya dumba ek saal, gaye do saal, oont paanch saal; gaye aur oont mein saat hisse', 'Goat or sheep one year, cow two years, camel five years; cow and camel have seven shares'),
      L('گوشت کے تین حصے: اپنا، رشتہ دار، غریب (مستحب)', 'Gosht ke teen hisse: apna, rishtedar, ghareeb (mustahab)', 'Divide the meat in three: family, relatives, the poor (recommended)'),
    ]),
    list(L('عقیقہ', 'Aqeeqa', 'Aqiqah'), [
      L('ساتویں دن مستحب: لڑکے کی طرف سے دو، لڑکی کی طرف سے ایک بکری', 'Saatwen din mustahab: larke ki taraf se do, larki ki taraf se ek bakri', 'Recommended on the 7th day: two goats for a boy, one for a girl'),
      L('سر کے بال منڈوا کر ان کے وزن کے برابر چاندی صدقہ کریں اور اچھا نام رکھیں', 'Sar ke baal mundwa kar un ke wazan ke barabar chandi sadqa karein aur achha naam rakhein', 'Shave the head, give its weight in silver as charity and give a good name'),
    ]),
    list(L('نکاح', 'Nikah', 'Nikah'), [
      L('ارکان: ایجاب و قبول، دو مسلمان گواہ (دو مرد یا ایک مرد دو عورتیں)', 'Arkan: ijab o qubool, do Musalman gawah (do mard ya ek mard do auratein)', 'Pillars: offer and acceptance, two Muslim witnesses (two men or one man and two women)'),
      L('مہر بیوی کا حق ہے؛ حنفی کم از کم دس درہم (تقریباً 30.6 گرام چاندی)', 'Mehr biwi ka haq hai; Hanafi kam az kam das dirham (taqreeban 30.6 gram chandi)', 'Mahr is the wife\'s right; Hanafi minimum ten dirhams (about 30.6 g silver)'),
      L('خطبۂ نکاح اور ولیمہ سنت', 'Khutba-e-nikah aur walima sunnat', 'The nikah sermon and the walimah are sunnah'),
    ]),
  ],
};

export const HUQOOQ: Topic = {
  id: 'huqooq',
  title: L('حقوق اور اخلاق', 'Huqooq aur akhlaq', 'Rights and good character'),
  lists: [
    list(L('والدین', 'Walidain', 'Parents'), [
      L('ان کے سامنے "اف" تک نہ کہیں، نرمی سے بات کریں (بنی اسرائیل 23)', 'Un ke saamne "uff" tak na kahein, narmi se baat karein (Bani Israil 23)', 'Do not even say "uff" to them; speak gently (17:23)'),
      L('ان کی وفات کے بعد دعا، صدقہ اور ان کے رشتہ داروں سے حسنِ سلوک', 'Un ki wafat ke baad dua, sadqa aur un ke rishtedaron se husn-e-sulook', 'After they pass away: dua, charity and kindness to their relatives'),
    ]),
    list(L('پڑوسی، رشتہ دار اور عام مسلمان', 'Parosi, rishtedar aur aam Musalman', 'Neighbours, relatives and all Muslims'), [
      L('پڑوسی کو تکلیف نہ دیں؛ جو پڑوسی کو ستائے وہ کامل مومن نہیں (بخاری)', 'Parosi ko takleef na dein; jo parosi ko sataye woh kaamil momin nahi (Bukhari)', 'Do not harm your neighbour (Bukhari)'),
      L('صلہ رحمی: رشتہ توڑنے والا جنت میں نہیں جائے گا (مسلم)', 'Sila rehmi: rishta torne wala jannat mein nahi jayega (Muslim)', 'Keeping family ties (Muslim)'),
      L('سلام، بیمار پرسی، جنازے میں شرکت، چھینک کا جواب، دعوت قبول کرنا (بخاری، مسلم)', 'Salam, beemar pursi, janaze mein shirkat, chheenk ka jawab, dawat qubool karna (Bukhari, Muslim)', 'Greeting, visiting the sick, attending funerals, replying to sneezes, accepting invitations'),
    ]),
    list(L('زبان کی حفاظت', 'Zaban ki hifazat', 'Guarding the tongue'), [
      L('غیبت، چغلی، جھوٹ، گالی اور مذاق اڑانے سے بچیں (الحجرات 11-12)', 'Gheebat, chughli, jhoot, gaali aur mazaq urane se bachein (Al-Hujurat 11-12)', 'Avoid backbiting, tale-bearing, lies, abuse and mockery (49:11-12)'),
      L('جو اللہ اور آخرت پر ایمان رکھے وہ اچھی بات کہے یا خاموش رہے (بخاری)', 'Jo Allah aur aakhirat par iman rakhe woh achhi baat kahe ya khamosh rahe (Bukhari)', 'Speak good or stay silent (Bukhari)'),
    ]),
  ],
};

export const ADULT_TOPICS: Topic[] = [NAMAZ_TAREEQA, WITR_EID_JANAZA, SAFAR_QAZA, ROZA, QURBANI_NIKAH, HUQOOQ];

// ---------------- Women's section ----------------

export const WOMEN_SALAH: Topic = {
  id: 'womenSalah',
  title: L('خواتین کی نماز (حنفی)', 'Khawateen ki namaz (Hanafi)', 'Women\'s prayer (Hanafi)'),
  intro: L('باقی طریقہ مردوں کی طرح ہے؛ یہ فرق ہیں', 'Baqi tareeqa mardon ki tarah hai; yeh farq hain', 'The rest is like the men\'s prayer; these are the differences'),
  lists: [list(L('فرق', 'Farq', 'Differences'), [
    L('تکبیرِ تحریمہ میں ہاتھ کندھوں تک اٹھائیں، دوپٹے کے اندر', 'Takbeer-e-tahreema mein haath kandhon tak uthayen, dupatte ke andar', 'Raise the hands to the shoulders, inside the scarf'),
    L('ہاتھ سینے پر باندھیں، دائیں ہتھیلی بائیں کی پشت پر', 'Haath seene par bandhein, dayen hatheli baayen ki pusht par', 'Place the hands on the chest, right palm over the back of the left'),
    L('رکوع میں تھوڑا جھکیں، انگلیاں ملا کر گھٹنوں پر رکھیں', 'Ruku mein thora jhukein, ungliyan mila kar ghutnon par rakhein', 'Bow a little in ruku, fingers together on the knees'),
    L('سجدے میں سمٹ کر، پیٹ رانوں سے اور بازو پہلوؤں سے ملے ہوں، کہنیاں زمین پر', 'Sajde mein simat kar, pet raanon se aur baazu pehluon se mile hon, kohniyan zameen par', 'In sajdah keep compact: belly to thighs, arms to the sides, forearms on the ground'),
    L('قعدے میں دونوں پاؤں دائیں طرف نکال کر بائیں سرین پر بیٹھیں', 'Qade mein dono paaon dayen taraf nikal kar baayen sureen par baithein', 'In the sitting, both feet out to the right, sitting on the left side'),
    L('اذان اور اقامت نہیں؛ گھر میں نماز افضل', 'Azan aur iqamat nahi; ghar mein namaz afzal', 'No adhan or iqamah; praying at home is better'),
  ])],
};

export const WOMEN_TAHARAH: Topic = {
  id: 'womenTaharah',
  title: L('حیض، نفاس اور استحاضہ', 'Haiz, nifas aur istihaza', 'Menstruation and post-natal bleeding'),
  intro: L('حنفی فقہ کے مطابق خلاصہ؛ تفصیل کسی عالمہ یا مفتی سے', 'Hanafi fiqh ke mutabiq khulasa; tafseel kisi aalima ya mufti se', 'Hanafi summary; ask a scholar for details'),
  lists: [
    list(L('مدت', 'Muddat', 'Duration'), [
      L('حیض کم از کم 3 دن، زیادہ سے زیادہ 10 دن', 'Haiz kam az kam 3 din, zyada se zyada 10 din', 'Haiz: at least 3 days, at most 10'),
      L('نفاس (ولادت کے بعد) زیادہ سے زیادہ 40 دن، کم کی حد نہیں', 'Nifas (wiladat ke baad) zyada se zyada 40 din, kam ki had nahi', 'Nifas (after birth): at most 40 days, no minimum'),
      L('ان حدوں سے کم یا زیادہ خون استحاضہ (بیماری) ہے', 'In hadon se kam ya zyada khoon istihaza (beemari) hai', 'Bleeding outside these limits is istihadah (an illness)'),
    ]),
    list(L('ان دنوں میں', 'In dinon mein', 'During these days'), [
      L('نماز معاف ہے، اس کی قضا نہیں', 'Namaz maaf hai, us ki qaza nahi', 'Salah is excused and not made up'),
      L('روزہ نہیں رکھ سکتیں، بعد میں قضا لازم', 'Roza nahi rakh saktin, baad mein qaza lazim', 'No fasting; the fasts are made up later'),
      L('قرآن کو بغیر غلاف کے چھونا اور تلاوت کرنا منع؛ ذکر، درود اور دعائیں پڑھ سکتی ہیں', 'Quran ko baghair ghilaf ke chhoona aur tilawat karna mana; zikr, durood aur duain parh sakti hain', 'Do not touch the Mushaf or recite the Quran; dhikr, durood and duas are fine'),
      L('مسجد میں داخل ہونا اور طواف منع', 'Masjid mein dakhil hona aur tawaf mana', 'Do not enter the masjid or perform tawaf'),
      L('پاک ہونے پر غسل فرض', 'Paak hone par ghusl farz', 'Ghusl is obligatory on becoming clean'),
    ]),
    list(L('استحاضہ', 'Istihaza', 'Istihadah'), [
      L('نماز روزہ معاف نہیں؛ ہر نماز کے وقت کے لیے نیا وضو کریں', 'Namaz roza maaf nahi; har namaz ke waqt ke liye naya wuzu karein', 'Salah and fasting continue; make fresh wudu for each prayer time'),
    ]),
  ],
};

export const WOMEN_PARDA_IDDAT: Topic = {
  id: 'womenParda',
  title: L('ستر، پردہ اور عدت', 'Satr, parda aur iddat', 'Covering, hijab and iddah'),
  lists: [
    list(L('ستر اور پردہ', 'Satr aur parda', 'Covering'), [
      L('عورت کا ستر چہرے، ہتھیلیوں اور پاؤں کے سوا پورا جسم ہے؛ نماز میں بال اور کلائیاں بھی ڈھکی ہوں', 'Aurat ka satr chehre, hatheliyon aur paaon ke siwa poora jism hai; namaz mein baal aur kalaiyan bhi dhaki hon', 'A woman\'s awrah is the whole body except face, hands and feet; hair and wrists covered in salah'),
      L('نامحرم کے سامنے پردہ (النور 31، الاحزاب 59)', 'Namehram ke saamne parda (An-Nur 31, Al-Ahzab 59)', 'Hijab before non-mahram men (24:31, 33:59)'),
    ]),
    list(L('عدت', 'Iddat', 'Iddah'), [
      L('شوہر کی وفات پر 4 مہینے 10 دن؛ حاملہ ہو تو ولادت تک', 'Shohar ki wafat par 4 mahine 10 din; hamila ho to wiladat tak', 'After the husband\'s death: 4 months 10 days; if pregnant, until birth'),
      L('طلاق کے بعد تین حیض؛ جسے حیض نہ آتا ہو اس کے لیے تین مہینے؛ حاملہ کی ولادت تک', 'Talaq ke baad teen haiz; jise haiz na aata ho us ke liye teen mahine; hamila ki wiladat tak', 'After divorce: three periods; three months if she does not menstruate; until birth if pregnant'),
      L('وفات کی عدت میں زینت سے پرہیز اور بلا ضرورت گھر سے نہ نکلنا', 'Wafat ki iddat mein zeenat se parhez aur bila zaroorat ghar se na nikalna', 'In the iddah of death, avoid adornment and do not leave home without need'),
    ]),
  ],
};

const w = (id: string, title: [string, string, string], arabic: string, meaning: [string, string, string], source: string): Recitation => ({
  id, arabic, source, title: { ur: title[0], roman: title[1], en: title[2] }, meaning: { ur: meaning[0], roman: meaning[1], en: meaning[2] },
});

export const WOMEN_DUAS: Recitation[] = [
  w('wChildren', ['نیک اولاد کی دعا (حضرت زکریا)', 'Nek aulad ki dua', 'For righteous children'],
    'رَبِّ هَبْ لِيْ مِنْ لَّدُنْكَ ذُرِّيَّةً طَيِّبَةً إِنَّكَ سَمِيْعُ الدُّعَاءِ',
    ['اے میرے رب! مجھے اپنی طرف سے پاکیزہ اولاد عطا فرما، بیشک تو دعا سننے والا ہے۔', 'Aye mere Rab! Mujhe apni taraf se pakeeza aulad ata farma, beshak tu dua sunne wala hai.', 'My Lord, grant me from Yourself good offspring; You hear every prayer.'], 'Quran 3:38'),
  w('wFamily', ['گھر والوں کی ٹھنڈک', 'Ghar walon ki thandak', 'Comfort in spouse and children'],
    'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَّاجْعَلْنَا لِلْمُتَّقِيْنَ إِمَامًا',
    ['اے ہمارے رب! ہمیں ہماری بیویوں اور اولاد سے آنکھوں کی ٹھنڈک عطا فرما اور ہمیں پرہیزگاروں کا پیشوا بنا۔', 'Aye hamare Rab! Hamein hamari biwiyon aur aulad se aankhon ki thandak ata farma aur hamein parhezgaron ka peshwa bana.', 'Our Lord, grant us joy in our spouses and children and make us leaders of the righteous.'], 'Quran 25:74'),
  w('wMaryamMother', ['حضرت مریم کی والدہ کی دعا', 'Hazrat Maryam ki walida ki dua', 'Dua of the mother of Maryam'],
    'رَبِّ إِنِّيْ نَذَرْتُ لَكَ مَا فِيْ بَطْنِيْ مُحَرَّرًا فَتَقَبَّلْ مِنِّيْ إِنَّكَ أَنْتَ السَّمِيْعُ الْعَلِيْمُ',
    ['اے میرے رب! جو میرے پیٹ میں ہے میں نے اسے تیرے لیے وقف کرنے کی نذر مانی، تو مجھ سے قبول فرما، بیشک تو سننے والا جاننے والا ہے۔ (حمل کے دنوں میں)', 'Aye mere Rab! Jo mere pet mein hai main ne usay tere liye waqf karne ki nazar maani, to mujh se qubool farma, beshak tu sunne wala jaanne wala hai. (Hamal ke dinon mein)', 'My Lord, I have vowed to You what is in my womb, dedicated, so accept it from me. (During pregnancy)'], 'Quran 3:35'),
  w('wProtectChild', ['بچے کو اللہ کی پناہ میں دینا', 'Bachay ko Allah ki panah mein dena', 'Placing the child in Allah\'s protection'],
    'وَإِنِّيْ أُعِيْذُهَا بِكَ وَذُرِّيَّتَهَا مِنَ الشَّيْطَانِ الرَّجِيْمِ',
    ['اور میں اسے اور اس کی اولاد کو شیطان مردود سے تیری پناہ میں دیتی ہوں۔', 'Aur main isay aur is ki aulad ko Shaitan mardood se teri panah mein deti hoon.', 'I seek Your protection for her and her offspring from Satan the accursed.'], 'Quran 3:36'),
  w('wAsiya', ['حضرت آسیہ کی دعا', 'Hazrat Asiya ki dua', 'Dua of Asiya'],
    'رَبِّ ابْنِ لِيْ عِنْدَكَ بَيْتًا فِي الْجَنَّةِ وَنَجِّنِيْ مِنْ فِرْعَوْنَ وَعَمَلِهٖ وَنَجِّنِيْ مِنَ الْقَوْمِ الظَّالِمِيْنَ',
    ['اے میرے رب! اپنے پاس جنت میں میرے لیے گھر بنا، اور مجھے فرعون اور اس کے عمل سے اور ظالم لوگوں سے نجات دے۔ (ظلم اور مشکل میں)', 'Aye mere Rab! Apne paas jannat mein mere liye ghar bana, aur mujhe Firaun aur us ke amal se aur zalim logon se nijat de. (Zulm aur mushkil mein)', 'My Lord, build me a house near You in Paradise and save me from Pharaoh and his deeds and from the wrongdoing people.'], 'Quran 66:11'),
  w('wEase', ['آسانی کی دعا (ولادت کے وقت بھی)', 'Aasani ki dua (wiladat ke waqt bhi)', 'For ease (also in childbirth)'],
    'رَبِّ يَسِّرْ وَلَا تُعَسِّرْ وَتَمِّمْ بِالْخَيْرِ',
    ['اے میرے رب! آسانی فرما، مشکل نہ کر، اور خیر کے ساتھ پورا فرما۔', 'Aye mere Rab! Aasani farma, mushkil na kar, aur khair ke saath poora farma.', 'My Lord, make it easy, not hard, and complete it with good.'], 'Mashhur dua (Bayhaqi, Al-Adab)'),
  w('wSpouse', ['نیک رشتے کی دعا (حضرت موسیٰ)', 'Nek rishte ki dua', 'For a good spouse'],
    'رَبِّ إِنِّيْ لِمَا أَنْزَلْتَ إِلَيَّ مِنْ خَيْرٍ فَقِيْرٌ',
    ['اے میرے رب! جو بھلائی تو میری طرف اتارے میں اس کی محتاج ہوں۔', 'Aye mere Rab! Jo bhalai tu meri taraf utare main us ki mohtaj hoon.', 'My Lord, I am in need of whatever good You send down to me.'], 'Quran 28:24'),
];

export const WOMEN_MAJLIS: Topic = {
  id: 'womenMajlis',
  title: L('خواتین کی محافل', 'Khawateen ki mehfilein', "Women's gatherings"),
  intro: L('قرآن خوانی، درس، نعت اور دعا کی محفل', 'Quran khwani, dars, naat aur dua ki mehfil', 'Quran recitation, lessons, naat and dua gatherings'),
  lists: [
    list(L('قرآن خوانی اور ختم کی محفل', 'Quran khwani aur khatam ki mehfil', 'A Quran khwani or khatam gathering'), [
      L('پارے بانٹ دیں؛ ایامِ حیض والی خواتین تلاوت کے بجائے درود، کلمہ اور تسبیحات پڑھیں', 'Paray baant dein; ayyam-e-haiz wali khawateen tilawat ke bajaye durood, kalima aur tasbeehat parhein', 'Share out the paras; women in their period read durood, kalimah and tasbih instead'),
      L('آخر میں ختم شریف ("مسمات مجلس" والا حصہ) اور ایصالِ ثواب کی دعا', 'Aakhir mein Khatam Sharif ("Masmat Majlis" wala hissa) aur isaal-e-sawab ki dua', 'End with the Khatam Sharif (see Masmat Majlis) and the isal-e-sawab dua'),
      L('آواز گھر سے باہر نامحرم مردوں تک نہ پہنچے', 'Awaz ghar se bahar namehram mardon tak na pohanche', 'Keep voices from reaching non-mahram men outside'),
    ]),
    list(L('محفل کے آداب', 'Mehfil ke adaab', 'Etiquette'), [
      L('باوضو بیٹھیں اور قرآن کو ادب سے رکھیں', 'Ba-wuzu baithein aur Quran ko adab se rakhein', 'Sit with wudu and keep the Quran respectfully'),
      L('غیبت اور دنیاوی باتوں سے بچیں؛ وقت کم رکھیں', 'Gheebat aur duniyawi baaton se bachein; waqt kam rakhein', 'Avoid gossip; keep it short'),
      L('دکھاوے اور فضول خرچی سے پرہیز؛ کھانا سادہ', 'Dikhawe aur fuzool kharchi se parhez; khana sada', 'Avoid show and waste; keep food simple'),
      L('نعت اور درود کے ساتھ دعا پر ختم کریں', 'Naat aur durood ke saath dua par khatam karein', 'Close with naat, durood and dua'),
    ]),
  ],
};

export const WOMEN_MOTHER: Topic = {
  id: 'womenMother',
  title: L('حمل اور ماں بننا', 'Hamal aur maa banna', 'Pregnancy and motherhood'),
  lists: [
    list(L('رہنمائی', 'Rehnumai', 'Guidance'), [
      L('حاملہ یا دودھ پلانے والی کو اپنی یا بچے کی صحت کا خطرہ ہو تو روزہ چھوڑ سکتی ہے، بعد میں قضا', 'Hamila ya doodh pilane wali ko apni ya bachay ki sehat ka khatra ho to roza chhor sakti hai, baad mein qaza', 'If fasting risks her or the baby\'s health, she may skip and make up later'),
      L('سورۃ مریم، سورۃ یوسف اور سورۃ لقمان کی تلاوت اور نیک دعائیں (عام معمول)', 'Surah Maryam, Surah Yusuf aur Surah Luqman ki tilawat aur nek duain (aam mamool)', 'Reciting Maryam, Yusuf and Luqman and making good duas (common practice)'),
      L('ڈاکٹر کی ہدایات پر عمل کریں؛ صحت کی حفاظت بھی عبادت ہے', 'Doctor ki hidayat par amal karein; sehat ki hifazat bhi ibadat hai', 'Follow medical advice; caring for health is worship too'),
      L('ماں کے قدموں تلے جنت ہے (نسائی)', 'Maa ke qadmon tale jannat hai (Nasai)', 'Paradise lies at the feet of mothers (Nasai)'),
    ]),
  ],
};

export const WOMEN_TOPICS: Topic[] = [WOMEN_SALAH, WOMEN_TAHARAH, WOMEN_PARDA_IDDAT, WOMEN_MOTHER, WOMEN_MAJLIS];
