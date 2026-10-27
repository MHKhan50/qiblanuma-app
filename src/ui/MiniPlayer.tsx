import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { QURAN } from '../data/quran';
import { useAudio } from '../state/audio';
import { useSettings } from '../state/settings';

/** Small player bar above the tabs while a recitation is loaded. */
export default function MiniPlayer() {
  const a = useAudio();
  const { colors } = useSettings();
  if (!a.pos) return null;
  const sura = QURAN.suras[a.pos.sura - 1];
  const btn = (label: string, onPress: () => void, name: string) => (
    <Pressable accessibilityRole="button" accessibilityLabel={name} onPress={onPress} style={styles.btn}>
      <Text style={{ color: colors.card, fontSize: 20 }}>{label}</Text>
    </Pressable>
  );
  return (
    <View style={[styles.bar, { backgroundColor: colors.accent }]} accessibilityLiveRegion="polite">
      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.card, fontWeight: '700' }}>{`${sura?.tname ?? ''} ${a.pos.sura}:${a.pos.aya}`}</Text>
        <Text style={{ color: colors.card, opacity: 0.85, fontSize: 12 }}>{a.reciterName}</Text>
      </View>
      {btn('⏮', a.previous, 'Previous ayah')}
      {a.playing ? btn('⏸', a.pause, 'Pause') : btn('▶', a.resume, 'Play')}
      {btn('⏭', a.next, 'Next ayah')}
      {btn('■', a.stop, 'Stop')}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8 },
  btn: { paddingHorizontal: 10, paddingVertical: 6 },
});
