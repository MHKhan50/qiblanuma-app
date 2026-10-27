import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { KAABA_PHOTO } from '../data/kaabaPhoto';
import { distanceToKaabaKm, qiblaBearing, turnAngle } from '../engine/qibla';
import { useSettings } from '../state/settings';
import type { PlaceState } from '../state/usePlace';
import { Card, Note, Row, Title } from '../ui/components';
import { KaabaIcon } from '../ui/icons';
import Svg, { Circle, G, Line, Path, Rect, Text as SvgText } from 'react-native-svg';

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
        <View style={styles.dialBox}>
          {/* The rose turns against the phone heading, so N points to true north. */}
          <View style={[StyleSheet.absoluteFill, { transform: [{ rotate: `${-(h ?? 0)}deg` }] }]}>
            <CompassRose color={colors.muted} accent={facing ? colors.gold : colors.accent} />
          </View>
          {/* The prayer mat points at the Qibla relative to the top of the phone. */}
          <View style={[StyleSheet.absoluteFill, styles.center, { transform: [{ rotate: `${turn ?? bearing}deg` }] }]}>
            {KAABA_PHOTO ? (
              <Image
                source={KAABA_PHOTO.source}
                style={[styles.kaabaPhoto, { borderColor: facing ? colors.gold : colors.accent }]}
                accessibilityLabel="Kaaba"
              />
            ) : (
              <View style={styles.kaabaFallback}><KaabaIcon size={46} color="#1b1b1b" accent={colors.gold} /></View>
            )}
            <PrayerMat color={colors.accent} accent={colors.gold} glow={facing} />
          </View>
        </View>
        <Text style={[styles.status, { color: facing ? colors.gold : colors.text }]}>
          {turn === null ? '' : facing ? t('facingQibla') : `${turn > 0 ? t('turnRight') : t('turnLeft')} ${Math.abs(Math.round(turn))}°`}
        </Text>
      </Card>

      {facing && KAABA_PHOTO && (
        <Card style={{ padding: 0, overflow: 'hidden', borderColor: colors.gold }}>
          <Image source={KAABA_PHOTO.source} style={styles.kaabaLarge} resizeMode="cover" accessibilityLabel="Kaaba" />
          <Note>{`  ${KAABA_PHOTO.artist}, ${KAABA_PHOTO.licence}, Wikimedia Commons`}</Note>
        </Card>
      )}

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

function CompassRose({ color, accent }: { color: string; accent: string }) {
  const ticks = Array.from({ length: 72 }, (_, i) => i * 5);
  return (
    <Svg width="100%" height="100%" viewBox="0 0 300 300">
      <Circle cx="150" cy="150" r="140" fill="none" stroke={color} strokeWidth={6} opacity={0.35} />
      <G>
        {ticks.map((d) => (
          <Line
            key={d}
            x1="150" y1={d % 30 === 0 ? 14 : 20} x2="150" y2="30"
            stroke={d % 90 === 0 ? accent : color}
            strokeWidth={d % 30 === 0 ? 4 : 1.5}
            transform={`rotate(${d} 150 150)`}
          />
        ))}
      </G>
      {[['N', 0], ['E', 90], ['S', 180], ['W', 270]].map(([l, d]) => (
        <SvgText
          key={l as string}
          x="150" y="52" fontSize="18" fontWeight="700" textAnchor="middle"
          fill={l === 'N' ? accent : color}
          transform={`rotate(${d} 150 150)`}
        >
          {l as string}
        </SvgText>
      ))}
    </Svg>
  );
}

/** A simple prayer mat (jaa-e-namaz) with a mihrab arch, drawn in code. */
function PrayerMat({ color, accent, glow }: { color: string; accent: string; glow: boolean }) {
  return (
    <Svg width={92} height={140} viewBox="0 0 92 140">
      <Rect x="4" y="4" width="84" height="132" rx="6" fill={color} stroke={glow ? accent : color} strokeWidth={glow ? 4 : 2} />
      <Rect x="12" y="12" width="68" height="116" rx="4" fill="none" stroke={accent} strokeWidth={2} />
      <Path d="M24 120V52c0-16 10-26 22-32 12 6 22 16 22 32v68z" fill="none" stroke={accent} strokeWidth={2.5} />
      <Path d="M46 30l3 6 6 1-4.5 4 1 6-5.5-3-5.5 3 1-6-4.5-4 6-1z" fill={accent} />
      {Array.from({ length: 9 }, (_, i) => (
        <Line key={i} x1={10 + i * 9} y1="136" x2={10 + i * 9} y2="140" stroke={accent} strokeWidth={1.5} />
      ))}
    </Svg>
  );
}

const styles = StyleSheet.create({
  pad: { padding: 16 },
  dialCard: { alignItems: 'center' },
  dialBox: { width: 300, height: 300 },
  center: { alignItems: 'center', justifyContent: 'center' },
  kaabaPhoto: { width: 56, height: 56, borderRadius: 12, borderWidth: 3, marginBottom: 4 },
  kaabaFallback: { marginBottom: 2 },
  kaabaLarge: { width: '100%', height: 220 },
  status: { fontSize: 20, fontWeight: '700', marginTop: 14 },
});
