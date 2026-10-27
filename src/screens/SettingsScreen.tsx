import React, { useState } from 'react';
import { CITY_PHOTOS } from '../data/cityPhotos';
import { GROUP_FLAGS } from '../data/groupFlags';
import { KAABA_PHOTO } from '../data/kaabaPhoto';
import { QURAN, QURAN_INDOPAK, RECITERS } from '../data/quran';
import { Image, Pressable, ScrollView, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { MANUAL_LOCATIONS } from '../data/cities';
import { METHODS, PRAYER_ORDER, type HighLatitudeRule, type MethodId, type PrayerName } from '../engine/methods';
import type { Language } from '../i18n/strings';
import { useSettings, type ThemeMode } from '../state/settings';
import { Card, Chip, Note, Title } from '../ui/components';

const HIGH_LAT: HighLatitudeRule[] = ['angleBased', 'seventhOfNight', 'middleOfNight', 'none'];
const LANGS: { id: Language; label: string }[] = [
  { id: 'roman', label: 'Roman Urdu' }, { id: 'ur', label: 'اردو' }, { id: 'en', label: 'English' }, { id: 'fa', label: 'فارسی' }, { id: 'tr', label: 'Türkçe' },
];

export default function SettingsScreen() {
  const { settings, update, t, colors, rtl } = useSettings();
  const p = settings.prayer;
  const wrap: ViewStyle = { ...styles.wrap, flexDirection: rtl ? 'row-reverse' : 'row' };

  const setAdj = (name: PrayerName, delta: number) =>
    update({ prayer: { ...p, adjustments: { ...p.adjustments, [name]: p.adjustments[name] + delta } } });

  return (
    <ScrollView contentContainerStyle={styles.pad}>
      <Card>
        <Title>{t('adhanTitle')}</Title>
        <View style={wrap}>
          {(['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const).map((p) => (
            <Chip
              key={p}
              label={`${settings.adhan[p] ? '🔔' : '🔕'} ${t(p)}`}
              active={settings.adhan[p]}
              onPress={() => update({ adhan: { ...settings.adhan, [p]: !settings.adhan[p] } })}
            />
          ))}
        </View>
        <View style={wrap}>
          <Chip label={`${settings.eventReminders ? '🔔' : '🔕'} ${t('eventRemindersLabel')}`} active={settings.eventReminders} onPress={() => update({ eventReminders: !settings.eventReminders })} />
        </View>
      </Card>

      {RECITERS.length > 0 && (
        <Card>
          <Title>{t('reciter')}</Title>
          <View style={wrap}>
            {RECITERS.map((r) => (
              <Chip key={r.id} label={r.name} active={settings.reciter === r.id} onPress={() => update({ reciter: r.id })} />
            ))}
          </View>
          <Title>{t('repeatEach')}</Title>
          <View style={wrap}>
            {[1, 3, 5, 10].map((n) => (
              <Chip key={n} label={`${n}×`} active={settings.repeatEach === n} onPress={() => update({ repeatEach: n })} />
            ))}
          </View>
          <View style={wrap}>
            <Chip label={`${settings.openingRecitation ? '✓' : '○'} ${t('openingRecitation')}`} active={settings.openingRecitation} onPress={() => update({ openingRecitation: !settings.openingRecitation })} />
          </View>
          <View style={wrap}>
            <Chip label={`${settings.voiceMode ? '✓' : '○'} ${t('voiceMode')}`} active={settings.voiceMode} onPress={() => update({ voiceMode: !settings.voiceMode })} />
          </View>
          <View style={wrap}>
            <Chip label={`${settings.voiceAutoplay ? '✓' : '○'} ${t('voiceAutoplay')}`} active={settings.voiceAutoplay} onPress={() => update({ voiceAutoplay: !settings.voiceAutoplay })} />
          </View>
          <Note>{t('audioCredit')}</Note>
        </Card>
      )}

      <Card>
        <Title>{t('language')}</Title>
        <View style={wrap}>
          {LANGS.map((l) => <Chip key={l.id} label={l.label} active={settings.language === l.id} onPress={() => update({ language: l.id })} />)}
        </View>
      </Card>

      <Card>
        <Title>{t('location')}</Title>
        <View style={wrap}>
          <Chip label={t('useGps')} active={settings.locationMode === 'gps'} onPress={() => update({ locationMode: 'gps' })} />
        </View>
        <Note>{t('chooseCity')}</Note>
        <View style={[wrap, { marginTop: 8 }]}>
          {MANUAL_LOCATIONS.map((c) => (
            <Chip
              key={c.id}
              label={settings.language === 'ur' || settings.language === 'fa' ? c.name.ur : c.name.en}
              active={settings.locationMode === 'manual' && settings.manualCityId === c.id}
              onPress={() => update({ locationMode: 'manual', manualCityId: c.id })}
            />
          ))}
        </View>
      </Card>

      <Card>
        <Title>{t('method')}</Title>
        <View style={wrap}>
          {(Object.keys(METHODS) as MethodId[]).map((id) => (
            <Chip key={id} label={METHODS[id].name} active={p.method === id} onPress={() => update({ prayer: { ...p, method: id } })} />
          ))}
        </View>
        <Title>{t('asrSchool')}</Title>
        <View style={wrap}>
          <Chip label={t('hanafi')} active={p.asrSchool === 'hanafi'} onPress={() => update({ prayer: { ...p, asrSchool: 'hanafi' } })} />
          <Chip label={t('shafi')} active={p.asrSchool === 'shafi'} onPress={() => update({ prayer: { ...p, asrSchool: 'shafi' } })} />
        </View>
        <Title>{t('highLat')}</Title>
        <View style={wrap}>
          {HIGH_LAT.map((r) => (
            <Chip key={r} label={t(`hl_${r}` as 'hl_none')} active={p.highLatitudeRule === r} onPress={() => update({ prayer: { ...p, highLatitudeRule: r } })} />
          ))}
        </View>
      </Card>

      <Card>
        <Title>{t('adjustments')}</Title>
        {PRAYER_ORDER.map((name) => (
          <View key={name} style={[styles.adjRow, { flexDirection: rtl ? 'row-reverse' : 'row', borderBottomColor: colors.border }]}>
            <Text style={{ color: colors.text, fontSize: 16, flex: 1, textAlign: rtl ? 'right' : 'left' }}>{t(name)}</Text>
            <Stepper label="−" onPress={() => setAdj(name, -1)} />
            <Text style={{ color: colors.text, width: 44, textAlign: 'center', fontVariant: ['tabular-nums'] }}>
              {p.adjustments[name] > 0 ? `+${p.adjustments[name]}` : p.adjustments[name]}
            </Text>
            <Stepper label="+" onPress={() => setAdj(name, 1)} />
          </View>
        ))}
      </Card>

      <Card>
        <Title>{t('theme')}</Title>
        <View style={wrap}>
          {(['system', 'light', 'dark'] as ThemeMode[]).map((m) => (
            <Chip key={m} label={t(m === 'system' ? 'themeSystem' : m === 'light' ? 'themeLight' : 'themeDark')} active={settings.theme === m} onPress={() => update({ theme: m })} />
          ))}
        </View>
        <Title>{t('hijriAdjust')}</Title>
        <View style={[styles.adjRow, { flexDirection: rtl ? 'row-reverse' : 'row', borderBottomColor: colors.border }]}>
          <Stepper label="−" onPress={() => update({ hijriOffset: Math.max(-2, settings.hijriOffset - 1) })} />
          <Text style={{ color: colors.text, width: 44, textAlign: 'center' }}>{settings.hijriOffset > 0 ? `+${settings.hijriOffset}` : settings.hijriOffset}</Text>
          <Stepper label="+" onPress={() => update({ hijriOffset: Math.min(2, settings.hijriOffset + 1) })} />
        </View>
        <Title>{t('clock')}</Title>
        <View style={wrap}>
          <Chip label={t('clock12')} active={!settings.use24h} onPress={() => update({ use24h: false })} />
          <Chip label={t('clock24')} active={settings.use24h} onPress={() => update({ use24h: true })} />
        </View>
      </Card>

      <Note>{t('privacy')}</Note>
      <Card style={{ marginTop: 14, alignItems: 'center' }}>
        <Image source={require('../../assets/icon.png')} style={{ width: 96, height: 96, borderRadius: 20, marginBottom: 10 }} />
        <Title>{t('iconStoryTitle')}</Title>
        <Text style={{ color: colors.text, lineHeight: 22, textAlign: rtl ? 'right' : 'left' }}>{t('iconStory')}</Text>
      </Card>
      <Note>{t('about')}</Note>
      <CreditsCard />
    </ScrollView>
  );
}

function Stepper({ label, onPress }: { label: string; onPress: () => void }) {
  const { colors } = useSettings();
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={[styles.step, { borderColor: colors.border }]}>
      <Text style={{ color: colors.accent, fontSize: 20 }}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pad: { padding: 16, paddingBottom: 40 },
  wrap: { flexWrap: 'wrap', marginBottom: 6 },
  adjRow: { alignItems: 'center', paddingVertical: 8, borderBottomWidth: StyleSheet.hairlineWidth },
  step: { width: 38, height: 34, borderWidth: 1, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
});

function CreditsCard() {
  const { t, colors } = useSettings();
  const [open, setOpen] = useState(false);
  const items = [...(KAABA_PHOTO ? [KAABA_PHOTO] : []), ...Object.values(CITY_PHOTOS), ...Object.values(GROUP_FLAGS)];
  return (
    <Card style={{ marginTop: 14 }}>
      <Pressable accessibilityRole="button" onPress={() => setOpen(!open)}>
        <Text style={{ color: colors.accent, fontWeight: '700' }}>{open ? t('hideCredits') : t('showCredits')}</Text>
      </Pressable>
      {open && (
        <View style={{ marginTop: 8 }}>
          {QURAN.notice ? <Note>{`${QURAN.source}\n${QURAN.notice}`}</Note> : null}
          {QURAN_INDOPAK.licence ? <Note>{`IndoPak: ${QURAN_INDOPAK.source}, ${QURAN_INDOPAK.licence}`}</Note> : null}
          <Note>Amiri Quran font: The Amiri Project Authors, SIL Open Font License 1.1</Note>
          <Note>Flags of historic states are traditional representations from Wikimedia Commons; many medieval states had no single official flag.</Note>
          {items.map((c) => (
            <Note key={c.page}>{`${c.title}: ${c.artist}, ${c.licence}, Wikimedia Commons`}</Note>
          ))}
        </View>
      )}
    </Card>
  );
}
