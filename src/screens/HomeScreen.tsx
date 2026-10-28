import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { dayOf, daysUntil, EVENT_CATEGORIES, eventsOn, upcomingEvents } from '../engine/islamicCalendar';
import { dateKey, prayerStreak } from '../engine/tracker';
import { Gradient, SectionTitle, Tile, TileGrid } from '../ui/kit';
import type { IconName } from '../ui/SufiIcon';
import { HIJRI_MONTHS, hijriDate } from '../engine/hijri';
import { addDays, computePrayerTimes, currentPrayer, nextPrayer } from '../engine/prayerTimes';
import { formatClock, localDateIn } from '../engine/timezone';
import { useSettings } from '../state/settings';
import type { PlaceState } from '../state/usePlace';
import { Countdown, Note, useNow } from '../ui/components';
import { QURAN, QURAN_FONT } from '../data/quran';
import { useAudio } from '../state/audio';
import VoiceButton, { VOICE_AVAILABLE } from '../ui/VoiceButton';
import { Dedication } from './FamilyScreens';
import { AyahOfDayCard } from './ExtraScreens';


export type Screen = 'home' | 'times' | 'quran' | 'qibla' | 'tasbeeh' | 'duas' | 'world' | 'settings' | 'maktab' | 'khatam' | 'halima' | 'zakat'
  | 'kids' | 'tarbiyat' | 'khatamSharif' | 'duaLibrary' | 'names' | 'calendar' | 'tracker' | 'hajj' | 'babyNames' | 'ushr' | 'mirath' | 'nearby' | 'timetable' | 'journal' | 'women' | 'turkHistory';

// Turkish-Sufi icon for each feature (see ui/SufiIcon.tsx).
const ICONS: Partial<Record<Screen, IconName>> = {
  quran: 'quran', times: 'mosque', qibla: 'kaaba', tasbeeh: 'dervish', duaLibrary: 'library', duas: 'dua',
  calendar: 'calendar', tracker: 'tracker', timetable: 'timetable', nearby: 'nearby', kids: 'tulip',
  tarbiyat: 'book', khatamSharif: 'kandil', names: 'allah', hajj: 'hajj', babyNames: 'crescent', journal: 'quill',
  women: 'rose', turkHistory: 'helmet', zakat: 'zakat', ushr: 'wheat', mirath: 'scales', world: 'globe', settings: 'gear',
};

export default function HomeScreen({ place, open, onVoice }: { place: PlaceState; open: (s: Screen) => void; onVoice?: (text: string) => void }) {
  const { settings, t, colors, rtl } = useSettings();
  // Minute ticks are enough here; the countdown has its own one-second timer,
  // so the tiles and icons below are not redrawn every second.
  const now = useNow(20000);
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
  const greg = now.toLocaleDateString(settings.language === 'ur' ? 'ur-PK' : settings.language === 'tr' ? 'tr-TR' : settings.language === 'fa' ? 'fa-IR' : 'en-GB', { timeZone: tz, weekday: 'short', day: 'numeric', month: 'short' });
  const clock = (d: Date) => formatClock(d, tz, settings.use24h);

  const cur = times ? currentPrayer(times.today, times.tomorrow, now) : null;
  const next = times ? nextPrayer(times.today, times.tomorrow, now) : null;

  const [query, setQuery] = useState('');
  const todayKey = dateKey(localDateIn(now, tz));
  const streak = prayerStreak(settings.tracker, todayKey);
  const evKey = settings.language === 'ur' || settings.language === 'fa' ? 'ur' : settings.language === 'roman' ? 'roman' : 'en';
  const todayEvents = useMemo(() => eventsOn(dayOf(localDateIn(new Date(), tz)), settings.hijriOffset), [dayKey, settings.hijriOffset]);
  const nextEvent = useMemo(() => upcomingEvents(dayOf(localDateIn(new Date(), tz)), settings.hijriOffset)[0], [dayKey, settings.hijriOffset]);

  const sections: { title: string; tiles: { id: Screen; emoji: string; label: string; sub?: string }[] }[] = [
    {
      title: t('sectionWorship'),
      tiles: [
        { id: 'quran', emoji: '📖', label: t('tabQuran') },
        { id: 'times', emoji: '🕌', label: t('prayerTimes') },
        { id: 'qibla', emoji: '🕋', label: t('tabQibla') },
        { id: 'tasbeeh', emoji: '📿', label: t('muzammil'), sub: '40+ azkar' },
        { id: 'duaLibrary', emoji: '📚', label: t('duaLibrary'), sub: `${t('masnoonDuas')} · Hisn al-Muslim` },
        { id: 'duas', emoji: '📜', label: t('duas') },
        { id: 'calendar', emoji: '🗓️', label: t('mudassir'), sub: t('mudassirSub') },
        { id: 'tracker', emoji: '✅', label: t('tracker') },
        { id: 'timetable', emoji: '🗒️', label: `${t('prayerTimes')} · 30` },
        { id: 'nearby', emoji: '📍', label: settings.language === 'ur' ? 'قریبی مساجد اور حلال' : 'Masjid aur halal qareeb' },
      ],
    },
    {
      title: t('sectionLearn'),
      tiles: [
        { id: 'kids', emoji: '🏫', label: t('kids'), sub: t('kidsSub') },
        { id: 'women', emoji: '🌸', label: t('women'), sub: t('womenSub') },
        { id: 'turkHistory', emoji: '🛡️', label: t('turkHistory'), sub: t('turkHistorySub') },
        { id: 'tarbiyat', emoji: '🎓', label: t('tarbiyat'), sub: t('tarbiyatSub') },
        { id: 'khatamSharif', emoji: '🕯️', label: t('khatamSharif'), sub: t('khatamSharifSub') },
        { id: 'names', emoji: '✨', label: t('names99') },
        { id: 'hajj', emoji: '🧳', label: t('hajjUmrah') },
        { id: 'babyNames', emoji: '👶', label: t('babyNames'), sub: `${t('boys')} · ${t('girls')}` },
        { id: 'journal', emoji: '📔', label: settings.language === 'ur' ? 'روزنامچہ' : 'Journal' },
      ],
    },
    {
      title: t('sectionCalc'),
      tiles: [
        { id: 'zakat', emoji: '💰', label: t('zakat') },
        { id: 'ushr', emoji: '🌾', label: t('ushr') },
        { id: 'mirath', emoji: '⚖️', label: t('mirath') },
      ],
    },
    {
      title: t('sectionMore'),
      tiles: [
        { id: 'world', emoji: '🌍', label: t('tabWorld') },
        { id: 'settings', emoji: '⚙️', label: t('tabSettings') },
      ],
    },
  ];
  const needle = query.trim().toLowerCase();
  const shown = sections
    .map((sec) => ({ ...sec, tiles: sec.tiles.filter((x) => !needle || `${x.label} ${x.sub ?? ''}`.toLowerCase().includes(needle)) }))
    .filter((sec) => sec.tiles.length > 0);
  const align = rtl ? 'right' : 'left';

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 32 }} keyboardShouldPersistTaps="handled">
      <Gradient from={colors.accent} to="#082E2E" radius={0} style={styles.hero}>
        {openingAyah && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Al-Fatiha 1:5"
            onPress={() => audio.available && audio.playRange({ sura: 1, aya: 5 }, { sura: 1, aya: 5 })}
            style={styles.opening}
          >
            <Text style={[styles.openingText, { color: '#FFFFFF', fontFamily: QURAN_FONT.uthmani }]}>{openingAyah}</Text>
            <Text style={{ color: colors.gold, fontSize: 12 }}>{`${QURAN.suras[0].tname} 1:5${audio.available ? '  ▶' : ''}`}</Text>
          </Pressable>
        )}
        <View style={{ flexDirection: rtl ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <View>
            <Text style={[styles.hijri, { color: '#FFFFFF', textAlign: align }]}>{`${h.day} ${monthNames[h.month - 1]} ${h.year}`}</Text>
            <Text style={{ color: '#FFFFFFCC', textAlign: align }}>{greg}</Text>
          </View>
          {ready && <Text style={{ color: '#FFFFFFCC', fontSize: 12 }}>{`📍 ${ready.label ?? ''}`}</Text>}
        </View>

        {times && next ? (
          <View style={[styles.cards, { flexDirection: rtl ? 'row-reverse' : 'row' }]}>
            <View style={[styles.nowCard, { backgroundColor: 'rgba(255,255,255,0.12)', borderColor: 'rgba(255,255,255,0.3)' }]}>
              <Text style={[styles.cardLabel, { color: '#FFFFFFCC' }]}>{`● ${t('now')}`}</Text>
              <Text style={[styles.cardTitle, { color: '#FFFFFF' }]}>{cur ? t(cur.name) : t('beforeZuhr')}</Text>
              {cur && (
                <>
                  <Text style={{ color: '#FFFFFFCC', marginTop: 6 }}>{t('endsIn')}</Text>
                  <Countdown to={cur.endsAt} style={[styles.count, { color: '#FFFFFF' }]} />
                </>
              )}
            </View>
            <Pressable onPress={() => open('times')} style={[styles.nextCard, { backgroundColor: 'rgba(0,0,0,0.25)', borderColor: 'rgba(255,255,255,0.18)' }]}>
              <Text style={[styles.cardLabel, { color: '#FFFFFFCC' }]}>{t('nextPrayer')}</Text>
              <Text style={[styles.cardTitle, { color: '#FFFFFF' }]}>{t(next.name)}</Text>
              <Text style={[styles.count, { color: colors.gold }]}>{clock(next.time)}</Text>
              <Text style={{ color: '#FFFFFFAA', fontSize: 12, marginTop: 4 }}>{`${t('prayerTimes')} →`}</Text>
            </Pressable>
          </View>
        ) : (
          <Text style={{ color: '#FFFFFF', marginTop: 16 }}>{place.status === 'loading' ? t('locating') : t('locationDenied')}</Text>
        )}
      </Gradient>

      <View style={{ paddingHorizontal: 16 }}>
        <View style={[styles.stats, { flexDirection: rtl ? 'row-reverse' : 'row' }]}>
          <Pressable onPress={() => open('tracker')} style={[styles.stat, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={{ color: colors.muted, fontSize: 12 }}>{t('streak')}</Text>
            <Text style={{ color: colors.accent, fontSize: 26, fontWeight: '900' }}>{`🔥 ${streak}`}</Text>
          </Pressable>
          {nextEvent && (
            <Pressable onPress={() => open('calendar')} style={[styles.stat, { flex: 2, backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={{ color: colors.muted, fontSize: 12 }}>{t('upcoming')}</Text>
              <Text style={{ color: colors.text, fontWeight: '800' }} numberOfLines={1}>{nextEvent.event.name[settings.language === 'ur' || settings.language === 'fa' ? 'ur' : settings.language === 'roman' ? 'roman' : 'en']}</Text>
              <Text style={{ color: colors.accent, fontWeight: '700' }}>{`${daysUntil(dayOf(localDateIn(new Date(), tz)), nextEvent.date)} ${t('daysLeft')}`}</Text>
            </Pressable>
          )}
        </View>

        {todayEvents.length > 0 && (
          <Pressable onPress={() => open('calendar')}>
            <Gradient from="#7C2D12" to="#B08A3E" style={{ padding: 14, marginTop: 14 }}>
              <Text style={{ color: '#FFF', fontWeight: '800', textAlign: align }}>{`📅 ${t('todayEvents')}`}</Text>
              {todayEvents.map((e) => (
                <Text key={e.id} style={{ color: '#FFF', fontSize: 16, marginTop: 4, textAlign: align }}>
                  {`${EVENT_CATEGORIES.find((c) => c.id === e.category)?.emoji ?? ''} ${e.name[evKey]}${e.year ? ` (${e.year})` : ''}`}
                </Text>
              ))}
            </Gradient>
          </Pressable>
        )}

        <AyahOfDayCard />

        {times && h.month === 9 && (
          <View style={[styles.ramadan, { backgroundColor: colors.card, borderColor: colors.gold }]}>
            <Text style={{ color: colors.gold, fontWeight: '700', fontSize: 16 }}>{t('ramadan')}</Text>
            <Text style={{ color: colors.text, marginTop: 4 }}>
              {`${t('sehri')}: ${clock(times.today.times.fajr)}   ·   ${t('iftar')}: ${clock(times.today.times.maghrib)}`}
            </Text>
          </View>
        )}

        {VOICE_AVAILABLE && onVoice && (
          <View style={[styles.voice, { backgroundColor: colors.card, borderColor: colors.gold, flexDirection: rtl ? 'row-reverse' : 'row' }]}>
            <VoiceButton onText={onVoice} />
            <Text style={{ color: colors.text, flex: 1, marginHorizontal: 12, textAlign: align }}>{t('speakNow')}</Text>
          </View>
        )}

        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={`🔍  ${t('searchFeatures')}`}
          placeholderTextColor={colors.muted}
          style={[styles.search, { color: colors.text, backgroundColor: colors.card, borderColor: colors.border, textAlign: align }]}
        />

        {shown.map((sec) => (
          <View key={sec.title}>
            <SectionTitle>{sec.title}</SectionTitle>
            <TileGrid>
              {sec.tiles.map((x) => <Tile key={x.id} emoji={x.emoji} icon={ICONS[x.id]} title={x.label} sub={x.sub} onPress={() => open(x.id)} />)}
            </TileGrid>
          </View>
        ))}
      </View>

      <Dedication />
      <View style={{ paddingHorizontal: 16 }}>
        <Note>{t('swipeHint')}</Note>
        <Note>{t('privacy')}</Note>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  opening: { alignItems: 'center', marginBottom: 12, paddingBottom: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(255,255,255,0.35)' },
  openingText: { fontSize: 30, lineHeight: 58, writingDirection: 'rtl', textAlign: 'center' },
  hero: { paddingHorizontal: 18, paddingTop: 18, paddingBottom: 24, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  stats: { marginTop: 14, gap: 10 },
  stat: { flex: 1, borderWidth: 1, borderRadius: 18, padding: 12 },
  search: { borderWidth: 1, borderRadius: 18, paddingHorizontal: 16, paddingVertical: 12, fontSize: 15, marginTop: 14 },
  hijri: { fontSize: 22, fontWeight: '700' },
  cards: { marginTop: 16, gap: 12 },
  nowCard: { flex: 1.2, borderRadius: 18, borderWidth: 1, padding: 14 },
  nextCard: { flex: 1, borderRadius: 18, borderWidth: 1, padding: 14 },
  cardLabel: { fontSize: 12, letterSpacing: 1, textTransform: 'uppercase' },
  cardTitle: { fontSize: 24, fontWeight: '700', marginTop: 4 },
  count: { fontSize: 20, fontWeight: '600', fontVariant: ['tabular-nums'], marginTop: 2 },
  divider: { alignItems: 'center', marginVertical: 14 },
  voice: { alignItems: 'center', marginTop: 14, borderWidth: 1.5, borderRadius: 18, padding: 12 },
  ramadan: { marginTop: 14, borderWidth: 1.5, borderRadius: 16, padding: 14, alignItems: 'center' },
  grid: { flexWrap: 'wrap', paddingHorizontal: 10, justifyContent: 'space-between' },
  tile: { width: '31%', aspectRatio: 0.9, borderRadius: 18, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginHorizontal: '1%', marginBottom: 12 },
  iconWrap: { width: 66, height: 66, borderRadius: 33, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  tileLabel: { fontSize: 14, fontWeight: '600', textAlign: 'center' },
});
