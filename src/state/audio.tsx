import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { globalAyah, nextAyah, prevAyah, RECITERS } from '../data/quran';
import { useSettings } from './settings';

// Recitation player. Audio streams ayah by ayah from the reciter's files, so
// the reader can highlight the ayah being recited and voice commands can move
// between ayahs. Needs an internet connection.

export interface Pos { sura: number; aya: number }

/** Set while a guided sequence (e.g. Khatam Sharif) is playing, so hands-free mode does not interrupt it. */
export const sequence = { active: false };

interface AudioCtx {
  available: boolean;
  playing: boolean;
  pos: Pos | null;
  /** Increases each time a requested range finishes playing. */
  finished: number;
  reciterName: string;
  playRange: (start: Pos, end?: Pos) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  next: () => void;
  previous: () => void;
  repeat: () => void;
}

const Ctx = createContext<AudioCtx | null>(null);

const after = (a: Pos, b: Pos) => a.sura > b.sura || (a.sura === b.sura && a.aya > b.aya);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useSettings();
  const reciter = RECITERS.find((r) => r.id === settings.reciter) ?? RECITERS[0];
  const player = useRef<AudioPlayer | null>(null);
  const [playing, setPlaying] = useState(false);
  const [pos, setPos] = useState<Pos | null>(null);
  const [finished, setFinished] = useState(0);
  const state = useRef<{ pos: Pos | null; end: Pos | null; left: number }>({ pos: null, end: null, left: 0 });
  // The player's listener is created once, so it calls the latest advance() through a ref.
  const advanceRef = useRef<() => void>(() => undefined);

  const load = useCallback((p: Pos) => {
    if (!reciter) return;
    if (!player.current) {
      player.current = createAudioPlayer(null);
      player.current.addListener('playbackStatusUpdate', (s: { didJustFinish?: boolean }) => {
        if (s.didJustFinish) advanceRef.current();
      });
    }
    state.current.pos = p;
    setPos(p);
    player.current.replace({ uri: `${reciter.base}${globalAyah(p.sura, p.aya)}.mp3` });
    player.current.play();
    setPlaying(true);
  }, [reciter]);

  const stop = useCallback(() => {
    player.current?.pause();
    state.current = { pos: null, end: null, left: 0 };
    setPlaying(false);
    setPos(null);
  }, []);

  // Moves on when an ayah finishes: repeat it if asked, else the next ayah until the end of the range.
  function advance() {
    const { pos: p, end } = state.current;
    if (!p) return;
    if (state.current.left > 1) {
      state.current.left -= 1;
      load(p);
      return;
    }
    state.current.left = Math.max(1, settings.repeatEach);
    const n = nextAyah(p.sura, p.aya);
    if (!n || (end && after(n, end))) { stop(); setFinished((f) => f + 1); return; }
    load(n);
  }
  advanceRef.current = advance;

  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true, shouldPlayInBackground: true }).catch(() => undefined);
    return () => { player.current?.remove(); player.current = null; };
  }, []);

  const value = useMemo<AudioCtx>(() => ({
    available: !!reciter,
    playing,
    pos,
    finished,
    reciterName: reciter?.name ?? '',
    playRange: (start, end) => {
      state.current = { pos: start, end: end ?? null, left: Math.max(1, settings.repeatEach) };
      load(start);
    },
    pause: () => { player.current?.pause(); setPlaying(false); },
    resume: () => { if (state.current.pos) { player.current?.play(); setPlaying(true); } },
    stop,
    next: () => { const p = state.current.pos; const n = p && nextAyah(p.sura, p.aya); if (n) load(n); },
    previous: () => { const p = state.current.pos; const n = p && prevAyah(p.sura, p.aya); if (n) load(n); },
    repeat: () => { const p = state.current.pos; if (p) load(p); },
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [reciter, playing, pos, finished, load, stop, settings.repeatEach]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAudio(): AudioCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error('useAudio must be used inside AudioProvider');
  return c;
}

export function runControl(a: AudioCtx, action: 'stop' | 'pause' | 'resume' | 'next' | 'previous' | 'repeat'): void {
  if (action === 'stop') a.stop();
  else if (action === 'pause') a.pause();
  else if (action === 'resume') a.resume();
  else if (action === 'next') a.next();
  else if (action === 'previous') a.previous();
  else a.repeat();
}
