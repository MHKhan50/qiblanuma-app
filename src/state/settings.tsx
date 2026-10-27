import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { DEFAULT_SETTINGS, type Settings } from '../engine/methods';
import { isRTL, translate, type Language, type StringKey } from '../i18n/strings';
import { DARK, LIGHT, type Palette } from '../ui/theme';

export type ThemeMode = 'system' | 'light' | 'dark';

export interface AppSettings {
  prayer: Settings;
  language: Language;
  theme: ThemeMode;
  use24h: boolean;
  locationMode: 'gps' | 'manual';
  manualCityId: string;
}

export const DEFAULT_APP_SETTINGS: AppSettings = {
  prayer: DEFAULT_SETTINGS,
  language: 'roman',
  theme: 'system',
  use24h: false,
  locationMode: 'gps',
  manualCityId: 'glasgow',
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
