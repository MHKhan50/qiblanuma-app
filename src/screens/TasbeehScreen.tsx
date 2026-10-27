import * as Haptics from 'expo-haptics';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSettings } from '../state/settings';
import { Chip } from '../ui/components';

export { ADHKAR } from '../data/learn/adhkar';
import { ADHKAR, ADHKAR_GROUPS, type AdhkarGroup } from '../data/learn/adhkar';
import { QURAN, QURAN_FONT, arabicNumber } from '../data/quran';

const TARGETS = [3, 7, 10, 33, 34, 100, 313, 450, 1000, 0];

export default function TasbeehScreen() {
  const { settings, update, t, colors } = useSettings();
  const tb = settings.tasbeeh;
  const dhikr = ADHKAR.find((d) => d.id === tb.dhikr) ?? ADHKAR[0];
  const [group, setGroup] = React.useState<AdhkarGroup>(dhikr.group);
  const lang = settings.language;
  const groupLabel = (g: (typeof ADHKAR_GROUPS)[number]) => `${g.emoji} ${lang === 'ur' || lang === 'fa' ? g.ur : lang === 'roman' ? g.roman : g.en}`;
  const arabic = dhikr.quran
    ? (QURAN.suras[dhikr.quran.sura - 1]?.ayahs.slice(dhikr.quran.from - 1, dhikr.quran.to).map((a, i) => `${a} ﴿${arabicNumber(dhikr.quran!.from + i)}﴾`).join(' ') ?? dhikr.roman)
    : dhikr.ar;
  const choose = (id: string) => {
    const d = ADHKAR.find((x) => x.id === id)!;
    update({ tasbeeh: { ...tb, dhikr: id, target: d.target } });
  };
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
      <Text style={{ color: colors.gold, fontSize: 20, fontWeight: '800', textAlign: 'center', marginBottom: 8 }}>{`📿 ${t('muzammil')}`}</Text>
      {/* Groups and adhkar wrap (no sideways scrolling) so a sideways swipe can change tabs. */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 6 }}>
        {ADHKAR_GROUPS.map((g) => <Chip key={g.id} label={groupLabel(g)} active={g.id === group} onPress={() => setGroup(g.id)} />)}
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 }}>
        {ADHKAR.filter((d) => d.group === group).map((d) => (
          <Chip key={d.id} label={`${d.roman.length > 34 ? `${d.roman.slice(0, 32)}…` : d.roman} · ${d.target}`} active={d.id === dhikr.id} onPress={() => choose(d.id)} />
        ))}
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.gold }]}>
        <Text style={[styles.arabic, { color: colors.accent, fontFamily: QURAN_FONT.uthmani, fontSize: arabic.length > 60 ? 24 : 34, lineHeight: arabic.length > 60 ? 48 : 64 }]}>{arabic}</Text>
        <Text style={{ color: colors.muted, textAlign: 'center' }}>{dhikr.roman}</Text>
        <Text style={{ color: colors.text, textAlign: 'center', marginTop: 6, lineHeight: 22, writingDirection: 'rtl' }}>{dhikr.ur}</Text>
        <Text style={{ color: colors.gold, fontSize: 12, marginTop: 4 }}>{`${dhikr.source} · ${dhikr.target}×`}</Text>
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
  targets: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 18 },
  counter: { alignSelf: 'center', width: 220, height: 220, borderRadius: 110, alignItems: 'center', justifyContent: 'center' },
  countText: { fontSize: 64, fontWeight: '700', fontVariant: ['tabular-nums'] },
  reset: { alignSelf: 'center', marginTop: 18, padding: 10 },
});
