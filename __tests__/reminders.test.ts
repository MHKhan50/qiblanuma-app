import { DEFAULT_SETTINGS } from '../src/engine/methods';
import { upcomingReminders } from '../src/engine/reminders';

const all = { fajr: true, dhuhr: true, asr: true, maghrib: true, isha: true };
const lahore = { latitude: 31.5204, longitude: 74.3587 };

describe('prayer reminders', () => {
  it('lists only future, enabled prayers in time order', () => {
    const now = new Date('2026-10-27T09:00:00Z'); // 14:00 in Lahore, after Zuhr
    const list = upcomingReminders({ year: 2026, month: 10, day: 27 }, lahore, DEFAULT_SETTINGS, all, now, 2);
    expect(list[0].prayer).toBe('asr');
    expect(list.every((r) => r.date.getTime() > now.getTime())).toBe(true);
    for (let i = 1; i < list.length; i++) expect(list[i].date.getTime()).toBeGreaterThan(list[i - 1].date.getTime());
    expect(list.length).toBe(3 + 5);
  });

  it('skips switched-off prayers and stays under the iOS limit', () => {
    const now = new Date('2026-10-27T00:00:00Z');
    const off = { ...all, fajr: false };
    const list = upcomingReminders({ year: 2026, month: 10, day: 27 }, lahore, DEFAULT_SETTINGS, off, now, 30);
    expect(list.some((r) => r.prayer === 'fajr')).toBe(false);
    expect(list.length).toBeLessThanOrEqual(60);
  });
});
