import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { HIJRI_MONTHS, hijriDate } from '../engine/hijri';
import { addDays, computePrayerTimes, currentPrayer, nextPrayer } from '../engine/prayerTimes';
import { formatClock, formatCountdown, localDateIn } from '../engine/timezone';
import { useSettings } from '../state/settings';
import type { PlaceState } from '../state/usePlace';
import { Note, useNow } from '../ui/components';
import { GearIcon, GlobeIcon, KaabaIcon, MosqueClockIcon, QuranIcon, Star8, TasbeehIcon } from '../ui/icons';

export type Screen = 'home' | 'times' | 'quran' | 'qibla' | 'tasbeeh' | 'duas' | 'world' | 'settings';

export default function HomeScreen({ place, open }: { place: PlaceState; open: (s: Screen) => void }) {
  const { settings, t, colors, rtl } = useSettings();
  const now = useNow();
  const ready = place.status === 'ready' ? place.place : null;
  const tz = ready?.timeZone ?? 'UTC';
  const dayKey = JSON.stringify(localDateIn(now, tz));

  const times = useMemo(() => {
    if (!ready) return null;
    const d = localDateIn(new Date(), ready.timeZone);
    const c = { latitude: ready.latitude, longitude: ready.longitude };
    return { today: computePrayerTimes(d, c, settings.prayer), tomorrow: computePrayerTimes(addDays(d, 1), c, settings.prayer) };
    // dayKey refreshes the times after midnight.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, settings.prayer, dayKey]);

  const h = hijriDate(now, tz, settings.hijriOffset);
  const monthNames = HIJRI_MONTHS[settings.language];
  const greg = now.toLocaleDateString(settings.language === 'ur' ? 'ur-PK' : 'en-GB', { timeZone: tz, weekday: 'short', day: 'numeric', month: 'short' });
  const clock = (d: Date) => formatClock(d, tz, settings.use24h);

  const cur = times ? currentPrayer(times.today, times.tomorrow, now) : null;
  const next = times ? nextPrayer(times.today, times.tomorrow, now) : null;

  const tiles: { id: Screen; label: string; Icon: typeof QuranIcon }[] = [
    { id: 'quran', label: t('tabQuran'), Icon: QuranIcon },
    { id: 'qibla', label: t('tabQibla'), Icon: KaabaIcon },
    { id: 'times', label: t('prayerTimes'), Icon: MosqueClockIcon },
    { id: 'tasbeeh', label: t('tasbeeh'), Icon: TasbeehIcon },
    { id: 'duas', label: t('duas'), Icon: QuranIcon },
    { id: 'world', label: t('tabWorld'), Icon: GlobeIcon },
    { id: 'settings', label: t('tabSettings'), Icon: GearIcon },
  ];

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
      <View style={[styles.hero, { backgroundColor: colors.accent }]}>
        <Text style={[styles.hijri, { color: colors.card, textAlign: rtl ? 'right' : 'left' }]}>
          {`${h.day} ${monthNames[h.month - 1]} ${h.year}`}
        </Text>
        <Text style={{ color: colors.card, opacity: 0.85, textAlign: rtl ? 'right' : 'left' }}>{greg}</Text>

        {times && next ? (
          <View style={[styles.cards, { flexDirection: rtl ? 'row-reverse' : 'row' }]}>
            <View style={[styles.nowCard, { backgroundColor: 'rgba(255,255,255,0.14)', borderColor: 'rgba(255,255,255,0.35)' }]}>
              <Text style={[styles.cardLabel, { color: colors.card }]}>{t('now')}</Text>
              <Text style={[styles.cardTitle, { color: colors.card }]}>{cur ? t(cur.name) : t('beforeZuhr')}</Text>
              {cur && (
                <>
                  <Text style={{ color: colors.card, opacity: 0.85, marginTop: 6 }}>{t('endsIn')}</Text>
                  <Text style={[styles.count, { color: colors.card }]}>{formatCountdown(cur.endsAt.getTime() - now.getTime())}</Text>
                </>
              )}
            </View>
            <View style={[styles.nextCard, { backgroundColor: colors.card }]}>
              <Text style={[styles.cardLabel, { color: colors.muted }]}>{t('nextPrayer')}</Text>
              <Text style={[styles.cardTitle, { color: colors.text }]}>{t(next.name)}</Text>
              <Text style={[styles.count, { color: colors.accent }]}>{clock(next.time)}</Text>
            </View>
          </View>
        ) : (
          <Text style={{ color: colors.card, marginTop: 16 }}>{place.status === 'loading' ? t('locating') : t('locationDenied')}</Text>
        )}
      </View>

      {times && h.month === 9 && (
        <View style={[styles.ramadan, { backgroundColor: colors.card, borderColor: colors.gold }]}>
          <Text style={{ color: colors.gold, fontWeight: '700', fontSize: 16 }}>{t('ramadan')}</Text>
          <Text style={{ color: colors.text, marginTop: 4 }}>
            {`${t('sehri')}: ${clock(times.today.times.fajr)}   ·   ${t('iftar')}: ${clock(times.today.times.maghrib)}`}
          </Text>
        </View>
      )}

      <View style={styles.divider}>
        <Star8 color={colors.gold} />
      </View>

      <View style={[styles.grid, { flexDirection: rtl ? 'row-reverse' : 'row' }]}>
        {tiles.map(({ id, label, Icon }) => (
          <Pressable
            key={id}
            accessibilityRole="button"
            onPress={() => open(id)}
            style={({ pressed }) => [
              styles.tile,
              { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <View style={[styles.iconWrap, { backgroundColor: colors.bg, borderColor: colors.gold }]}>
              <Icon color={colors.accent} accent={colors.gold} />
            </View>
            <Text style={[styles.tileLabel, { color: colors.text }]}>{label}</Text>
          </Pressable>
        ))}
      </View>

      <View style={{ paddingHorizontal: 16 }}>
        <Note>{t('privacy')}</Note>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  hero: { paddingHorizontal: 18, paddingTop: 18, paddingBottom: 24, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  hijri: { fontSize: 22, fontWeight: '700' },
  cards: { marginTop: 16, gap: 12 },
  nowCard: { flex: 1.2, borderRadius: 18, borderWidth: 1, padding: 14 },
  nextCard: { flex: 1, borderRadius: 18, padding: 14 },
  cardLabel: { fontSize: 12, letterSpacing: 1, textTransform: 'uppercase' },
  cardTitle: { fontSize: 24, fontWeight: '700', marginTop: 4 },
  count: { fontSize: 20, fontWeight: '600', fontVariant: ['tabular-nums'], marginTop: 2 },
  divider: { alignItems: 'center', marginVertical: 14 },
  ramadan: { marginHorizontal: 16, marginTop: 14, borderWidth: 1.5, borderRadius: 16, padding: 14, alignItems: 'center' },
  grid: { flexWrap: 'wrap', paddingHorizontal: 10, justifyContent: 'space-between' },
  tile: { width: '31%', aspectRatio: 0.9, borderRadius: 18, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginHorizontal: '1%', marginBottom: 12 },
  iconWrap: { width: 66, height: 66, borderRadius: 33, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  tileLabel: { fontSize: 14, fontWeight: '600', textAlign: 'center' },
});
