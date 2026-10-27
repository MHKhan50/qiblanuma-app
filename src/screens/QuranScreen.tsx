import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { searchQuran, splitBismillah } from '../data/quran/search';
import { parseVoiceCommand, type VoiceTarget } from '../data/quran/voice';
import { runControl, useAudio } from '../state/audio';
import VoiceButton from '../ui/VoiceButton';
import { arabicNumber, ayahText, INDOPAK_AVAILABLE, juzEnd, QURAN, QURAN_FONT, TRANSLATIONS, translationOf, type Sura } from '../data/quran';
import { useSettings } from '../state/settings';
import { Card, Chip, Note } from '../ui/components';

export interface QuranTarget { sura: number; aya: number }

export default function QuranScreen({ request, onHandled }: {
  request?: (VoiceTarget & { autoplay?: boolean }) | null; onHandled?: () => void;
} = {}) {
  const { settings, update, t, colors } = useSettings();
  const audio = useAudio();
  const [open, setOpen] = useState<QuranTarget | null>(null);
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<'suras' | 'paras'>('suras');
  const [listening, setListening] = useState(false);
  const hits = useMemo(() => searchQuran(query), [query]);
  const command = useMemo(() => (query.trim() ? parseVoiceCommand(query, QURAN.suras) : null), [query]);

  const go = (c: VoiceTarget, play = false) => {
    if (c.type === 'control') { runControl(audio, c.action); return; }
    if (c.type === 'juz') {
      const start = QURAN.juz?.[c.juz - 1];
      if (!start) return;
      setOpen(start);
      if (play) audio.playRange(start, juzEnd(c.juz));
    } else {
      const max = QURAN.suras[c.sura - 1]?.ayahs.length ?? 1;
      const start = { sura: c.sura, aya: Math.min(Math.max(c.aya ?? 1, 1), max) };
      setOpen(start);
      if (play) audio.playRange(start, { sura: c.sura, aya: max });
    }
  };

  // Requests from the Home screen's big microphone open and, if asked, play.
  useEffect(() => {
    if (request && QURAN.suras.length) { go(request, !!request.autoplay); onHandled?.(); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request]);

  // A spoken request opens its place straight away (and plays it, if set); otherwise it becomes a search.
  const onVoice = (text: string) => {
    const c = parseVoiceCommand(text, QURAN.suras);
    if (c && (c.type !== 'juz' || QURAN.juz)) { setQuery(''); go(c, settings.voiceAutoplay); } else setQuery(text);
  };

  if (QURAN.suras.length === 0) {
    return <View style={styles.pad}><Note>{t('quranMissing')}</Note></View>;
  }
  if (open) {
    const sura = QURAN.suras[open.sura - 1];
    return (
      <Reader
        sura={sura}
        startAya={open.aya}
        onBack={() => setOpen(null)}
        onRead={(aya) => update({ lastRead: { sura: sura.n, aya } })}
      />
    );
  }

  const q = query.trim().toLowerCase();
  const suras = q && hits.length === 0
    ? QURAN.suras.filter((s) => String(s.n) === q || s.tname.toLowerCase().includes(q) || s.ename.toLowerCase().includes(q) || s.name.includes(query.trim()))
    : QURAN.suras;
  const last = settings.lastRead;

  const header = (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={t('searchQuran')}
          placeholderTextColor={colors.muted}
          autoCorrect={false}
          returnKeyType="go"
          onSubmitEditing={() => command && go(command)}
          style={[styles.search, { flex: 1, marginBottom: 0, color: colors.text, borderColor: colors.border, backgroundColor: colors.card }]}
        />
        <VoiceButton onText={onVoice} onListening={setListening} />
      </View>
      {listening && <Note>{t('listening')}</Note>}
      {command && (
        <Pressable onPress={() => go(command)}>
          <Card style={{ borderColor: colors.gold }}>
            <Text style={{ color: colors.gold, fontWeight: '700' }}>
              {command.type === 'juz'
                ? `${t('para')} ${command.juz}`
                : command.type === 'control'
                  ? `▶ ${command.action}`
                  : `${QURAN.suras[command.sura - 1]?.tname ?? ''} (${command.sura})${command.aya ? ` · ${command.aya}` : ''}`}
            </Text>
          </Card>
        </Pressable>
      )}
      {!q && QURAN.juz && (
        <View style={{ flexDirection: 'row', marginBottom: 8 }}>
          <Chip label={t('suras')} active={mode === 'suras'} onPress={() => setMode('suras')} />
          <Chip label={t('paras')} active={mode === 'paras'} onPress={() => setMode('paras')} />
        </View>
      )}
      {!q && last && (
        <Pressable onPress={() => setOpen(last)}>
          <Card style={{ backgroundColor: colors.accent, borderColor: colors.accent }}>
            <Text style={{ color: colors.card, fontSize: 14 }}>{t('continueReading')}</Text>
            <Text style={{ color: colors.card, fontSize: 20, fontWeight: '700' }}>
              {QURAN.suras[last.sura - 1]?.tname} · {last.aya}
            </Text>
          </Card>
        </Pressable>
      )}
      {!q && settings.bookmarks.length > 0 && (
        <Card>
          <Text style={{ color: colors.gold, fontWeight: '700', marginBottom: 6 }}>{t('bookmarks')}</Text>
          {settings.bookmarks.map((b) => (
            <Pressable key={`${b.sura}:${b.aya}`} onPress={() => setOpen(b)} style={{ paddingVertical: 6 }}>
              <Text style={{ color: colors.text }}>{`${QURAN.suras[b.sura - 1]?.tname} ${b.sura}:${b.aya}`}</Text>
            </Pressable>
          ))}
        </Card>
      )}
      {hits.map((h) => (
        <Pressable key={`${h.sura}:${h.aya}`} onPress={() => setOpen(h)} style={[styles.hit, { borderBottomColor: colors.border }]}>
          <Text style={{ color: colors.gold, fontSize: 13 }}>{`${QURAN.suras[h.sura - 1].tname} ${h.sura}:${h.aya}`}</Text>
          <Text numberOfLines={2} style={[styles.hitText, { color: colors.text, fontFamily: QURAN_FONT.uthmani }]}>{h.text}</Text>
        </Pressable>
      ))}
    </View>
  );

  if (mode === 'paras' && !q && QURAN.juz) {
    return (
      <FlatList
        contentContainerStyle={styles.pad}
        data={QURAN.juz.map((start, i) => ({ n: i + 1, start }))}
        keyExtractor={(j) => String(j.n)}
        ListHeaderComponent={header}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <Pressable onPress={() => setOpen(item.start)} style={[styles.sura, { borderBottomColor: colors.border }]}>
            <Text style={[styles.num, { color: colors.gold, borderColor: colors.gold }]}>{item.n}</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.text, fontSize: 17, fontWeight: '600' }}>{`${t('para')} ${item.n}`}</Text>
              <Text style={{ color: colors.muted, fontSize: 13 }}>{`${QURAN.suras[item.start.sura - 1].tname} ${item.start.sura}:${item.start.aya}`}</Text>
            </View>
          </Pressable>
        )}
      />
    );
  }

  return (
    <FlatList
      contentContainerStyle={styles.pad}
      data={hits.length > 0 ? [] : suras}
      keyExtractor={(s) => String(s.n)}
      initialNumToRender={20}
      keyboardShouldPersistTaps="handled"
      ListHeaderComponent={header}
      renderItem={({ item }) => (
        <Pressable
          accessibilityRole="button"
          onPress={() => setOpen({ sura: item.n, aya: last?.sura === item.n ? last.aya : 1 })}
          style={[styles.sura, { borderBottomColor: colors.border }]}
        >
          <Text style={[styles.num, { color: colors.gold, borderColor: colors.gold }]}>{item.n}</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.text, fontSize: 17, fontWeight: '600' }}>{item.tname}</Text>
            <Text style={{ color: colors.muted, fontSize: 13 }}>
              {item.ename} · {item.ayahs.length} {t('ayahs')} · {item.type === 'Meccan' ? t('makki') : t('madani')}
            </Text>
          </View>
          <Text style={[styles.arabicName, { color: colors.accent }]}>{item.name}</Text>
        </Pressable>
      )}
    />
  );
}

function Reader({ sura, startAya, onBack, onRead }: {
  sura: Sura; startAya: number; onBack: () => void; onRead: (aya: number) => void;
}) {
  const { settings, update, t, colors } = useSettings();
  const size = settings.quranFontSize;
  const script = INDOPAK_AVAILABLE ? settings.quranScript : 'uthmani';
  const lines = settings.quranView === 'lines';
  // Lines view flows several ayahs together like a printed mushaf; ayah view
  // keeps one ayah per block. Either way the text itself is unchanged.
  const perBlock = lines ? 8 : 1;
  const data = useMemo(() => {
    const blocks: { aya: number; ayahs: { aya: number; text: string }[] }[] = [];
    for (let i = 0; i < sura.ayahs.length; i += perBlock) {
      const ayahs: { aya: number; text: string }[] = [];
      for (let j = i; j < Math.min(i + perBlock, sura.ayahs.length); j++) {
        const text = ayahText(script, sura.n, j + 1);
        // The Bismillah is shown on its own line above the sura (display only).
        ayahs.push({ aya: j + 1, text: j === 0 && script === 'uthmani' ? splitBismillah(sura.n, text).rest : text });
      }
      blocks.push({ aya: i + 1, ayahs });
    }
    return blocks;
  }, [sura, script, perBlock]);
  const lastSaved = useRef(0);
  const audio = useAudio();
  const nowPlaying = (aya: number) => audio.pos?.sura === sura.n && audio.pos.aya === aya;
  const listRef = useRef<FlatList<(typeof data)[number]>>(null);

  // Follow the recitation: keep the ayah being recited in view, for learners and listeners.
  useEffect(() => {
    if (!audio.pos || audio.pos.sura !== sura.n) return;
    const index = Math.floor((audio.pos.aya - 1) / perBlock);
    listRef.current?.scrollToIndex({ index, viewPosition: 0.25, animated: true });
  }, [audio.pos, sura.n, perBlock]);
  const isMarked = (aya: number) => settings.bookmarks.some((b) => b.sura === sura.n && b.aya === aya);
  const toggleBookmark = (aya: number) =>
    update({
      bookmarks: isMarked(aya)
        ? settings.bookmarks.filter((b) => !(b.sura === sura.n && b.aya === aya))
        : [...settings.bookmarks, { sura: sura.n, aya }],
    });

  return (
    <View style={{ flex: 1 }}>
      <View style={[styles.bar, { borderBottomColor: colors.border }]}>
        <Pressable accessibilityRole="button" onPress={onBack} style={styles.barBtn}>
          <Text style={{ color: colors.accent, fontSize: 16 }}>‹ {t('suras')}</Text>
        </Pressable>
        <Text style={[styles.barTitle, { color: colors.text }]}>{sura.name}</Text>
        <View style={{ flexDirection: 'row' }}>
          {audio.available && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={audio.playing ? 'Pause recitation' : 'Play recitation'}
              onPress={() => {
                if (audio.playing && audio.pos?.sura === sura.n) audio.pause();
                else audio.playRange({ sura: sura.n, aya: Math.max(1, lastSaved.current || startAya) }, { sura: sura.n, aya: sura.ayahs.length });
              }}
              style={styles.barBtn}
            >
              <Text style={{ color: colors.accent, fontSize: 18 }}>{audio.playing && audio.pos?.sura === sura.n ? '⏸' : '▶'}</Text>
            </Pressable>
          )}
          {INDOPAK_AVAILABLE && (
            <Pressable
              accessibilityRole="button"
              onPress={() => update({ quranScript: script === 'uthmani' ? 'indopak' : 'uthmani' })}
              style={styles.barBtn}
            >
              <Text style={{ color: colors.gold, fontSize: 14 }}>{script === 'uthmani' ? 'عثمانی' : 'انڈوپاک'}</Text>
            </Pressable>
          )}
          {TRANSLATIONS.length > 0 && !lines && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Translation"
              onPress={() => {
                const order: ('none' | 'ur' | 'en')[] = ['none', ...TRANSLATIONS];
                const i = order.indexOf(settings.quranTranslation);
                update({ quranTranslation: order[(i + 1) % order.length] });
              }}
              style={styles.barBtn}
            >
              <Text style={{ color: colors.gold, fontSize: 14 }}>{settings.quranTranslation === 'none' ? 'ترجمہ' : settings.quranTranslation === 'ur' ? 'اردو' : 'EN'}</Text>
            </Pressable>
          )}
          <Pressable
            accessibilityRole="button"
            onPress={() => update({ quranView: lines ? 'ayahs' : 'lines' })}
            style={styles.barBtn}
          >
            <Text style={{ color: colors.gold, fontSize: 14 }}>{lines ? 'آیات' : 'سطور'}</Text>
          </Pressable>
          <Pressable onPress={() => update({ quranFontSize: Math.max(18, size - 2) })} style={styles.barBtn}>
            <Text style={{ color: colors.accent, fontSize: 15 }}>A−</Text>
          </Pressable>
          <Pressable onPress={() => update({ quranFontSize: Math.min(44, size + 2) })} style={styles.barBtn}>
            <Text style={{ color: colors.accent, fontSize: 19 }}>A+</Text>
          </Pressable>
        </View>
      </View>
      <FlatList
        data={data}
        ref={listRef}
        keyExtractor={(b) => String(b.aya)}
        contentContainerStyle={{ padding: 16, paddingBottom: 48 }}
        initialScrollIndex={Math.min(Math.floor(Math.max(startAya - 1, 0) / perBlock), data.length - 1)}
        ListHeaderComponent={
          <View style={[styles.suraHead, { borderColor: colors.gold }]}>
            <Text style={[styles.suraHeadText, { color: colors.gold, fontFamily: QURAN_FONT.uthmani }]}>
              {`سُورَةُ ${sura.name}`}
            </Text>
            {script === 'uthmani' && splitBismillah(sura.n, sura.ayahs[0]).bismillah && (
              <Text style={[styles.bismillah, { color: colors.text, fontFamily: QURAN_FONT.uthmani, fontSize: size }]}>
                {splitBismillah(sura.n, sura.ayahs[0]).bismillah}
              </Text>
            )}
          </View>
        }
        onScrollToIndexFailed={(info) => listRef.current?.scrollToOffset({ offset: info.averageItemLength * info.index, animated: true })}
        viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
        onViewableItemsChanged={({ viewableItems }) => {
          const first = viewableItems[0]?.item as { aya: number } | undefined;
          if (first && first.aya !== lastSaved.current) {
            lastSaved.current = first.aya;
            onRead(first.aya);
          }
        }}
        renderItem={({ item }) => (
          <View style={[styles.ayah, !lines && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border }]}>
            <Text
              style={[
                styles.arabic,
                { color: colors.text, fontSize: size, lineHeight: size * 2, fontFamily: QURAN_FONT[script] },
                lines && styles.justify,
              ]}
            >
              {item.ayahs.map((a) => (
                <Text
                  key={a.aya}
                  onLongPress={() => toggleBookmark(a.aya)}
                  onPress={() => audio.available && audio.playRange({ sura: sura.n, aya: a.aya }, { sura: sura.n, aya: sura.ayahs.length })}
                  style={nowPlaying(a.aya) ? { backgroundColor: colors.border, color: colors.accent } : undefined}
                >
                  {a.text}
                  <Text style={{ color: isMarked(a.aya) ? colors.danger : colors.gold }}>{` ﴿${arabicNumber(a.aya)}﴾ `}</Text>
                </Text>
              ))}
            </Text>
            {!lines && settings.quranTranslation !== 'none' && TRANSLATIONS.includes(settings.quranTranslation) && (
              <Text style={{ color: colors.muted, fontSize: 15, lineHeight: 26, marginTop: 4, textAlign: settings.quranTranslation === 'ur' ? 'right' : 'left', writingDirection: settings.quranTranslation === 'ur' ? 'rtl' : 'ltr' }}>
                {translationOf(settings.quranTranslation, sura.n, item.aya)}
              </Text>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  pad: { padding: 16 },
  sura: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth },
  num: { width: 36, height: 36, borderWidth: 1, borderRadius: 18, textAlign: 'center', lineHeight: 34, marginRight: 12, fontWeight: '700' },
  arabicName: { fontSize: 22, writingDirection: 'rtl' },
  bar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 8, borderBottomWidth: StyleSheet.hairlineWidth },
  barBtn: { paddingHorizontal: 10, paddingVertical: 10 },
  barTitle: { fontSize: 22, writingDirection: 'rtl' },
  ayah: { paddingVertical: 6 },
  justify: { textAlign: 'justify' },
  suraHead: { borderWidth: 2, borderRadius: 14, paddingVertical: 10, marginBottom: 12, alignItems: 'center' },
  bismillah: { writingDirection: 'rtl', textAlign: 'center', marginTop: 6 },
  search: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16, marginBottom: 12 },
  hit: { paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth },
  hitText: { fontSize: 20, writingDirection: 'rtl', textAlign: 'right', lineHeight: 38 },
  suraHeadText: { fontSize: 26, writingDirection: 'rtl' },
  arabic: { textAlign: 'right', writingDirection: 'rtl' },
});
