import React from 'react';
import { Pressable, Text } from 'react-native';
import { useSettings } from '../state/settings';
import { useVoice, VOICE_AVAILABLE } from '../state/useVoice';
import { SPEECH_LANG } from '../i18n/strings';

export { VOICE_AVAILABLE };

export default function VoiceButton({ onText, onListening }: { onText: (t: string) => void; onListening?: (on: boolean) => void }) {
  const { settings, colors } = useSettings();
  const voice = useVoice(SPEECH_LANG[settings.language]);
  React.useEffect(() => { onListening?.(voice.listening); }, [voice.listening, onListening]);
  if (!voice.available) return null;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Voice search"
      onPress={() => voice.listen(onText)}
      style={{ width: 46, height: 46, borderRadius: 23, marginLeft: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: voice.listening ? colors.danger : colors.accent }}
    >
      <Text style={{ color: colors.card, fontSize: 20 }}>{voice.listening ? '■' : '🎙'}</Text>
    </Pressable>
  );
}
