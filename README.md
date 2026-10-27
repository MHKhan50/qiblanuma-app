# Qiblanuma

A free prayer times and Qibla app for Android and iPhone, built with React Native, Expo and TypeScript. No ads, no tracking, no account. Location is used on the phone only and is never sent anywhere.

Working name. Developer: Masmatix Innovations.

## Version 0.1 (this step)

- Prayer times engine written from the published astronomical formulas, with no third-party calculation library
  - Methods: Karachi (University of Islamic Sciences), Muslim World League, ISNA, Egypt, Umm al-Qura, Tehran, Diyanet angles
  - Hanafi or standard Asr, Hanafi by default
  - High latitude rules for places like Glasgow: angle based, one seventh of night, middle of night
  - Per-prayer minute adjustments and elevation
  - Makruh windows (sunrise, zawal, before sunset)
- Qibla: great-circle bearing, distance to the Kaaba, live compass with accuracy and a calibration hint
- World clock with each city's local time and next prayer. 127 cities in 49 groups: Khilafat-e-Rashida first, then the Ottoman state, then other Muslim states in historical order, the Sufi centres of the Barr-e-Azeem, and present-day world cities; a city appears in every group it belonged to. Users add, remove and reorder their own list, with search by city or empire.
- Urdu, Roman Urdu and English, right-to-left layout for Urdu, light and dark themes
- Settings saved on the phone

## Accuracy

| Check | Result |
|---|---|
| Karachi method vs a published Karachi timetable, 17 to 26 Oct 2026 | all five prayers within 1 minute |
| Glasgow sunrise and sunset vs a published table, across the UK clock change | within 3 minutes (our values match the NOAA formulas) |
| Qibla bearing vs six published city bearings | within 0.1 degree |

Official timetables are not in the tests yet. See [docs/RESEARCH_NOTES.md](docs/RESEARCH_NOTES.md) for sources and open checks.

## Run it

Needs Node.js 20.19.4 or newer, the Expo Go app (SDK 58) on the phone, and the same free Expo account signed in on the computer and in Expo Go.

```bash
npm install
npm test
npx expo login
npx expo start --tunnel
```

Scan the QR code with Expo Go (Android) or the Camera app (iPhone).

## Structure

```
src/engine/     astronomy, methods, prayer times, qibla, time zones (pure TypeScript, tested)
src/data/       city catalog, empire groups and manual locations
src/i18n/       English, Urdu and Roman Urdu strings
src/state/      settings (stored on the phone) and location
src/screens/    Today, Qibla, Cities, Settings
__tests__/      engine tests, published reference checks, official timetable fixtures
```

## Roadmap

1. Adhan reminders (Android exact alarms and a battery optimisation guide; iOS rolling schedule)
2. Qibla map line and home screen widget
3. Quran (Tanzil Uthmani text, verbatim, licence confirmed), then translations one by one after licence checks
4. Tasbeeh, duas and kalimas, learning sections

## Licence

Code: MIT. Religious texts added later keep their own licences, listed in the app and in this repository.
