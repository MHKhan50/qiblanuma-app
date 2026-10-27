import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import QiblaScreen from './src/screens/QiblaScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import TodayScreen from './src/screens/TodayScreen';
import WorldScreen from './src/screens/WorldScreen';
import { SettingsProvider, useSettings } from './src/state/settings';
import { usePlace } from './src/state/usePlace';
import type { StringKey } from './src/i18n/strings';

type Tab = 'today' | 'qibla' | 'world' | 'settings';
const TABS: { id: Tab; label: StringKey }[] = [
  { id: 'today', label: 'tabToday' },
  { id: 'qibla', label: 'tabQibla' },
  { id: 'world', label: 'tabWorld' },
  { id: 'settings', label: 'tabSettings' },
];

function Shell() {
  const { t, colors, settings, rtl } = useSettings();
  const [tab, setTab] = useState<Tab>('today');
  const place = usePlace();
  const dark = colors.bg === '#0B1418';

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: colors.bg }]} edges={['top', 'bottom']}>
      <StatusBar style={dark ? 'light' : 'dark'} />
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.brand, { color: colors.accent }]}>{t('appName')}</Text>
      </View>
      <View style={styles.flex}>
        {tab === 'today' && <TodayScreen place={place} />}
        {tab === 'qibla' && <QiblaScreen place={place} />}
        {tab === 'world' && <WorldScreen />}
        {tab === 'settings' && <SettingsScreen />}
      </View>
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
  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <Shell />
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
