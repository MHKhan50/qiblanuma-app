import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { distanceToKaabaKm, qiblaBearing, turnAngle } from '../engine/qibla';
import { useSettings } from '../state/settings';
import type { PlaceState } from '../state/usePlace';
import { Card, Note, Row, Title } from '../ui/components';

interface Heading { trueHeading: number; magHeading: number; accuracy: number }

/** expo-location heading accuracy: 3 high, 2 medium, 1 low, 0 unreliable (Android scale). */
function accuracyKey(a: number): 'accHigh' | 'accMedium' | 'accLow' | 'accUnknown' {
  if (a >= 3) return 'accHigh';
  if (a === 2) return 'accMedium';
  if (a >= 0 && a <= 1) return 'accLow';
  return 'accUnknown';
}

export default function QiblaScreen({ place }: { place: PlaceState }) {
  const { t, colors } = useSettings();
  const [heading, setHeading] = useState<Heading | null>(null);
  const [noCompass, setNoCompass] = useState(false);

  useEffect(() => {
    let sub: Location.LocationSubscription | null = null;
    let active = true;
    Location.watchHeadingAsync((h) => setHeading(h))
      .then((s) => { if (active) sub = s; else s.remove(); })
      .catch(() => setNoCompass(true));
    return () => { active = false; sub?.remove(); };
  }, []);

  if (place.status !== 'ready') {
    return <View style={styles.pad}><Note>{place.status === 'loading' ? t('locating') : t('locationDenied')}</Note></View>;
  }

  const coords = { latitude: place.place.latitude, longitude: place.place.longitude };
  const bearing = qiblaBearing(coords);
  const km = distanceToKaabaKm(coords);
  // True heading is -1 on some devices until location is known; fall back to magnetic.
  const h = heading ? (heading.trueHeading >= 0 ? heading.trueHeading : heading.magHeading) : null;
  const turn = h === null ? null : turnAngle(bearing, h);
  const facing = turn !== null && Math.abs(turn) <= 3;

  return (
    <ScrollView contentContainerStyle={styles.pad}>
      <Card style={styles.dialCard}>
        <View style={[styles.dial, { borderColor: facing ? colors.gold : colors.border }]}>
          {/* The dial rotates against the phone heading so the arrow points to the Qibla. */}
          <View style={[styles.needleWrap, { transform: [{ rotate: `${turn ?? bearing}deg` }] }]}>
            <View style={[styles.needle, { backgroundColor: facing ? colors.gold : colors.accent }]} />
            <Text style={[styles.kaaba, { color: facing ? colors.gold : colors.accent }]}>■</Text>
          </View>
        </View>
        <Text style={[styles.status, { color: facing ? colors.gold : colors.text }]}>
          {turn === null ? '' : facing ? t('facingQibla') : `${turn > 0 ? t('turnRight') : t('turnLeft')} ${Math.abs(Math.round(turn))}°`}
        </Text>
      </Card>

      <Card>
        <Row left={t('qiblaBearing')} right={`${bearing.toFixed(1)}° ${t('fromNorth')}`} strong />
        <Row left={t('distance')} right={`${Math.round(km).toLocaleString()} km`} />
        <Row left={t('compassAccuracy')} right={heading ? t(accuracyKey(heading.accuracy)) : t('accUnknown')} />
        {noCompass ? <Note>{t('noCompass')}</Note> : <Note>{t('calibrate')}</Note>}
      </Card>

      <Card>
        <Title>{t('qiblaBearing')}</Title>
        <Note>
          {`${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)} → 21.4225, 39.8262`}
        </Note>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pad: { padding: 16 },
  dialCard: { alignItems: 'center' },
  dial: { width: 260, height: 260, borderRadius: 130, borderWidth: 3, alignItems: 'center', justifyContent: 'center' },
  needleWrap: { width: 260, height: 260, alignItems: 'center' },
  needle: { width: 6, height: 110, marginTop: 20, borderRadius: 3 },
  kaaba: { fontSize: 26, position: 'absolute', top: 0 },
  status: { fontSize: 20, fontWeight: '700', marginTop: 14 },
});
