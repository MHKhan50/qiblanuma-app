import { useCallback, useEffect, useState } from 'react';

// Speech recognition through the phone's own service. It is a native module:
// available in the installed app (APK or store build), not inside Expo Go.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let speech: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  speech = require('expo-speech-recognition').ExpoSpeechRecognitionModule;
} catch {
  speech = null;
}

export const VOICE_AVAILABLE = speech !== null;

const HINTS = ['سورہ', 'پارہ', 'آیت', 'یاسین', 'رحمن', 'ملک', 'کہف', 'بقرہ', 'روکو', 'اگلی', 'para', 'surah'];

// One recognition session for the whole app. Earlier every screen had its own
// listeners and its own "listening" flag; when one of them missed the "end"
// event the flag stayed on, the next tap stopped instead of starting, and the
// microphone seemed to stop working. Now there is a single session, a watchdog
// that resets it, and every start first aborts whatever was running.
type Sub = { remove: () => void };
let subs: Sub[] = [];
let active = false;
let watchdog: ReturnType<typeof setTimeout> | null = null;
const watchers = new Set<(on: boolean) => void>();

function setActive(on: boolean) {
  active = on;
  watchers.forEach((w) => w(on));
}

function finish() {
  subs.forEach((s) => { try { s.remove(); } catch { /* already removed */ } });
  subs = [];
  if (watchdog) clearTimeout(watchdog);
  watchdog = null;
  setActive(false);
}

export function stopListening() {
  if (!speech) return;
  try { speech.abort(); } catch { /* not running */ }
  finish();
}

export async function startListening(lang: string, onText: (t: string) => void, onFail?: () => void): Promise<void> {
  if (!speech) return;
  stopListening();
  try {
    const perm = await speech.requestPermissionsAsync();
    if (!perm.granted) { onFail?.(); return; }
  } catch { onFail?.(); return; }
  let got = false;
  subs = [
    speech.addListener('result', (e: { isFinal: boolean; results: { transcript: string }[] }) => {
      if (e.isFinal && e.results[0] && !got) {
        got = true;
        finish();
        onText(e.results[0].transcript);
      }
    }),
    speech.addListener('end', () => { const miss = !got; finish(); if (miss) onFail?.(); }),
    speech.addListener('error', () => { finish(); if (!got) onFail?.(); }),
  ];
  setActive(true);
  // Never stay stuck: give up after 12 seconds.
  watchdog = setTimeout(() => { if (active) { stopListening(); if (!got) onFail?.(); } }, 12000);
  try {
    speech.start({ lang, interimResults: false, continuous: false, contextualStrings: HINTS, androidIntentOptions: { EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS: 1500 } });
  } catch {
    finish();
    onFail?.();
  }
}

/** listen() starts one recognition and calls onText with the final transcript; tapping again stops it. */
export function useVoice(lang: string) {
  const [listening, setListening] = useState(active);
  useEffect(() => {
    watchers.add(setListening);
    return () => { watchers.delete(setListening); };
  }, []);
  const listen = useCallback((onText: (t: string) => void, onFail?: () => void) => {
    if (active) { stopListening(); return; }
    void startListening(lang, onText, onFail);
  }, [lang]);
  /** Always start, even if a session is running (used by hands-free mode). */
  const restart = useCallback((onText: (t: string) => void, onFail?: () => void) => {
    void startListening(lang, onText, onFail);
  }, [lang]);
  return { available: VOICE_AVAILABLE, listening, listen, restart, stop: stopListening };
}
