# Qiblanuma

[![Tests](https://github.com/MHKhan50/qiblanuma-app/actions/workflows/test.yml/badge.svg)](https://github.com/MHKhan50/qiblanuma-app/actions/workflows/test.yml)

A free Quran, prayer times and Qibla app for Android and iPhone, built with React Native, Expo (SDK 58) and TypeScript. No adverts, no account, no tracking. Developed by Masmatix Innovations as sadaqah jariyah.

## Features

**Quran**
- Uthmani text from Tanzil, unchanged, in the Amiri Quran font; lines view like a printed mushaf, or one ayah per block
- Surah and para (juz) lists, search by surah name or Arabic words, bookmarks, continue reading
- Recitation ayah by ayah with the current ayah highlighted and followed on screen; choice of reciter; repeat each ayah for memorising
- 49 duas from the Quran, shown as full ayahs with references

**Voice, for everyone and for blind users**
- Say "سورہ یاسین", "para bees" or "surah baqarah ayat 255" and the app opens and recites it
- Spoken controls: "روکو", "اگلی آیت", "دوبارہ", "بند کرو"
- Hands-free mode: the app greets, listens on its own, asks again when a recitation ends, and the whole screen becomes a talk button
- Commands are matched against known surah and para names and numbers; nothing is generated

**Prayer**
- Prayer times from published astronomical formulas, Hanafi Asr by default, seven calculation methods, high latitude rules (for places like Glasgow), minute adjustments
- Prayer reminders, makruh times, Sehri and Iftar, Hijri date with a moon-sighting adjustment
- Qibla compass with a prayer mat pointing to the Kaaba, accuracy and calibration hint
- Home screen with the current and next prayer

**More**
- World clock of 127 cities grouped by 49 Muslim states (Khilafat-e-Rashida first), with search, flags and photos
- Tasbeeh counter, zakat calculator (Hanafi nisab)
- Masmat Maktab (Qaida lessons), Fatima (khatam tracker) and Halima (kalimas for children)
- Urdu, Roman Urdu and English; light and dark themes

## Accuracy and tests

| Check | Result |
|---|---|
| Karachi method vs a published Karachi timetable, 17 to 26 Oct 2026 | all five prayers within 1 minute |
| Glasgow sunrise and sunset vs a published table, across the UK clock change | within 3 minutes (matches the NOAA formulas) |
| Qibla bearing vs six published city bearings | within 0.1 degree |
| Quran text | 114 surahs and 6236 ayahs checked on import |

Tests run on every push (badge above). Sources and open checks are in [docs/RESEARCH_NOTES.md](docs/RESEARCH_NOTES.md).

## Run it

Needs Node.js 20.19.4 or newer and a free Expo account.

```bash
npm install
node scripts/patch-app-json.mjs   # icon and splash screen
node scripts/fetch-content.mjs    # Quran text, reciters, city photos and flags (once)
npm test
npx expo start --tunnel           # Expo Go (voice features need the APK)
npx eas-cli build -p android --profile preview   # installable APK
```

## Content and licences

- Quran text: Tanzil Project (tanzil.net), Creative Commons Attribution 3.0, verbatim
- Quran font: Amiri Quran, SIL Open Font License 1.1
- Recitations: streamed from Islamic Network (alquran.cloud), licensed by the reciters or their estates for free, non-commercial use
- Photos and flags: Wikimedia Commons, free licences only, credited in the app
- Privacy: [docs/PRIVACY_POLICY.md](docs/PRIVACY_POLICY.md)
- Reviewer checklist: [docs/REVIEW_CHECKLIST.md](docs/REVIEW_CHECKLIST.md)

## Licence

Code: MIT. Religious texts, fonts, recitations and images keep their own licences, listed above and in the app.
