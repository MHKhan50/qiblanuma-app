# Research notes: free resources and their terms

Checked on 27 October 2026. Each line says what was verified and what still needs a check before use.

## Platform

| Item | Finding | Source |
|---|---|---|
| Expo SDK | SDK 56 was released on 21 May 2026 (React Native 0.85, React 19.2, Node 20.19.4 or newer). | [Expo SDK 56 changelog](https://expo.dev/changelog/sdk-56) |
| Expo Go on phones | The May 2026 Expo post said store Expo Go supported SDK 54. By 27 Oct 2026 the App Store Expo Go reported client 58.0.5 with supported SDK 58.0.0 (checked on a real iPhone), so the app now targets SDK 58. SDK 58 Expo Go also needs the same Expo account signed in on the phone and the computer. | [Expo Go and the App Store, May 2026](https://expo.dev/changelog/expo-go-and-app-store-may-2026); Expo Go settings screen |
| Android exact alarms | Apps targeting Android 12+ need `SCHEDULE_EXACT_ALARM` (user grantable, not pre-granted on fresh installs of apps targeting Android 13+ on Android 14). `USE_EXACT_ALARM` is granted automatically but limited by Google Play policy to apps whose core function needs precise alarms. Decide between them when adhan reminders are built, after reading the Play policy page. | [Android: Schedule alarms](https://developer.android.com/training/scheduling/alarms), [Play policy 12253906](https://support.google.com/googleplay/android-developer/answer/12253906) |
| Google Play fee | US$25 once per developer account (checked 26 Oct 2026). | Google Play Console help |

## Prayer time calculation

| Item | Finding | Source |
|---|---|---|
| Method angles | Karachi 18/18, MWL 18/17, ISNA 15/15, Egypt 19.5/17.5, Umm al-Qura Fajr 18.5 and Isha 90 minutes after Maghrib (120 in Ramadan), Tehran 17.7/14 with Maghrib at 4.5. | [PrayTimes.org: Calculation methods](https://praytimes.org/wiki/Calculation_Methods) |
| Solar position | USNO "Approximate Solar Coordinates" formulas (about 1 arcminute accuracy, 1950 to 2050). Results were checked against the NOAA solar calculator formulas, which agreed to the minute for Glasgow and Karachi. | US Naval Observatory; NOAA Global Monitoring Laboratory solar calculator |
| adhan-js | MIT licence, latest npm version 4.4.6. Not used: the engine here is written from the published formulas, has no dependencies and is tested directly. adhan-js stays useful as a second implementation for cross-checks. | [adhan on jsDelivr](https://www.jsdelivr.com/package/npm/adhan), [batoulapps/adhan-js](https://github.com/batoulapps/adhan-js) |
| Diyanet (Turkey) | The app uses 18/17 angles only. The official Diyanet timetable adds fixed safety minutes (temkin) per prayer; the exact values must be confirmed from Diyanet before the Turkey method is called exact. | To verify |
| Umm al-Qura in Ramadan | Isha becomes 120 minutes after Maghrib in Ramadan. Needs a Hijri calendar; not implemented yet. | PrayTimes.org |

## Test references used

| Reference | Use | Source |
|---|---|---|
| Karachi, October 2026, Karachi method | Fajr, Dhuhr, Asr (standard shadow), Maghrib and Isha for 17 to 26 Oct; all within 1 minute. | [ihadis.com Karachi](https://ihadis.com/en/countries/pakistan/prayer-times-karachi) |
| Glasgow sunrise and sunset, October 2026 | Days on both sides of the 25 Oct clock change; within 3 minutes. This site's day length is about 3 minutes longer than the NOAA formulas give. | [sunrisesunset.io Glasgow](https://sunrisesunset.io/gb/scotland/glasgow/) |
| Qibla bearings | London 119.0, New York 58.5, Istanbul 151.6, Karachi 267.7, Sydney 277.5, Cairo 136.1; all within 0.1 degree. Kaaba at 21.4225 N, 39.8262 E. | [MakkahLive Qibla](https://makkahlive.net/en/tools/qibla/united-kingdom/glasgow) |
| Official timetables | Not yet collected. Both references above are third-party calculations. `__tests__/fixtures/officialTimetables.ts` is ready for values copied from a masjid or authority timetable, with the source named. | To collect |

## Content for later versions

| Item | Finding | Status |
|---|---|---|
| Quran text (Tanzil) | Creative Commons Attribution 3.0. Verbatim copies may be used in any website or application, the text must not be changed, the source must be indicated with a link to tanzil.net, and the copyright notice must be included. | Terms quoted in the [quRan package README](https://rdrr.io/cran/quRan/f/README.md); confirm on tanzil.net/download before shipping |
| Translations | Each translation has its own copyright holder. None checked yet. | To verify one by one |
| Quran fonts | Not checked yet (candidates: KFGQPC fonts, Amiri under SIL OFL). | To verify |
| Adhan recordings | No licensed source verified. Use system sounds until a recording with written permission is found and credited. | To verify |
| Time zones | IANA tz database through the phone's Intl/ICU; no bundled data needed. | In use |

## Bundled content (fetched by scripts/fetch-content.mjs)

| Item | Rule | Status |
|---|---|---|
| Quran text | Tanzil Uthmani, "text with aya numbers", stored unchanged. The script refuses anything other than 114 suras and 6236 ayahs and keeps Tanzil's notice, which the app shows under Settings, credits. | Needs review by huffaz before release |
| City photos | Lead image of the landmark's English Wikipedia article, used only when the file is on Wikimedia Commons with CC0, CC BY, CC BY-SA or public domain licence. Artist and licence are stored with each photo and shown in the app. | content-report.md lists every photo and every skipped file |
| Group flags | The Ottoman flag (1844) is fixed in scripts/group-flags.json. For other states the script searches Wikimedia Commons for "Flag of the <state>" and keeps only free licences. Many medieval states had no single official flag, so the app calls these traditional representations. Each pick is listed in content-report.md for review. | Review content-report.md before release |
| Hijri date | Phone's Umm al-Qura calendar through Intl, tabular Islamic calendar as fallback, plus a ±2 day adjustment for local moon sighting. | In use |
| Quran audio | Not added. A recitation source with clear terms for app use must be confirmed first. | To verify |

## Quran fonts and scripts (checked 27 Oct 2026)

| Item | Finding | Status |
|---|---|---|
| Amiri Quran | SIL Open Font License 1.1, The Amiri Project Authors. Free to bundle; cannot be sold on its own. Used for the Uthmani text through @expo-google-fonts/amiri-quran. | In use. [Fontsource](https://fontsource.org/fonts/amiri-quran/about) |
| KFGQPC Uthmanic Script Hafs | Property of King Fahd Glorious Quran Printing Complex; copying or altering needs their prior written approval (ScanCode category "Proprietary Free"). | Not bundled. Ask the Complex for written permission. [ScanCode](https://scancode-licensedb.aboutcode.org/kfgqpc-uthmanic-script-hafs.html) |
| IndoPak text and font (QUL, Tarteel) | QUL says each resource has its own licence and some need attribution. The licence tab of the IndoPak text and font could not be read from here. | Import with scripts/import-indopak.mjs only after reading both licence tabs. [QUL FAQ](https://qul.tarteel.ai/faq) |
