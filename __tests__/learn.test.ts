import { KALIMAS, IMAN } from '../src/data/learn/kalimas';
import { MASNOON_DUAS } from '../src/data/learn/masnoonDuas';
import { KHATAM_STEPS } from '../src/data/learn/khatamSharif';
import { TARBIYAT_TOPICS, RAKAAT } from '../src/data/learn/tarbiyat';
import { dayOf, eventReminders, eventsOn, hijriMonth, upcomingEvents, ISLAMIC_EVENTS } from '../src/engine/islamicCalendar';

// Ayah count of each sura (standard Kufan count, 6236 in total).
const AYAHS = [7, 286, 200, 176, 120, 165, 206, 75, 129, 109, 123, 111, 43, 52, 99, 128, 111, 110, 98, 135, 112, 78, 118, 64, 77, 227, 93, 88, 69, 60, 34, 30, 73, 54, 45, 83, 182, 88, 75, 85, 54, 53, 89, 59, 37, 35, 38, 29, 18, 45, 60, 49, 62, 55, 78, 96, 29, 22, 24, 13, 14, 11, 11, 18, 12, 12, 30, 52, 52, 44, 28, 28, 20, 56, 40, 31, 50, 40, 46, 42, 29, 19, 36, 25, 22, 17, 19, 26, 30, 20, 15, 21, 11, 8, 8, 19, 5, 8, 8, 11, 11, 8, 3, 9, 5, 4, 7, 3, 6, 3, 5, 4, 5, 6];

const full = (t: { ur: string; roman: string; en: string }) => t.ur.length > 0 && t.roman.length > 0 && t.en.length > 0;

describe('learning content', () => {
  it('has all six kalimas and both imans with meanings in three languages', () => {
    expect(AYAHS.reduce((a, b) => a + b, 0)).toBe(6236);
    expect(KALIMAS.length).toBe(6);
    expect(IMAN.length).toBe(2);
    for (const k of [...KALIMAS, ...IMAN, ...MASNOON_DUAS]) {
      expect(full(k.title)).toBe(true);
      expect(full(k.meaning)).toBe(true);
      expect(/[؀-ۿ]/.test(k.arabic)).toBe(true);
    }
  });

  it('gives a source for every masnoon dua and has unique ids', () => {
    expect(MASNOON_DUAS.length).toBeGreaterThanOrEqual(25);
    for (const d of MASNOON_DUAS) expect((d.source ?? '').length).toBeGreaterThan(0);
    expect(new Set(MASNOON_DUAS.map((d) => d.id)).size).toBe(MASNOON_DUAS.length);
  });

  it('points khatam sharif at real ayahs', () => {
    const parts = KHATAM_STEPS.flatMap((s) => (s.kind === 'quran' ? [s.part] : []));
    expect(parts.length).toBeGreaterThan(10);
    for (const p of parts) {
      expect(p.sura).toBeGreaterThanOrEqual(1);
      expect(p.sura).toBeLessThanOrEqual(114);
      expect(p.from).toBeGreaterThanOrEqual(1);
      expect(p.to).toBeGreaterThanOrEqual(p.from);
      expect(p.to).toBeLessThanOrEqual(AYAHS[p.sura - 1]);
    }
  });

  it('has the Hanafi fara\'iz counts and rakat totals', () => {
    const wudu = TARBIYAT_TOPICS.find((t) => t.id === 'wudu')!;
    expect(wudu.lists![0].items.length).toBe(4);
    const ghusl = TARBIYAT_TOPICS.find((t) => t.id === 'ghusl')!;
    expect(ghusl.lists![0].items.length).toBe(3);
    const namaz = TARBIYAT_TOPICS.find((t) => t.id === 'namaz')!;
    expect(namaz.lists![0].items.length + namaz.lists![1].items.length).toBe(13);
    const totals = RAKAAT.table!.rows.map((r) => Number(r.cells[5]));
    expect(totals).toEqual([4, 12, 8, 7, 17, 14]);
    for (const t of TARBIYAT_TOPICS) {
      expect(full(t.title)).toBe(true);
      for (const l of t.lists ?? []) for (const i of l.items) expect(full(i)).toBe(true);
    }
  });
});

describe('Islamic calendar', () => {
  it('lists a whole Hijri month of 29 or 30 days', () => {
    const today = dayOf({ year: 2026, month: 10, day: 27 });
    for (const shift of [-2, -1, 0, 1, 2]) {
      const m = hijriMonth(today, 0, shift);
      expect(m.length === 29 || m.length === 30).toBe(true);
      expect(m[0].hijri.day).toBe(1);
      m.forEach((d, i) => expect(d.hijri.day).toBe(i + 1));
    }
    const now = hijriMonth(today, 0, 0);
    expect(now.some((d) => d.date.getTime() === today.getTime())).toBe(true);
    const next = hijriMonth(today, 0, 1);
    expect(next[0].date.getTime() - now[now.length - 1].date.getTime()).toBe(86400000);
  });

  it('finds every event within a year, in date order', () => {
    const ev = upcomingEvents(dayOf({ year: 2026, month: 10, day: 27 }));
    expect(ev.length).toBe(ISLAMIC_EVENTS.length);
    for (let i = 1; i < ev.length; i++) expect(ev[i].date.getTime()).toBeGreaterThanOrEqual(ev[i - 1].date.getTime());
    for (const e of ev) {
      if (e.event.kind === 'hijri') {
        expect(e.hijri.month).toBe(e.event.month);
        expect(e.hijri.day).toBe(e.event.day);
      } else {
        expect(e.date.getUTCMonth() + 1).toBe(e.event.month);
        expect(e.date.getUTCDate()).toBe(e.event.day);
      }
    }
    expect(new Set(ISLAMIC_EVENTS.map((e) => e.id)).size).toBe(ISLAMIC_EVENTS.length);
    expect(eventsOn(dayOf({ year: 2027, month: 5, day: 29 })).some((e) => e.id === 'fetih')).toBe(true);
  });

  it('plans reminders the evening before and the morning of each event', () => {
    const today = dayOf({ year: 2026, month: 10, day: 27 });
    const r = eventReminders(today, new Date(2026, 9, 27, 12), 0, 60, 50);
    expect(r.length).toBeGreaterThan(0);
    for (let i = 1; i < r.length; i++) expect(r[i].at.getTime()).toBeGreaterThanOrEqual(r[i - 1].at.getTime());
    const iqbal = r.filter((x) => x.event.id === 'iqbal');
    expect(iqbal.map((x) => [x.at.getDate(), x.at.getHours()])).toEqual([[8, 19], [9, 7]]);
    expect(eventReminders(today, new Date(2026, 9, 27, 12)).length).toBeLessThanOrEqual(14);
  });
});

import { prayerStreak, toggle, lastDays } from '../src/engine/tracker';
import { ASMA_UL_HUSNA } from '../src/data/learn/asmaUlHusna';

describe('tracker and names', () => {
  it('counts a prayer streak across days and keeps 90 days', () => {
    let log = {};
    for (const k of ['2026-10-25', '2026-10-26', '2026-10-27']) for (const p of ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const) log = toggle(log, k, p);
    expect(prayerStreak(log, '2026-10-27')).toBe(3);
    log = toggle(log, '2026-10-27', 'isha');
    expect(prayerStreak(log, '2026-10-27')).toBe(2);
    expect(prayerStreak(log, '2026-11-01')).toBe(0);
    expect(lastDays('2026-03-01', 3)).toEqual(['2026-02-27', '2026-02-28', '2026-03-01']);
    let big = {};
    for (const k of lastDays('2026-10-27', 120)) big = toggle(big, k, 'quran');
    expect(Object.keys(big).length).toBe(90);
  });

  it('has the 99 names, each with meanings', () => {
    expect(ASMA_UL_HUSNA.length).toBe(99);
    expect(new Set(ASMA_UL_HUSNA.map((n) => n[1])).size).toBe(99);
    for (const n of ASMA_UL_HUSNA) expect(n.every((s) => s.length > 0)).toBe(true);
  });
});

import { ALL_DUAS, DUA_CATEGORIES, KIDS_DUA_IDS } from '../src/data/learn';

describe('dua library', () => {
  it('has unique ids, a known category and a source for every dua', () => {
    expect(ALL_DUAS.length).toBeGreaterThanOrEqual(80);
    expect(new Set(ALL_DUAS.map((d) => d.id)).size).toBe(ALL_DUAS.length);
    const cats = new Set(DUA_CATEGORIES.map((c) => c.id));
    for (const d of ALL_DUAS) {
      expect(cats.has(d.category)).toBe(true);
      expect((d.source ?? '').length).toBeGreaterThan(0);
      expect(d.title.ur.length > 0 && d.meaning.roman.length > 0 && d.meaning.en.length > 0).toBe(true);
    }
    for (const c of cats) expect(ALL_DUAS.some((d) => d.category === c)).toBe(true);
    for (const id of KIDS_DUA_IDS) expect(ALL_DUAS.some((d) => d.id === id)).toBe(true);
  });
});

import { CITY_GROUPS } from '../src/data/groups';
import { FLAG_SPECS } from '../src/ui/flagSpecs';

describe('flags', () => {
  it('has a drawn flag for every city group', () => {
    for (const g of CITY_GROUPS) expect(FLAG_SPECS[g.id]).toBeDefined();
  });
});

import { ADHKAR, ADHKAR_GROUPS } from '../src/data/learn/adhkar';

describe('tasbeeh adhkar', () => {
  it('has 40+ counted adhkar in six groups with unique ids', () => {
    expect(ADHKAR.length).toBeGreaterThanOrEqual(40);
    expect(new Set(ADHKAR.map((d) => d.id)).size).toBe(ADHKAR.length);
    for (const g of ADHKAR_GROUPS) expect(ADHKAR.some((d) => d.group === g.id)).toBe(true);
    for (const d of ADHKAR) {
      expect(d.target).toBeGreaterThan(0);
      expect(d.ar.length > 0 || !!d.quran).toBe(true);
      expect(d.source.length).toBeGreaterThan(0);
    }
    expect(ADHKAR.some((d) => d.id === 'subhanallah')).toBe(true);
  });
});
