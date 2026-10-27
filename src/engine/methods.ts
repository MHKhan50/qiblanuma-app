// Calculation methods. Angles are the published twilight depressions of each
// authority (see docs/RESEARCH_NOTES.md for sources). A method only decides
// Fajr and Isha; the Asr school is chosen separately.

export type MethodId = 'karachi' | 'mwl' | 'isna' | 'egypt' | 'makkah' | 'tehran' | 'turkey';
export type AsrSchool = 'hanafi' | 'shafi';
export type HighLatitudeRule = 'none' | 'angleBased' | 'seventhOfNight' | 'middleOfNight';
export type PrayerName = 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export interface Method {
  id: MethodId;
  name: string;
  fajrAngle: number;
  /** Isha twilight angle, used when ishaMinutes is not set. */
  ishaAngle: number;
  /** Fixed minutes after Maghrib for Isha (Umm al-Qura). */
  ishaMinutes?: number;
  /** Maghrib depression angle; omitted means Maghrib is sunset. */
  maghribAngle?: number;
}

export const METHODS: Record<MethodId, Method> = {
  karachi: { id: 'karachi', name: 'University of Islamic Sciences, Karachi', fajrAngle: 18, ishaAngle: 18 },
  mwl: { id: 'mwl', name: 'Muslim World League', fajrAngle: 18, ishaAngle: 17 },
  isna: { id: 'isna', name: 'Islamic Society of North America', fajrAngle: 15, ishaAngle: 15 },
  egypt: { id: 'egypt', name: 'Egyptian General Authority of Survey', fajrAngle: 19.5, ishaAngle: 17.5 },
  makkah: { id: 'makkah', name: 'Umm al-Qura, Makkah', fajrAngle: 18.5, ishaAngle: 0, ishaMinutes: 90 },
  tehran: { id: 'tehran', name: 'Institute of Geophysics, Tehran', fajrAngle: 17.7, ishaAngle: 14, maghribAngle: 4.5 },
  // Angles only. The official Diyanet timetable also adds fixed safety
  // minutes (temkin) per prayer, which users can set as adjustments.
  turkey: { id: 'turkey', name: 'Diyanet angles (Turkey, without temkin)', fajrAngle: 18, ishaAngle: 17 },
};

export interface Settings {
  method: MethodId;
  asrSchool: AsrSchool;
  highLatitudeRule: HighLatitudeRule;
  /** Minutes added to each computed time (can be negative). */
  adjustments: Record<PrayerName, number>;
  /** Observer elevation in metres; lowers sunrise and raises sunset. */
  elevation: number;
}

export const ZERO_ADJUSTMENTS: Record<PrayerName, number> = {
  fajr: 0, sunrise: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0,
};

export const DEFAULT_SETTINGS: Settings = {
  method: 'karachi',
  asrSchool: 'hanafi',
  highLatitudeRule: 'angleBased',
  adjustments: { ...ZERO_ADJUSTMENTS },
  elevation: 0,
};

export const PRAYER_ORDER: PrayerName[] = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];
