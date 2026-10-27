import React, { useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { ISLAMIC_CITIES, type City } from '../data/cities';
import { addDays, computePrayerTimes, nextPrayer } from '../engine/prayerTimes';
import { formatClock, localDateIn } from '../engine/timezone';
import { useSettings } from '../state/settings';
import { Title, useNow } from '../ui/components';

export interface CityNow {
  city: City;
  localTime: string;
  next: { name: string; time: string };
}

export default function WorldScreen() {
  const { settings, t, colors, rtl } = useSettings();
  const now = useNow(30000);
  const minuteKey = Math.floor(now.getTime() / 60000);

  const rows = useMemo<CityNow[]>(
    () =>
      ISLAMIC_CITIES.map((city) => {
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
    [minuteKey, settings.prayer, settings.use24h],
  );

  return (
    <FlatList
      contentContainerStyle={styles.pad}
      data={rows}
      keyExtractor={(r) => r.city.id}
      ListHeaderComponent={<Title>{t('worldTitle')}</Title>}
      renderItem={({ item }) => (
        <View style={[styles.item, { borderColor: colors.border, backgroundColor: colors.card, flexDirection: rtl ? 'row-reverse' : 'row' }]}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.city, { color: colors.text, textAlign: rtl ? 'right' : 'left' }]}>
              {settings.language === 'ur' ? item.city.name.ur : item.city.name.en}
            </Text>
            <Text style={{ color: colors.muted, textAlign: rtl ? 'right' : 'left' }}>
              {t('nextAt')}: {t(item.next.name as 'fajr')} {item.next.time}
            </Text>
          </View>
          <Text style={[styles.time, { color: colors.accent }]}>{item.localTime}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  pad: { padding: 16 },
  item: { borderWidth: 1, borderRadius: 12, padding: 14, marginBottom: 10, alignItems: 'center' },
  city: { fontSize: 18, fontWeight: '600', marginBottom: 2 },
  time: { fontSize: 22, fontWeight: '700', fontVariant: ['tabular-nums'] },
});
