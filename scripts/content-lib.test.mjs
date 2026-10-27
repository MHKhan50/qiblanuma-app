import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  buildQuran, extensionOf, imageFileFromUrl, isFreeLicence, parseSuraMetadata, parseTanzilText, stripHtml,
} from './content-lib.mjs';

test('accepts free licences and rejects the rest', () => {
  for (const ok of ['CC BY-SA 4.0', 'CC BY 2.0', 'CC0', 'Public domain', 'CC BY-SA 3.0 de', 'PD-self']) {
    assert.equal(isFreeLicence(ok), true, ok);
  }
  for (const no of ['CC BY-NC 2.0', 'CC BY-ND 4.0', 'Fair use', '', undefined]) {
    assert.equal(isFreeLicence(no), false, String(no));
  }
});

test('reads Commons and local image paths', () => {
  assert.deepEqual(
    imageFileFromUrl('https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Blue_Mosque%2C_Istanbul.jpg/640px-Blue_Mosque%2C_Istanbul.jpg'),
    { repo: 'commons', file: 'Blue_Mosque,_Istanbul.jpg' },
  );
  assert.equal(imageFileFromUrl('https://upload.wikimedia.org/wikipedia/en/1/1a/Logo.png').repo, 'en');
  assert.equal(imageFileFromUrl('https://example.com/x.jpg'), null);
  assert.equal(extensionOf('https://x/640px-A.JPEG'), 'jpg');
  assert.equal(extensionOf('https://x/160px-Flag.svg.png'), 'png');
});

test('strips html from artist fields', () => {
  assert.equal(stripHtml('<a href="x">Ahmed &amp; Ali</a>\n'), 'Ahmed & Ali');
});

test('parses Tanzil text and keeps the notice', () => {
  const raw = '﻿1|1|بِسْمِ\n1|2|ٱلْحَمْدُ\n\n# Tanzil Quran Text\n# Copyright notice';
  const p = parseTanzilText(raw);
  assert.equal(p.ayahs.length, 2);
  assert.deepEqual(p.ayahs[1], { sura: 1, aya: 2, text: 'ٱلْحَمْدُ' });
  assert.equal(p.notice, 'Tanzil Quran Text\nCopyright notice');
});

test('parses sura metadata with both quote styles', () => {
  const js = `QuranData.Sura = [\n\t// [start, ayas, order, rukus, name, tname, ename, type]\n\t[],\n\t[0, 7, 5, 1, 'الفاتحة', "Al-Faatiha", 'The Opening', 'Meccan'],\n\t[7, 286, 87, 40, 'البقرة', "Al-Baqara", 'The Cow', 'Medinan'],\n\t[293, 200, 89, 20, 'آل عمران', "Aal-i-Imraan", 'The Family of Imraan', 'Medinan'],\n];`;
  const s = parseSuraMetadata(js);
  assert.equal(s.length, 3);
  assert.deepEqual(s[1], { ayas: 286, name: 'البقرة', tname: 'Al-Baqara', ename: 'The Cow', type: 'Medinan' });
});

test('refuses an incomplete Quran', () => {
  const meta = Array.from({ length: 114 }, () => ({ ayas: 1, name: 'x', tname: 'x', ename: 'x', type: 'Meccan' }));
  assert.throws(() => buildQuran({ ayahs: [{ sura: 1, aya: 1, text: 'x' }] }, meta), /6236/);
  assert.throws(() => buildQuran({ ayahs: [] }, meta.slice(1)), /114/);
});

test('reads IndoPak exports in several shapes and refuses gaps', async () => {
  const { readIndoPak } = await import('./content-lib.mjs');
  const lengths = Array.from({ length: 114 }, (_, i) => (i === 0 ? 6236 - 113 : 1));
  const obj = {};
  lengths.forEach((n, s) => { for (let a = 1; a <= n; a++) obj[`${s + 1}:${a}`] = { text: `t${s + 1}.${a}` }; });
  const suras = readIndoPak(obj, lengths);
  assert.equal(suras[113][0], 't114.1');
  const arr = Object.entries(obj).map(([verse_key, v]) => ({ verse_key, text: v.text }));
  assert.equal(readIndoPak(arr, lengths)[0][2], 't1.3');
  delete obj['2:1'];
  assert.throws(() => readIndoPak(obj, lengths), /missing/);
});
