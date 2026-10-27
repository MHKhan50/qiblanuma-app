// Khatam Sharif (Fatiha / isal-e-sawab) in the order commonly read in Pakistan
// and India. Quran passages are taken from the bundled Tanzil text by reference.
// Families differ a little in what they add; this order must be checked by the
// reviewing ulama before release.
import type { QuranPart, Recitation, Tri } from './types';
import { DUROOD_IBRAHIMI, DUROOD_MEANING } from './tarbiyat';

export type KhatamStep =
  | { kind: 'recite'; item: Recitation }
  | { kind: 'quran'; part: QuranPart }
  | { kind: 'dua'; title: Tri; text: Tri };

const q = (id: string, ur: string, roman: string, en: string, sura: number, from: number, to: number, times?: number): KhatamStep => ({
  kind: 'quran', part: { id, title: { ur, roman, en }, sura, from, to, times },
});

const durood: Recitation = {
  id: 'durood', title: { ur: 'درود شریف', roman: 'Durood Sharif', en: 'Durood' }, arabic: DUROOD_IBRAHIMI, meaning: DUROOD_MEANING, times: 3,
};

export const KHATAM_STEPS: KhatamStep[] = [
  { kind: 'recite', item: durood },
  q('kafirun', 'سورۃ الکافرون', 'Surah Al-Kafiroon', 'Surah Al-Kafirun', 109, 1, 6),
  q('ikhlas', 'سورۃ الاخلاص', 'Surah Al-Ikhlas', 'Surah Al-Ikhlas', 112, 1, 4, 3),
  q('falaq', 'سورۃ الفلق', 'Surah Al-Falaq', 'Surah Al-Falaq', 113, 1, 5),
  q('nas', 'سورۃ الناس', 'Surah An-Naas', 'Surah An-Nas', 114, 1, 6),
  q('fatiha', 'سورۃ الفاتحہ', 'Surah Al-Fatiha', 'Surah Al-Fatihah', 1, 1, 7),
  q('baqarah', 'سورۃ البقرہ: آیات 1 تا 5', 'Surah Al-Baqarah: ayaat 1 se 5', 'Al-Baqarah 1–5', 2, 1, 5),
  q('ilahukum', 'سورۃ البقرہ: آیت 163', 'Surah Al-Baqarah: ayat 163', 'Al-Baqarah 163', 2, 163, 163),
  q('kursi', 'آیت الکرسی', 'Ayat-ul-Kursi', 'Ayat al-Kursi', 2, 255, 255),
  q('rahmat', 'سورۃ الاعراف: آیت 56', 'Surah Al-Araf: ayat 56', "Al-A'raf 56", 7, 56, 56),
  q('rahmatan', 'سورۃ الانبیاء: آیت 107', 'Surah Al-Anbiya: ayat 107', "Al-Anbiya' 107", 21, 107, 107),
  q('khatam', 'سورۃ الاحزاب: آیت 40', 'Surah Al-Ahzab: ayat 40', 'Al-Ahzab 40', 33, 40, 40),
  q('yusalloon', 'سورۃ الاحزاب: آیت 56', 'Surah Al-Ahzab: ayat 56', 'Al-Ahzab 56', 33, 56, 56),
  { kind: 'recite', item: { ...durood, id: 'durood2' } },
  q('subhana', 'سورۃ الصافات: آیات 180 تا 182', 'Surah As-Saffat: ayaat 180 se 182', 'As-Saffat 180–182', 37, 180, 182),
  {
    kind: 'dua',
    title: { ur: 'ایصالِ ثواب کی دعا', roman: 'Isaal-e-sawab ki dua', en: 'Dua for passing on the reward' },
    text: {
      ur: 'یا اللہ! جو کچھ ہم نے پڑھا ہے اسے اپنی بارگاہ میں قبول فرما، اور اس کا ثواب ہمارے آقا محمد ﷺ کی بارگاہ میں پیش کرتے ہیں، اور آپ ﷺ کے وسیلے سے تمام انبیاء، صحابہ، اولیاء اور تمام مرحوم مسلمانوں کو پہنچا۔ خاص طور پر ہماری مرحومہ والدہ اور جدّہ مسمات، اور مرحومہ بہنوں فاطمہ اور حلیمہ کو، اور ان سب کو جن کے لیے ہم دعا کر رہے ہیں (یہاں نام لیں)۔ یا اللہ! ان کی مغفرت فرما، ان کی قبروں کو جنت کے باغوں میں سے باغ بنا، اور ہمیں بھی ایمان پر خاتمہ نصیب فرما۔ آمین۔',
      roman: 'Ya Allah! Jo kuch hum ne parha hai usay apni bargah mein qubool farma, aur us ka sawab hamare Aqa Muhammad ﷺ ki bargah mein pesh karte hain, aur Aap ﷺ ke waseele se tamam Anbiya, Sahaba, Auliya aur tamam marhoom Musalmanon ko pohncha. Khaas taur par hamari marhooma walida aur jaddah Masmat, aur marhooma behnon Fatima aur Halima ko, aur un sab ko jin ke liye hum dua kar rahe hain (yahan naam lein). Ya Allah! Un ki maghfirat farma, un ki qabron ko jannat ke baaghon mein se baagh bana, aur hamein bhi iman par khatma naseeb farma. Ameen.',
      en: 'O Allah, accept what we have read, and we present its reward to our Master Muhammad ﷺ and through him to all the prophets, companions, saints and all deceased Muslims; especially our late mother and grandmother Masmat, our late sisters Fatima and Halima, and everyone we are praying for (say their names). O Allah, forgive them, make their graves gardens of Paradise, and grant us an end upon faith. Ameen.',
    },
  },
];
