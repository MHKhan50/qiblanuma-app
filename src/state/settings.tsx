import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { DEFAULT_SETTINGS, type Settings } from '../engine/methods';
import { isRTL, translate, type Language, type StringKey } from '../i18n/strings';
import { DARK, LIGHT, type Palette } from '../ui/theme';
import { DEFAULT_WORLD_CITIES } from '../data/groups';
import { cleanList } from './cityList';
import type { TrackerLog } from '../engine/tracker';

export type ThemeMode = 'system' | 'light' | 'dark';

export interface AppSettings {
  prayer: Settings;
  language: Language;
  theme: ThemeMode;
  use24h: boolean;
  locationMode: 'gps' | 'manual';
  manualCityId: string;
  /** Ids shown on the Shehar tab, in the user's order. */
  worldCities: string[];
  /** Last ayah seen in the Quran reader. */
  lastRead: { sura: number; aya: number } | null;
  quranFontSize: number;
  quranScript: 'uthmani' | 'indopak';
  /** 'lines' flows ayahs like a printed mushaf; 'ayahs' shows one ayah per block. */
  quranView: 'lines' | 'ayahs';
  /** Days added to the calculated Hijri date to match local moon sighting. */
  hijriOffset: number;
  tasbeeh: { dhikr: string; target: number; counts: Record<string, number> };
  bookmarks: { sura: number; aya: number }[];
  /** Which prayers get a reminder at their time. */
  adhan: Record<'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha', boolean>;
  reciter: string;
  /** How many times each ayah is recited (for memorising). */
  repeatEach: number;
  /** A spoken request starts the recitation straight away (for people who cannot see the screen). */
  voiceAutoplay: boolean;
  /** Hands-free mode: the app greets, listens on start, and a tap anywhere starts listening. */
  voiceMode: boolean;
  /** Recite Al-Fatiha 1:5 once when the app opens. */
  openingRecitation: boolean;
  /** Fatima section: paras read in the current khatam, and khatams completed. */
  khatam: { paras: boolean[]; completed: number };
  /** Ids of duas the user starred. */
  favDuas: string[];
  /** Notify the evening before and the morning of Islamic days and heroes' days. */
  eventReminders: boolean;
  /** Translation shown under each ayah in the ayah view. */
  quranTranslation: 'none' | 'ur' | 'en';
  /** Personal journal entries, newest first. */
  journal: { id: string; date: string; text: string }[];
  /** Daily deen tracker, last 90 days. */
  tracker: TrackerLog;
}

export const DEFAULT_APP_SETTINGS: AppSettings = {
  prayer: DEFAULT_SETTINGS,
  language: 'roman',
  theme: 'system',
  use24h: false,
  locationMode: 'gps',
  manualCityId: 'glasgow',
  worldCities: DEFAULT_WORLD_CITIES,
  lastRead: null,
  quranFontSize: 26,
  quranScript: 'uthmani',
  quranView: 'lines',
  hijriOffset: 0,
  tasbeeh: { dhikr: 'subhanallah', target: 33, counts: {} },
  bookmarks: [],
  adhan: { fajr: true, dhuhr: true, asr: true, maghrib: true, isha: true },
  reciter: 'ar.alafasy',
  repeatEach: 1,
  voiceAutoplay: true,
  voiceMode: false,
  openingRecitation: true,
  khatam: { paras: Array(30).fill(false), completed: 0 },
  favDuas: [],
  eventReminders: true,
  quranTranslation: 'ur',
  journal: [],
  tracker: {},
};

const STORAGE_KEY = 'qiblanuma.settings.v1';

interface Ctx {
  settings: AppSettings;
  update: (patch: Partial<AppSettings>) => void;
  t: (key: StringKey) => string;
  rtl: boolean;
  colors: Palette;
}

const SettingsContext = createContext<Ctx | null>(null);

/** Merge stored JSON over defaults so new fields added later get defaults. */
export function mergeSettings(stored: unknown): AppSettings {
  if (!stored || typeof stored !== 'object') return DEFAULT_APP_SETTINGS;
  const s = stored as Partial<AppSettings>;
  return {
    ...DEFAULT_APP_SETTINGS,
    ...s,
    prayer: {
      ...DEFAULT_SETTINGS,
      ...(s.prayer ?? {}),
      adjustments: { ...DEFAULT_SETTINGS.adjustments, ...(s.prayer?.adjustments ?? {}) },
    },
    worldCities: cleanList(s.worldCities, DEFAULT_WORLD_CITIES),
    adhan: { ...DEFAULT_APP_SETTINGS.adhan, ...(s.adhan ?? {}) },
    khatam: Array.isArray(s.khatam?.paras) && s.khatam.paras.length === 30 ? s.khatam : DEFAULT_APP_SETTINGS.khatam,
    bookmarks: Array.isArray(s.bookmarks) ? s.bookmarks : [],
    journal: Array.isArray(s.journal) ? s.journal : [],
    favDuas: Array.isArray(s.favDuas) ? s.favDuas.filter((x) => typeof x === 'string') : [],
    tracker: s.tracker && typeof s.tracker === 'object' && !Array.isArray(s.tracker) ? s.tracker : {},
    language: ['en', 'ur', 'roman', 'fa', 'tr'].includes(s.language as string) ? (s.language as AppSettings['language']) : DEFAULT_APP_SETTINGS.language,
    tasbeeh: { ...DEFAULT_APP_SETTINGS.tasbeeh, ...(s.tasbeeh ?? {}), counts: { ...(s.tasbeeh?.counts ?? {}) } },
  };
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_APP_SETTINGS);
  const scheme = useColorScheme();

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => { if (raw) setSettings(mergeSettings(JSON.parse(raw))); })
      .catch(() => undefined);
  }, []);

  const update = useCallback((patch: Partial<AppSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => undefined);
      return next;
    });
  }, []);

  const value = useMemo<Ctx>(() => {
    const dark = settings.theme === 'dark' || (settings.theme === 'system' && scheme === 'dark');
    return {
      settings,
      update,
      t: (key) => translate(settings.language, key),
      rtl: isRTL(settings.language),
      colors: dark ? DARK : LIGHT,
    };
  }, [settings, update, scheme]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): Ctx {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used inside SettingsProvider');
  return ctx;
}
