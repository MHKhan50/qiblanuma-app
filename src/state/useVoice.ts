import { useCallback, useEffect, useRef, useState } from 'react';

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

/** listen() starts one recognition and calls onText with the final transcript. */
export function useVoice(lang: string) {
  const [listening, setListening] = useState(false);
  const subs = useRef<{ remove: () => void }[]>([]);

  const clear = useCallback(() => {
    subs.current.forEach((s) => s.remove());
    subs.current = [];
    setListening(false);
  }, []);

  useEffect(() => clear, [clear]);

  const listen = useCallback(async (onText: (t: string) => void) => {
    if (!speech) return;
    if (listening) { speech.stop(); clear(); return; }
    const perm = await speech.requestPermissionsAsync();
    if (!perm.granted) return;
    clear();
    subs.current = [
      speech.addListener('result', (e: { isFinal: boolean; results: { transcript: string }[] }) => {
        if (e.isFinal && e.results[0]) onText(e.results[0].transcript);
      }),
      speech.addListener('end', clear),
      speech.addListener('error', clear),
    ];
    setListening(true);
    speech.start({ lang, interimResults: false, continuous: false, contextualStrings: HINTS });
  }, [lang, listening, clear]);

  return { available: VOICE_AVAILABLE, listening, listen };
}
