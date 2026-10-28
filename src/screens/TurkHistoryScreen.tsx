import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { TURK_HISTORY } from '../data/turkHistory';
import { useSettings } from '../state/settings';
import { Note } from '../ui/components';
import { Gradient } from '../ui/kit';
import SufiIcon from '../ui/SufiIcon';

type Item = { kind: 'head'; id: string; title: string; count: number } | { kind: 'row'; key: string; row: [string, string, string, string] };

export default function TurkHistoryScreen() {
  const { settings, t, colors, rtl } = useSettings();
  const [open, setOpen] = useState<string | null>('ottoman');
  const [q, setQ] = useState('');
  const lang = settings.language;
  const titleOf = (s: (typeof TURK_HISTORY)[number]) => (lang === 'ur' || lang === 'fa' ? s.title.ur : lang === 'roman' ? s.title.roman : s.title.en);
  const items = useMemo<Item[]>(() => {
    const n = q.trim().toLowerCase();
    const out: Item[] = [];
    for (const s of TURK_HISTORY) {
      const rows = s.rows.filter((r) => !n || r.some((x) => x.toLowerCase().includes(n)));
      if (!rows.length) continue;
      out.push({ kind: 'head', id: s.id, title: titleOf(s), count: rows.length });
      if (open === s.id || n) rows.forEach((r, i) => out.push({ kind: 'row', key: `${s.id}${i}`, row: r }));
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, open, lang]);
  const align = rtl ? 'right' : 'left';
  return (
    <FlatList
      contentContainerStyle={{ padding: 16, paddingBottom: 48 }}
      data={items}
      keyExtractor={(x) => (x.kind === 'head' ? x.id : x.key)}
      keyboardShouldPersistTaps="handled"
      ListHeaderComponent={
        <View>
          <Gradient from="#7A1E1E" to="#0B3B3B" style={{ padding: 18, marginBottom: 12 }}>
            <SufiIcon name="helmet" size={64} />
            <Text style={{ color: '#FFF', fontSize: 22, fontWeight: '800', marginTop: 6 }}>{t('turkHistory')}</Text>
            <Text style={{ color: '#FFFFFFCC', marginTop: 4 }}>{t('turkHistorySub')}</Text>
          </Gradient>
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder={`🔍 ${t('search')}`}
            placeholderTextColor={colors.muted}
            style={[styles.search, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card, textAlign: align }]}
          />
        </View>
      }
      renderItem={({ item }) =>
        item.kind === 'head' ? (
          <Pressable onPress={() => setOpen(open === item.id ? null : item.id)} style={[styles.head, { backgroundColor: colors.accent, flexDirection: rtl ? 'row-reverse' : 'row' }]}>
            <Text style={{ color: '#FFF', fontWeight: '800', fontSize: 16, flex: 1, textAlign: align }}>{item.title}</Text>
            <Text style={{ color: '#FFFFFFCC' }}>{`${item.count}  ${open === item.id || q ? '▾' : '▸'}`}</Text>
          </Pressable>
        ) : (
          <View style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={{ flexDirection: rtl ? 'row-reverse' : 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: colors.text, fontWeight: '800', fontSize: 15, flex: 1, textAlign: align }}>
                {lang === 'ur' || lang === 'fa' ? item.row[1] || item.row[0] : item.row[0]}
              </Text>
              {item.row[2] ? <Text style={{ color: colors.gold, fontWeight: '700' }}>{item.row[2]}</Text> : null}
            </View>
            {lang !== 'en' && lang !== 'ur' && item.row[1] ? <Text style={{ color: colors.muted, textAlign: align }}>{item.row[1]}</Text> : null}
            {item.row[3] ? <Text style={{ color: colors.text, marginTop: 4, lineHeight: 20, textAlign: align }}>{item.row[3]}</Text> : null}
          </View>
        )
      }
      ListFooterComponent={<Note>{t('reportNote')}</Note>}
    />
  );
}

const styles = StyleSheet.create({
  search: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, fontSize: 16, marginBottom: 10 },
  head: { borderRadius: 14, padding: 14, marginTop: 8, marginBottom: 6, alignItems: 'center' },
  row: { borderWidth: 1, borderRadius: 14, padding: 12, marginBottom: 6 },
});
