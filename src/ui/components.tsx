import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { useSettings } from '../state/settings';

export function useNow(intervalMs = 1000): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

export function Card({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  const { colors } = useSettings();
  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }, style]}>
      {children}
    </View>
  );
}

export function Row({ left, right, strong, muted }: { left: string; right: string; strong?: boolean; muted?: boolean }) {
  const { colors, rtl } = useSettings();
  const color = muted ? colors.muted : strong ? colors.accent : colors.text;
  return (
    <View style={[styles.row, { flexDirection: rtl ? 'row-reverse' : 'row', borderBottomColor: colors.border }]}>
      <Text style={[styles.rowText, { color, fontWeight: strong ? '700' : '400' }]}>{left}</Text>
      <Text style={[styles.rowText, { color, fontWeight: strong ? '700' : '400', fontVariant: ['tabular-nums'] }]}>{right}</Text>
    </View>
  );
}

export function Title({ children }: { children: React.ReactNode }) {
  const { colors, rtl } = useSettings();
  return <Text style={[styles.title, { color: colors.text, textAlign: rtl ? 'right' : 'left' }]}>{children}</Text>;
}

export function Note({ children }: { children: React.ReactNode }) {
  const { colors, rtl } = useSettings();
  return <Text style={[styles.note, { color: colors.muted, textAlign: rtl ? 'right' : 'left' }]}>{children}</Text>;
}

export function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  const { colors } = useSettings();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={[styles.chip, { borderColor: active ? colors.accent : colors.border, backgroundColor: active ? colors.accent : 'transparent' }]}
    >
      <Text style={{ color: active ? colors.card : colors.text, fontSize: 14 }}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 14, borderWidth: 1, padding: 16, marginBottom: 14 },
  row: { justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth },
  rowText: { fontSize: 17 },
  title: { fontSize: 15, fontWeight: '700', marginBottom: 8, letterSpacing: 0.3 },
  note: { fontSize: 13, marginTop: 8, lineHeight: 19 },
  chip: { borderWidth: 1, borderRadius: 18, paddingHorizontal: 12, paddingVertical: 7, marginRight: 8, marginBottom: 8 },
});

/** A countdown that re-renders only itself every second, not the whole screen. */
export function Countdown({ to, style, suffix }: { to: Date; style?: any; suffix?: string }) {
  const now = useNow(1000);
  const ms = Math.max(0, to.getTime() - now.getTime());
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const sec = Math.floor((ms % 60000) / 1000);
  const pad = (n: number) => String(n).padStart(2, '0');
  return <Text style={style}>{`${h > 0 ? `${h}:` : ''}${pad(m)}:${pad(sec)}${suffix ?? ''}`}</Text>;
}
