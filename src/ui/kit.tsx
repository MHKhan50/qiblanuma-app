import * as Speech from 'expo-speech';
import React from 'react';
import { Pressable, ScrollView, Share, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { arabicNumber, QURAN, QURAN_FONT } from '../data/quran';
import { pick, type QuranPart, type Recitation, type Topic, type Tri } from '../data/learn';
import { useAudio } from '../state/audio';
import { useSettings } from '../state/settings';
import SufiIcon, { type IconName } from './SufiIcon';

/** A soft two-colour gradient behind its children. */
export function Gradient({ from, to, style, children, radius = 20 }: { from: string; to: string; style?: ViewStyle; children?: React.ReactNode; radius?: number }) {
  const id = `g${from.replace('#', '')}${to.replace('#', '')}`;
  return (
    <View style={[{ borderRadius: radius, overflow: 'hidden' }, style]}>
      <Svg style={StyleSheet.absoluteFill} preserveAspectRatio="none" viewBox="0 0 100 100">
        <Defs>
          <LinearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={from} />
            <Stop offset="1" stopColor={to} />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100" height="100" fill={`url(#${id})`} />
      </Svg>
      {children}
    </View>
  );
}

/** A feature card: big emoji art, title and optional subtitle. */
export function Tile({ emoji, icon, title, sub, onPress, wide }: { emoji?: string; icon?: IconName; title: string; sub?: string; onPress: () => void; wide?: boolean }) {
  const { colors, rtl } = useSettings();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      style={({ pressed }) => [styles.tile, wide && styles.wide, { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.75 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] }]}
    >
      {icon ? (
        <View style={[styles.tileIcon, rtl ? { left: 8 } : { right: 8 }]}><SufiIcon name={icon} size={50} /></View>
      ) : (
        <Text style={[styles.tileEmoji, rtl ? { left: 10 } : { right: 10 }]}>{emoji}</Text>
      )}
      <Text style={[styles.tileTitle, { color: colors.text, textAlign: rtl ? 'right' : 'left' }]} numberOfLines={2}>{title}</Text>
      {sub ? <Text style={{ color: colors.muted, fontSize: 12, textAlign: rtl ? 'right' : 'left' }} numberOfLines={2}>{sub}</Text> : null}
    </Pressable>
  );
}

export function TileGrid({ children }: { children: React.ReactNode }) {
  const { rtl } = useSettings();
  return <View style={[styles.grid, { flexDirection: rtl ? 'row-reverse' : 'row' }]}>{children}</View>;
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  const { colors, rtl } = useSettings();
  return <Text style={[styles.section, { color: colors.text, textAlign: rtl ? 'right' : 'left' }]}>{children}</Text>;
}

/** Horizontal segmented tabs. */
export function Segments<T extends string>({ items, value, onChange }: { items: { id: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  const { colors } = useSettings();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 4 }}>
      {items.map((it) => {
        const on = it.id === value;
        return (
          <Pressable
            key={it.id}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            onPress={() => onChange(it.id)}
            style={[styles.seg, { backgroundColor: on ? colors.accent : colors.card, borderColor: on ? colors.accent : colors.border }]}
          >
            <Text style={{ color: on ? colors.card : colors.text, fontWeight: on ? '700' : '500' }}>{it.label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const speakArabic = (text: string) => {
  Speech.stop();
  Speech.speak(text.replace(/\(\d+\)/g, ''), { language: 'ar-SA', rate: 0.8 });
};

/** Arabic text with meaning, source, listen, share and favourite. */
export function RecitationCard({ item, index }: { item: Recitation; index?: number }) {
  const { settings, update, t, colors, rtl } = useSettings();
  const fav = settings.favDuas.includes(item.id);
  const title = pick(item.title, settings.language);
  const meaning = pick(item.meaning, settings.language);
  const align = rtl ? 'right' : 'left';
  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.cardHead, { flexDirection: rtl ? 'row-reverse' : 'row' }]}>
        {index !== undefined && (
          <View style={[styles.badge, { borderColor: colors.gold }]}><Text style={{ color: colors.gold, fontWeight: '700' }}>{index}</Text></View>
        )}
        <Text style={[styles.cardTitle, { color: colors.accent, textAlign: align }]}>{title}</Text>
        {item.times ? <Text style={{ color: colors.gold, fontWeight: '700' }}>{`${item.times}×`}</Text> : null}
      </View>
      <Text style={[styles.arabic, { color: colors.text, fontFamily: QURAN_FONT.uthmani, fontSize: settings.quranFontSize - 2 }]}>{item.arabic}</Text>
      <Text style={[styles.meaning, { color: colors.text, textAlign: align, writingDirection: rtl ? 'rtl' : 'ltr' }]}>{meaning}</Text>
      {item.source ? <Text style={{ color: colors.muted, fontSize: 12, marginTop: 6, textAlign: align }}>{`${t('source')}: ${item.source}`}</Text> : null}
      <View style={[styles.actions, { flexDirection: rtl ? 'row-reverse' : 'row' }]}>
        <Action label={`🔊 ${t('listen')}`} onPress={() => speakArabic(item.arabic)} />
        <Action label="↗ Share" onPress={() => { void Share.share({ message: `${title}\n\n${item.arabic}\n\n${meaning}${item.source ? `\n(${item.source})` : ''}\n\n— Qiblanuma` }); }} />
        <Action
          label={fav ? '★' : '☆'}
          onPress={() => update({ favDuas: fav ? settings.favDuas.filter((x) => x !== item.id) : [...settings.favDuas, item.id] })}
        />
      </View>
    </View>
  );
}

function Action({ label, onPress }: { label: string; onPress: () => void }) {
  const { colors } = useSettings();
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={[styles.action, { borderColor: colors.border }]}>
      <Text style={{ color: colors.accent, fontWeight: '600' }}>{label}</Text>
    </Pressable>
  );
}

/** A Quran passage from the bundled Tanzil text, playable with the chosen reciter. */
export function QuranPassage({ part, index }: { part: QuranPart; index?: number }) {
  const { settings, colors, rtl } = useSettings();
  const audio = useAudio();
  const sura = QURAN.suras[part.sura - 1];
  if (!sura) return null;
  const text = sura.ayahs.slice(part.from - 1, part.to).map((a, i) => `${a} ﴿${arabicNumber(part.from + i)}﴾`).join(' ');
  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.cardHead, { flexDirection: rtl ? 'row-reverse' : 'row' }]}>
        {index !== undefined && (
          <View style={[styles.badge, { borderColor: colors.gold }]}><Text style={{ color: colors.gold, fontWeight: '700' }}>{index}</Text></View>
        )}
        <Text style={[styles.cardTitle, { color: colors.accent, textAlign: rtl ? 'right' : 'left' }]}>{pick(part.title, settings.language)}</Text>
        {part.times ? <Text style={{ color: colors.gold, fontWeight: '700' }}>{`${part.times}×`}</Text> : null}
      </View>
      <Text style={[styles.arabic, { color: colors.text, fontFamily: QURAN_FONT.uthmani, fontSize: settings.quranFontSize - 2 }]}>{text}</Text>
      <View style={[styles.actions, { flexDirection: rtl ? 'row-reverse' : 'row' }]}>
        {audio.available && <Action label="▶ Play" onPress={() => audio.playRange({ sura: part.sura, aya: part.from }, { sura: part.sura, aya: part.to })} />}
        <Text style={{ color: colors.muted, alignSelf: 'center' }}>{`${sura.tname} ${part.sura}:${part.from}${part.to > part.from ? `–${part.to}` : ''}`}</Text>
      </View>
    </View>
  );
}

/** Numbered lists, a table and recitations of one learning topic. */
export function TopicView({ topic }: { topic: Topic }) {
  const { settings, colors, rtl } = useSettings();
  const L = (x: Tri) => pick(x, settings.language);
  const align = rtl ? 'right' : 'left';
  return (
    <View>
      {topic.intro && <Text style={{ color: colors.muted, marginBottom: 10, textAlign: align }}>{L(topic.intro)}</Text>}
      {topic.table && (
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, padding: 0, overflow: 'hidden' }]}>
          <View style={[styles.tr, { backgroundColor: colors.accent, flexDirection: rtl ? 'row-reverse' : 'row' }]}>
            <Text style={[styles.td, styles.tdFirst, { color: colors.card, fontWeight: '700' }]}> </Text>
            {topic.table.head.map((h, i) => <Text key={i} style={[styles.td, { color: colors.card, fontWeight: '700' }]}>{L(h)}</Text>)}
          </View>
          {topic.table.rows.map((r, i) => (
            <View key={i} style={[styles.tr, { flexDirection: rtl ? 'row-reverse' : 'row', backgroundColor: i % 2 ? colors.bg : colors.card }]}>
              <Text style={[styles.td, styles.tdFirst, { color: colors.accent, fontWeight: '700' }]}>{L(r.label)}</Text>
              {r.cells.map((c, j) => <Text key={j} style={[styles.td, { color: colors.text, fontWeight: j === r.cells.length - 1 ? '700' : '400' }]}>{c}</Text>)}
            </View>
          ))}
        </View>
      )}
      {topic.lists?.map((l, i) => (
        <View key={i} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.gold, textAlign: align, marginBottom: 8 }]}>{L(l.heading)}</Text>
          {l.items.map((it, j) => (
            <View key={j} style={[styles.li, { flexDirection: rtl ? 'row-reverse' : 'row' }]}>
              <View style={[styles.num, { backgroundColor: colors.accent }]}><Text style={{ color: colors.card, fontSize: 12, fontWeight: '700' }}>{j + 1}</Text></View>
              <Text style={{ color: colors.text, flex: 1, lineHeight: 22, textAlign: align }}>{L(it)}</Text>
            </View>
          ))}
        </View>
      ))}
      {topic.recitations?.map((r, i) => <RecitationCard key={r.id} item={r} index={i + 1} />)}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexWrap: 'wrap', justifyContent: 'space-between' },
  tile: { width: '48.5%', minHeight: 104, borderRadius: 20, borderWidth: 1, padding: 14, paddingTop: 58, marginBottom: 10, justifyContent: 'flex-end', overflow: 'hidden' },
  wide: { width: '100%' },
  tileEmoji: { position: 'absolute', top: 8, fontSize: 40 },
  tileIcon: { position: 'absolute', top: 6 },
  tileTitle: { fontSize: 16, fontWeight: '700' },
  section: { fontSize: 20, fontWeight: '800', marginTop: 18, marginBottom: 10, letterSpacing: 0.2 },
  seg: { borderWidth: 1, borderRadius: 18, paddingHorizontal: 14, paddingVertical: 8, marginRight: 8 },
  card: { borderWidth: 1, borderRadius: 18, padding: 14, marginBottom: 12 },
  cardHead: { alignItems: 'center', marginBottom: 6 },
  cardTitle: { fontSize: 16, fontWeight: '700', flex: 1 },
  badge: { width: 28, height: 28, borderRadius: 14, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', marginHorizontal: 6 },
  arabic: { writingDirection: 'rtl', textAlign: 'right', lineHeight: 54, marginVertical: 4 },
  meaning: { fontSize: 15, lineHeight: 23, marginTop: 4 },
  actions: { marginTop: 10, flexWrap: 'wrap', alignItems: 'center' },
  action: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 6, marginRight: 8, marginBottom: 4 },
  li: { alignItems: 'flex-start', marginBottom: 8 },
  num: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', marginHorizontal: 8, marginTop: 1 },
  tr: { paddingVertical: 8 },
  td: { flex: 1, textAlign: 'center', fontSize: 12 },
  tdFirst: { flex: 1.3 },
});
