import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { findCity, type City } from '../data/cities';
import { addDays, computePrayerTimes, nextPrayer } from '../engine/prayerTimes';
import { formatClock, localDateIn } from '../engine/timezone';
import { moveCity, toggleCity } from '../state/cityList';
import { useSettings } from '../state/settings';
import { Note, Title, useNow } from '../ui/components';
import AddCityModal from './AddCityModal';

interface CityNow {
  city: City;
  localTime: string;
  next: { name: string; time: string };
}

export default function WorldScreen() {
  const { settings, update, t, colors, rtl } = useSettings();
  const now = useNow(30000);
  const minuteKey = Math.floor(now.getTime() / 60000);
  const [editing, setEditing] = useState(false);
  const [picking, setPicking] = useState(false);
  const list = settings.worldCities;

  const rows = useMemo<CityNow[]>(
    () =>
      list
        .map((id) => findCity(id))
        .filter((c): c is City => !!c)
        .map((city) => {
          const coords = { latitude: city.latitude, longitude: city.longitude };
          // Each city uses its own country's method with the user's Asr school.
          const s = { ...settings.prayer, method: city.method };
          const day = localDateIn(now, city.timeZone);
          const np = nextPrayer(computePrayerTimes(day, coords, s), computePrayerTimes(addDays(day, 1), coords, s), now);
          return {
            city,
            localTime: formatClock(now, city.timeZone, settings.use24h),
            next: { name: np.name, time: formatClock(np.time, city.timeZone, settings.use24h) },
          };
        }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [minuteKey, list, settings.prayer, settings.use24h],
  );

  const dir = rtl ? 'row-reverse' : 'row';
  const cityName = (c: City) => (settings.language === 'ur' ? c.name.ur : c.name.en);

  return (
    <>
      <FlatList
        contentContainerStyle={styles.pad}
        data={rows}
        keyExtractor={(r) => r.city.id}
        ListHeaderComponent={
          <View style={[styles.header, { flexDirection: dir }]}>
            <Title>{t('worldTitle')}</Title>
            <View style={{ flexDirection: dir }}>
              <SmallButton label={editing ? t('done') : t('edit')} onPress={() => setEditing(!editing)} />
              <SmallButton label={t('addCity')} onPress={() => setPicking(true)} strong />
            </View>
          </View>
        }
        ListEmptyComponent={<Note>{t('noCities')}</Note>}
        renderItem={({ item }) => (
          <View style={[styles.item, { borderColor: colors.border, backgroundColor: colors.card, flexDirection: dir }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.city, { color: colors.text, textAlign: rtl ? 'right' : 'left' }]}>{cityName(item.city)}</Text>
              <Text style={{ color: colors.muted, textAlign: rtl ? 'right' : 'left' }}>
                {t('nextAt')}: {t(item.next.name as 'fajr')} {item.next.time}
              </Text>
            </View>
            {editing ? (
              <View style={{ flexDirection: dir }}>
                <IconButton label="↑" onPress={() => update({ worldCities: moveCity(list, item.city.id, -1) })} />
                <IconButton label="↓" onPress={() => update({ worldCities: moveCity(list, item.city.id, 1) })} />
                <IconButton label="✕" danger onPress={() => update({ worldCities: toggleCity(list, item.city.id) })} />
              </View>
            ) : (
              <Text style={[styles.time, { color: colors.accent }]}>{item.localTime}</Text>
            )}
          </View>
        )}
      />
      <AddCityModal
        visible={picking}
        selected={list}
        onToggle={(id) => update({ worldCities: toggleCity(list, id) })}
        onClose={() => setPicking(false)}
      />
    </>
  );
}

function SmallButton({ label, onPress, strong }: { label: string; onPress: () => void; strong?: boolean }) {
  const { colors } = useSettings();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.small, { borderColor: colors.accent, backgroundColor: strong ? colors.accent : 'transparent' }]}
    >
      <Text style={{ color: strong ? colors.card : colors.accent, fontWeight: '600' }}>{label}</Text>
    </Pressable>
  );
}

function IconButton({ label, onPress, danger }: { label: string; onPress: () => void; danger?: boolean }) {
  const { colors } = useSettings();
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={[styles.icon, { borderColor: colors.border }]}>
      <Text style={{ color: danger ? colors.danger : colors.accent, fontSize: 18 }}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pad: { padding: 16 },
  header: { justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  item: { borderWidth: 1, borderRadius: 12, padding: 14, marginBottom: 10, alignItems: 'center' },
  city: { fontSize: 18, fontWeight: '600', marginBottom: 2 },
  time: { fontSize: 22, fontWeight: '700', fontVariant: ['tabular-nums'] },
  small: { borderWidth: 1, borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6, marginLeft: 8 },
  icon: { width: 36, height: 34, borderWidth: 1, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginLeft: 6 },
});
