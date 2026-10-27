import { distribute, netEstate, NO_HEIRS, type Heirs } from '../src/engine/inheritance';

const run = (p: Partial<Heirs>) => {
  const r = distribute({ ...NO_HEIRS, ...p });
  const m: Record<string, string> = {};
  for (const s of r.shares) m[s.heir] = s.total.toString();
  return { ...r, m };
};

describe('Hanafi inheritance', () => {
  it('husband, one daughter and father', () => {
    expect(run({ husband: 1, daughters: 1, father: 1 }).m).toEqual({ husband: '1/4', daughters: '1/2', father: '1/4' });
  });
  it('Umariyyatan: wife, mother, father', () => {
    expect(run({ wives: 1, mother: 1, father: 1 }).m).toEqual({ wives: '1/4', father: '1/2', mother: '1/4' });
    expect(run({ husband: 1, mother: 1, father: 1 }).m).toEqual({ husband: '1/2', father: '1/3', mother: '1/6' });
  });
  it("'awl: husband and two full sisters", () => {
    const r = run({ husband: 1, fullSisters: 2 });
    expect(r.awl).toBe(true);
    expect(r.m).toEqual({ husband: '3/7', fullSisters: '4/7' });
  });
  it('sons take twice the daughters', () => {
    expect(run({ sons: 1, daughters: 1 }).m).toEqual({ sons: '2/3', daughters: '1/3' });
    const r = run({ wives: 1, sons: 2, daughters: 1 });
    expect(r.m).toEqual({ wives: '1/8', sons: '7/10', daughters: '7/40' });
    expect(r.shares.find((s) => s.heir === 'sons')!.each.toString()).toBe('7/20');
  });
  it('radd: mother and one daughter', () => {
    const r = run({ mother: 1, daughters: 1 });
    expect(r.radd).toBe(true);
    expect(r.m).toEqual({ daughters: '3/4', mother: '1/4' });
  });
  it('radd never goes to the spouse while others remain', () => {
    expect(run({ wives: 1, daughters: 1 }).m).toEqual({ wives: '1/8', daughters: '7/8' });
  });
  it('Himariyya: full brother gets nothing (Hanafi)', () => {
    const r = run({ husband: 1, mother: 1, maternalSiblings: 2, fullBrothers: 1 });
    expect(r.m).toEqual({ husband: '1/2', mother: '1/6', fullBrothers: '0', maternalSiblings: '1/3' });
  });
  it('blocking: son blocks brothers, father blocks grandfather and siblings', () => {
    const r = run({ sons: 1, fullBrothers: 2, father: 1, grandfather: 1 });
    expect(r.m).toEqual({ sons: '5/6', father: '1/6', grandfather: '0', fullBrothers: '0' });
    expect(r.shares.find((s) => s.heir === 'fullBrothers')!.blocked).toBe(true);
  });
  it('grandfather blocks siblings when there is no father (Abu Hanifa)', () => {
    expect(run({ grandfather: 1, fullBrothers: 1 }).m).toEqual({ grandfather: '1', fullBrothers: '0' });
  });
  it("daughters with full sister: sister takes the residue", () => {
    expect(run({ daughters: 2, fullSisters: 1 }).m).toEqual({ daughters: '2/3', fullSisters: '1/3' });
  });
  it("son's daughter completes two thirds with one daughter", () => {
    expect(run({ daughters: 1, sonsDaughters: 1, fullBrothers: 1 }).m).toEqual({ daughters: '1/2', sonsDaughters: '1/6', fullBrothers: '1/3' });
  });
  it('shares always add up to the whole', () => {
    const cases: Partial<Heirs>[] = [
      { wives: 2, mother: 1, daughters: 3, father: 1 }, { husband: 1, mother: 1, fullSisters: 1, paternalSisters: 1 },
      { grandmothers: 2, paternalGrandmother: 1, sons: 1 }, { wives: 1 }, { mother: 1, maternalSiblings: 1 },
    ];
    for (const c of cases) {
      const r = run(c);
      const sum = r.shares.reduce((a, s) => a + s.total.value(), 0) + r.unassigned.value();
      expect(Math.abs(sum - 1) < 1e-9).toBe(true);
    }
  });
  it('wasiyyat is capped at one third after debts', () => {
    expect(netEstate(1200, 0, 300, 600)).toEqual({ net: 600, wasiyyat: 300, capped: true });
    expect(netEstate(900, 100, 200, 100)).toEqual({ net: 500, wasiyyat: 100, capped: false });
  });
});
