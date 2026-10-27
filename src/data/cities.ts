import type { MethodId } from '../engine/methods';

export interface City {
  id: string;
  name: { en: string; ur: string };
  country: string;
  latitude: number;
  longitude: number;
  timeZone: string;
  /** Method commonly used in that country; users can still override. */
  method: MethodId;
}

// City-centre coordinates rounded to four decimals (about 10 m), which is far
// below the precision that changes a prayer time by one minute.
export const ISLAMIC_CITIES: City[] = [
  { id: 'makkah', name: { en: 'Makkah', ur: 'مکہ مکرمہ' }, country: 'SA', latitude: 21.4225, longitude: 39.8262, timeZone: 'Asia/Riyadh', method: 'makkah' },
  { id: 'madinah', name: { en: 'Madinah', ur: 'مدینہ منورہ' }, country: 'SA', latitude: 24.4672, longitude: 39.6111, timeZone: 'Asia/Riyadh', method: 'makkah' },
  { id: 'alquds', name: { en: 'Al-Quds', ur: 'القدس' }, country: 'PS', latitude: 31.7781, longitude: 35.2360, timeZone: 'Asia/Jerusalem', method: 'mwl' },
  { id: 'istanbul', name: { en: 'Istanbul', ur: 'استنبول' }, country: 'TR', latitude: 41.0082, longitude: 28.9784, timeZone: 'Europe/Istanbul', method: 'turkey' },
  { id: 'konya', name: { en: 'Konya', ur: 'قونیہ' }, country: 'TR', latitude: 37.8746, longitude: 32.4932, timeZone: 'Europe/Istanbul', method: 'turkey' },
  { id: 'bursa', name: { en: 'Bursa', ur: 'بورصہ' }, country: 'TR', latitude: 40.1885, longitude: 29.0610, timeZone: 'Europe/Istanbul', method: 'turkey' },
  { id: 'bukhara', name: { en: 'Bukhara', ur: 'بخارا' }, country: 'UZ', latitude: 39.7747, longitude: 64.4286, timeZone: 'Asia/Tashkent', method: 'mwl' },
  { id: 'samarqand', name: { en: 'Samarqand', ur: 'سمرقند' }, country: 'UZ', latitude: 39.6542, longitude: 66.9597, timeZone: 'Asia/Samarkand', method: 'mwl' },
  { id: 'baghdad', name: { en: 'Baghdad', ur: 'بغداد' }, country: 'IQ', latitude: 33.3152, longitude: 44.3661, timeZone: 'Asia/Baghdad', method: 'mwl' },
  { id: 'damascus', name: { en: 'Damascus', ur: 'دمشق' }, country: 'SY', latitude: 33.5138, longitude: 36.2765, timeZone: 'Asia/Damascus', method: 'mwl' },
  { id: 'cairo', name: { en: 'Cairo', ur: 'قاہرہ' }, country: 'EG', latitude: 30.0444, longitude: 31.2357, timeZone: 'Africa/Cairo', method: 'egypt' },
  { id: 'isfahan', name: { en: 'Isfahan', ur: 'اصفہان' }, country: 'IR', latitude: 32.6539, longitude: 51.6660, timeZone: 'Asia/Tehran', method: 'tehran' },
  { id: 'herat', name: { en: 'Herat', ur: 'ہرات' }, country: 'AF', latitude: 34.3529, longitude: 62.2040, timeZone: 'Asia/Kabul', method: 'karachi' },
  { id: 'cordoba', name: { en: 'Cordoba', ur: 'قرطبہ' }, country: 'ES', latitude: 37.8882, longitude: -4.7794, timeZone: 'Europe/Madrid', method: 'mwl' },
  { id: 'fez', name: { en: 'Fez', ur: 'فاس' }, country: 'MA', latitude: 34.0181, longitude: -5.0078, timeZone: 'Africa/Casablanca', method: 'mwl' },
  { id: 'kairouan', name: { en: 'Kairouan', ur: 'قیروان' }, country: 'TN', latitude: 35.6781, longitude: 10.0963, timeZone: 'Africa/Tunis', method: 'mwl' },
  { id: 'lahore', name: { en: 'Lahore', ur: 'لاہور' }, country: 'PK', latitude: 31.5204, longitude: 74.3587, timeZone: 'Asia/Karachi', method: 'karachi' },
];

// Places a user can pick when GPS is off (home cities of the first users).
export const MANUAL_LOCATIONS: City[] = [
  { id: 'glasgow', name: { en: 'Glasgow', ur: 'گلاسگو' }, country: 'GB', latitude: 55.8642, longitude: -4.2518, timeZone: 'Europe/London', method: 'karachi' },
  { id: 'london', name: { en: 'London', ur: 'لندن' }, country: 'GB', latitude: 51.5072, longitude: -0.1276, timeZone: 'Europe/London', method: 'karachi' },
  { id: 'faisalabad', name: { en: 'Faisalabad', ur: 'فیصل آباد' }, country: 'PK', latitude: 31.4504, longitude: 73.1350, timeZone: 'Asia/Karachi', method: 'karachi' },
  { id: 'karachi', name: { en: 'Karachi', ur: 'کراچی' }, country: 'PK', latitude: 24.8607, longitude: 67.0011, timeZone: 'Asia/Karachi', method: 'karachi' },
  { id: 'islamabad', name: { en: 'Islamabad', ur: 'اسلام آباد' }, country: 'PK', latitude: 33.6844, longitude: 73.0479, timeZone: 'Asia/Karachi', method: 'karachi' },
  ...ISLAMIC_CITIES,
];
