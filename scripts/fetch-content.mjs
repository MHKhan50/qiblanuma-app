// Downloads the app's bundled content once, on a developer machine:
//   1. the Quran text (Tanzil, Uthmani, verbatim) and sura names
//   2. one photo per city from Wikimedia Commons, free licences only
//   3. group flags that are documented on Wikimedia Commons
// Run: node scripts/fetch-content.mjs [path-to-tanzil-quran.txt]
// Writes assets/, src/data/quran/quran.json, src/data/cityPhotos.ts,
// src/data/groupFlags.ts and content-report.md. Nothing is uploaded anywhere.

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import {
  buildQuran, extensionOf, parseJuzMetadata, imageFileFromUrl, isFreeLicence, parseSuraMetadata, parseTanzilText, stripHtml,
} from './content-lib.mjs';

const UA = 'QiblanumaContentFetcher/0.2 (https://masmatixinnovations.co.uk; GitHub MHKhan50/qiblanuma-app)';
// Wikimedia only serves thumbnails at its standard widths (120, 250, 330, 500,
// 960, 1280...); other widths are refused, so use one of those.
const WIDTH = 500;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const report = [];

let lastStatus = 0;

async function get(url, as = 'json') {
  for (let attempt = 1; attempt <= 5; attempt++) {
    const res = await fetch(url, { headers: { 'User-Agent': UA, 'Api-User-Agent': UA } });
    lastStatus = res.status;
    if (res.ok) return as === 'json' ? res.json() : as === 'text' ? res.text() : Buffer.from(await res.arrayBuffer());
    if (res.status === 404) return null;
    // Back off politely when Wikimedia asks us to slow down.
    const wait = Number(res.headers.get('retry-after')) || 2 * attempt;
    await sleep(wait * 1000);
  }
  throw new Error(`Failed after 5 tries (HTTP ${lastStatus}): ${url}`);
}

/** Image download that reports failure instead of stopping the whole run. */
async function tryGet(url) {
  try {
    return await get(url, 'buffer');
  } catch {
    return null;
  }
}

// ---------- Quran ----------
async function quran(localPath) {
  const out = 'src/data/quran/quran.json';
  let raw;
  if (localPath) {
    raw = await readFile(localPath, 'utf8');
  } else {
    raw = await get(
      'https://tanzil.net/pub/download/index.php?marks=true&sajdah=true&rub=true&alif=true&quranType=uthmani&outType=txt-2&agree=true',
      'text',
    );
  }
  const meta = parseSuraMetadata(await get('https://tanzil.net/res/text/metadata/quran-data.js', 'text'));
  const parsed = parseTanzilText(raw ?? '');
  const suras = buildQuran(parsed, meta);
  await mkdir('src/data/quran', { recursive: true });
  await writeFile(out, JSON.stringify({
    source: 'Tanzil Quran Text (Uthmani), tanzil.net',
    notice: parsed.notice,
    suras,
  }));
  report.push(`## Quran\n\n6236 ayahs in 114 suras written to ${out}, text unchanged from Tanzil.\n\nNotice kept with the text:\n\n\`\`\`\n${parsed.notice}\n\`\`\`\n`);
  console.log('Quran: 114 suras, 6236 ayahs');
}

// ---------- Wikimedia ----------
async function commonsInfo(file) {
  const url = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo'
    + `&iiprop=url|extmetadata&iiurlwidth=${WIDTH}&titles=${encodeURIComponent(`File:${file}`)}`;
  const data = await get(url);
  const page = data && Object.values(data.query?.pages ?? {})[0];
  const info = page?.imageinfo?.[0];
  if (!info) return null;
  const m = info.extmetadata ?? {};
  return {
    file,
    thumb: info.thumburl ?? info.url,
    page: info.descriptionurl,
    licence: m.LicenseShortName?.value ?? '',
    licenceUrl: m.LicenseUrl?.value ?? '',
    artist: stripHtml(m.Artist?.value) || 'Unknown author',
  };
}

async function leadImage(title) {
  const s = await get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/ /g, '_'))}`);
  const src = s?.originalimage?.source ?? s?.thumbnail?.source;
  return src ? imageFileFromUrl(src) : null;
}

async function freeImage(candidates) {
  for (const c of candidates) {
    if (!c) continue;
    const loc = c.startsWith('File:') ? { repo: 'commons', file: c.slice(5) } : await leadImage(c);
    if (!loc) { report.push(`- no lead image for "${c}"`); continue; }
    if (loc.repo !== 'commons') { report.push(`- skipped non-Commons image for "${c}"`); continue; }
    const info = await commonsInfo(loc.file);
    await sleep(150);
    if (info && isFreeLicence(info.licence)) return { ...info, from: c };
    if (info) report.push(`- skipped "${loc.file}" (${info.licence || 'no licence'})`);
    else report.push(`- no Commons details for "${loc.file}"`);
  }
  return null;
}

const esc = (s) => JSON.stringify(s);

async function photos() {
  const list = JSON.parse(await readFile('scripts/city-landmarks.json', 'utf8'));
  await mkdir('assets/cities', { recursive: true });
  const lines = [];
  const missing = [];
  report.push('## City photos\n');
  for (const [id, e] of Object.entries(list)) {
    let img = null;
    try {
      img = await freeImage([e.file, e.landmark, e.city]);
    } catch (err) {
      report.push(`- ${id}: lookup failed (${err.message})`);
    }
    if (!img) { missing.push(id); console.log(`photo: ${id} none`); continue; }
    const ext = extensionOf(img.thumb);
    const data = await tryGet(img.thumb);
    if (!data) { missing.push(id); report.push(`- ${id}: download failed (HTTP ${lastStatus})`); console.log(`photo: ${id} download failed (HTTP ${lastStatus})`); continue; }
    await sleep(300);
    await writeFile(`assets/cities/${id}.${ext}`, data);
    lines.push(`  ${id}: { source: require('../../assets/cities/${id}.${ext}'), title: ${esc(img.from)}, artist: ${esc(img.artist)}, licence: ${esc(img.licence)}, licenceUrl: ${esc(img.licenceUrl)}, page: ${esc(img.page)} },`);
    report.push(`- ${id}: ${img.file} | ${img.artist} | ${img.licence}`);
    console.log(`photo: ${id} ok (${img.licence})`);
  }
  await writeFile('src/data/cityPhotos.ts', `// Generated by scripts/fetch-content.mjs. Do not edit by hand.
import type { Credit } from './credits';

export const CITY_PHOTOS: Record<string, Credit> = {
${lines.join('\n')}
};
`);
  report.push(`\nNo free photo found for: ${missing.join(', ') || 'none'}\n`);
}

async function searchFlag(name) {
  const q = `Flag of the ${name.replace(/\s*\(.*?\)/g, '')}`;
  const data = await get('https://commons.wikimedia.org/w/api.php?action=query&format=json&list=search&srnamespace=6&srlimit=5'
    + `&srsearch=${encodeURIComponent(`intitle:flag ${q}`)}`);
  await sleep(200);
  const hit = (data?.query?.search ?? []).find((r) => /flag/i.test(r.title) && /\.(svg|png)$/i.test(r.title));
  return hit ? hit.title.replace(/^File:/, '') : null;
}

async function flags() {
  const list = JSON.parse(await readFile('scripts/group-flags.json', 'utf8'));
  await mkdir('assets/flags', { recursive: true });
  const lines = [];
  report.push('## Group flags\n');
  const groups = JSON.parse(await readFile('scripts/group-names.json', 'utf8'));
  for (const [id, en] of Object.entries(groups)) {
    // A file named in group-flags.json wins; otherwise search Wikimedia Commons.
    const file = list[id] ?? (await searchFlag(en).catch(() => null));
    if (!file) { report.push(`- ${id}: no flag found on Commons`); continue; }
    let img = null;
    try {
      img = await freeImage([`File:${file}`]);
    } catch (err) {
      report.push(`- ${id}: lookup failed (${err.message})`);
    }
    if (!img) { report.push(`- ${id}: ${file} not usable`); continue; }
    // Wikimedia serves only its standard thumbnail sizes, so keep the API's own URL.
    const ext = extensionOf(img.thumb);
    const data = await tryGet(img.thumb);
    if (!data) { report.push(`- ${id}: download failed`); continue; }
    await writeFile(`assets/flags/${id}.${ext}`, data);
    lines.push(`  ${id}: { source: require('../../assets/flags/${id}.${ext}'), title: ${esc(file)}, artist: ${esc(img.artist)}, licence: ${esc(img.licence)}, licenceUrl: ${esc(img.licenceUrl)}, page: ${esc(img.page)} },`);
    report.push(`- ${id}: ${file} | ${img.licence} (check this is a fair representation before release)`);
    await sleep(300);
  }
  await writeFile('src/data/groupFlags.ts', `// Generated by scripts/fetch-content.mjs. Do not edit by hand.
import type { Credit } from './credits';

export const GROUP_FLAGS: Record<string, Credit> = {
${lines.join('\n')}
};
`);
}

async function kaaba() {
  const img = await freeImage(['Kaaba', 'Masjid al-Haram']).catch(() => null);
  let body = 'export const KAABA_PHOTO: Credit | null = null;';
  const data = img ? await tryGet(img.thumb) : null;
  if (img && data) {
    const ext = extensionOf(img.thumb);
    await writeFile(`assets/kaaba.${ext}`, data);
    body = `export const KAABA_PHOTO: Credit | null = { source: require('../../assets/kaaba.${ext}'), title: 'Kaaba', artist: ${esc(img.artist)}, licence: ${esc(img.licence)}, licenceUrl: ${esc(img.licenceUrl)}, page: ${esc(img.page)} };`;
    report.push(`## Kaaba photo\n\n- ${img.file} | ${img.artist} | ${img.licence}\n`);
  } else {
    report.push(`## Kaaba photo\n\n- not available (HTTP ${lastStatus})\n`);
  }
  await writeFile('src/data/kaabaPhoto.ts', `// Generated by scripts/fetch-content.mjs. Do not edit by hand.
import type { Credit } from './credits';

${body}
`);
}

/** Adds the 30 para starts to quran.json if they are missing. */
async function ensureJuz() {
  const path = 'src/data/quran/quran.json';
  if (!existsSync(path)) return;
  const q = JSON.parse(await readFile(path, 'utf8'));
  if (q.suras.length !== 114 || Array.isArray(q.juz)) return;
  q.juz = parseJuzMetadata(await get('https://tanzil.net/res/text/metadata/quran-data.js', 'text'));
  await writeFile(path, JSON.stringify(q));
  console.log('Para (juz) starts added');
}

// Reciters streamed from the Islamic Network CDN (alquran.cloud). Their terms:
// recitations are licensed to them by the reciters or estates for free,
// non-commercial redistribution; streaming for personal and educational use
// is allowed, with credit. Each id is checked against the live API and the
// real file URL for ayah 1 is stored, so the app never guesses a link.
const RECITERS = [
  'ar.alafasy', 'ar.abdulbasitmurattal', 'ar.husary', 'ar.minshawi',
  'ar.abdurrahmaansudais', 'ar.mahermuaiqly', 'ar.saoodshuraym',
];

async function reciters() {
  const out = [];
  report.push('## Reciters\n');
  for (const id of RECITERS) {
    try {
      const d = await get(`https://api.alquran.cloud/v1/ayah/1/${id}`);
      const url = d?.data?.audio;
      const name = d?.data?.edition?.englishName;
      if (url && /\/1\.mp3$/.test(url)) {
        out.push({ id, name, base: url.replace(/1\.mp3$/, '') });
        report.push(`- ${id}: ${name} (${url})`);
      } else report.push(`- ${id}: not available`);
    } catch (e) {
      report.push(`- ${id}: lookup failed (${e.message})`);
    }
    await sleep(300);
  }
  await writeFile('src/data/quran/reciters.json', JSON.stringify(out, null, 1));
  console.log(`Reciters: ${out.length}`);
}

const localQuran = process.argv[2];
if (localQuran && !existsSync(localQuran)) throw new Error(`File not found: ${localQuran}`);
const haveQuran = existsSync('src/data/quran/quran.json')
  && JSON.parse(await readFile('src/data/quran/quran.json', 'utf8')).suras.length === 114;
try {
  if (haveQuran && !localQuran) console.log('Quran already present, skipping download');
  else await quran(localQuran);
} catch (err) {
  console.error(`Quran step failed: ${err.message}`);
  console.error('Download "Uthmani", format "Text (with aya numbers)" from https://tanzil.net/download and run:');
  console.error('  node scripts/fetch-content.mjs ~/Downloads/quran-uthmani.txt');
  process.exitCode = 1;
}
await reciters().catch((e) => console.error(`Reciter step failed: ${e.message}`));
await ensureJuz().catch((e) => console.error(`Para step failed: ${e.message}`));
await photos();
await flags();
await kaaba();
await writeFile('content-report.md', `# Content report\n\n${report.join('\n')}\n`);
console.log('Done. Read content-report.md and look through assets/cities before committing.');
