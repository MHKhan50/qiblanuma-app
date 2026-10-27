import React, { useMemo, useState } from 'react';
import { Linking, Platform, Pressable, ScrollView, Share, StyleSheet, Text, TextInput, View } from 'react-native';
import { arabicNumber, ayahOfDay, QURAN, QURAN_FONT, TRANSLATIONS, translationOf } from '../data/quran';
import { PRAYER_ORDER } from '../engine/methods';
import { addDays, computePrayerTimes } from '../engine/prayerTimes';
import { formatClock, localDateIn } from '../engine/timezone';
import { useAudio } from '../state/audio';
import { useSettings } from '../state/settings';
import SufiIcon, { EMOJI_ICON } from '../ui/SufiIcon';
import type { PlaceState } from '../state/usePlace';
import { Note } from '../ui/components';
import { Gradient } from '../ui/kit';

const pad = { padding: 16, paddingBottom: 48 };

function Hero({ emoji, title, sub }: { emoji: string; title: string; sub?: string }) {
  const { colors } = useSettings();
  return (
    <Gradient from={colors.accent} to="#0B3B3B" style={{ padding: 18, marginBottom: 14 }}>
      {EMOJI_ICON[emoji] ? <SufiIcon name={EMOJI_ICON[emoji]} size={64} /> : <Text style={{ fontSize: 40 }}>{emoji}</Text>}
      <Text style={{ color: '#FFF', fontSize: 22, fontWeight: '800', marginTop: 6 }}>{title}</Text>
      {sub ? <Text style={{ color: '#FFFFFFCC', marginTop: 4 }}>{sub}</Text> : null}
    </Gradient>
  );
}

/** Ayah of the day card for the home screen. */
export function AyahOfDayCard() {
  const { settings, colors, rtl } = useSettings();
  const audio = useAudio();
  const day = Math.floor(Date.now() / 86400000);
  const pick = ayahOfDay(day);
  if (!pick) return null;
  const sura = QURAN.suras[pick.sura - 1];
  const text = sura.ayahs[pick.aya - 1];
  const tr = TRANSLATIONS.includes('ur') && settings.language !== 'en' ? translationOf('ur', pick.sura, pick.aya) : TRANSLATIONS.includes('en') ? translationOf('en', pick.sura, pick.aya) : null;
  const ref = `${sura.tname} ${pick.sura}:${pick.aya}`;
  return (
    <Gradient from="#B08A3E" to="#5B3A00" style={{ padding: 16, marginTop: 14 }}>
      <Text style={{ color: '#FFF', fontWeight: '800', textAlign: rtl ? 'right' : 'left' }}>{settings.language === 'ur' ? '📖 آج کی آیت' : '📖 Aaj ki ayat'}</Text>
      <Text style={{ color: '#FFF', fontFamily: QURAN_FONT.uthmani, fontSize: 24, lineHeight: 48, textAlign: 'right', writingDirection: 'rtl', marginTop: 6 }}>{`${text} ﴿${arabicNumber(pick.aya)}﴾`}</Text>
      {tr ? <Text style={{ color: '#FFFFFFE6', lineHeight: 24, textAlign: rtl || TRANSLATIONS.includes('ur') ? 'right' : 'left' }}>{tr}</Text> : null}
      <View style={{ flexDirection: rtl ? 'row-reverse' : 'row', marginTop: 10, alignItems: 'center' }}>
        <Text style={{ color: '#FFFFFFCC', flex: 1, textAlign: rtl ? 'right' : 'left' }}>{ref}</Text>
        {audio.available && (
          <Pressable onPress={() => audio.playRange(pick, pick)} style={styles.chip}><Text style={styles.chipText}>▶</Text></Pressable>
        )}
        <Pressable onPress={() => { void Share.share({ message: `${text}\n\n${tr ?? ''}\n(${ref})\n\n— Qiblanuma` }); }} style={styles.chip}><Text style={styles.chipText}>↗</Text></Pressable>
      </View>
    </Gradient>
  );
}

// ---------------- Mosques and halal food near me ----------------
export function NearbyScreen({ place }: { place: PlaceState }) {
  const { settings, colors, rtl } = useSettings();
  const ready = place.status === 'ready' ? place.place : null;
  const open = (q: string) => {
    const ll = ready ? `${ready.latitude},${ready.longitude}` : '';
    const url = Platform.OS === 'ios'
      ? `maps://?q=${encodeURIComponent(q)}${ll ? `&sll=${ll}` : ''}`
      : ll ? `geo:${ll}?q=${encodeURIComponent(q)}` : `https://www.google.com/maps/search/${encodeURIComponent(q)}`;
    Linking.openURL(url).catch(() => Linking.openURL(`https://www.google.com/maps/search/${encodeURIComponent(q)}${ll ? `/@${ll},14z` : ''}`));
  };
  const ur = settings.language === 'ur';
  const items = [
    { emoji: '🕌', title: ur ? 'قریبی مساجد' : 'Masjids near me', q: 'mosque' },
    { emoji: '🍽️', title: ur ? 'حلال کھانا' : 'Halal food near me', q: 'halal restaurant' },
    { emoji: '🥩', title: ur ? 'حلال قصاب' : 'Halal butcher', q: 'halal butcher' },
    { emoji: '📚', title: ur ? 'اسلامی کتب خانہ' : 'Islamic bookshop', q: 'islamic bookshop' },
    { emoji: '🏫', title: ur ? 'مدرسہ / قرآن کلاس' : 'Madrasa / Quran class', q: 'madrasa quran classes' },
  ];
  return (
    <ScrollView contentContainerStyle={pad}>
      <Hero emoji="📍" title={ur ? 'قریبی مساجد اور حلال' : 'Masjids and halal near me'} sub={ready?.label} />
      {items.map((it) => (
        <Pressable key={it.q} onPress={() => open(it.q)} style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border, flexDirection: rtl ? 'row-reverse' : 'row' }]}>
          <Text style={{ fontSize: 34 }}>{it.emoji}</Text>
          <Text style={{ color: colors.text, fontSize: 17, fontWeight: '700', flex: 1, marginHorizontal: 12, textAlign: rtl ? 'right' : 'left' }}>{it.title}</Text>
          <Text style={{ color: colors.accent, fontSize: 20 }}>›</Text>
        </Pressable>
      ))}
      <Note>{ur ? 'نقشہ آپ کے فون کی میپ ایپ میں کھلتا ہے۔ ایپ آپ کا مقام کہیں نہیں بھیجتی۔' : "Opens in your phone's maps app. Qiblanuma itself sends your location nowhere."}</Note>
    </ScrollView>
  );
}

// ---------------- Monthly prayer timetable ----------------
export function TimetableScreen({ place }: { place: PlaceState }) {
  const { settings, t, colors } = useSettings();
  const ready = place.status === 'ready' ? place.place : null;
  const rows = useMemo(() => {
    if (!ready) return [];
    const start = localDateIn(new Date(), ready.timeZone);
    return Array.from({ length: 30 }, (_, i) => {
      const d = addDays(start, i);
      const pt = computePrayerTimes(d, { latitude: ready.latitude, longitude: ready.longitude }, settings.prayer);
      return { d, times: PRAYER_ORDER.map((p) => formatClock(pt.times[p], ready.timeZone, settings.use24h).replace(/ (AM|PM)/, '')) };
    });
  }, [ready, settings.prayer, settings.use24h]);
  if (!ready) return <View style={pad}><Note>{t('locating')}</Note></View>;
  return (
    <ScrollView contentContainerStyle={pad}>
      <Hero emoji="🗓️" title={`${t('prayerTimes')} · 30`} sub={ready.label} />
      <View style={[styles.tr, { backgroundColor: colors.accent }]}>
        <Text style={[styles.td, { color: '#FFF', fontWeight: '800', flex: 1.2 }]}>#</Text>
        {PRAYER_ORDER.map((p) => <Text key={p} style={[styles.td, { color: '#FFF', fontWeight: '800' }]} numberOfLines={1}>{t(p)}</Text>)}
      </View>
      {rows.map((r, i) => (
        <View key={i} style={[styles.tr, { backgroundColor: i === 0 ? colors.gold + '33' : i % 2 ? colors.bg : colors.card }]}>
          <Text style={[styles.td, { color: colors.accent, fontWeight: '700', flex: 1.2 }]}>{`${r.d.day}/${r.d.month}`}</Text>
          {r.times.map((x, j) => <Text key={j} style={[styles.td, { color: colors.text }]}>{x}</Text>)}
        </View>
      ))}
      <Note>{t('makruhNote')}</Note>
    </ScrollView>
  );
}

// ---------------- Journal ----------------
export function JournalScreen() {
  const { settings, update, colors, rtl } = useSettings();
  const [text, setText] = useState('');
  const ur = settings.language === 'ur';
  const save = () => {
    if (!text.trim()) return;
    const entry = { id: String(Date.now()), date: new Date().toISOString(), text: text.trim() };
    update({ journal: [entry, ...settings.journal].slice(0, 500) });
    setText('');
  };
  const prompts = ur
    ? ['آج میں کس بات پر شکرگزار ہوں؟', 'آج کون سی نیکی کی؟', 'کل کس بات کی بہتری کروں گا؟', 'میری خاص دعائیں']
    : ['Aaj main kis baat par shukrguzar hoon?', 'Aaj kaunsi neki ki?', 'Kal kis baat mein behtari karunga?', 'Meri khaas duain'];
  return (
    <ScrollView contentContainerStyle={pad} keyboardShouldPersistTaps="handled">
      <Hero emoji="📔" title={ur ? 'روزنامچہ اور دعا ڈائری' : 'Journal aur dua diary'} />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 }}>
        {prompts.map((p) => (
          <Pressable key={p} onPress={() => setText(text ? `${text}\n${p} ` : `${p} `)} style={[styles.prompt, { borderColor: colors.border, backgroundColor: colors.card }]}>
            <Text style={{ color: colors.accent }}>{p}</Text>
          </Pressable>
        ))}
      </View>
      <TextInput
        value={text}
        onChangeText={setText}
        multiline
        placeholder={ur ? 'یہاں لکھیں…' : 'Yahan likhein…'}
        placeholderTextColor={colors.muted}
        style={[styles.box, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card, textAlign: rtl ? 'right' : 'left' }]}
      />
      <Pressable onPress={save} style={[styles.save, { backgroundColor: colors.accent }]}><Text style={{ color: '#FFF', fontWeight: '800' }}>{ur ? 'محفوظ کریں' : 'Save'}</Text></Pressable>
      {settings.journal.map((e) => (
        <View key={e.id} style={[styles.entry, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={{ flexDirection: rtl ? 'row-reverse' : 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: colors.gold, fontWeight: '700' }}>{new Date(e.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</Text>
            <Pressable onPress={() => update({ journal: settings.journal.filter((x) => x.id !== e.id) })}><Text style={{ color: colors.danger }}>✕</Text></Pressable>
          </View>
          <Text style={{ color: colors.text, marginTop: 6, lineHeight: 22, textAlign: rtl ? 'right' : 'left' }}>{e.text}</Text>
        </View>
      ))}
      <Note>{ur ? 'یہ باتیں صرف آپ کے فون پر رہتی ہیں۔' : 'Yeh sirf aap ke phone par rehta hai.'}</Note>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  chip: { backgroundColor: '#FFFFFF33', borderRadius: 14, paddingHorizontal: 12, paddingVertical: 6, marginLeft: 8 },
  chipText: { color: '#FFF', fontWeight: '800' },
  row: { borderWidth: 1, borderRadius: 18, padding: 14, marginBottom: 10, alignItems: 'center' },
  tr: { flexDirection: 'row', paddingVertical: 8 },
  td: { flex: 1, textAlign: 'center', fontSize: 12, fontVariant: ['tabular-nums'] },
  prompt: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 10, paddingVertical: 6, margin: 3 },
  box: { borderWidth: 1, borderRadius: 16, padding: 12, minHeight: 120, fontSize: 16, textAlignVertical: 'top' },
  save: { borderRadius: 14, padding: 12, alignItems: 'center', marginVertical: 10 },
  entry: { borderWidth: 1, borderRadius: 16, padding: 12, marginBottom: 8 },
});
