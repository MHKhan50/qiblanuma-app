import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { PRAYER_ORDER } from '../engine/methods';
import { addDays, computePrayerTimes, nextPrayer } from '../engine/prayerTimes';
import { formatClock, formatCountdown, localDateIn } from '../engine/timezone';
import { useSettings } from '../state/settings';
import type { PlaceState } from '../state/usePlace';
import { Card, Note, Row, Title, useNow } from '../ui/components';

export default function TodayScreen({ place }: { place: PlaceState }) {
  const { settings, t, colors } = useSettings();
  const now = useNow();

  const ready = place.status === 'ready' ? place.place : null;
  const dayKey = ready ? JSON.stringify(localDateIn(now, ready.timeZone)) : '';

  const data = useMemo(() => {
    if (!ready) return null;
    const today = localDateIn(new Date(), ready.timeZone);
    const coords = { latitude: ready.latitude, longitude: ready.longitude };
    return {
      today: computePrayerTimes(today, coords, settings.prayer),
      tomorrow: computePrayerTimes(addDays(today, 1), coords, settings.prayer),
    };
    // dayKey makes the times refresh after midnight.
  }, [ready, settings.prayer, dayKey]);

  if (place.status === 'loading') return <Centered text={t('locating')} />;
  if (place.status === 'denied' || !data || !ready) return <Centered text={t('locationDenied')} />;

  const next = nextPrayer(data.today, data.tomorrow, now);
  const clock = (d: Date) => formatClock(d, ready.timeZone, settings.use24h);

  return (
    <ScrollView contentContainerStyle={styles.pad}>
      <Card style={{ backgroundColor: colors.accent, borderColor: colors.accent }}>
        <Text style={[styles.small, { color: colors.card }]}>{t('nextPrayer')}</Text>
        <Text style={[styles.big, { color: colors.card }]}>{t(next.name)} · {clock(next.time)}</Text>
        <Text style={[styles.count, { color: colors.card }]}>
          {formatCountdown(next.time.getTime() - now.getTime())} {t('in')}
        </Text>
      </Card>

      <Card>
        {PRAYER_ORDER.map((p) => (
          <Row
            key={p}
            left={t(p) + (data.today.estimated.includes(p) ? ' *' : '')}
            right={clock(data.today.times[p])}
            strong={p === next.name && next.time === data.today.times[p]}
            muted={p === 'sunrise'}
          />
        ))}
        {data.today.estimated.length > 0 && <Note>* {t('estimated')}</Note>}
        <Note>{ready.source === 'gps' ? t('usingGps') : `${t('usingCity')}: ${ready.label}`}</Note>
      </Card>

      <Card>
        <Title>{t('roza')}</Title>
        <Row left={t('sehri')} right={clock(data.today.times.fajr)} />
        <Row left={t('iftar')} right={clock(data.today.times.maghrib)} />
      </Card>

      <Card>
        <Title>{t('makruhTitle')}</Title>
        {data.today.makruh.map((w) => (
          <Row
            key={w.label}
            left={t(`makruh_${w.label}` as 'makruh_sunrise')}
            right={`${clock(w.start)} – ${clock(w.end)}`}
          />
        ))}
        <Note>{t('makruhNote')}</Note>
      </Card>
    </ScrollView>
  );
}

function Centered({ text }: { text: string }) {
  const { colors } = useSettings();
  return (
    <View style={styles.center}>
      <Text style={{ color: colors.muted, fontSize: 16, textAlign: 'center' }}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pad: { padding: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  small: { fontSize: 14, opacity: 0.9 },
  big: { fontSize: 30, fontWeight: '700', marginVertical: 4 },
  count: { fontSize: 20, fontVariant: ['tabular-nums'] },
});
