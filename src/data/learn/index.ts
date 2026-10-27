import { HISN_DUAS, type CategorisedDua, type DuaCategory } from './hisnDuas';
import { MASNOON_DUAS } from './masnoonDuas';
import { HISN_DUAS_2 } from './hisnDuas2';

export { DUA_CATEGORIES, type DuaCategory, type CategorisedDua } from './hisnDuas';
export { pick, type Recitation, type Topic, type Tri, type QuranPart } from './types';

const MASNOON_CATEGORY: Record<string, DuaCategory> = {
  sleep: 'home', wake: 'home', eatStart: 'home', eatForgot: 'home', eatEnd: 'home', milk: 'home',
  toiletIn: 'daily', toiletOut: 'daily', wuduEnd: 'salah', homeOut: 'home', homeIn: 'home',
  masjidIn: 'salah', masjidOut: 'salah', azanAfter: 'salah', clothes: 'home', mirror: 'daily',
  ride: 'travel', sneeze: 'people', salam: 'people', thanks: 'people', farewell: 'travel',
  sick: 'health', newMoon: 'weather', iftar: 'home', knowledge: 'daily', parents: 'daily',
  distress: 'hardship', trust: 'hardship',
};

/** Every masnoon dua in the app, each with a category. */
export const ALL_DUAS: CategorisedDua[] = [
  ...MASNOON_DUAS.map((d) => ({ ...d, category: MASNOON_CATEGORY[d.id] ?? 'daily' })),
  ...HISN_DUAS,
  ...HISN_DUAS_2,
];

/** The short everyday duas children learn first. */
export const KIDS_DUA_IDS = ['sleep', 'wake', 'eatStart', 'eatEnd', 'toiletIn', 'toiletOut', 'homeOut', 'homeIn', 'masjidIn', 'masjidOut', 'clothes', 'mirror', 'sneeze', 'salam', 'thanks', 'ride', 'knowledge', 'parents', 'milk', 'iftar'];
