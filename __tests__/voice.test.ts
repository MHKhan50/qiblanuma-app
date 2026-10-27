import { parseVoiceCommand } from '../src/data/quran/voice';

const names = Array.from({ length: 114 }, () => ({ name: '', tname: '' }));
names[1] = { name: 'البقرة', tname: 'Al-Baqara' };
names[35] = { name: 'يس', tname: 'Yaseen' };
names[54] = { name: 'الرحمن', tname: 'Ar-Rahmaan' };
names[66] = { name: 'الملك', tname: 'Al-Mulk' };
const p = (s: string) => parseVoiceCommand(s, names);

describe('voice and typed Quran commands', () => {
  it('finds a para by number in Urdu, Roman Urdu and English', () => {
    expect(p('پارہ نمبر 20')).toEqual({ type: 'juz', juz: 20 });
    expect(p('مجھے پارہ بیس چاہیے')).toEqual({ type: 'juz', juz: 20 });
    expect(p('para 2')).toEqual({ type: 'juz', juz: 2 });
    expect(p('teesra para')).toEqual({ type: 'juz', juz: 3 });
    expect(p('juz 30')).toEqual({ type: 'juz', juz: 30 });
    expect(p('پارہ ۲۹')).toEqual({ type: 'juz', juz: 29 });
  });

  it('finds a para by its name', () => {
    expect(p('پارہ عم')).toEqual({ type: 'juz', juz: 30 });
    expect(p('para sayaqool')).toEqual({ type: 'juz', juz: 2 });
  });

  it('finds a surah by name or number', () => {
    expect(p('سورہ یاسین')).toEqual({ type: 'sura', sura: 36, aya: undefined });
    expect(p('مجھے سورت رحمن چاہیے')).toEqual({ type: 'sura', sura: 55, aya: undefined });
    expect(p('surah yaseen')).toEqual({ type: 'sura', sura: 36, aya: undefined });
    expect(p('surah mulk')).toEqual({ type: 'sura', sura: 67, aya: undefined });
    expect(p('سورۃ الملک')).toEqual({ type: 'sura', sura: 67, aya: undefined });
    expect(p('mujhe surah yaseen chahiye')).toEqual({ type: 'sura', sura: 36, aya: undefined });
    expect(p('surah 18')).toEqual({ type: 'sura', sura: 18, aya: undefined });
  });

  it('reads an ayah number', () => {
    expect(p('surah baqarah ayat 255')).toEqual({ type: 'sura', sura: 2, aya: 255 });
    expect(p('سورہ بقرہ آیت 255')).toEqual({ type: 'sura', sura: 2, aya: 255 });
  });

  it('understands spoken player controls', () => {
    expect(p('روکو')).toEqual({ type: 'control', action: 'pause' });
    expect(p('agli ayat')).toEqual({ type: 'control', action: 'next' });
    expect(p('بند کرو')).toEqual({ type: 'control', action: 'stop' });
    expect(p('dobara')).toEqual({ type: 'control', action: 'repeat' });
  });

  it('returns nothing when it does not understand', () => {
    expect(p('آج موسم کیسا ہے')).toBeNull();
    expect(p('para 45')).toBeNull();
  });
});
