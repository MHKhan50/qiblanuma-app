import * as Speech from 'expo-speech';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Linking, Pressable, ScrollView, Share, StyleSheet, Text, TextInput, View } from 'react-native';
import { ALL_DUAS, DUA_CATEGORIES, KIDS_DUA_IDS, pick, type DuaCategory } from '../data/learn';
import { ASMA_UL_HUSNA } from '../data/learn/asmaUlHusna';
import { GREETINGS, HAJJ, LIVE_LINKS, UMRAH } from '../data/learn/hajj';
import { IMAN, KALIMAS } from '../data/learn/kalimas';
import { KHATAM_STEPS } from '../data/learn/khatamSharif';
import { TARBIYAT_TOPICS } from '../data/learn/tarbiyat';
import { HIJRI_MONTHS } from '../engine/hijri';
import { dayOf, daysUntil, EVENT_CATEGORIES, eventsOn, hijriMonth, upcomingEvents, type EventCategory, type IslamicEvent } from '../engine/islamicCalendar';
import { localDateIn } from '../engine/timezone';
import { allPrayers, dateKey, lastDays, prayerStreak, toggle, TRACK_ITEMS, type TrackItem } from '../engine/tracker';
import { WEEKDAYS } from '../i18n/strings';
import { useSettings } from '../state/settings';
import { useKhatamPlayer } from '../state/useKhatamPlayer';
import SufiIcon, { EMOJI_ICON } from '../ui/SufiIcon';
import { Note } from '../ui/components';
import { Gradient, QuranPassage, RecitationCard, Segments, SectionTitle, TopicView } from '../ui/kit';
import { KhatamScreen, MaktabScreen } from './FamilyScreens';

const pad = { padding: 16, paddingBottom: 48 };

function Header({ emoji, title, sub }: { emoji: string; title: string; sub?: string }) {
  const { colors } = useSettings();
  return (
    <Gradient from={colors.accent} to="#0B3B3B" style={{ padding: 18, marginBottom: 14 }}>
      {EMOJI_ICON[emoji] ? <SufiIcon name={EMOJI_ICON[emoji]} size={64} /> : <Text style={{ fontSize: 40 }}>{emoji}</Text>}
      <Text style={{ color: '#FFFFFF', fontSize: 22, fontWeight: '800', marginTop: 6 }}>{title}</Text>
      {sub ? <Text style={{ color: '#FFFFFFCC', marginTop: 4 }}>{sub}</Text> : null}
    </Gradient>
  );
}

// ---------------- Fatima: children's corner ----------------
export function KidsScreen() {
  const { t } = useSettings();
  const [tab, setTab] = useState<'kalimas' | 'iman' | 'duas' | 'qaida'>('kalimas');
  const kidsDuas = KIDS_DUA_IDS.map((id) => ALL_DUAS.find((d) => d.id === id)!).filter(Boolean);
  if (tab === 'qaida') {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
          <Segments items={kidsTabs(t)} value={tab} onChange={setTab} />
        </View>
        <MaktabScreen />
      </View>
    );
  }
  return (
    <ScrollView contentContainerStyle={pad}>
      <Header emoji="🏫" title={t('kids')} sub={t('kidsSub')} />
      <Segments items={kidsTabs(t)} value={tab} onChange={setTab} />
      <View style={{ height: 10 }} />
      {tab === 'kalimas' && KALIMAS.map((k, i) => <RecitationCard key={k.id} item={k} index={i + 1} />)}
      {tab === 'iman' && IMAN.map((k, i) => <RecitationCard key={k.id} item={k} index={i + 1} />)}
      {tab === 'duas' && kidsDuas.map((k, i) => <RecitationCard key={k.id} item={k} index={i + 1} />)}
      <Note>{t('reportNote')}</Note>
    </ScrollView>
  );
}

const kidsTabs = (t: (k: 'kalimas' | 'iman' | 'masnoonDuas' | 'qaida') => string) => [
  { id: 'kalimas' as const, label: t('kalimas') },
  { id: 'iman' as const, label: t('iman') },
  { id: 'duas' as const, label: t('masnoonDuas') },
  { id: 'qaida' as const, label: t('qaida') },
];

// ---------------- Halima: learning for adults ----------------
export function TarbiyatScreen() {
  const { settings, t } = useSettings();
  const [topic, setTopic] = useState(TARBIYAT_TOPICS[0].id);
  const current = TARBIYAT_TOPICS.find((x) => x.id === topic)!;
  return (
    <ScrollView contentContainerStyle={pad}>
      <Header emoji="🎓" title={t('tarbiyat')} sub={t('tarbiyatSub')} />
      <Segments items={TARBIYAT_TOPICS.map((x) => ({ id: x.id, label: pick(x.title, settings.language) }))} value={topic} onChange={setTopic} />
      <SectionTitle>{pick(current.title, settings.language)}</SectionTitle>
      <TopicView topic={current} />
      <Note>{t('reportNote')}</Note>
    </ScrollView>
  );
}

// ---------------- Masmat: Khatam Sharif ----------------
export function KhatamSharifScreen({ autoPlay }: { autoPlay?: boolean }) {
  const { settings, t, colors, rtl } = useSettings();
  const [tab, setTab] = useState<'fatiha' | 'tracker'>('fatiha');
  const player = useKhatamPlayer(KHATAM_STEPS);
  const scroll = useRef<ScrollView>(null);
  const ys = useRef<number[]>([]);
  const ur = settings.language === 'ur' || settings.language === 'roman' || settings.language === 'fa';
  useEffect(() => { if (autoPlay) player.play(0); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [autoPlay]);
  useEffect(() => {
    if (player.current !== null && ys.current[player.current] !== undefined) scroll.current?.scrollTo({ y: Math.max(0, ys.current[player.current] - 80), animated: true });
  }, [player.current]);
  const tabs = [{ id: 'fatiha' as const, label: t('khatamSharif') }, { id: 'tracker' as const, label: t('khatamTracker') }];
  if (tab === 'tracker') {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
          <Segments items={tabs} value={tab} onChange={setTab} />
        </View>
        <KhatamScreen />
      </View>
    );
  }
  return (
    <ScrollView ref={scroll} contentContainerStyle={pad}>
      <Header emoji="🕯️" title={t('khatamSharif')} sub={t('khatamNote')} />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={player.playing ? 'Stop Khatam Sharif' : 'Play the whole Khatam Sharif'}
        onPress={() => (player.playing ? player.stop() : player.play(0))}
        style={[styles.bigPlay, { backgroundColor: player.playing ? colors.danger : colors.gold }]}
      >
        <Text style={{ color: '#FFF', fontSize: 20, fontWeight: '900', textAlign: 'center' }}>
          {player.playing ? (ur ? '■  روکیں' : '■  Stop') : (ur ? '▶  پورا ختم شریف سنیں اور ساتھ پڑھیں' : '▶  Listen to the whole Khatam Sharif')}
        </Text>
        <Text style={{ color: '#FFFFFFDD', textAlign: 'center', marginTop: 4 }}>
          {ur ? 'ہر حصے سے پہلے ایپ بتاتی ہے کہ اب کیا پڑھنا ہے؛ آپ ساتھ ساتھ دہرائیں' : 'Before each part the app says what comes next; repeat along'}
        </Text>
      </Pressable>
      <Segments items={tabs} value={tab} onChange={setTab} />
      <View style={{ height: 10 }} />
      {KHATAM_STEPS.map((s, i) => {
        const active = player.current === i;
        const body = s.kind === 'quran'
          ? <QuranPassage part={s.part} index={i + 1} />
          : s.kind === 'recite'
            ? <RecitationCard item={s.item} index={i + 1} />
            : (
              <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.gold }]}>
                <Text style={{ color: colors.gold, fontWeight: '700', fontSize: 16, textAlign: rtl ? 'right' : 'left' }}>{`${i + 1}. ${pick(s.title, settings.language)}`}</Text>
                <Text style={{ color: colors.text, lineHeight: 24, marginTop: 6, textAlign: rtl ? 'right' : 'left' }}>{pick(s.text, settings.language)}</Text>
              </View>
            );
        return (
          <View key={i} onLayout={(e) => { ys.current[i] = e.nativeEvent.layout.y; }} style={active ? [styles.activeStep, { borderColor: colors.accent }] : undefined}>
            {active && <Text style={{ color: colors.accent, fontWeight: '900', marginBottom: 4 }}>{ur ? '🔊 ابھی یہ پڑھا جا رہا ہے' : '🔊 Now reading'}</Text>}
            {body}
            {!player.playing && (
              <Pressable onPress={() => player.play(i)} style={{ alignSelf: rtl ? 'flex-start' : 'flex-end', marginTop: -6, marginBottom: 10 }}>
                <Text style={{ color: colors.accent, fontWeight: '700' }}>{ur ? '▶ یہاں سے شروع کریں' : '▶ Start from here'}</Text>
              </Pressable>
            )}
          </View>
        );
      })}
      <Note>{ur ? 'سورتیں منتخب قاری کی آواز میں (انٹرنیٹ ضروری)، درود فون کی عربی آواز میں، اور ایصالِ ثواب کی دعا فون کی اردو آواز میں۔' : 'Surahs in the chosen qari\'s voice (needs internet), durood in the phone\'s Arabic voice, the dua in the phone\'s Urdu voice.'}</Note>
      <Note>{t('reportNote')}</Note>
    </ScrollView>
  );
}

// ---------------- Dua library ----------------
export function DuaLibraryScreen() {
  const { settings, t, colors, rtl } = useSettings();
  const [cat, setCat] = useState<DuaCategory | 'all' | 'fav'>('all');
  const [q, setQ] = useState('');
  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return ALL_DUAS.filter((d) => (cat === 'all' ? true : cat === 'fav' ? settings.favDuas.includes(d.id) : d.category === cat))
      .filter((d) => !needle || [d.title.ur, d.title.roman, d.title.en, d.meaning.roman, d.meaning.en, d.arabic].some((s) => s.toLowerCase().includes(needle)));
  }, [cat, q, settings.favDuas]);
  const catLabel = (c: (typeof DUA_CATEGORIES)[number]) => `${c.emoji} ${settings.language === 'ur' || settings.language === 'fa' ? c.ur : settings.language === 'roman' ? c.roman : c.en}`;
  return (
    <FlatList
      contentContainerStyle={pad}
      data={list}
      keyExtractor={(d) => d.id}
      ListHeaderComponent={
        <View>
          <Header emoji="📚" title={t('duaLibrary')} sub={`${ALL_DUAS.length}`} />
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder={t('search')}
            placeholderTextColor={colors.muted}
            style={[styles.search, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card, textAlign: rtl ? 'right' : 'left' }]}
          />
          <Segments
            items={[{ id: 'all' as const, label: t('all') }, { id: 'fav' as const, label: `★ ${t('favourites')}` }, ...DUA_CATEGORIES.map((c) => ({ id: c.id, label: catLabel(c) }))]}
            value={cat}
            onChange={setCat}
          />
          <View style={{ height: 10 }} />
        </View>
      }
      renderItem={({ item, index }) => <RecitationCard item={item} index={index + 1} />}
      ListFooterComponent={<Note>{t('reportNote')}</Note>}
    />
  );
}

// ---------------- 99 Names ----------------
export function NamesScreen() {
  const { settings, t, colors } = useSettings();
  const ur = settings.language === 'ur' || settings.language === 'roman' || settings.language === 'fa';
  return (
    <FlatList
      contentContainerStyle={pad}
      data={ASMA_UL_HUSNA}
      numColumns={2}
      keyExtractor={(n) => n[1]}
      columnWrapperStyle={{ justifyContent: 'space-between' }}
      ListHeaderComponent={<Header emoji="✨" title={t('names99')} />}
      renderItem={({ item, index }) => (
        <Pressable
          accessibilityRole="button"
          onPress={() => { Speech.stop(); Speech.speak(item[0], { language: 'ar-SA', rate: 0.8 }); }}
          style={[styles.name, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <Text style={{ color: colors.gold, fontSize: 11 }}>{index + 1}</Text>
          <Text style={{ color: colors.accent, fontSize: 26, fontFamily: 'AmiriQuran', lineHeight: 50 }}>{item[0]}</Text>
          <Text style={{ color: colors.text, fontWeight: '700' }}>{item[1]}</Text>
          <Text style={{ color: colors.muted, fontSize: 12, textAlign: 'center' }}>{ur ? item[3] : item[2]}</Text>
        </Pressable>
      )}
    />
  );
}

// ---------------- Islamic calendar ----------------
export function CalendarScreen({ timeZone }: { timeZone: string }) {
  const { settings, t, colors, rtl } = useSettings();
  const [shift, setShift] = useState(0);
  const [cat, setCat] = useState<EventCategory | 'all'>('all');
  const today = dayOf(localDateIn(new Date(), timeZone));
  const [picked, setPicked] = useState<number>(today.getTime());
  const days = useMemo(() => hijriMonth(today, settings.hijriOffset, shift), [today.getTime(), settings.hijriOffset, shift]);
  const events = useMemo(() => upcomingEvents(today, settings.hijriOffset, cat === 'all' ? undefined : [cat]), [today.getTime(), settings.hijriOffset, cat]);
  const months = HIJRI_MONTHS[settings.language];
  const first = days[0];
  const lead = first ? first.date.getUTCDay() : 0;
  const cells: (typeof days[number] | null)[] = [...Array(lead).fill(null), ...days];
  const gLocale = settings.language === 'tr' ? 'tr-TR' : 'en-GB';
  const gFmt = (d: Date, o: Intl.DateTimeFormatOptions) => d.toLocaleDateString(gLocale, { timeZone: 'UTC', ...o });
  const key = settings.language === 'ur' || settings.language === 'fa' ? 'ur' : settings.language === 'roman' ? 'roman' : 'en';
  const catOf = (e: IslamicEvent) => EVENT_CATEGORIES.find((c) => c.id === e.category)!;
  const pickedEvents = eventsOn(new Date(picked), settings.hijriOffset);
  const catLabel = (c: (typeof EVENT_CATEGORIES)[number]) => `${c.emoji} ${c[key]}`;
  return (
    <ScrollView contentContainerStyle={pad}>
      <Gradient from={colors.accent} to="#0B3B3B" style={{ padding: 16, marginBottom: 12 }}>
        <View style={{ flexDirection: rtl ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Pressable accessibilityLabel="previous month" onPress={() => setShift(shift - 1)} style={styles.arrow}><Text style={styles.arrowText}>‹</Text></Pressable>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: '#FFF', fontSize: 22, fontWeight: '800' }}>{first ? `${months[first.hijri.month - 1]} ${first.hijri.year}` : ''}</Text>
            {first && <Text style={{ color: '#FFFFFFCC' }}>{`${gFmt(first.date, { day: 'numeric', month: 'short' })} – ${gFmt(days[days.length - 1].date, { day: 'numeric', month: 'short', year: 'numeric' })}`}</Text>}
          </View>
          <Pressable accessibilityLabel="next month" onPress={() => setShift(shift + 1)} style={styles.arrow}><Text style={styles.arrowText}>›</Text></Pressable>
        </View>
      </Gradient>
      <View style={styles.week}>
        {WEEKDAYS[settings.language].map((w) => <Text key={w} style={[styles.wd, { color: colors.muted }]}>{w}</Text>)}
      </View>
      <View style={styles.week}>
        {cells.map((c, i) => {
          if (!c) return <View key={`e${i}`} style={styles.cell} />;
          const isToday = c.date.getTime() === today.getTime();
          const isPicked = c.date.getTime() === picked;
          const evs = eventsOn(c.date, settings.hijriOffset);
          return (
            <Pressable
              key={c.hijri.day}
              onPress={() => setPicked(c.date.getTime())}
              style={[styles.cell, { backgroundColor: isToday ? colors.accent : evs.length ? colors.gold + '33' : colors.card, borderColor: isPicked ? colors.accent : evs.length ? colors.gold : colors.border, borderWidth: isPicked ? 2 : 1 }]}
            >
              <Text style={{ color: isToday ? '#FFF' : colors.text, fontSize: 17, fontWeight: '700' }}>{c.hijri.day}</Text>
              <Text style={{ color: isToday ? '#FFFFFFCC' : colors.muted, fontSize: 10 }}>{gFmt(c.date, { day: 'numeric', month: 'short' })}</Text>
              {evs.length > 0 && <Text style={{ fontSize: 9 }}>{evs.slice(0, 3).map((e) => catOf(e).emoji).join('')}</Text>}
            </Pressable>
          );
        })}
      </View>
      {pickedEvents.length > 0 && (
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.gold, marginTop: 10 }]}>
          {pickedEvents.map((e) => (
            <Text key={e.id} style={{ color: colors.text, fontWeight: '700', marginBottom: 4, textAlign: rtl ? 'right' : 'left' }}>{`${catOf(e).emoji} ${e.name[key]}${e.year ? ` (${e.year})` : ''}`}</Text>
          ))}
        </View>
      )}
      <SectionTitle>{t('upcoming')}</SectionTitle>
      <View style={{ flexDirection: rtl ? 'row-reverse' : 'row', flexWrap: 'wrap', marginBottom: 8 }}>
        {[{ id: 'all' as const, label: t('allCats') }, ...EVENT_CATEGORIES.map((c) => ({ id: c.id, label: catLabel(c) }))].map((c) => (
          <Pressable key={c.id} onPress={() => setCat(c.id)} style={[styles.catChip, { backgroundColor: cat === c.id ? colors.accent : colors.card, borderColor: cat === c.id ? colors.accent : colors.border }]}>
            <Text style={{ color: cat === c.id ? '#FFF' : colors.text, fontWeight: '600' }}>{c.label}</Text>
          </Pressable>
        ))}
      </View>
      {events.map((e) => {
        const n = daysUntil(today, e.date);
        return (
          <View key={e.event.id} style={[styles.event, { backgroundColor: colors.card, borderColor: colors.border, flexDirection: rtl ? 'row-reverse' : 'row' }]}>
            <Text style={{ fontSize: 26, marginHorizontal: 6 }}>{catOf(e.event).emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.text, fontWeight: '700', textAlign: rtl ? 'right' : 'left' }}>{`${e.event.name[key]}${e.event.year ? ` (${e.event.year})` : ''}`}</Text>
              <Text style={{ color: colors.muted, textAlign: rtl ? 'right' : 'left' }}>{`${e.hijri.day} ${months[e.hijri.month - 1]} · ${gFmt(e.date, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}`}</Text>
            </View>
            <Text style={{ color: colors.accent, fontWeight: '800' }}>{n === 0 ? t('today') : `${n} ${t('daysLeft')}`}</Text>
          </View>
        );
      })}
      <Note>{t('calendarNote')}</Note>
    </ScrollView>
  );
}

// ---------------- Daily tracker ----------------
export function TrackerScreen({ timeZone }: { timeZone: string }) {
  const { settings, update, t, colors, rtl } = useSettings();
  const key = dateKey(localDateIn(new Date(), timeZone));
  const log = settings.tracker;
  const streak = prayerStreak(log, key);
  const week = lastDays(key, 7);
  const label = (i: TrackItem) => (i === 'quran' ? t('quranRead') : i === 'dhikr' ? t('dhikr') : t(i));
  return (
    <ScrollView contentContainerStyle={pad}>
      <Gradient from="#0E6E6E" to="#B08A3E" style={{ padding: 18, marginBottom: 14 }}>
        <Text style={{ color: '#FFF', fontSize: 16 }}>{t('streak')}</Text>
        <Text style={{ color: '#FFF', fontSize: 44, fontWeight: '900' }}>{`🔥 ${streak}`}</Text>
        {allPrayers(log[key]) && <Text style={{ color: '#FFF', fontWeight: '700' }}>{t('dayDone')}</Text>}
      </Gradient>
      <SectionTitle>{t('today')}</SectionTitle>
      <View style={{ flexDirection: rtl ? 'row-reverse' : 'row', flexWrap: 'wrap' }}>
        {TRACK_ITEMS.map((i) => {
          const on = !!log[key]?.[i];
          return (
            <Pressable
              key={i}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: on }}
              onPress={() => update({ tracker: toggle(log, key, i) })}
              style={[styles.check, { backgroundColor: on ? colors.accent : colors.card, borderColor: on ? colors.accent : colors.border }]}
            >
              <Text style={{ color: on ? '#FFF' : colors.text, fontWeight: '700' }}>{`${on ? '✓' : '○'} ${label(i)}`}</Text>
            </Pressable>
          );
        })}
      </View>
      <SectionTitle>7</SectionTitle>
      {week.map((k) => (
        <View key={k} style={[styles.weekRow, { borderBottomColor: colors.border, flexDirection: rtl ? 'row-reverse' : 'row' }]}>
          <Text style={{ color: colors.muted, width: 92 }}>{k.slice(5)}</Text>
          {TRACK_ITEMS.map((i) => (
            <View key={i} style={[styles.dot, { backgroundColor: log[k]?.[i] ? colors.accent : colors.border }]} />
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

// ---------------- Hajj, Umrah, greetings, live ----------------
export function HajjScreen() {
  const { settings, t, colors, rtl } = useSettings();
  const [tab, setTab] = useState<'umrah' | 'hajj' | 'duas' | 'greetings'>('umrah');
  return (
    <ScrollView contentContainerStyle={pad}>
      <Header emoji="🕋" title={t('hajjUmrah')} />
      <View style={{ flexDirection: rtl ? 'row-reverse' : 'row', marginBottom: 10 }}>
        {LIVE_LINKS.map((l) => (
          <Pressable key={l.id} accessibilityRole="link" onPress={() => { void Linking.openURL(l.url); }} style={[styles.live, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={{ color: '#E11D48', fontWeight: '800' }}>● LIVE</Text>
            <Text style={{ color: colors.text, fontWeight: '700' }}>{pick(l.title, settings.language)}</Text>
          </Pressable>
        ))}
      </View>
      <Segments
        items={[
          { id: 'umrah' as const, label: pick(UMRAH.title, settings.language) },
          { id: 'hajj' as const, label: pick(HAJJ.title, settings.language) },
          { id: 'duas' as const, label: t('duas') },
          { id: 'greetings' as const, label: t('greetings') },
        ]}
        value={tab}
        onChange={setTab}
      />
      <View style={{ height: 10 }} />
      {tab === 'umrah' && <TopicView topic={UMRAH} />}
      {tab === 'hajj' && <TopicView topic={HAJJ} />}
      {tab === 'duas' && ALL_DUAS.filter((d) => d.category === 'hajj' || d.category === 'travel').map((d, i) => <RecitationCard key={d.id} item={d} index={i + 1} />)}
      {tab === 'greetings' && GREETINGS.map((g) => (
        <Pressable key={g.id} onPress={() => { void Share.share({ message: `${g.text}\n\n— Qiblanuma` }); }} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.gold }]}>
          <Text style={{ color: colors.gold, fontWeight: '800', fontSize: 16 }}>{`🌙 ${pick(g.title, settings.language)}`}</Text>
          <Text style={{ color: colors.text, marginTop: 6, lineHeight: 24 }}>{g.text}</Text>
          <Text style={{ color: colors.accent, marginTop: 6, fontWeight: '700' }}>↗ Share</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: 18, padding: 14, marginBottom: 12 },
  search: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, fontSize: 16, marginBottom: 8 },
  name: { width: '48.5%', borderWidth: 1, borderRadius: 18, padding: 10, marginBottom: 10, alignItems: 'center' },
  arrow: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFFFFF22', alignItems: 'center', justifyContent: 'center' },
  arrowText: { color: '#FFF', fontSize: 28, lineHeight: 30 },
  week: { flexDirection: 'row', flexWrap: 'wrap' },
  wd: { width: `${100 / 7}%`, textAlign: 'center', fontSize: 11, marginBottom: 4 },
  cell: { width: `${100 / 7 - 1}%`, margin: '0.5%', aspectRatio: 0.85, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  event: { borderWidth: 1, borderRadius: 16, padding: 12, marginBottom: 8, alignItems: 'center' },
  check: { borderWidth: 1, borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10, margin: 4 },
  weekRow: { alignItems: 'center', paddingVertical: 8, borderBottomWidth: StyleSheet.hairlineWidth },
  dot: { width: 18, height: 18, borderRadius: 9, marginHorizontal: 4 },
  bigPlay: { borderRadius: 20, padding: 16, marginBottom: 12 },
  activeStep: { borderWidth: 2, borderRadius: 20, padding: 6, marginBottom: 6 },
  catChip: { borderWidth: 1, borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6, margin: 3 },
  live: { flex: 1, borderWidth: 1, borderRadius: 16, padding: 12, marginHorizontal: 4 },
});
