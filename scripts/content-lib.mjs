// Pure helpers for fetch-content.mjs. No network here, so they are unit tested
// with `node --test scripts/`.

/** Licences we can ship in a free app with attribution. Non-commercial,
 * no-derivatives and fair-use images are rejected. */
export function isFreeLicence(shortName) {
  if (!shortName) return false;
  const s = String(shortName).trim();
  if (/\b(NC|ND)\b/i.test(s) || /fair use|non-free|copyrighted/i.test(s)) return false;
  return /^(CC0|CC BY(-SA)? \d(\.\d)?( [a-z]{2,3})?|CC[- ]BY(-SA)?|Public domain|PD\b|PD-)/i.test(s);
}

export function stripHtml(html) {
  return String(html ?? '')
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Where a Wikipedia image lives. Images under /wikipedia/commons/ are on
 * Wikimedia Commons; images under /wikipedia/en/ are local uploads, which are
 * usually non-free, so they are skipped.
 */
export function imageFileFromUrl(url) {
  const m = /upload\.wikimedia\.org\/wikipedia\/([^/]+)\/(?:thumb\/)?[0-9a-f]\/[0-9a-f]{2}\/([^/]+)/.exec(url ?? '');
  if (!m) return null;
  return { repo: m[1], file: decodeURIComponent(m[2]) };
}

export function extensionOf(url) {
  const m = /\.([a-z0-9]+)(?:\?|$)/i.exec(url ?? '');
  const ext = m ? m[1].toLowerCase() : 'jpg';
  return ext === 'jpeg' ? 'jpg' : ext;
}

/** Parse Tanzil "text with aya numbers" (sura|aya|text). Returns ayahs and the notice. */
export function parseTanzilText(raw) {
  const ayahs = [];
  const notice = [];
  for (const line of String(raw).replace(/^﻿/, '').split(/\r?\n/)) {
    if (line.startsWith('#')) { notice.push(line.replace(/^#\s?/, '')); continue; }
    if (!line.trim()) continue;
    const m = /^(\d+)\|(\d+)\|(.*)$/.exec(line);
    if (!m) throw new Error(`Unexpected line in Quran text: ${line.slice(0, 40)}`);
    ayahs.push({ sura: Number(m[1]), aya: Number(m[2]), text: m[3] });
  }
  return { ayahs, notice: notice.join('\n').trim() };
}

/** Parse QuranData.Sura from Tanzil's quran-data.js metadata. */
export function parseSuraMetadata(js) {
  const block = /QuranData\.Sura\s*=\s*\[([\s\S]*?)\n\];/.exec(String(js));
  if (!block) throw new Error('QuranData.Sura not found in metadata');
  const re = /\[\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+),\s*(['"])(.*?)\5,\s*(['"])(.*?)\7,\s*(['"])(.*?)\9,\s*['"](\w+)['"]\s*\]/g;
  const suras = [];
  let m;
  while ((m = re.exec(block[1])) !== null) {
    suras.push({ ayas: Number(m[2]), name: m[6], tname: m[8], ename: m[10], type: m[11] });
  }
  return suras;
}

/** Build the app's Quran JSON and check it is complete: 114 suras, 6236 ayahs. */
export function buildQuran(parsed, meta) {
  if (meta.length !== 114) throw new Error(`Expected 114 suras in metadata, got ${meta.length}`);
  if (parsed.ayahs.length !== 6236) throw new Error(`Expected 6236 ayahs, got ${parsed.ayahs.length}`);
  const suras = meta.map((s, i) => ({ n: i + 1, name: s.name, tname: s.tname, ename: s.ename, type: s.type, ayahs: [] }));
  for (const a of parsed.ayahs) {
    const s = suras[a.sura - 1];
    if (!s || a.aya !== s.ayahs.length + 1) throw new Error(`Ayah out of order at ${a.sura}:${a.aya}`);
    s.ayahs.push(a.text);
  }
  suras.forEach((s, i) => {
    if (s.ayahs.length !== meta[i].ayas) throw new Error(`Sura ${i + 1}: ${s.ayahs.length} ayahs, metadata says ${meta[i].ayas}`);
  });
  return suras;
}

/**
 * Read an IndoPak text export into one array of ayahs per sura. Accepts the
 * common shapes: { "1:1": "text" }, { "1:1": { text } }, or [{ verse_key, text }].
 * `lengths` are the ayah counts per sura from the Tanzil metadata.
 */
export function readIndoPak(data, lengths) {
  const entries = Array.isArray(data)
    ? data.map((v) => [v.verse_key ?? v.key ?? `${v.sura}:${v.aya ?? v.ayah}`, v.text ?? v.text_indopak])
    : Object.entries(data).map(([k, v]) => [k, typeof v === 'string' ? v : v?.text ?? v?.text_indopak]);
  const suras = lengths.map((n) => new Array(n).fill(null));
  for (const [key, text] of entries) {
    const m = /^(\d+):(\d+)$/.exec(String(key));
    if (!m || typeof text !== 'string') throw new Error(`Unexpected entry: ${String(key).slice(0, 20)}`);
    const s = Number(m[1]); const a = Number(m[2]);
    if (!suras[s - 1] || a < 1 || a > suras[s - 1].length) throw new Error(`Ayah out of range: ${key}`);
    suras[s - 1][a - 1] = text;
  }
  const missing = suras.reduce((n, s) => n + s.filter((x) => x === null).length, 0);
  const total = suras.reduce((n, s) => n + s.length, 0);
  if (suras.length !== 114 || total !== 6236 || missing > 0) throw new Error(`Incomplete IndoPak text: ${missing} ayahs missing`);
  return suras;
}

/** Parse QuranData.Juz (start of each of the 30 paras) from Tanzil metadata. */
export function parseJuzMetadata(js) {
  const block = /QuranData\.Juz\s*=\s*\[([\s\S]*?)\n\];/.exec(String(js));
  if (!block) throw new Error('QuranData.Juz not found in metadata');
  const starts = [...block[1].matchAll(/\[\s*(\d+),\s*(\d+)\s*\]/g)].map((m) => ({ sura: Number(m[1]), aya: Number(m[2]) }));
  const juz = starts.filter((s) => s.sura >= 1 && s.sura <= 114).slice(0, 30);
  if (juz.length !== 30 || juz[0].sura !== 1 || juz[0].aya !== 1) throw new Error(`Unexpected Juz data (${juz.length} entries)`);
  return juz;
}
