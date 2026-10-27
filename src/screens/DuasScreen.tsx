import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { arabicNumber, QURAN, QURAN_FONT } from '../data/quran';
import { QURANIC_DUAS } from '../data/quran/duas';
import { useSettings } from '../state/settings';
import { Note } from '../ui/components';

export default function DuasScreen() {
  const { settings, t, colors } = useSettings();
  if (QURAN.suras.length === 0) return <View style={styles.pad}><Note>{t('quranMissing')}</Note></View>;
  return (
    <FlatList
      contentContainerStyle={styles.pad}
      data={QURANIC_DUAS}
      keyExtractor={(d) => `${d.sura}:${d.from}`}
      ListHeaderComponent={<Note>{t('duasNote')}</Note>}
      renderItem={({ item }) => {
        const sura = QURAN.suras[item.sura - 1];
        const ayahs = sura.ayahs.slice(item.from - 1, item.to);
        const ref = item.from === item.to ? `${item.from}` : `${item.from}–${item.to}`;
        return (
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.arabic, { color: colors.text, fontFamily: QURAN_FONT.uthmani, fontSize: settings.quranFontSize - 2 }]}>
              {ayahs.map((a, i) => `${a} ﴿${arabicNumber(item.from + i)}﴾`).join(' ')}
            </Text>
            <Text style={{ color: colors.gold, marginTop: 6 }}>{`${sura.tname} (${sura.name}) ${item.sura}:${ref}`}</Text>
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  pad: { padding: 16 },
  card: { borderWidth: 1, borderRadius: 16, padding: 14, marginTop: 12 },
  arabic: { writingDirection: 'rtl', textAlign: 'right', lineHeight: 52 },
});
