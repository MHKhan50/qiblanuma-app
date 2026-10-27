// City groups named after Muslim states. Khilafat-e-Rashida comes first,
// then the Ottoman state, then the rest in rough historical order, then the
// Sufi centres of the Barr-e-Azeem and present-day world cities. A city is
// listed in every group whose territory or history it was part of.

export interface CityGroup {
  id: string;
  name: { en: string; ur: string; roman: string };
  cityIds: string[];
}

const g = (id: string, roman: string, ur: string, en: string, cityIds: string[]): CityGroup => ({
  id, name: { en, ur, roman }, cityIds,
});

export const CITY_GROUPS: CityGroup[] = [
  g('rashidun', 'Khilafat-e-Rashida', 'خلافتِ راشدہ', 'Rashidun Caliphate',
    ['madinah', 'makkah', 'kufa', 'alquds', 'damascus', 'basra', 'cairo']),
  g('ottoman', 'Sultanat-e-Usmania', 'سلطنتِ عثمانیہ', 'Ottoman Empire', [
    'istanbul', 'bursa', 'sogut', 'edirne', 'iznik', 'konya', 'kayseri', 'sivas', 'erzurum', 'ahlat',
    'diyarbakir', 'sarajevo', 'makkah', 'madinah', 'alquds', 'damascus', 'aleppo', 'hama', 'karak',
    'baghdad', 'basra', 'mosul', 'cairo', 'alexandria', 'tunis', 'algiers', 'kairouan', 'sanaa',
  ]),
  g('umayyad', 'Khilafat-e-Umawiya', 'خلافتِ امویہ', 'Umayyad Caliphate (Damascus and Cordoba)',
    ['damascus', 'alquds', 'kairouan', 'cordoba']),
  g('abbasid', 'Khilafat-e-Abbasiya', 'خلافتِ عباسیہ', 'Abbasid Caliphate',
    ['baghdad', 'kufa', 'basra', 'samarra', 'raqqa', 'cairo']),
  g('aghlabid', 'Riyasat-e-Aghlabia', 'ریاستِ اغالبہ', 'Aghlabid Emirate', ['kairouan', 'tunis']),
  g('idrisid', 'Riyasat-e-Adarisa', 'ریاستِ ادارسہ', 'Idrisid State', ['fez']),
  g('samanid', 'Sultanat-e-Samania', 'سلطنتِ سامانیہ', 'Samanid Empire',
    ['bukhara', 'samarqand', 'nishapur', 'merv', 'herat']),
  g('fatimid', 'Khilafat-e-Fatimiya', 'خلافتِ فاطمیہ', 'Fatimid Caliphate', ['mahdia', 'cairo', 'alquds']),
  g('buyid', 'Riyasat-e-Buwaihia', 'ریاستِ آلِ بویہ', 'Buyid State', ['shiraz', 'baghdad', 'isfahan']),
  g('ghaznavid', 'Sultanat-e-Ghaznavia', 'سلطنتِ غزنویہ', 'Ghaznavid Empire',
    ['ghazni', 'lahore', 'multan', 'nishapur', 'herat', 'balkh']),
  g('karakhanid', 'Sultanat-e-Qarakhania', 'سلطنتِ قراخانیہ', 'Kara-Khanid Khanate',
    ['kashgar', 'bukhara', 'samarqand']),
  g('seljuk', 'Sultanat-e-Salajqa', 'سلطنتِ سلاجقہ', 'Seljuk Empire',
    ['nishapur', 'merv', 'isfahan', 'baghdad', 'konya', 'iznik', 'kayseri', 'sivas', 'erzurum', 'ahlat']),
  g('almoravid', 'Sultanat-e-Murabitun', 'سلطنتِ مرابطین', 'Almoravid Empire',
    ['marrakesh', 'fez', 'seville', 'cordoba']),
  g('ghurid', 'Sultanat-e-Ghauria', 'سلطنتِ غوریہ', 'Ghurid Empire',
    ['jam', 'herat', 'ghazni', 'lahore', 'multan', 'delhi']),
  g('zengid', 'Riyasat-e-Zangia', 'ریاستِ زنگیہ', 'Zengid State', ['mosul', 'aleppo', 'damascus']),
  g('ayyubid', 'Sultanat-e-Ayyubia', 'سلطنتِ ایوبیہ', 'Ayyubid Sultanate',
    ['cairo', 'damascus', 'alquds', 'aleppo', 'hama', 'karak']),
  g('almohad', 'Sultanat-e-Muwahhidun', 'سلطنتِ موحدین', 'Almohad Caliphate',
    ['marrakesh', 'rabat', 'seville', 'fez', 'tunis', 'cordoba']),
  g('khwarazmian', 'Khwarazm Shahi Sultanat', 'خوارزم شاہی سلطنت', 'Khwarazmian Empire',
    ['kunyaurgench', 'khiva', 'samarqand', 'bukhara', 'balkh', 'merv', 'nishapur', 'herat', 'ghazni']),
  g('delhi', 'Sultanat-e-Dehli', 'سلطنتِ دہلی', 'Delhi Sultanate',
    ['delhi', 'lahore', 'multan', 'uch', 'pakpattan', 'ajmer']),
  g('mamluk', 'Sultanat-e-Mamluk', 'سلطنتِ مملوک', 'Mamluk Sultanate',
    ['cairo', 'alexandria', 'damascus', 'aleppo', 'alquds', 'hama', 'karak', 'makkah', 'madinah']),
  g('nasrid', 'Sultanat-e-Gharnata', 'سلطنتِ غرناطہ', 'Nasrid Emirate of Granada', ['granada']),
  g('hafsid', 'Sultanat-e-Hafsia', 'سلطنتِ حفصیہ', 'Hafsid Sultanate', ['tunis', 'kairouan']),
  g('ilkhanate', 'Ilkhani Sultanat', 'ایلخانی سلطنت', 'Ilkhanate', ['tabriz', 'sultaniyeh', 'baghdad', 'isfahan']),
  g('mali', 'Sultanat-e-Mali', 'سلطنتِ مالی', 'Mali Empire', ['timbuktu', 'gao']),
  g('samma', 'Sultanat-e-Samma (Sindh)', 'سلطنتِ سمہ (سندھ)', 'Samma Sultanate of Sindh', ['thatta']),
  g('timurid', 'Sultanat-e-Taimuria', 'سلطنتِ تیموریہ', 'Timurid Empire',
    ['samarqand', 'shahrisabz', 'herat', 'bukhara', 'balkh', 'mazarisharif', 'turkistan', 'mashhad']),
  g('qaraqoyunlu', 'Riyasat-e-Qara Qoyunlu', 'ریاستِ قرہ قویونلو', 'Qara Qoyunlu State', ['tabriz', 'baghdad']),
  g('aqqoyunlu', 'Riyasat-e-Aq Qoyunlu', 'ریاستِ آق قویونلو', 'Aq Qoyunlu State', ['tabriz', 'diyarbakir', 'baghdad']),
  g('bengal', 'Sultanat-e-Bangala', 'سلطنتِ بنگالہ', 'Bengal Sultanate', ['sonargaon']),
  g('deccan', 'Bahmani aur Deccan Sultanatein', 'بہمنی اور دکن کی سلطنتیں', 'Bahmani and Deccan Sultanates',
    ['gulbarga', 'bidar', 'bijapur', 'hyderabad']),
  g('nusantara', 'Malacca, Aceh aur Brunei Sultanatein', 'ملاکا، آچے اور برونائی کی سلطنتیں', 'Sultanates of Malacca, Aceh and Brunei',
    ['malacca', 'bandaaceh', 'brunei']),
  g('songhai', 'Sultanat-e-Songhai', 'سلطنتِ سونگھائی', 'Songhai Empire', ['gao', 'timbuktu']),
  g('tatar', 'Kazan aur Kirim Khanatein', 'قازان اور کریمیا کی خانیتیں', 'Khanates of Kazan and Crimea',
    ['kazan', 'bakhchysarai']),
  g('safavid', 'Sultanat-e-Safavia', 'سلطنتِ صفویہ', 'Safavid Empire',
    ['ardabil', 'tabriz', 'qazvin', 'isfahan', 'mashhad', 'herat', 'baghdad', 'baku']),
  g('mughal', 'Sultanat-e-Mughlia', 'سلطنتِ مغلیہ', 'Mughal Empire', [
    'delhi', 'agra', 'fatehpursikri', 'lahore', 'ajmer', 'multan', 'peshawar', 'kabul', 'kandahar',
    'thatta', 'srinagar', 'dhaka', 'hyderabad', 'pakpattan', 'uch', 'chishtian',
  ]),
  g('suri', 'Sultanat-e-Suri', 'سلطنتِ سوری', 'Sur Empire', ['sasaram', 'rohtas', 'delhi']),
  g('centralasia', 'Bukhara, Khiva aur Kokand Khanatein', 'بخارا، خیوہ اور خوقند کی خانیتیں', 'Khanates of Bukhara, Khiva and Kokand',
    ['bukhara', 'samarqand', 'khiva', 'kokand', 'tashkent']),
  g('morocco', 'Saadi aur Alawi Sultanat (Maghrib)', 'سعدی اور علوی سلطنت (مغرب)', 'Saadi and Alaouite Morocco',
    ['marrakesh', 'fez', 'meknes', 'rabat']),
  g('afsharqajar', 'Afshari, Zand aur Qajari Silsile', 'افشاری، زند اور قاجاری سلسلے', 'Afsharid, Zand and Qajar Dynasties',
    ['mashhad', 'shiraz', 'tehran', 'tabriz', 'isfahan', 'herat']),
  g('durrani', 'Sultanat-e-Durrania', 'سلطنتِ درانیہ', 'Durrani Empire', ['kandahar', 'kabul', 'peshawar', 'herat']),
  g('yemen', 'Yemen aur Hadramawt ki Riyasatein', 'یمن اور حضرموت کی ریاستیں', 'States of Yemen and Hadramawt', ['sanaa', 'tarim']),
  g('oman', 'Saltanat-e-Oman aur Zanzibar', 'سلطنتِ عمان اور زنجبار', 'Sultanate of Oman and Zanzibar', ['muscat', 'zanzibar']),
  g('mysore', 'Saltanat-e-Khudadad (Mysore)', 'سلطنتِ خداداد (میسور)', 'Kingdom of Mysore under Tipu Sultan', ['srirangapatna']),
  g('bahawalpur', 'Riyasat-e-Bahawalpur', 'ریاستِ بہاولپور', 'Bahawalpur State', ['bahawalpur', 'uch', 'chishtian']),
  g('awadh', 'Riyasat-e-Awadh', 'ریاستِ اودھ', 'Awadh State', ['lucknow']),
  g('hyderabad', 'Riyasat-e-Hyderabad (Asaf Jahi)', 'ریاستِ حیدرآباد (آصف جاہی)', 'Hyderabad State (Asaf Jahi)', ['hyderabad']),
  g('sokoto', 'Khilafat-e-Sokoto', 'خلافتِ سوکوتو', 'Sokoto Caliphate', ['sokoto']),
  g('auliya', 'Barr-e-Azeem ke Auliya', 'برِ عظیم کے اولیاء', 'Sufi Saints of the Barr-e-Azeem',
    ['chishtian', 'pakpattan', 'ajmer', 'uch', 'multan', 'delhi', 'lahore']),
  g('world', 'Duniya ke Shehar', 'دنیا کے شہر', 'World Cities', [
    'glasgow', 'london', 'manchester', 'birmingham', 'paris', 'brussels', 'amsterdam', 'berlin', 'moscow',
    'newyork', 'chicago', 'toronto', 'sydney', 'capetown', 'lagos', 'nairobi', 'riyadh', 'dubai', 'doha',
    'kuwait', 'karachi', 'islamabad', 'faisalabad', 'kualalumpur', 'singapore', 'jakarta', 'tokyo',
  ]),
];

/** Cities shown on the Shehar tab the first time the app opens. */
export const DEFAULT_WORLD_CITIES = [
  'makkah', 'madinah', 'alquds', 'istanbul', 'bursa', 'chishtian', 'konya', 'samarqand', 'lahore', 'cairo',
];
