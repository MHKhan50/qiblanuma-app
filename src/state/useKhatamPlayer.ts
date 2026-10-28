import * as Speech from 'expo-speech';
import { speak } from './tts';
import { useEffect, useRef, useState } from 'react';
import { QURAN } from '../data/quran';
import type { KhatamStep } from '../data/learn/khatamSharif';
import { SPEECH_LANG } from '../i18n/strings';
import { sequence, useAudio } from './audio';
import { useSettings } from './settings';

// Plays the whole Khatam Sharif hands-free, for people who cannot read it:
// before each part it says what comes next (in the app language), then the
// Quran parts are recited by the chosen qari, the durood is read by the phone's
// Arabic voice, and the isaal-e-sawab dua by the phone's Urdu voice. Each part
// is repeated as many times as it is read in the khatam.
export function useKhatamPlayer(steps: KhatamStep[]) {
  const audio = useAudio();
  const { settings } = useSettings();
  const [current, setCurrent] = useState<number | null>(null);
  const st = useRef({ idx: -1, left: 0, waiting: false, lastFinished: 0 });
  const lang = SPEECH_LANG[settings.language];
  const key = settings.language === 'ur' || settings.language === 'fa' ? 'ur' : settings.language === 'roman' ? 'roman' : 'en';

  // Each part is read once; the reader repeats it themselves if they wish.
  const timesOf = (_s: KhatamStep) => 1;
  const titleOf = (s: KhatamStep) => (s.kind === 'quran' ? s.part.title[key] : s.kind === 'recite' ? s.item.title[key] : s.title[key]);

  const finish = () => {
    sequence.active = false;
    st.current.idx = -1;
    setCurrent(null);
  };

  const perform = (i: number) => {
    const s = steps[i];
    if (s.kind === 'quran') {
      if (audio.available) {
        st.current.waiting = true;
        st.current.lastFinished = audio.finished;
        audio.playRange({ sura: s.part.sura, aya: s.part.from }, { sura: s.part.sura, aya: s.part.to });
      } else {
        const text = QURAN.suras[s.part.sura - 1]?.ayahs.slice(s.part.from - 1, s.part.to).join(' ') ?? '';
        void speak(text, 'ar-SA', { rate: 0.8, onDone: () => next.current() });
      }
    } else if (s.kind === 'recite') {
      void speak(s.item.arabic, 'ar-SA', { rate: 0.85, onDone: () => next.current() });
    } else {
      const text = key === 'en' ? s.text.en : s.text.ur;
      void speak(text, key === 'en' ? 'en-GB' : 'ur-PK', { rate: 0.9, onDone: () => next.current() });
    }
  };

  const start = (i: number, announce: boolean) => {
    if (i >= steps.length) {
      Speech.speak(key === 'en' ? 'Khatam Sharif is complete. May Allah accept it.' : 'ختم شریف مکمل ہوا۔ اللہ قبول فرمائے۔', { language: key === 'en' ? 'en-GB' : 'ur-PK' });
      finish();
      return;
    }
    st.current.idx = i;
    setCurrent(i);
    const s = steps[i];
    if (announce) {
      st.current.left = timesOf(s);
      const times = timesOf(s) > 1 ? (key === 'en' ? `, ${timesOf(s)} times` : `، ${timesOf(s)} مرتبہ`) : '';
      void speak(`${titleOf(s)}${times}`, lang, { rate: 0.95, onDone: () => perform(i) });
    } else perform(i);
  };

  // Called when one reading of the current part ends.
  const next = useRef<() => void>(() => undefined);
  next.current = () => {
    const i = st.current.idx;
    if (i < 0) return;
    if (st.current.left > 1) { st.current.left -= 1; start(i, false); return; }
    start(i + 1, true);
  };

  useEffect(() => {
    if (st.current.waiting && audio.finished !== st.current.lastFinished) {
      st.current.waiting = false;
      st.current.lastFinished = audio.finished;
      next.current();
    }
  }, [audio.finished]);

  useEffect(() => () => { if (sequence.active) { Speech.stop(); sequence.active = false; } }, []);

  return {
    current,
    playing: current !== null,
    play: (from = 0) => { Speech.stop(); audio.stop(); sequence.active = true; start(from, true); },
    stop: () => { st.current.idx = -1; st.current.waiting = false; Speech.stop(); audio.stop(); finish(); },
  };
}
