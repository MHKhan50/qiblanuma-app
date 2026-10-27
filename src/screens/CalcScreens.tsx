import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, Share, StyleSheet, Text, TextInput, View } from 'react-native';
import { BOY_NAMES, GIRL_NAMES } from '../data/learn/names';
import { distribute, netEstate, NO_HEIRS, type HeirKey, type Heirs } from '../engine/inheritance';
import { calculateUshr, KG_PER_MAUND, type Irrigation } from '../engine/ushr';
import type { StringKey } from '../i18n/strings';
import { useSettings } from '../state/settings';
import SufiIcon, { EMOJI_ICON } from '../ui/SufiIcon';
import { Card, Note, Row } from '../ui/components';
import { Gradient, Segments } from '../ui/kit';

const pad = { padding: 16, paddingBottom: 48 };
const num = (s: string) => Number(s.replace(/,/g, '')) || 0;
const fmt = (x: number) => (Math.round(x * 100) / 100).toLocaleString();

function Hero({ emoji, title }: { emoji: string; title: string }) {
  const { colors } = useSettings();
  return (
    <Gradient from={colors.accent} to="#0B3B3B" style={{ padding: 18, marginBottom: 14 }}>
      {EMOJI_ICON[emoji] ? <SufiIcon name={EMOJI_ICON[emoji]} size={64} /> : <Text style={{ fontSize: 40 }}>{emoji}</Text>}
      <Text style={{ color: '#FFF', fontSize: 22, fontWeight: '800', marginTop: 6 }}>{title}</Text>
    </Gradient>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (s: string) => void }) {
  const { colors, rtl } = useSettings();
  return (
    <View style={[styles.field, { borderBottomColor: colors.border, flexDirection: rtl ? 'row-reverse' : 'row' }]}>
      <Text style={{ color: colors.text, flex: 1, textAlign: rtl ? 'right' : 'left' }}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        keyboardType="numeric"
        placeholder="0"
        placeholderTextColor={colors.muted}
        style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card }]}
      />
    </View>
  );
}

// ---------------- Islamic names ----------------
export function BabyNamesScreen() {
  const { settings, t, colors, rtl } = useSettings();
  const [g, setG] = useState<'boys' | 'girls'>('boys');
  const [q, setQ] = useState('');
  const list = useMemo(() => {
    const n = q.trim().toLowerCase();
    return (g === 'boys' ? BOY_NAMES : GIRL_NAMES).filter((r) => !n || r.some((x) => x.toLowerCase().includes(n)));
  }, [g, q]);
  const ur = settings.language === 'ur' || settings.language === 'roman' || settings.language === 'fa';
  return (
    <FlatList
      contentContainerStyle={pad}
      data={list}
      keyExtractor={(r) => r[0]}
      keyboardShouldPersistTaps="handled"
      ListHeaderComponent={
        <View>
          <Hero emoji="👶" title={t('babyNames')} />
          <Segments items={[{ id: 'boys' as const, label: `👦 ${t('boys')} (${BOY_NAMES.length})` }, { id: 'girls' as const, label: `👧 ${t('girls')} (${GIRL_NAMES.length})` }]} value={g} onChange={setG} />
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder={`🔍 ${t('search')}`}
            placeholderTextColor={colors.muted}
            style={[styles.search, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card, textAlign: rtl ? 'right' : 'left' }]}
          />
        </View>
      }
      renderItem={({ item }) => (
        <Pressable
          onPress={() => { void Share.share({ message: `${item[0]} (${item[1]})\n${item[2]}\n${item[3]}\n\n— Qiblanuma` }); }}
          style={[styles.nameRow, { backgroundColor: colors.card, borderColor: colors.border, flexDirection: rtl ? 'row-reverse' : 'row' }]}
        >
          <View style={[styles.initial, { backgroundColor: g === 'boys' ? colors.accent : '#B4537A' }]}>
            <Text style={{ color: '#FFF', fontSize: 20, fontWeight: '800' }}>{item[1].charAt(0)}</Text>
          </View>
          <View style={{ flex: 1, marginHorizontal: 12 }}>
            <Text style={{ color: colors.text, fontSize: 17, fontWeight: '800', textAlign: rtl ? 'right' : 'left' }}>{`${item[0]}  ·  ${item[1]}`}</Text>
            <Text style={{ color: colors.muted, textAlign: rtl ? 'right' : 'left' }}>{ur ? item[3] : item[2]}</Text>
          </View>
          <Text style={{ color: colors.accent }}>↗</Text>
        </Pressable>
      )}
    />
  );
}

// ---------------- Ushr ----------------
export function UshrScreen() {
  const { t, colors } = useSettings();
  const [qty, setQty] = useState('');
  const [unit, setUnit] = useState<'maund' | 'kg'>('maund');
  const [irr, setIrr] = useState<Irrigation>('rain');
  const [paidPct, setPaidPct] = useState('50');
  const [price, setPrice] = useState('');
  const r = calculateUshr({ quantity: num(qty), irrigation: irr, paidShare: num(paidPct) / 100, pricePerUnit: num(price) || undefined });
  const unitLabel = unit === 'maund' ? 'maund (40 kg)' : 'kg';
  const other = unit === 'maund' ? `${fmt(r.due * KG_PER_MAUND)} kg` : `${fmt(r.due / KG_PER_MAUND)} maund`;
  return (
    <ScrollView contentContainerStyle={pad} keyboardShouldPersistTaps="handled">
      <Hero emoji="🌾" title={t('ushr')} />
      <Segments items={[{ id: 'maund' as const, label: 'Maund (من)' }, { id: 'kg' as const, label: 'kg' }]} value={unit} onChange={setUnit} />
      <Field label={`${t('ushrQty')} (${unitLabel})`} value={qty} onChange={setQty} />
      {(['rain', 'paid', 'mixed'] as const).map((k) => (
        <Pressable key={k} onPress={() => setIrr(k)} style={[styles.option, { borderColor: irr === k ? colors.accent : colors.border, backgroundColor: irr === k ? colors.accent + '18' : colors.card }]}>
          <Text style={{ color: colors.text, fontWeight: irr === k ? '800' : '500' }}>{`${irr === k ? '◉' : '○'}  ${k === 'rain' ? `🌧️ ${t('ushrRain')}` : k === 'paid' ? `🚰 ${t('ushrPaid')}` : `🔀 ${t('ushrMixed')}`}`}</Text>
        </Pressable>
      ))}
      {irr === 'mixed' && <Field label={t('ushrPaidShare')} value={paidPct} onChange={setPaidPct} />}
      <Field label={t('ushrPrice')} value={price} onChange={setPrice} />
      <Card style={{ marginTop: 14, borderColor: colors.gold }}>
        <Row left="%" right={`${r.rate * 100}%`} />
        <Row left={t('ushrDue')} right={`${fmt(r.due)} ${unit}  (${other})`} strong />
        {r.value !== null && <Row left={t('ushrValue')} right={fmt(r.value)} strong />}
      </Card>
      <Note>{t('ushrNote')}</Note>
    </ScrollView>
  );
}

// ---------------- Inheritance ----------------
const HEIR_FIELDS: { key: keyof Heirs; max: number }[] = [
  { key: 'husband', max: 1 }, { key: 'wives', max: 4 }, { key: 'sons', max: 30 }, { key: 'daughters', max: 30 },
  { key: 'father', max: 1 }, { key: 'mother', max: 1 }, { key: 'sonsSons', max: 30 }, { key: 'sonsDaughters', max: 30 },
  { key: 'grandfather', max: 1 }, { key: 'grandmothers', max: 2 }, { key: 'paternalGrandmother', max: 1 },
  { key: 'fullBrothers', max: 30 }, { key: 'fullSisters', max: 30 }, { key: 'paternalBrothers', max: 30 },
  { key: 'paternalSisters', max: 30 }, { key: 'maternalSiblings', max: 30 },
];

export function MirathScreen() {
  const { t, colors, rtl } = useSettings();
  const [estate, setEstate] = useState('');
  const [funeral, setFuneral] = useState('');
  const [debts, setDebts] = useState('');
  const [will, setWill] = useState('');
  const [h, setH] = useState<Heirs>({ ...NO_HEIRS });
  const set = (k: keyof Heirs, v: number, max: number) => {
    const next = { ...h, [k]: Math.max(0, Math.min(max, v)) };
    if (k === 'husband' && v > 0) next.wives = 0;
    if (k === 'wives' && v > 0) next.husband = 0;
    if (next.paternalGrandmother > next.grandmothers) next.paternalGrandmother = next.grandmothers;
    setH(next);
  };
  const any = HEIR_FIELDS.some((f) => f.key !== 'paternalGrandmother' && h[f.key] > 0);
  const net = netEstate(num(estate), num(funeral), num(debts), num(will));
  const res = any ? distribute(h) : null;
  const label = (k: HeirKey | 'paternalGrandmother') => t(`h_${k}` as StringKey);
  return (
    <ScrollView contentContainerStyle={pad} keyboardShouldPersistTaps="handled">
      <Hero emoji="⚖️" title={t('mirath')} />
      <Field label={`💰 ${t('estate')}`} value={estate} onChange={setEstate} />
      <Field label={`🕊️ ${t('funeral')}`} value={funeral} onChange={setFuneral} />
      <Field label={`📄 ${t('debtsOwed')}`} value={debts} onChange={setDebts} />
      <Field label={`✍️ ${t('wasiyyat')}`} value={will} onChange={setWill} />
      <Card style={{ marginTop: 12 }}>
        <Row left={t('netEstate')} right={fmt(net.net)} strong />
        {net.capped && <Note>{t('wasiyyatCapped')}</Note>}
      </Card>

      <Text style={[styles.h2, { color: colors.text, textAlign: rtl ? 'right' : 'left' }]}>{`👪 ${t('heirsTitle')}`}</Text>
      {HEIR_FIELDS.map((f) => {
        if (f.key === 'paternalGrandmother' && h.grandmothers === 0) return null;
        return (
          <View key={f.key} style={[styles.field, { borderBottomColor: colors.border, flexDirection: rtl ? 'row-reverse' : 'row' }]}>
            <Text style={{ color: colors.text, flex: 1, textAlign: rtl ? 'right' : 'left', paddingLeft: f.key === 'paternalGrandmother' ? 16 : 0 }}>{label(f.key)}</Text>
            <Step label="−" onPress={() => set(f.key, h[f.key] - 1, f.max)} />
            <Text style={{ color: colors.text, width: 36, textAlign: 'center', fontWeight: '700' }}>{h[f.key]}</Text>
            <Step label="+" onPress={() => set(f.key, h[f.key] + 1, f.max)} />
          </View>
        );
      })}

      {res && (
        <View style={{ marginTop: 16 }}>
          {res.shares.map((s) => (
            <View key={s.heir} style={[styles.result, { backgroundColor: s.blocked ? colors.bg : colors.card, borderColor: s.blocked ? colors.border : colors.gold, flexDirection: rtl ? 'row-reverse' : 'row' }]}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.text, fontWeight: '800', textAlign: rtl ? 'right' : 'left' }}>{`${label(s.heir)} × ${s.count}`}</Text>
                <Text style={{ color: colors.muted, fontSize: 12, textAlign: rtl ? 'right' : 'left' }}>{s.blocked ? `${t('blocked')} (${s.basis})` : s.basis}</Text>
              </View>
              {!s.blocked && (
                <View style={{ alignItems: rtl ? 'flex-start' : 'flex-end' }}>
                  <Text style={{ color: colors.accent, fontWeight: '900', fontSize: 16 }}>{`${s.total.toString()}  (${fmt(s.total.value() * 100)}%)`}</Text>
                  {net.net > 0 && <Text style={{ color: colors.text }}>{fmt(s.total.value() * net.net)}</Text>}
                  {s.count > 1 && net.net > 0 && <Text style={{ color: colors.muted, fontSize: 12 }}>{`${fmt(s.each.value() * net.net)} ${t('each')}`}</Text>}
                </View>
              )}
            </View>
          ))}
          {res.awl && <Note>{t('awlNote')}</Note>}
          {res.radd && <Note>{t('raddNote')}</Note>}
          {res.warnings.map((w) => <Note key={w}>{`⚠️ ${w}`}</Note>)}
        </View>
      )}
      <Note>{t('mirathNote')}</Note>
    </ScrollView>
  );
}

function Step({ label, onPress }: { label: string; onPress: () => void }) {
  const { colors } = useSettings();
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={[styles.step, { borderColor: colors.border }]}>
      <Text style={{ color: colors.accent, fontSize: 20 }}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  field: { alignItems: 'center', paddingVertical: 8, borderBottomWidth: StyleSheet.hairlineWidth },
  input: { width: 140, borderWidth: 1, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 8, textAlign: 'right' },
  search: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, fontSize: 16, marginVertical: 10 },
  nameRow: { borderWidth: 1, borderRadius: 16, padding: 12, marginBottom: 8, alignItems: 'center' },
  initial: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  option: { borderWidth: 1.5, borderRadius: 14, padding: 12, marginTop: 8 },
  h2: { fontSize: 18, fontWeight: '800', marginTop: 18, marginBottom: 4 },
  step: { width: 38, height: 34, borderWidth: 1, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  result: { borderWidth: 1, borderRadius: 16, padding: 12, marginBottom: 8, alignItems: 'center' },
});
