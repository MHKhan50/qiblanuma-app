// Islamic inheritance (mirath) by the Hanafi school, for the common heirs.
// Order: funeral costs and debts first, then the wasiyyat (at most one third of
// what is left), then the fixed shares (fara'id), then the residue (asabah),
// with 'awl when shares exceed the whole and radd when something is left over.
// Distant relatives (uncles, cousins, dhawil-arham) are not covered: the result
// says so and the family must ask a mufti.

export interface Heirs {
  husband: number; // 0 or 1
  wives: number; // 0..4
  sons: number;
  daughters: number;
  sonsSons: number;
  sonsDaughters: number;
  father: number; // 0 or 1
  mother: number; // 0 or 1
  grandfather: number; // father's father, 0 or 1
  grandmothers: number; // 0..2 (mother's mother, father's mother)
  paternalGrandmother: number; // how many of the grandmothers are the father's mother (0 or 1)
  fullBrothers: number;
  fullSisters: number;
  paternalBrothers: number;
  paternalSisters: number;
  maternalSiblings: number;
}

export const NO_HEIRS: Heirs = {
  husband: 0, wives: 0, sons: 0, daughters: 0, sonsSons: 0, sonsDaughters: 0, father: 0, mother: 0,
  grandfather: 0, grandmothers: 0, paternalGrandmother: 0, fullBrothers: 0, fullSisters: 0,
  paternalBrothers: 0, paternalSisters: 0, maternalSiblings: 0,
};

export type HeirKey = keyof Omit<Heirs, 'paternalGrandmother'>;

// ---------- exact fractions ----------
export class Frac {
  readonly n: number;
  readonly d: number;
  constructor(n: number, d = 1) {
    if (d === 0) throw new Error('zero denominator');
    const g = gcd(Math.abs(n), Math.abs(d)) || 1;
    const s = d < 0 ? -1 : 1;
    this.n = (s * n) / g;
    this.d = (s * d) / g;
  }
  add(o: Frac) { return new Frac(this.n * o.d + o.n * this.d, this.d * o.d); }
  sub(o: Frac) { return new Frac(this.n * o.d - o.n * this.d, this.d * o.d); }
  mul(o: Frac) { return new Frac(this.n * o.n, this.d * o.d); }
  div(o: Frac) { return new Frac(this.n * o.d, this.d * o.n); }
  cmp(o: Frac) { return this.n * o.d - o.n * this.d; }
  isZero() { return this.n === 0; }
  value() { return this.n / this.d; }
  toString() { return this.d === 1 ? `${this.n}` : `${this.n}/${this.d}`; }
}
function gcd(a: number, b: number): number { return b === 0 ? a : gcd(b, a % b); }
const F = (n: number, d = 1) => new Frac(n, d);
const ZERO = F(0);

export interface Share {
  heir: HeirKey;
  count: number;
  /** Share of the whole estate for the whole group. */
  total: Frac;
  /** Share for each person in the group. */
  each: Frac;
  /** Why: e.g. "1/4 (fixed)", "residue", "blocked by son". */
  basis: string;
  blocked?: boolean;
}

export interface Result {
  shares: Share[];
  awl: boolean;
  radd: boolean;
  /** Part of the estate no listed heir takes (goes to distant relatives or Bait-ul-Mal). */
  unassigned: Frac;
  warnings: string[];
}

export function distribute(h: Heirs): Result {
  const warnings: string[] = [];
  const children = h.sons + h.daughters + h.sonsSons + h.sonsDaughters > 0;
  const maleDesc = h.sons + h.sonsSons > 0;
  const siblingsCount = h.fullBrothers + h.fullSisters + h.paternalBrothers + h.paternalSisters + h.maternalSiblings;
  const father = h.father > 0;
  const grandfather = !father && h.grandfather > 0;
  const paternalAscendant = father || grandfather;

  const fixed = new Map<HeirKey, { f: Frac; basis: string }>();
  const blocked = new Map<HeirKey, string>();
  // residuary groups, highest priority first: [heir, weight per person]
  let residuary: { heir: HeirKey; weight: number }[] = [];

  // Spouses
  if (h.husband) fixed.set('husband', { f: children ? F(1, 4) : F(1, 2), basis: children ? '1/4' : '1/2' });
  if (h.wives) fixed.set('wives', { f: children ? F(1, 8) : F(1, 4), basis: children ? '1/8' : '1/4' });

  // Descendants
  if (h.sons) {
    residuary = [{ heir: 'sons', weight: 2 }];
    if (h.daughters) residuary.push({ heir: 'daughters', weight: 1 });
    if (h.sonsSons) blocked.set('sonsSons', 'son');
    if (h.sonsDaughters) blocked.set('sonsDaughters', 'son');
  } else {
    if (h.daughters) {
      if (h.daughters === 1) fixed.set('daughters', { f: F(1, 2), basis: '1/2' });
      else fixed.set('daughters', { f: F(2, 3), basis: '2/3' });
    }
    if (h.sonsSons) {
      residuary = [{ heir: 'sonsSons', weight: 2 }];
      if (h.sonsDaughters) residuary.push({ heir: 'sonsDaughters', weight: 1 });
    } else if (h.sonsDaughters) {
      if (h.daughters === 0) fixed.set('sonsDaughters', { f: h.sonsDaughters === 1 ? F(1, 2) : F(2, 3), basis: h.sonsDaughters === 1 ? '1/2' : '2/3' });
      else if (h.daughters === 1) fixed.set('sonsDaughters', { f: F(1, 6), basis: '1/6 (completing 2/3)' });
      else blocked.set('sonsDaughters', 'two or more daughters');
    }
  }

  // Father / grandfather
  const pa: HeirKey | null = father ? 'father' : grandfather ? 'grandfather' : null;
  if (h.grandfather && father) blocked.set('grandfather', 'father');
  if (pa) {
    if (maleDesc) fixed.set(pa, { f: F(1, 6), basis: '1/6' });
    else if (children) { fixed.set(pa, { f: F(1, 6), basis: '1/6 + residue' }); residuary.push({ heir: pa, weight: 1 }); }
    else residuary.push({ heir: pa, weight: 1 });
  }

  // Mother
  const spouse = h.husband ? 'husband' : h.wives ? 'wives' : null;
  let umariyya = false;
  if (h.mother) {
    if (children || siblingsCount >= 2) fixed.set('mother', { f: F(1, 6), basis: '1/6' });
    else if (father && spouse) { umariyya = true; fixed.set('mother', { f: ZERO, basis: '1/3 of the remainder (Umariyyatan)' }); }
    else fixed.set('mother', { f: F(1, 3), basis: '1/3' });
  }

  // Grandmothers
  if (h.grandmothers) {
    const paternalOnes = Math.min(h.paternalGrandmother, h.grandmothers);
    let eligible = h.grandmothers;
    if (h.mother) { blocked.set('grandmothers', 'mother'); eligible = 0; }
    else if (father) eligible -= paternalOnes;
    if (eligible > 0) fixed.set('grandmothers', { f: F(1, 6), basis: '1/6 shared' });
    else if (!h.mother) blocked.set('grandmothers', 'father');
    if (eligible > 0 && eligible < h.grandmothers) warnings.push("The father's mother is blocked by the father; the 1/6 goes to the mother's mother.");
  }

  // Maternal siblings: blocked by any descendant or paternal ascendant
  if (h.maternalSiblings) {
    if (children || paternalAscendant) blocked.set('maternalSiblings', children ? 'children' : father ? 'father' : 'grandfather');
    else fixed.set('maternalSiblings', { f: h.maternalSiblings === 1 ? F(1, 6) : F(1, 3), basis: h.maternalSiblings === 1 ? '1/6' : '1/3 shared equally' });
  }

  // Full and paternal siblings: blocked by son, son's son, father, grandfather (Hanafi)
  const sibBlocker = h.sons ? 'son' : h.sonsSons ? "son's son" : father ? 'father' : grandfather ? 'grandfather' : null;
  const femaleDesc = h.daughters + h.sonsDaughters > 0;
  let fullSisterResiduary = false;
  if (sibBlocker) {
    for (const k of ['fullBrothers', 'fullSisters', 'paternalBrothers', 'paternalSisters'] as const) if (h[k]) blocked.set(k, sibBlocker);
  } else {
    if (h.fullBrothers) {
      residuary.push({ heir: 'fullBrothers', weight: 2 });
      if (h.fullSisters) residuary.push({ heir: 'fullSisters', weight: 1 });
    } else if (h.fullSisters) {
      if (femaleDesc) { residuary.push({ heir: 'fullSisters', weight: 1 }); fullSisterResiduary = true; }
      else fixed.set('fullSisters', { f: h.fullSisters === 1 ? F(1, 2) : F(2, 3), basis: h.fullSisters === 1 ? '1/2' : '2/3' });
    }
    const paternalBlocker = h.fullBrothers ? 'full brother' : fullSisterResiduary ? 'full sister (with daughters)' : null;
    if (paternalBlocker) {
      if (h.paternalBrothers) blocked.set('paternalBrothers', paternalBlocker);
      if (h.paternalSisters) blocked.set('paternalSisters', paternalBlocker);
    } else {
      if (h.paternalBrothers) {
        residuary.push({ heir: 'paternalBrothers', weight: 2 });
        if (h.paternalSisters) residuary.push({ heir: 'paternalSisters', weight: 1 });
      } else if (h.paternalSisters) {
        if (h.fullSisters >= 2) blocked.set('paternalSisters', 'two full sisters');
        else if (h.fullSisters === 1) fixed.set('paternalSisters', { f: F(1, 6), basis: '1/6 (completing 2/3)' });
        else if (femaleDesc) residuary.push({ heir: 'paternalSisters', weight: 1 });
        else fixed.set('paternalSisters', { f: h.paternalSisters === 1 ? F(1, 2) : F(2, 3), basis: h.paternalSisters === 1 ? '1/2' : '2/3' });
      }
    }
  }

  // Only the highest residuary class inherits the residue.
  if (residuary.length) {
    const top = residuary[0].heir;
    const rank = (k: HeirKey) => (['sons', 'daughters'].includes(k) ? 0 : ['sonsSons', 'sonsDaughters'].includes(k) ? 1 : ['father', 'grandfather'].includes(k) ? 2 : ['fullBrothers', 'fullSisters'].includes(k) ? 3 : 4);
    const r = rank(top);
    for (const x of residuary.filter((y) => rank(y.heir) !== r)) if (!fixed.has(x.heir)) blocked.set(x.heir, 'a closer residuary heir');
    residuary = residuary.filter((y) => rank(y.heir) === r);
  }

  // Umariyyatan: mother takes 1/3 of what is left after the spouse.
  if (umariyya && spouse) {
    const s = fixed.get(spouse)!.f;
    fixed.set('mother', { f: F(1).sub(s).mul(F(1, 3)), basis: '1/3 of the remainder after the spouse (Umariyyatan)' });
  }

  // Sum fixed shares; 'awl if over 1.
  let sum = ZERO;
  for (const v of fixed.values()) sum = sum.add(v.f);
  let awl = false;
  if (sum.cmp(F(1)) > 0) {
    awl = true;
    for (const [k, v] of fixed) fixed.set(k, { f: v.f.div(sum), basis: `${v.basis}, reduced by 'awl` });
    sum = F(1);
  }

  const totals = new Map<HeirKey, Frac>();
  for (const [k, v] of fixed) totals.set(k, v.f);
  let rest = F(1).sub(sum);
  let radd = false;
  let unassigned = ZERO;

  if (residuary.length && !rest.isZero()) {
    const units = residuary.reduce((a, x) => a + x.weight * (h[x.heir] as number), 0);
    for (const x of residuary) {
      const part = rest.mul(F(x.weight * (h[x.heir] as number), units));
      totals.set(x.heir, (totals.get(x.heir) ?? ZERO).add(part));
    }
    rest = ZERO;
  } else if (residuary.length) {
    for (const x of residuary) if (!totals.has(x.heir)) totals.set(x.heir, ZERO);
  }

  if (!rest.isZero()) {
    // Radd: return the remainder to the fixed heirs other than the spouses, in proportion.
    const raddHeirs = [...fixed.keys()].filter((k) => k !== 'husband' && k !== 'wives' && !fixed.get(k)!.f.isZero());
    if (raddHeirs.length) {
      radd = true;
      const base = raddHeirs.reduce((a, k) => a.add(fixed.get(k)!.f), ZERO);
      for (const k of raddHeirs) totals.set(k, totals.get(k)!.add(rest.mul(fixed.get(k)!.f.div(base))));
      rest = ZERO;
    } else if (spouse) {
      // Later Hanafi scholars: with no other heir at all, the remainder returns to the spouse.
      radd = true;
      totals.set(spouse, totals.get(spouse)!.add(rest));
      warnings.push('Only a spouse inherits here. Later Hanafi scholars give the rest to the spouse when there are no other relatives; check with a mufti, as distant relatives (dhawil-arham) may exist.');
      rest = ZERO;
    } else {
      unassigned = rest;
      warnings.push('No listed heir takes this part. It may go to uncles, cousins or other relatives not covered here; please ask a mufti.');
    }
  }

  const shares: Share[] = [];
  const order: HeirKey[] = ['husband', 'wives', 'sons', 'daughters', 'sonsSons', 'sonsDaughters', 'father', 'mother', 'grandfather', 'grandmothers', 'fullBrothers', 'fullSisters', 'paternalBrothers', 'paternalSisters', 'maternalSiblings'];
  for (const k of order) {
    const count = h[k] as number;
    if (!count) continue;
    if (blocked.has(k) && !totals.has(k)) {
      shares.push({ heir: k, count, total: ZERO, each: ZERO, basis: `blocked by ${blocked.get(k)}`, blocked: true });
      continue;
    }
    const total = totals.get(k) ?? ZERO;
    const inRes = residuary.some((x) => x.heir === k);
    const basis = fixed.has(k) ? fixed.get(k)!.basis + (inRes && !fixed.get(k)!.basis.includes('residue') ? ' + residue' : '') : 'residue';
    const people = k === 'grandmothers' && father ? Math.max(1, count - Math.min(h.paternalGrandmother, count)) : count;
    shares.push({ heir: k, count, total, each: total.div(F(people)), basis: radd && fixed.has(k) && k !== 'husband' && k !== 'wives' ? `${basis} + radd` : basis });
  }
  if (h.wives > 4) warnings.push('More than four wives is not valid.');
  if (h.husband && h.wives) warnings.push('A deceased person cannot have both a husband and a wife.');
  return { shares, awl, radd, unassigned, warnings };
}

/** What is left to divide after funeral costs, debts and the wasiyyat (capped at one third). */
export function netEstate(estate: number, funeral: number, debts: number, wasiyyat: number): { net: number; wasiyyat: number; capped: boolean } {
  const afterDebts = Math.max(0, estate - funeral - debts);
  const cap = afterDebts / 3;
  const w = Math.min(Math.max(0, wasiyyat), cap);
  return { net: afterDebts - w, wasiyyat: w, capped: wasiyyat > cap };
}
