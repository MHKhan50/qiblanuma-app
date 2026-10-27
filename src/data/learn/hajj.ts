// Short step-by-step guide to Umrah and Hajj (Hanafi). A summary only;
// pilgrims should learn the full masail from an aalim or their group.
import type { Topic, Tri } from './types';

const L = (ur: string, roman: string, en: string): Tri => ({ ur, roman, en });

export const UMRAH: Topic = {
  id: 'umrah',
  title: L('عمرہ کا طریقہ', 'Umrah ka tareeqa', 'How to perform Umrah'),
  intro: L('مختصر خلاصہ؛ تفصیلی مسائل کسی عالم سے سیکھیں۔', 'Mukhtasar khulasa; tafseeli masail kisi aalim se seekhein.', 'A short summary; learn the full rulings from a scholar.'),
  lists: [{
    heading: L('ترتیب', 'Tarteeb', 'Steps'),
    items: [
      L('میقات سے پہلے غسل یا وضو کر کے احرام باندھیں، دو رکعت نفل پڑھیں، عمرہ کی نیت کریں اور تلبیہ پڑھیں: لَبَّيْكَ اللّٰهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيْكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لَا شَرِيْكَ لَكَ', 'Meeqat se pehle ghusl ya wuzu kar ke ehram bandhein, do rakat nafl parhein, Umrah ki niyyat karein aur talbiya parhein: Labbaik Allahumma labbaik, labbaika la shareeka laka labbaik, innal hamda wan-nimata laka wal-mulk, la shareeka lak', 'Before the miqat, bathe or make wudu, put on ihram, pray two rakats, make the intention for Umrah and recite the talbiyah: Labbayk Allahumma labbayk...'),
      L('مسجد الحرام میں داخل ہو کر حجرِ اسود سے طواف شروع کریں: کعبہ کے گرد سات چکر، کعبہ بائیں ہاتھ پر', 'Masjid-ul-Haram mein dakhil ho kar Hajr-e-Aswad se tawaf shuru karein: Kaaba ke gird saat chakkar, Kaaba baayen haath par', 'Enter Masjid al-Haram and start tawaf at the Black Stone: seven circuits with the Kaaba on your left'),
      L('طواف کے بعد مقامِ ابراہیم کے پیچھے (یا جہاں جگہ ملے) دو رکعت واجب الطواف پڑھیں اور زمزم پئیں', 'Tawaf ke baad Maqam-e-Ibrahim ke peeche (ya jahan jagah mile) do rakat wajib-ut-tawaf parhein aur Zamzam piyein', 'After tawaf, pray two rakats behind Maqam Ibrahim (or wherever there is room) and drink Zamzam'),
      L('صفا سے مروہ تک سات چکر سعی کریں (صفا سے شروع، مروہ پر ختم)', 'Safa se Marwa tak saat chakkar sa\'ee karein (Safa se shuru, Marwa par khatam)', "Perform sa'i: seven laps between Safa and Marwah, starting at Safa and ending at Marwah"),
      L('مرد سر منڈوائیں یا بال کٹوائیں، عورتیں انگلی کے پور کے برابر بال کاٹیں۔ عمرہ مکمل', 'Mard sar mundwayein ya baal katwayein, auratein ungli ke poor ke barabar baal kaatein. Umrah mukammal', 'Men shave or shorten the hair, women cut a fingertip’s length. Umrah is complete'),
    ],
  }],
};

export const HAJJ: Topic = {
  id: 'hajj',
  title: L('حج کے دن', 'Hajj ke din', 'The days of Hajj'),
  intro: L('مختصر خلاصہ؛ تفصیلی مسائل کسی عالم سے سیکھیں۔', 'Mukhtasar khulasa; tafseeli masail kisi aalim se seekhein.', 'A short summary; learn the full rulings from a scholar.'),
  lists: [{
    heading: L('8 سے 13 ذوالحجہ', '8 se 13 Zul-Hijjah', '8th to 13th Dhul-Hijjah'),
    items: [
      L('8 ذوالحجہ: احرام باندھ کر منیٰ جائیں اور وہاں پانچ نمازیں پڑھیں', '8 Zul-Hijjah: Ehram bandh kar Mina jayen aur wahan paanch namazein parhein', '8th: Enter ihram, go to Mina and pray five prayers there'),
      L('9 ذوالحجہ: عرفات میں وقوف (حج کا سب سے بڑا رکن)، غروب کے بعد مزدلفہ جائیں، مغرب و عشاء اکٹھی پڑھیں اور کنکریاں چنیں', '9 Zul-Hijjah: Arafat mein wuqoof (Hajj ka sab se bara rukn), ghuroob ke baad Muzdalifa jayen, Maghrib o Isha ikatthi parhein aur kankariyan chunein', '9th: Stand at Arafat (the greatest pillar of Hajj); after sunset go to Muzdalifah, pray Maghrib and Isha together and collect pebbles'),
      L('10 ذوالحجہ: بڑے جمرہ کو سات کنکریاں، قربانی، حلق یا قصر، پھر طوافِ زیارت اور سعی', '10 Zul-Hijjah: Baray jamrah ko saat kankariyan, qurbani, halq ya qasr, phir Tawaf-e-Ziyarat aur sa\'ee', '10th: Stone the large jamrah with seven pebbles, sacrifice, shave or shorten, then Tawaf al-Ziyarah and sa\'i'),
      L('11 اور 12 ذوالحجہ: تینوں جمرات کو زوال کے بعد سات سات کنکریاں (13 کو بھی، اگر رکیں)', '11 aur 12 Zul-Hijjah: Teenon jamrat ko zawal ke baad saat saat kankariyan (13 ko bhi, agar rukein)', '11th and 12th: Stone all three jamarat after midday, seven pebbles each (also the 13th if you stay)'),
      L('مکہ سے رخصت ہوتے وقت طوافِ وداع', 'Makkah se rukhsat hote waqt Tawaf-e-Wida', 'Farewell tawaf before leaving Makkah'),
    ],
  }],
};

/** Greetings people send on Islamic occasions, shared as plain text. */
export const GREETINGS: { id: string; title: Tri; text: string }[] = [
  { id: 'eidFitr', title: L('عید الفطر مبارک', 'Eid-ul-Fitr Mubarak', 'Eid al-Fitr'), text: 'تَقَبَّلَ اللّٰهُ مِنَّا وَمِنْكُمْ\nEid Mubarak! Allah aap ke roze aur ibadat qubool farmaye.' },
  { id: 'eidAdha', title: L('عید الاضحیٰ مبارک', 'Eid-ul-Azha Mubarak', 'Eid al-Adha'), text: 'تَقَبَّلَ اللّٰهُ مِنَّا وَمِنْكُمْ\nEid-ul-Azha Mubarak! Allah aap ki qurbani qubool farmaye.' },
  { id: 'ramadan', title: L('رمضان مبارک', 'Ramazan Mubarak', 'Ramadan'), text: 'Ramazan Mubarak! Allah is mubarak mahine ki barkatein aap ke ghar naseeb farmaye.' },
  { id: 'jumuah', title: L('جمعہ مبارک', 'Juma Mubarak', "Jumu'ah"), text: 'Juma Mubarak! Aaj Surah Kahf parhna aur kasrat se durood bhejna na bhoolein.' },
  { id: 'newYear', title: L('نیا اسلامی سال', 'Naya Islami saal', 'Islamic New Year'), text: 'Naya Hijri saal mubarak! Allah is saal ko aman, sehat aur barkat wala banaye.' },
];

/** Live streams from the Haramain, opened in YouTube. */
export const LIVE_LINKS = [
  { id: 'makkah', title: L('مکہ لائیو', 'Makkah Live', 'Makkah Live'), url: 'https://www.youtube.com/results?search_query=makkah+live' },
  { id: 'madinah', title: L('مدینہ لائیو', 'Madinah Live', 'Madinah Live'), url: 'https://www.youtube.com/results?search_query=madinah+live' },
];
