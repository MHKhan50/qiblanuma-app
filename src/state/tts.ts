import * as Speech from 'expo-speech';
import { Alert, Linking, Platform } from 'react-native';

// Speaking Arabic and Urdu through the phone's text-to-speech engine.
// The duas, Qaida letters and 99 names were silent on phones that have no
// Arabic voice installed: expo-speech then fails quietly. Here we look for a
// matching voice first, pass it explicitly, and if the phone has none we say
// so and offer to open the voice settings (Google: "Install voice data").

type Voice = { identifier: string; language: string; quality?: string };
let voices: Voice[] | null = null;
let warned = false;

async function loadVoices(): Promise<Voice[]> {
  if (voices) return voices;
  try {
    voices = ((await Speech.getAvailableVoicesAsync()) as Voice[]) ?? [];
  } catch {
    voices = [];
  }
  return voices;
}

function best(list: Voice[], prefix: string): Voice | undefined {
  const m = list.filter((v) => v.language?.toLowerCase().replace('_', '-').startsWith(prefix));
  return m.find((v) => v.quality === 'Enhanced') ?? m[0];
}

function openVoiceSettings() {
  if (Platform.OS === 'android') {
    Linking.sendIntent('com.android.settings.TTS_SETTINGS').catch(() => Linking.openSettings());
  } else {
    Linking.openURL('App-Prefs:root=ACCESSIBILITY').catch(() => Linking.openSettings());
  }
}

function warnMissing(lang: 'ar' | 'ur') {
  if (warned) return;
  warned = true;
  const what = lang === 'ar' ? 'عربی (Arabic)' : 'اردو (Urdu)';
  Alert.alert(
    `${what} آواز موجود نہیں`,
    `آپ کے فون میں ${what} آواز انسٹال نہیں، اس لیے آواز نہیں آ رہی۔\n\nSettings › Text-to-speech › Google › Install voice data › ${lang === 'ar' ? 'Arabic' : 'Urdu'} ڈاؤن لوڈ کریں (ایک بار)۔`,
    [{ text: 'بعد میں', style: 'cancel' }, { text: 'Settings کھولیں', onPress: openVoiceSettings }],
  );
}

export interface SpeakOptions { rate?: number; onDone?: () => void }

/** Speaks text in the given language ('ar', 'ur', 'en', 'fa', 'tr'), using an installed voice. */
export async function speak(text: string, lang: string, opts: SpeakOptions = {}): Promise<void> {
  const prefix = lang.slice(0, 2).toLowerCase();
  const list = await loadVoices();
  const v = best(list, prefix);
  if (!v && list.length > 0 && (prefix === 'ar' || prefix === 'ur')) warnMissing(prefix);
  Speech.speak(text, {
    language: v?.language ?? lang,
    voice: v?.identifier,
    rate: opts.rate ?? 0.85,
    onDone: opts.onDone,
    onError: () => { if (prefix === 'ar' || prefix === 'ur') warnMissing(prefix); opts.onDone?.(); },
  });
}

/** Arabic, with Quran-style marks such as (3) or ۔ separators read naturally. */
export function speakArabic(text: string, opts: SpeakOptions = {}): Promise<void> {
  Speech.stop();
  const clean = text.replace(/\(\d+\)/g, '').replace(/[﴿﴾]/g, ' ');
  return speak(clean, 'ar-SA', { rate: opts.rate ?? 0.8, onDone: opts.onDone });
}

export function stopSpeaking() { Speech.stop(); }
