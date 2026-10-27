import type { MethodId } from '../engine/methods';

export interface City {
  id: string;
  name: { en: string; ur: string };
  country: string;
  latitude: number;
  longitude: number;
  timeZone: string;
  /** Method commonly used in that country today; users can still override. */
  method: MethodId;
}

/** Calculation method used by default for each present-day country. */
const COUNTRY_METHOD: Record<string, MethodId> = {
  SA: 'makkah', YE: 'makkah',
  TR: 'turkey',
  EG: 'egypt',
  IR: 'tehran',
  PK: 'karachi', IN: 'karachi', BD: 'karachi', AF: 'karachi', GB: 'karachi',
  US: 'isna', CA: 'isna',
};

type Row = [id: string, en: string, ur: string, country: string, lat: number, lon: number, tz: string];

// City-centre coordinates to about 0.01 degree, which changes a prayer time
// by well under a minute. Merv uses the historic city, not modern Mary.
const ROWS: Row[] = [
  ['makkah', 'Makkah', 'مکہ مکرمہ', 'SA', 21.4225, 39.8262, 'Asia/Riyadh'],
  ['madinah', 'Madinah', 'مدینہ منورہ', 'SA', 24.4672, 39.6111, 'Asia/Riyadh'],
  ['alquds', 'Al-Quds', 'القدس', 'PS', 31.7781, 35.2360, 'Asia/Jerusalem'],
  ['istanbul', 'Istanbul', 'استنبول', 'TR', 41.0082, 28.9784, 'Europe/Istanbul'],
  ['bursa', 'Bursa', 'بورصہ', 'TR', 40.1885, 29.0610, 'Europe/Istanbul'],
  ['sogut', 'Söğüt', 'سوغوت', 'TR', 40.0186, 30.1797, 'Europe/Istanbul'],
  ['edirne', 'Edirne', 'ادرنہ', 'TR', 41.6771, 26.5557, 'Europe/Istanbul'],
  ['iznik', 'İznik', 'ازنک', 'TR', 40.4292, 29.7211, 'Europe/Istanbul'],
  ['konya', 'Konya', 'قونیہ', 'TR', 37.8746, 32.4932, 'Europe/Istanbul'],
  ['kayseri', 'Kayseri', 'قیصری', 'TR', 38.7205, 35.4826, 'Europe/Istanbul'],
  ['sivas', 'Sivas', 'سیواس', 'TR', 39.7477, 37.0179, 'Europe/Istanbul'],
  ['erzurum', 'Erzurum', 'ارض روم', 'TR', 39.9043, 41.2679, 'Europe/Istanbul'],
  ['ahlat', 'Ahlat', 'اخلاط', 'TR', 38.7531, 42.4936, 'Europe/Istanbul'],
  ['diyarbakir', 'Diyarbakır', 'دیار بکر', 'TR', 37.9144, 40.2306, 'Europe/Istanbul'],
  ['sarajevo', 'Sarajevo', 'سراجیوو', 'BA', 43.8563, 18.4131, 'Europe/Sarajevo'],
  ['damascus', 'Damascus', 'دمشق', 'SY', 33.5138, 36.2765, 'Asia/Damascus'],
  ['aleppo', 'Aleppo', 'حلب', 'SY', 36.2021, 37.1343, 'Asia/Damascus'],
  ['hama', 'Hama', 'حماہ', 'SY', 35.1318, 36.7578, 'Asia/Damascus'],
  ['karak', 'Al-Karak', 'الکرک', 'JO', 31.1853, 35.7048, 'Asia/Amman'],
  ['baghdad', 'Baghdad', 'بغداد', 'IQ', 33.3152, 44.3661, 'Asia/Baghdad'],
  ['mosul', 'Mosul', 'موصل', 'IQ', 36.3489, 43.1577, 'Asia/Baghdad'],
  ['cairo', 'Cairo', 'قاہرہ', 'EG', 30.0444, 31.2357, 'Africa/Cairo'],
  ['alexandria', 'Alexandria', 'اسکندریہ', 'EG', 31.2001, 29.9187, 'Africa/Cairo'],
  ['kairouan', 'Kairouan', 'قیروان', 'TN', 35.6781, 10.0963, 'Africa/Tunis'],
  ['fez', 'Fez', 'فاس', 'MA', 34.0181, -5.0078, 'Africa/Casablanca'],
  ['cordoba', 'Cordoba', 'قرطبہ', 'ES', 37.8882, -4.7794, 'Europe/Madrid'],
  ['granada', 'Granada', 'غرناطہ', 'ES', 37.1773, -3.5986, 'Europe/Madrid'],
  ['timbuktu', 'Timbuktu', 'ٹمبکٹو', 'ML', 16.7666, -3.0026, 'Africa/Bamako'],
  ['sanaa', "Sana'a", 'صنعاء', 'YE', 15.3694, 44.1910, 'Asia/Aden'],
  ['tarim', 'Tarim', 'تریم', 'YE', 16.0565, 49.0016, 'Asia/Aden'],
  ['zanzibar', 'Zanzibar', 'زنجبار', 'TZ', -6.1659, 39.2026, 'Africa/Dar_es_Salaam'],
  ['kazan', 'Kazan', 'قازان', 'RU', 55.7963, 49.1088, 'Europe/Moscow'],
  ['baku', 'Baku', 'باکو', 'AZ', 40.4093, 49.8671, 'Asia/Baku'],
  ['tabriz', 'Tabriz', 'تبریز', 'IR', 38.0962, 46.2738, 'Asia/Tehran'],
  ['ardabil', 'Ardabil', 'اردبیل', 'IR', 38.2498, 48.2933, 'Asia/Tehran'],
  ['qazvin', 'Qazvin', 'قزوین', 'IR', 36.2797, 50.0049, 'Asia/Tehran'],
  ['isfahan', 'Isfahan', 'اصفہان', 'IR', 32.6539, 51.6660, 'Asia/Tehran'],
  ['tehran', 'Tehran', 'تہران', 'IR', 35.6892, 51.3890, 'Asia/Tehran'],
  ['mashhad', 'Mashhad', 'مشہد', 'IR', 36.2605, 59.6168, 'Asia/Tehran'],
  ['nishapur', 'Nishapur', 'نیشاپور', 'IR', 36.2133, 58.7958, 'Asia/Tehran'],
  ['merv', 'Merv', 'مرو', 'TM', 37.6626, 62.1925, 'Asia/Ashgabat'],
  ['kunyaurgench', 'Kunya-Urgench', 'کہنہ ارگنج', 'TM', 42.3333, 59.1500, 'Asia/Ashgabat'],
  ['khiva', 'Khiva', 'خیوہ', 'UZ', 41.3783, 60.3639, 'Asia/Tashkent'],
  ['bukhara', 'Bukhara', 'بخارا', 'UZ', 39.7747, 64.4286, 'Asia/Tashkent'],
  ['samarqand', 'Samarqand', 'سمرقند', 'UZ', 39.6542, 66.9597, 'Asia/Samarkand'],
  ['shahrisabz', 'Shahrisabz', 'شہر سبز', 'UZ', 39.0578, 66.8342, 'Asia/Samarkand'],
  ['turkistan', 'Turkistan', 'ترکستان', 'KZ', 43.2973, 68.2517, 'Asia/Almaty'],
  ['balkh', 'Balkh', 'بلخ', 'AF', 36.7581, 66.8978, 'Asia/Kabul'],
  ['mazarisharif', 'Mazar-i-Sharif', 'مزار شریف', 'AF', 36.7090, 67.1109, 'Asia/Kabul'],
  ['herat', 'Herat', 'ہرات', 'AF', 34.3529, 62.2040, 'Asia/Kabul'],
  ['ghazni', 'Ghazni', 'غزنی', 'AF', 33.5536, 68.4269, 'Asia/Kabul'],
  ['lahore', 'Lahore', 'لاہور', 'PK', 31.5204, 74.3587, 'Asia/Karachi'],
  ['multan', 'Multan', 'ملتان', 'PK', 30.1575, 71.5249, 'Asia/Karachi'],
  ['uch', 'Uch Sharif', 'اوچ شریف', 'PK', 29.2361, 71.0614, 'Asia/Karachi'],
  ['pakpattan', 'Pakpattan', 'پاکپتن', 'PK', 30.3436, 73.3869, 'Asia/Karachi'],
  ['chishtian', 'Chishtian Sharif', 'چشتیاں شریف', 'PK', 29.7960, 72.8579, 'Asia/Karachi'],
  ['peshawar', 'Peshawar', 'پشاور', 'PK', 34.0151, 71.5249, 'Asia/Karachi'],
  ['delhi', 'Delhi', 'دہلی', 'IN', 28.6139, 77.2090, 'Asia/Kolkata'],
  ['agra', 'Agra', 'آگرہ', 'IN', 27.1767, 78.0081, 'Asia/Kolkata'],
  ['fatehpursikri', 'Fatehpur Sikri', 'فتح پور سیکری', 'IN', 27.0945, 77.6679, 'Asia/Kolkata'],
  ['ajmer', 'Ajmer', 'اجمیر', 'IN', 26.4499, 74.6399, 'Asia/Kolkata'],
  ['srinagar', 'Srinagar', 'سری نگر', 'IN', 34.0837, 74.7973, 'Asia/Kolkata'],
  ['hyderabad', 'Hyderabad Deccan', 'حیدرآباد دکن', 'IN', 17.3850, 78.4867, 'Asia/Kolkata'],
  ['dhaka', 'Dhaka', 'ڈھاکہ', 'BD', 23.8103, 90.4125, 'Asia/Dhaka'],
  ['kufa', 'Kufa', 'کوفہ', 'IQ', 32.0300, 44.4000, 'Asia/Baghdad'],
  ['basra', 'Basra', 'بصرہ', 'IQ', 30.5085, 47.7804, 'Asia/Baghdad'],
  ['samarra', 'Samarra', 'سامرا', 'IQ', 34.1959, 43.8857, 'Asia/Baghdad'],
  ['raqqa', 'Raqqa', 'رقہ', 'SY', 35.9594, 39.0079, 'Asia/Damascus'],
  ['mahdia', 'Mahdia', 'مہدیہ', 'TN', 35.5047, 11.0622, 'Africa/Tunis'],
  ['tunis', 'Tunis', 'تونس', 'TN', 36.8065, 10.1815, 'Africa/Tunis'],
  ['algiers', 'Algiers', 'الجزائر', 'DZ', 36.7538, 3.0588, 'Africa/Algiers'],
  ['marrakesh', 'Marrakesh', 'مراکش', 'MA', 31.6295, -7.9811, 'Africa/Casablanca'],
  ['rabat', 'Rabat', 'رباط', 'MA', 34.0209, -6.8416, 'Africa/Casablanca'],
  ['meknes', 'Meknes', 'مکناس', 'MA', 33.8935, -5.5547, 'Africa/Casablanca'],
  ['seville', 'Seville', 'اشبیلیہ', 'ES', 37.3891, -5.9845, 'Europe/Madrid'],
  ['gao', 'Gao', 'گاؤ', 'ML', 16.2717, -0.0447, 'Africa/Bamako'],
  ['sokoto', 'Sokoto', 'سوکوتو', 'NG', 13.0059, 5.2476, 'Africa/Lagos'],
  ['muscat', 'Muscat', 'مسقط', 'OM', 23.5880, 58.3829, 'Asia/Muscat'],
  ['shiraz', 'Shiraz', 'شیراز', 'IR', 29.5918, 52.5837, 'Asia/Tehran'],
  ['sultaniyeh', 'Soltaniyeh', 'سلطانیہ', 'IR', 36.4352, 48.7967, 'Asia/Tehran'],
  ['kashgar', 'Kashgar', 'کاشغر', 'CN', 39.4704, 75.9898, 'Asia/Shanghai'],
  ['kokand', 'Kokand', 'خوقند', 'UZ', 40.5286, 70.9425, 'Asia/Tashkent'],
  ['tashkent', 'Tashkent', 'تاشقند', 'UZ', 41.2995, 69.2401, 'Asia/Tashkent'],
  ['bakhchysarai', 'Bakhchysarai', 'باغچہ سرائے', 'UA', 44.7519, 33.8605, 'Europe/Simferopol'],
  ['jam', 'Jam (Firozkoh)', 'جام (فیروز کوہ)', 'AF', 34.3964, 64.5161, 'Asia/Kabul'],
  ['kabul', 'Kabul', 'کابل', 'AF', 34.5553, 69.2075, 'Asia/Kabul'],
  ['kandahar', 'Kandahar', 'قندھار', 'AF', 31.6289, 65.7372, 'Asia/Kabul'],
  ['thatta', 'Thatta', 'ٹھٹھہ', 'PK', 24.7461, 67.9235, 'Asia/Karachi'],
  ['rohtas', 'Rohtas Fort', 'قلعہ روہتاس', 'PK', 32.9667, 73.5833, 'Asia/Karachi'],
  ['bahawalpur', 'Bahawalpur', 'بہاولپور', 'PK', 29.3956, 71.6836, 'Asia/Karachi'],
  ['lucknow', 'Lucknow', 'لکھنؤ', 'IN', 26.8467, 80.9462, 'Asia/Kolkata'],
  ['sasaram', 'Sasaram', 'سہسرام', 'IN', 24.9500, 84.0300, 'Asia/Kolkata'],
  ['gulbarga', 'Gulbarga', 'گلبرگہ', 'IN', 17.3297, 76.8343, 'Asia/Kolkata'],
  ['bidar', 'Bidar', 'بیدر', 'IN', 17.9104, 77.5199, 'Asia/Kolkata'],
  ['bijapur', 'Bijapur', 'بیجاپور', 'IN', 16.8302, 75.7100, 'Asia/Kolkata'],
  ['srirangapatna', 'Srirangapatna', 'سرنگاپٹم', 'IN', 12.4216, 76.6932, 'Asia/Kolkata'],
  ['sonargaon', 'Sonargaon', 'سنار گاؤں', 'BD', 23.6485, 90.5976, 'Asia/Dhaka'],
  ['malacca', 'Malacca', 'ملاکا', 'MY', 2.1896, 102.2501, 'Asia/Kuala_Lumpur'],
  ['bandaaceh', 'Banda Aceh', 'باندا آچے', 'ID', 5.5483, 95.3238, 'Asia/Jakarta'],
  ['brunei', 'Bandar Seri Begawan', 'بندر سری بگاوان', 'BN', 4.9031, 114.9398, 'Asia/Brunei'],
  // Present-day world cities.
  ['glasgow', 'Glasgow', 'گلاسگو', 'GB', 55.8642, -4.2518, 'Europe/London'],
  ['london', 'London', 'لندن', 'GB', 51.5072, -0.1276, 'Europe/London'],
  ['manchester', 'Manchester', 'مانچسٹر', 'GB', 53.4808, -2.2426, 'Europe/London'],
  ['birmingham', 'Birmingham', 'برمنگھم', 'GB', 52.4862, -1.8904, 'Europe/London'],
  ['paris', 'Paris', 'پیرس', 'FR', 48.8566, 2.3522, 'Europe/Paris'],
  ['brussels', 'Brussels', 'برسلز', 'BE', 50.8503, 4.3517, 'Europe/Brussels'],
  ['amsterdam', 'Amsterdam', 'ایمسٹرڈیم', 'NL', 52.3676, 4.9041, 'Europe/Amsterdam'],
  ['berlin', 'Berlin', 'برلن', 'DE', 52.5200, 13.4050, 'Europe/Berlin'],
  ['moscow', 'Moscow', 'ماسکو', 'RU', 55.7558, 37.6173, 'Europe/Moscow'],
  ['newyork', 'New York', 'نیو یارک', 'US', 40.7128, -74.0060, 'America/New_York'],
  ['chicago', 'Chicago', 'شکاگو', 'US', 41.8781, -87.6298, 'America/Chicago'],
  ['toronto', 'Toronto', 'ٹورنٹو', 'CA', 43.6532, -79.3832, 'America/Toronto'],
  ['sydney', 'Sydney', 'سڈنی', 'AU', -33.8688, 151.2093, 'Australia/Sydney'],
  ['capetown', 'Cape Town', 'کیپ ٹاؤن', 'ZA', -33.9249, 18.4241, 'Africa/Johannesburg'],
  ['lagos', 'Lagos', 'لاگوس', 'NG', 6.5244, 3.3792, 'Africa/Lagos'],
  ['nairobi', 'Nairobi', 'نیروبی', 'KE', -1.2921, 36.8219, 'Africa/Nairobi'],
  ['riyadh', 'Riyadh', 'ریاض', 'SA', 24.7136, 46.6753, 'Asia/Riyadh'],
  ['dubai', 'Dubai', 'دبئی', 'AE', 25.2048, 55.2708, 'Asia/Dubai'],
  ['doha', 'Doha', 'دوحہ', 'QA', 25.2854, 51.5310, 'Asia/Qatar'],
  ['kuwait', 'Kuwait City', 'کویت', 'KW', 29.3759, 47.9774, 'Asia/Kuwait'],
  ['karachi', 'Karachi', 'کراچی', 'PK', 24.8607, 67.0011, 'Asia/Karachi'],
  ['islamabad', 'Islamabad', 'اسلام آباد', 'PK', 33.6844, 73.0479, 'Asia/Karachi'],
  ['faisalabad', 'Faisalabad', 'فیصل آباد', 'PK', 31.4504, 73.1350, 'Asia/Karachi'],
  ['kualalumpur', 'Kuala Lumpur', 'کوالالمپور', 'MY', 3.1390, 101.6869, 'Asia/Kuala_Lumpur'],
  ['singapore', 'Singapore', 'سنگاپور', 'SG', 1.3521, 103.8198, 'Asia/Singapore'],
  ['jakarta', 'Jakarta', 'جکارتہ', 'ID', -6.2088, 106.8456, 'Asia/Jakarta'],
  ['tokyo', 'Tokyo', 'ٹوکیو', 'JP', 35.6762, 139.6503, 'Asia/Tokyo'],
];


const toCity = ([id, en, ur, country, latitude, longitude, timeZone]: Row): City => ({
  id, name: { en, ur }, country, latitude, longitude, timeZone,
  method: COUNTRY_METHOD[country] ?? 'mwl',
});

export const CITY_CATALOG: City[] = ROWS.map(toCity);

const MANUAL_IDS = ['glasgow', 'london', 'faisalabad', 'karachi', 'islamabad', 'lahore', 'chishtian', 'makkah', 'madinah', 'istanbul', 'bursa'];

export function findCity(id: string): City | undefined {
  return CITY_CATALOG.find((c) => c.id === id);
}

export const MANUAL_LOCATIONS: City[] = MANUAL_IDS.map((id) => findCity(id) as City);
