import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { HIJRI_MONTHS, hijriDate } from '../engine/hijri';
import { addDays, computePrayerTimes, currentPrayer, nextPrayer } from '../engine/prayerTimes';
import { formatClock, formatCountdown, localDateIn } from '../engine/timezone';
import { useSettings } from '../state/settings';
import type { PlaceState } from '../state/usePlace';
import { Note, useNow } from '../ui/components';
import { QURAN, QURAN_FONT } from '../data/quran';
import { useAudio } from '../state/audio';
import VoiceButton, { VOICE_AVAILABLE } from '../ui/VoiceButton';
import { GearIcon, GlobeIcon, KaabaIcon, MosqueClockIcon, QuranIcon, Star8, TasbeehIcon } from '../ui/icons';
import { Dedication } from './FamilyScreens';

const Star8Icon = ({ accent }: { color: string; accent: string; size?: number }) => <Star8 size={40} color={accent} />;

export type Screen = 'home' | 'times' | 'quran' | 'qibla' | 'tasbeeh' | 'duas' | 'world' | 'settings' | 'maktab' | 'khatam' | 'halima' | 'zakat';

export default function HomeScreen({ place, open, onVoice }: { place: PlaceState; open: (s: Screen) => void; onVoice?: (text: string) => void }) {
  const { settings, t, colors, rtl } = useSettings();
  const now = useNow();
  const audio = useAudio();
  // Al-Fatiha 1:5, taken from the bundled Tanzil text (not retyped).
  const openingAyah = QURAN.suras[0]?.ayahs[4];
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
    { id: 'maktab', label: t('maktab'), Icon: QuranIcon },
    { id: 'khatam', label: t('khatam'), Icon: Star8Icon },
    { id: 'halima', label: t('halima'), Icon: TasbeehIcon },
    { id: 'zakat', label: t('zakat'), Icon: MosqueClockIcon },
    { id: 'world', label: t('tabWorld'), Icon: GlobeIcon },
    { id: 'settings', label: t('tabSettings'), Icon: GearIcon },
  ];

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
      <View style={[styles.hero, { backgroundColor: colors.accent }]}>
        {openingAyah && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Al-Fatiha 1:5"
            onPress={() => audio.available && audio.playRange({ sura: 1, aya: 5 }, { sura: 1, aya: 5 })}
            style={styles.opening}
          >
            <Text style={[styles.openingText, { color: colors.card, fontFamily: QURAN_FONT.uthmani }]}>{openingAyah}</Text>
            <Text style={{ color: colors.gold, fontSize: 12 }}>{`${QURAN.suras[0].tname} 1:5${audio.available ? '  ▶' : ''}`}</Text>
          </Pressable>
        )}
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

      {VOICE_AVAILABLE && onVoice && (
        <View style={[styles.voice, { backgroundColor: colors.card, borderColor: colors.gold }]}>
          <VoiceButton onText={onVoice} />
          <Text style={{ color: colors.text, flex: 1, marginLeft: 12 }}>{t('speakNow')}</Text>
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

      <Dedication />
      <View style={{ paddingHorizontal: 16 }}>
        <Note>{t('privacy')}</Note>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  opening: { alignItems: 'center', marginBottom: 12, paddingBottom: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(255,255,255,0.35)' },
  openingText: { fontSize: 30, lineHeight: 58, writingDirection: 'rtl', textAlign: 'center' },
  hero: { paddingHorizontal: 18, paddingTop: 18, paddingBottom: 24, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  hijri: { fontSize: 22, fontWeight: '700' },
  cards: { marginTop: 16, gap: 12 },
  nowCard: { flex: 1.2, borderRadius: 18, borderWidth: 1, padding: 14 },
  nextCard: { flex: 1, borderRadius: 18, padding: 14 },
  cardLabel: { fontSize: 12, letterSpacing: 1, textTransform: 'uppercase' },
  cardTitle: { fontSize: 24, fontWeight: '700', marginTop: 4 },
  count: { fontSize: 20, fontWeight: '600', fontVariant: ['tabular-nums'], marginTop: 2 },
  divider: { alignItems: 'center', marginVertical: 14 },
  voice: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginTop: 14, borderWidth: 1.5, borderRadius: 18, padding: 12 },
  ramadan: { marginHorizontal: 16, marginTop: 14, borderWidth: 1.5, borderRadius: 16, padding: 14, alignItems: 'center' },
  grid: { flexWrap: 'wrap', paddingHorizontal: 10, justifyContent: 'space-between' },
  tile: { width: '31%', aspectRatio: 0.9, borderRadius: 18, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginHorizontal: '1%', marginBottom: 12 },
  iconWrap: { width: 66, height: 66, borderRadius: 33, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  tileLabel: { fontSize: 14, fontWeight: '600', textAlign: 'center' },
});
