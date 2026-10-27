import React, { useMemo, useState } from 'react';
import { Modal, Pressable, SectionList, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { searchGroups } from '../state/cityList';
import { useSettings } from '../state/settings';

interface Props {
  visible: boolean;
  selected: string[];
  onToggle: (id: string) => void;
  onClose: () => void;
}

export default function AddCityModal({ visible, selected, onToggle, onClose }: Props) {
  const { settings, t, colors, rtl } = useSettings();
  const [query, setQuery] = useState('');
  const sections = useMemo(() => searchGroups(query), [query]);
  const lang = settings.language;
  const align = rtl ? 'right' : 'left';

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
        <View style={[styles.top, { flexDirection: rtl ? 'row-reverse' : 'row', borderBottomColor: colors.border }]}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={t('searchCity')}
            placeholderTextColor={colors.muted}
            autoCorrect={false}
            style={[styles.search, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card, textAlign: align }]}
          />
          <Pressable accessibilityRole="button" onPress={onClose} style={styles.done}>
            <Text style={{ color: colors.accent, fontWeight: '700', fontSize: 16 }}>{t('done')}</Text>
          </Pressable>
        </View>
        <SectionList
          sections={sections.map((s) => ({ key: s.group.id, group: s.group, data: s.data }))}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          stickySectionHeadersEnabled
          contentContainerStyle={{ paddingBottom: 40 }}
          renderSectionHeader={({ section }) => (
            <View style={[styles.sectionHead, { backgroundColor: colors.bg }]}>
              <Text style={[styles.sectionTitle, { color: colors.gold, textAlign: align }]}>
                {lang === 'ur' ? section.group.name.ur : lang === 'en' ? section.group.name.en : section.group.name.roman}
              </Text>
              {lang !== 'en' && (
                <Text style={{ color: colors.muted, fontSize: 12, textAlign: align }}>{section.group.name.en}</Text>
              )}
            </View>
          )}
          renderItem={({ item }) => {
            const on = selected.includes(item.id);
            return (
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: on }}
                onPress={() => onToggle(item.id)}
                style={[styles.row, { flexDirection: rtl ? 'row-reverse' : 'row', borderBottomColor: colors.border }]}
              >
                <Text style={{ color: colors.text, fontSize: 17, flex: 1, textAlign: align }}>
                  {lang === 'ur' ? item.name.ur : item.name.en}
                </Text>
                <Text style={{ color: on ? colors.accent : colors.muted, fontSize: 15 }}>{on ? `✓ ${t('added')}` : '+'}</Text>
              </Pressable>
            );
          }}
        />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  top: { padding: 12, alignItems: 'center', borderBottomWidth: StyleSheet.hairlineWidth },
  search: { flex: 1, borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16 },
  done: { paddingHorizontal: 12, paddingVertical: 8 },
  sectionHead: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 6 },
  sectionTitle: { fontSize: 16, fontWeight: '700' },
  row: { paddingHorizontal: 16, paddingVertical: 13, borderBottomWidth: StyleSheet.hairlineWidth, alignItems: 'center' },
});
