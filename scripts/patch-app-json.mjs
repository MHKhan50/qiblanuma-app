// Adds the app icon, splash screen and Android adaptive icon to app.json.
// Safe to run more than once; keeps everything else (including plugins) as it is.
import { readFile, writeFile } from 'node:fs/promises';

const app = JSON.parse(await readFile('app.json', 'utf8'));
const e = app.expo;
e.icon = './assets/icon.png';
e.splash = { image: './assets/splash-icon.png', resizeMode: 'contain', backgroundColor: '#F6F3EC' };
e.android = { ...(e.android ?? {}), adaptiveIcon: { foregroundImage: './assets/adaptive-icon.png', backgroundColor: '#0E6E6E' } };
await writeFile('app.json', `${JSON.stringify(app, null, 2)}\n`);
console.log('app.json: icon, splash and adaptive icon set');
