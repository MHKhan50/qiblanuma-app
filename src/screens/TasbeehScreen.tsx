import * as Haptics from 'expo-haptics';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSettings } from '../state/settings';
import { Chip } from '../ui/components';

// Common adhkar. Arabic is the standard wording; the transliteration is for
// readers who do not read Arabic.
export const ADHKAR = [
  { id: 'subhanallah', ar: 'سُبْحَانَ ٱللَّٰهِ', roman: 'SubhanAllah' },
  { id: 'alhamdulillah', ar: 'ٱلْحَمْدُ لِلَّٰهِ', roman: 'Alhamdulillah' },
  { id: 'allahuakbar', ar: 'ٱللَّٰهُ أَكْبَرُ', roman: 'Allahu Akbar' },
  { id: 'tahleel', ar: 'لَا إِلَٰهَ إِلَّا ٱللَّٰهُ', roman: 'La ilaha illallah' },
  { id: 'istighfar', ar: 'أَسْتَغْفِرُ ٱللَّٰهَ', roman: 'Astaghfirullah' },
  { id: 'durood', ar: 'ٱللَّٰهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ', roman: 'Allahumma salli ala Muhammad' },
];

const TARGETS = [33, 34, 100, 0];

export default function TasbeehScreen() {
  const { settings, update, t, colors } = useSettings();
  const tb = settings.tasbeeh;
  const dhikr = ADHKAR.find((d) => d.id === tb.dhikr) ?? ADHKAR[0];
  const count = tb.counts[dhikr.id] ?? 0;
  const done = tb.target > 0 && count >= tb.target;

  const set = (patch: Partial<typeof tb>) => update({ tasbeeh: { ...tb, ...patch } });
  const tap = () => {
    const next = count + 1;
    set({ counts: { ...tb.counts, [dhikr.id]: next } });
    if (tb.target > 0 && next === tb.target) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.pad}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
        {ADHKAR.map((d) => (
          <Chip key={d.id} label={d.roman} active={d.id === dhikr.id} onPress={() => set({ dhikr: d.id })} />
        ))}
      </ScrollView>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.gold }]}>
        <Text style={[styles.arabic, { color: colors.accent, fontFamily: 'AmiriQuran' }]}>{dhikr.ar}</Text>
        <Text style={{ color: colors.muted }}>{dhikr.roman}</Text>
      </View>

      <View style={styles.targets}>
        {TARGETS.map((n) => (
          <Chip key={n} label={n === 0 ? '∞' : String(n)} active={tb.target === n} onPress={() => set({ target: n })} />
        ))}
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${dhikr.roman} ${count}`}
        onPress={tap}
        style={({ pressed }) => [
          styles.counter,
          { backgroundColor: done ? colors.gold : colors.accent, transform: [{ scale: pressed ? 0.96 : 1 }] },
        ]}
      >
        <Text style={[styles.countText, { color: colors.card }]}>{count}</Text>
        {tb.target > 0 && <Text style={{ color: colors.card, opacity: 0.85 }}>/ {tb.target}</Text>}
      </Pressable>

      <Pressable accessibilityRole="button" onPress={() => set({ counts: { ...tb.counts, [dhikr.id]: 0 } })} style={styles.reset}>
        <Text style={{ color: colors.danger, fontWeight: '600' }}>{t('reset')}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pad: { padding: 16, alignItems: 'stretch' },
  card: { borderWidth: 1.5, borderRadius: 20, padding: 18, alignItems: 'center', marginBottom: 14 },
  arabic: { fontSize: 34, lineHeight: 64, writingDirection: 'rtl', textAlign: 'center' },
  targets: { flexDirection: 'row', justifyContent: 'center', marginBottom: 18 },
  counter: { alignSelf: 'center', width: 220, height: 220, borderRadius: 110, alignItems: 'center', justifyContent: 'center' },
  countText: { fontSize: 64, fontWeight: '700', fontVariant: ['tabular-nums'] },
  reset: { alignSelf: 'center', marginTop: 18, padding: 10 },
});
