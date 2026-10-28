// Adds the app icon, splash screen and Android adaptive icon to app.json.
// Safe to run more than once; keeps everything else (including plugins) as it is.
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const app = JSON.parse(await readFile('app.json', 'utf8'));
const e = app.expo;
e.version = '0.2.0';
e.icon = './assets/icon.png';
e.splash = { image: './assets/splash-icon.png', resizeMode: 'contain', backgroundColor: '#F6F3EC' };
e.android = { ...(e.android ?? {}), adaptiveIcon: { foregroundImage: './assets/adaptive-icon.png', backgroundColor: '#0E6E6E' } };
// Adhan notification sound, when scripts/fetch-content.mjs found one.
if (existsSync('assets/sounds/adhan.wav')) {
  const plugins = (e.plugins ?? []).filter((p) => (Array.isArray(p) ? p[0] : p) !== 'expo-notifications');
  plugins.push(['expo-notifications', { sounds: ['./assets/sounds/adhan.wav'] }]);
  e.plugins = plugins;
  console.log('app.json: adhan sound added to notifications');
}
await writeFile('app.json', `${JSON.stringify(app, null, 2)}\n`);
console.log('app.json: icon, splash and adaptive icon set');
