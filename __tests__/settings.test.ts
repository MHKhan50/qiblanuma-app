jest.mock('@react-native-async-storage/async-storage', () => ({}));
import { DEFAULT_APP_SETTINGS, mergeSettings } from '../src/state/settings';

describe('stored settings', () => {
  it('falls back to defaults for missing or broken data', () => {
    expect(mergeSettings(null)).toEqual(DEFAULT_APP_SETTINGS);
    expect(mergeSettings('x')).toEqual(DEFAULT_APP_SETTINGS);
  });

  it('keeps stored choices and fills new fields', () => {
    const m = mergeSettings({ language: 'ur', prayer: { asrSchool: 'shafi', adjustments: { isha: 2 } } });
    expect(m.language).toBe('ur');
    expect(m.prayer.asrSchool).toBe('shafi');
    expect(m.prayer.method).toBe('karachi');
    expect(m.prayer.adjustments.isha).toBe(2);
    expect(m.prayer.adjustments.fajr).toBe(0);
  });
});
