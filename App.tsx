import { AmiriQuran_400Regular } from '@expo-google-fonts/amiri-quran';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import HomeScreen, { type Screen } from './src/screens/HomeScreen';
import QiblaScreen from './src/screens/QiblaScreen';
import TasbeehScreen from './src/screens/TasbeehScreen';
import DuasScreen from './src/screens/DuasScreen';
import { HalimaScreen, KhatamScreen, MaktabScreen, ZakatScreen } from './src/screens/FamilyScreens';
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
import { AudioProvider, runControl, useAudio } from './src/state/audio';
import MiniPlayer from './src/ui/MiniPlayer';
import { useVoice } from './src/state/useVoice';

type Tab = Screen;
const TABS: { id: Tab; label: StringKey }[] = [
  { id: 'home', label: 'tabHome' },
  { id: 'quran', label: 'tabQuran' },
  { id: 'qibla', label: 'tabQibla' },
  { id: 'tasbeeh', label: 'tasbeeh' },
  { id: 'settings', label: 'tabSettings' },
];

function Shell() {
  const { t, colors, settings, rtl } = useSettings();
  const [tab, setTab] = useState<Tab>('home');
  const place = usePlace();
  useAdhanReminders(place);
  const audio = useAudio();
  const [quranRequest, setQuranRequest] = useState<(VoiceTarget & { autoplay?: boolean }) | null>(null);

  const lang = settings.language === 'en' ? 'en-GB' : 'ur-PK';
  const voice = useVoice(lang);

  // Speak a prompt, then listen. Used by the hands-free mode for blind users.
  const askAndListen = (message: string) => {
    audio.pause();
    Speech.stop();
    Speech.speak(message, { language: lang, onDone: () => voice.listen(onVoice) });
  };

  // Voice-first use: open and play what was asked, or control the recitation,
  // and say back what is happening for people who cannot see the screen.
  function onVoice(text: string) {
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
    if (settings.voiceMode && voice.available && audio.finished > 0) askAndListen(t('finishedAsk'));
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
      <View style={styles.flex}>
        {tab === 'home' && <HomeScreen place={place} open={setTab} onVoice={onVoice} />}
        {tab === 'times' && <TodayScreen place={place} />}
        {tab === 'tasbeeh' && <TasbeehScreen />}
        {tab === 'duas' && <DuasScreen />}
        {tab === 'maktab' && <MaktabScreen />}
        {tab === 'khatam' && <KhatamScreen />}
        {tab === 'halima' && <HalimaScreen />}
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
            onPress={() => { audio.pause(); Speech.stop(); voice.listen(onVoice); }}
          />
        )}
      </View>
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
            <Text style={{ color: tab === id ? colors.accent : colors.muted, fontWeight: tab === id ? '700' : '400', fontSize: settings.language === 'ur' ? 16 : 14 }}>
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
  tabs: { borderTopWidth: StyleSheet.hairlineWidth },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 12 },
});
