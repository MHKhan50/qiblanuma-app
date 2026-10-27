import { AmiriQuran_400Regular } from '@expo-google-fonts/amiri-quran';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import HomeScreen, { type Screen } from './src/screens/HomeScreen';
import QiblaScreen from './src/screens/QiblaScreen';
import TasbeehScreen from './src/screens/TasbeehScreen';
import DuasScreen from './src/screens/DuasScreen';
import { KhatamScreen, MaktabScreen, ZakatScreen } from './src/screens/FamilyScreens';
import { useAdhanReminders } from './src/state/useAdhanReminders';
import QuranScreen from './src/screens/QuranScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import TodayScreen from './src/screens/TodayScreen';
import WorldScreen from './src/screens/WorldScreen';
import { SettingsProvider, useSettings } from './src/state/settings';
import { usePlace } from './src/state/usePlace';
import type { StringKey } from './src/i18n/strings';
import { INDOPAK_FONT } from './src/data/quran/fonts';
import * as Speech from 'expo-speech';
import { QURAN } from './src/data/quran';
import { parseVoiceCommand, type VoiceTarget } from './src/data/quran/voice';
import { AudioProvider, runControl, sequence, useAudio } from './src/state/audio';
import MiniPlayer from './src/ui/MiniPlayer';
import SufiIcon, { type IconName } from './src/ui/SufiIcon';
import { useVoice } from './src/state/useVoice';
import { SPEECH_LANG } from './src/i18n/strings';
import { JournalScreen, NearbyScreen, TimetableScreen } from './src/screens/ExtraScreens';
import { BabyNamesScreen, MirathScreen, UshrScreen } from './src/screens/CalcScreens';
import { CalendarScreen, DuaLibraryScreen, HajjScreen, KhatamSharifScreen, KidsScreen, NamesScreen, TarbiyatScreen, TrackerScreen } from './src/screens/LearnScreens';

type Tab = Screen;
const TABS: { id: Tab; label: StringKey; icon: IconName }[] = [
  { id: 'home', label: 'tabHome', icon: 'home' },
  { id: 'quran', label: 'tabQuran', icon: 'quran' },
  { id: 'qibla', label: 'tabQibla', icon: 'qibla' },
  { id: 'tasbeeh', label: 'tasbeeh', icon: 'dervish' },
  { id: 'settings', label: 'tabSettings', icon: 'gear' },
];

function Shell() {
  const { t, colors, settings, rtl } = useSettings();
  const [tab, setTab] = useState<Tab>('home');
  const place = usePlace();
  useAdhanReminders(place);
  const audio = useAudio();
  const [khatamAuto, setKhatamAuto] = useState(0);
  const [quranRequest, setQuranRequest] = useState<(VoiceTarget & { autoplay?: boolean }) | null>(null);

  const lang = SPEECH_LANG[settings.language];
  const voice = useVoice(lang);

  // Speak a prompt, then listen. Used by the hands-free mode for blind users.
  // restart() always starts a fresh session, so the microphone never gets stuck.
  const askAndListen = (message: string) => {
    audio.pause();
    Speech.stop();
    Speech.speak(message, { language: lang, onDone: () => voice.restart(onVoice, onMiss) });
  };
  // Nothing heard: in hands-free mode ask again, otherwise stay quiet.
  function onMiss() {
    if (settings.voiceMode) Speech.speak(t('voiceBusy'), { language: lang, onDone: () => voice.restart(onVoice) });
  }

  // Swipe left or right anywhere on the content to move between the bottom tabs.
  const swipe = useRef(new Animated.Value(0)).current;
  const tabRef = useRef(tab);
  tabRef.current = tab;
  const rtlRef = useRef(rtl);
  rtlRef.current = rtl;
  const pan = useRef(
    PanResponder.create({
      // On a sub-screen (which may have sideways-scrolling chips) only an edge swipe goes back.
      onMoveShouldSetPanResponderCapture: (_e, g) => {
        const sideways = Math.abs(g.dx) > 24 && Math.abs(g.dx) > Math.abs(g.dy) * 2.2;
        if (!sideways) return false;
        if (TABS.some((x) => x.id === tabRef.current)) return true;
        return rtlRef.current ? g.x0 > Dimensions.get('window').width - 40 : g.x0 < 40;
      },
      onPanResponderMove: (_e, g) => swipe.setValue(g.dx * 0.35),
      onPanResponderRelease: (_e, g) => {
        const i = TABS.findIndex((x) => x.id === tabRef.current);
        if (i < 0) {
          const back = rtlRef.current ? g.dx < -60 : g.dx > 60;
          if (back) setTab('home');
          Animated.spring(swipe, { toValue: 0, useNativeDriver: true }).start();
          return;
        }
        let step = 0;
        if (g.dx < -60 || g.vx < -0.5) step = 1;
        else if (g.dx > 60 || g.vx > 0.5) step = -1;
        if (rtlRef.current) step = -step;
        if (step !== 0) {
          const from = i < 0 ? 0 : i;
          const to = Math.max(0, Math.min(TABS.length - 1, from + step));
          setTab(TABS[to].id);
        }
        Animated.spring(swipe, { toValue: 0, useNativeDriver: true, speed: 20, bounciness: 4 }).start();
      },
      onPanResponderTerminate: () => Animated.spring(swipe, { toValue: 0, useNativeDriver: true }).start(),
    }),
  ).current;

  // Voice-first use: open and play what was asked, or control the recitation,
  // and say back what is happening for people who cannot see the screen.
  function onVoice(text: string) {
    if (/ختم\s*شریف|khatam\s*shar|khatm\s*shar|fatiha khwani|فاتحہ خوانی/i.test(text)) {
      Speech.speak(t('khatamSharif'), { language: lang });
      setKhatamAuto((n) => n + 1);
      setTab('khatamSharif');
      return;
    }
    const c = parseVoiceCommand(text, QURAN.suras);
    if (!c) {
      if (settings.voiceMode) askAndListen(t('notUnderstood'));
      else Speech.speak(t('notUnderstood'), { language: lang });
      return;
    }
    if (c.type === 'control') { runControl(audio, c.action); return; }
    const label = c.type === 'juz' ? `${t('para')} ${c.juz}` : QURAN.suras[c.sura - 1]?.tname ?? '';
    Speech.speak(`${t('playing')} ${label}`, { language: lang });
    setQuranRequest({ ...c, autoplay: settings.voiceAutoplay || settings.voiceMode });
    setTab('quran');
  }

  // Hands-free mode: greet and listen when the app opens, and ask again when a recitation ends.
  const greeted = useRef(false);
  useEffect(() => {
    if (settings.voiceMode && voice.available && !greeted.current) {
      greeted.current = true;
      askAndListen(t('greet'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.voiceMode, voice.available]);
  // Optional recitation of Al-Fatiha 1:5 when the app opens (off by default; not in hands-free mode,
  // which greets with its own question).
  const opened = useRef(false);
  useEffect(() => {
    if (!opened.current && settings.openingRecitation && !settings.voiceMode && audio.available && QURAN.suras.length) {
      opened.current = true;
      audio.playRange({ sura: 1, aya: 5 }, { sura: 1, aya: 5 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.openingRecitation, audio.available]);
  useEffect(() => {
    if (settings.voiceMode && voice.available && audio.finished > 0 && !sequence.active) askAndListen(t('finishedAsk'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audio.finished]);
  const dark = colors.bg === '#0B1418';

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: colors.bg }]} edges={['top', 'bottom']}>
      <StatusBar style={dark ? 'light' : 'dark'} />
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        {TABS.some((x) => x.id === tab) ? (
          <Text style={[styles.brand, { color: colors.accent }]}>{t('appName')}</Text>
        ) : (
          <Pressable accessibilityRole="button" onPress={() => setTab('home')}>
            <Text style={[styles.brand, { color: colors.accent }]}>‹ {t('back')}</Text>
          </Pressable>
        )}
      </View>
      <Animated.View style={[styles.flex, { transform: [{ translateX: swipe }] }]} {...pan.panHandlers}>
        {tab === 'home' && <HomeScreen place={place} open={(s) => { setKhatamAuto(0); setTab(s); }} onVoice={onVoice} />}
        {tab === 'times' && <TodayScreen place={place} />}
        {tab === 'tasbeeh' && <TasbeehScreen />}
        {tab === 'duas' && <DuasScreen />}
        {tab === 'maktab' && <MaktabScreen />}
        {tab === 'khatam' && <KhatamScreen />}
        {(tab === 'halima' || tab === 'tarbiyat') && <TarbiyatScreen />}
        {tab === 'kids' && <KidsScreen />}
        {tab === 'khatamSharif' && <KhatamSharifScreen key={khatamAuto} autoPlay={khatamAuto > 0} />}
        {tab === 'duaLibrary' && <DuaLibraryScreen />}
        {tab === 'names' && <NamesScreen />}
        {tab === 'calendar' && <CalendarScreen timeZone={place.status === 'ready' ? place.place.timeZone : 'UTC'} />}
        {tab === 'tracker' && <TrackerScreen timeZone={place.status === 'ready' ? place.place.timeZone : 'UTC'} />}
        {tab === 'hajj' && <HajjScreen />}
        {tab === 'babyNames' && <BabyNamesScreen />}
        {tab === 'ushr' && <UshrScreen />}
        {tab === 'mirath' && <MirathScreen />}
        {tab === 'nearby' && <NearbyScreen place={place} />}
        {tab === 'timetable' && <TimetableScreen place={place} />}
        {tab === 'journal' && <JournalScreen />}
        {tab === 'zakat' && <ZakatScreen />}
        {tab === 'quran' && <QuranScreen request={quranRequest} onHandled={() => setQuranRequest(null)} />}
        {tab === 'qibla' && <QiblaScreen place={place} />}
        {tab === 'world' && <WorldScreen />}
        {tab === 'settings' && <SettingsScreen />}
        {settings.voiceMode && voice.available && (
          // In hands-free mode the whole content area is one big "talk" button;
          // the tab bar stays reachable so the mode can be switched off.
          <Pressable
            style={StyleSheet.absoluteFill}
            accessibilityRole="button"
            accessibilityLabel={t('tapToTalk')}
            onPress={() => { audio.pause(); Speech.stop(); voice.restart(onVoice, onMiss); }}
          />
        )}
      </Animated.View>
      <MiniPlayer />
      <View
        accessibilityRole="tablist"
        style={[styles.tabs, { borderTopColor: colors.border, backgroundColor: colors.card, flexDirection: rtl ? 'row-reverse' : 'row' }]}
      >
        {TABS.map(({ id, label }) => (
          <Pressable
            key={id}
            accessibilityRole="tab"
            accessibilityState={{ selected: tab === id }}
            onPress={() => setTab(id)}
            style={styles.tab}
          >
            <View style={[styles.tabPill, tab === id && { backgroundColor: colors.accent + '22' }]}>
              <View style={{ opacity: tab === id ? 1 : 0.5 }}>
                <SufiIcon name={TABS.find((x) => x.id === id)!.icon} size={26} bare tint={tab === id ? colors.accent : colors.muted} />
              </View>
            </View>
            <Text style={{ color: tab === id ? colors.accent : colors.muted, fontWeight: tab === id ? '700' : '400', fontSize: 11, marginTop: 2 }} numberOfLines={1}>
              {t(label)}
            </Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  // Quran fonts load in the background; text shows in the system font until ready.
  useFonts({
    AmiriQuran: AmiriQuran_400Regular,
    ...(INDOPAK_FONT !== null ? { IndoPakNastaleeq: INDOPAK_FONT } : {}),
  });
  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <AudioProvider>
          <Shell />
        </AudioProvider>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: { paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth },
  brand: { fontSize: 22, fontWeight: '700', letterSpacing: 0.5 },
  tabs: { borderTopWidth: StyleSheet.hairlineWidth, paddingTop: 6, paddingBottom: 4 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 4 },
  tabPill: { paddingHorizontal: 16, paddingVertical: 4, borderRadius: 16 },
});
