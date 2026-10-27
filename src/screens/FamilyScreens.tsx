import * as Speech from 'expo-speech';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { calculateZakat } from '../engine/zakat';
import { useSettings } from '../state/settings';
import { Card, Chip, Note, Row, Title } from '../ui/components';

// ---------------- Masmat Maktab: Qaida ----------------
// Lesson 1: the letters (mufradat) in Noorani Qaida order. Lessons 2-3 add
// harakat and tanween to each letter. Tapping a letter says it with the phone's
// Arabic voice; recorded lessons by a qualified teacher can replace this later.
export const QAIDA_LETTERS = ['ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'و', 'ه', 'ء', 'ي'];
const MARKS: { id: string; label: string; marks: string[] }[] = [
  { id: 'mufradat', label: 'مفردات', marks: [''] },
  { id: 'harakat', label: 'حرکات', marks: ['َ', 'ِ', 'ُ'] },
  { id: 'tanween', label: 'تنوین', marks: ['ً', 'ٍ', 'ٌ'] },
];

export function MaktabScreen() {
  const { t, colors } = useSettings();
  const [lesson, setLesson] = useState(0);
  const L = MARKS[lesson];
  return (
    <ScrollView contentContainerStyle={styles.pad}>
      <Title>{t('maktab')}</Title>
      <View style={styles.row}>
        {MARKS.map((m, i) => <Chip key={m.id} label={`${i + 1}. ${m.label}`} active={i === lesson} onPress={() => setLesson(i)} />)}
      </View>
      <View style={styles.grid}>
        {QAIDA_LETTERS.flatMap((l) => L.marks.map((mk) => l === 'ء' && mk === '' ? l : `${l === 'ا' && mk ? 'أ' : l}${mk}`)).map((g, i) => (
          <Pressable
            key={`${g}-${i}`}
            accessibilityRole="button"
            onPress={() => Speech.speak(g, { language: 'ar-SA', rate: 0.7 })}
            style={[styles.cell, { borderColor: colors.border, backgroundColor: colors.card }]}
          >
            <Text style={[styles.letter, { color: colors.accent, fontFamily: 'AmiriQuran' }]}>{g}</Text>
          </Pressable>
        ))}
      </View>
      <Note>{t('maktabNote')}</Note>
    </ScrollView>
  );
}

// ---------------- Fatima: khatam tracker ----------------
export function KhatamScreen() {
  const { settings, update, t, colors } = useSettings();
  const k = settings.khatam;
  const done = k.paras.filter(Boolean).length;
  const toggle = (i: number) => update({ khatam: { ...k, paras: k.paras.map((v, j) => (j === i ? !v : v)) } });
  return (
    <ScrollView contentContainerStyle={styles.pad}>
      <Title>{t('khatam')}</Title>
      <Card>
        <Row left={t('parasRead')} right={`${done} / 30`} strong />
        <Row left={t('khatamsDone')} right={String(k.completed)} />
      </Card>
      <View style={styles.grid}>
        {k.paras.map((v, i) => (
          <Pressable
            key={i}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: v }}
            onPress={() => toggle(i)}
            style={[styles.para, { borderColor: v ? colors.gold : colors.border, backgroundColor: v ? colors.accent : colors.card }]}
          >
            <Text style={{ color: v ? colors.card : colors.text, fontWeight: '700' }}>{i + 1}</Text>
          </Pressable>
        ))}
      </View>
      {done === 30 && (
        <Pressable
          accessibilityRole="button"
          onPress={() => update({ khatam: { paras: Array(30).fill(false), completed: k.completed + 1 } })}
          style={[styles.big, { backgroundColor: colors.gold }]}
        >
          <Text style={{ color: colors.card, fontWeight: '700', fontSize: 17 }}>{t('khatamComplete')}</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

// ---------------- Halima: kalimas for children ----------------
// Only the two kalimas whose wording is fixed are included until the
// reviewing scholars supply the full six with their agreed wording.
const KALIMAS = [
  { n: 1, name: 'کلمہ طیب', ar: 'لَا إِلٰهَ إِلَّا اللّٰهُ مُحَمَّدٌ رَّسُوْلُ اللّٰهِ' },
  { n: 2, name: 'کلمہ شہادت', ar: 'أَشْهَدُ أَنْ لَّا إِلٰهَ إِلَّا اللّٰهُ وَحْدَهُ لَا شَرِيْكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُوْلُهُ' },
];

export function HalimaScreen() {
  const { t, colors } = useSettings();
  return (
    <ScrollView contentContainerStyle={styles.pad}>
      <Title>{t('halima')}</Title>
      {KALIMAS.map((k) => (
        <Pressable key={k.n} onPress={() => Speech.speak(k.ar, { language: 'ar-SA', rate: 0.75 })}>
          <Card>
            <Text style={{ color: colors.gold, fontWeight: '700', textAlign: 'right' }}>{`${k.n}. ${k.name}`}</Text>
            <Text style={[styles.kalima, { color: colors.text, fontFamily: 'AmiriQuran' }]}>{k.ar}</Text>
          </Card>
        </Pressable>
      ))}
      <Note>{t('halimaNote')}</Note>
    </ScrollView>
  );
}

// ---------------- Zakat calculator ----------------
const FIELDS = ['cash', 'goldGrams', 'goldPricePerGram', 'silverGrams', 'silverPricePerGram', 'businessStock', 'receivables', 'debts'] as const;

export function ZakatScreen() {
  const { t, colors } = useSettings();
  const [v, setV] = useState<Record<(typeof FIELDS)[number], string>>(
    Object.fromEntries(FIELDS.map((f) => [f, ''])) as Record<(typeof FIELDS)[number], string>,
  );
  const num = (s: string) => Number(s.replace(/,/g, '')) || 0;
  const r = calculateZakat(Object.fromEntries(FIELDS.map((f) => [f, num(v[f])])) as unknown as Parameters<typeof calculateZakat>[0]);
  const fmt = (x: number) => Math.round(x).toLocaleString();
  return (
    <ScrollView contentContainerStyle={styles.pad} keyboardShouldPersistTaps="handled">
      <Title>{t('zakat')}</Title>
      {FIELDS.map((f) => (
        <View key={f} style={[styles.field, { borderBottomColor: colors.border }]}>
          <Text style={{ color: colors.text, flex: 1 }}>{t(`z_${f}` as 'z_cash')}</Text>
          <TextInput
            value={v[f]}
            onChangeText={(s) => setV({ ...v, [f]: s })}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor={colors.muted}
            style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card }]}
          />
        </View>
      ))}
      <Card style={{ marginTop: 14, borderColor: r.due ? colors.gold : colors.border }}>
        <Row left={t('z_total')} right={fmt(r.total)} />
        <Row left={t('z_nisab')} right={r.nisab > 0 ? fmt(r.nisab) : '—'} />
        <Row left={t('z_due')} right={r.due ? fmt(r.zakat) : t('z_notDue')} strong />
      </Card>
      <Note>{t('zakatNote')}</Note>
    </ScrollView>
  );
}

// ---------------- Dedication ----------------
export function Dedication() {
  const { t, colors } = useSettings();
  return (
    <View style={[styles.dedication, { borderColor: colors.gold }]}>
      <Text style={{ color: colors.gold, fontWeight: '700', textAlign: 'center' }}>{t('dedicationTitle')}</Text>
      <Text style={{ color: colors.text, textAlign: 'center', marginTop: 6, lineHeight: 22 }}>{t('dedication')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pad: { padding: 16, paddingBottom: 40 },
  row: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 },
  grid: { flexDirection: 'row-reverse', flexWrap: 'wrap', justifyContent: 'flex-start' },
  cell: { width: '22%', aspectRatio: 1, margin: '1.5%', borderWidth: 1, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  letter: { fontSize: 38 },
  para: { width: '16%', aspectRatio: 1, margin: '2%', borderWidth: 1.5, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  big: { marginTop: 16, borderRadius: 16, padding: 16, alignItems: 'center' },
  kalima: { fontSize: 26, lineHeight: 52, textAlign: 'right', writingDirection: 'rtl', marginTop: 6 },
  field: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: StyleSheet.hairlineWidth },
  input: { width: 130, borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8, textAlign: 'right' },
  dedication: { marginHorizontal: 16, marginTop: 8, marginBottom: 16, borderWidth: 1, borderRadius: 16, padding: 14 },
});
