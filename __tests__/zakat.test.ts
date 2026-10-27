import { calculateZakat, GOLD_NISAB_G, SILVER_NISAB_G } from '../src/engine/zakat';

const base = { goldGrams: 0, silverGrams: 0, goldPricePerGram: 0, silverPricePerGram: 0, cash: 0, businessStock: 0, receivables: 0, debts: 0 };

describe('zakat (Hanafi)', () => {
  it('uses 52.5 and 7.5 tola nisab', () => {
    expect(SILVER_NISAB_G).toBeCloseTo(612.36, 2);
    expect(GOLD_NISAB_G).toBeCloseTo(87.48, 2);
  });

  it('charges 2.5% when mixed wealth passes the silver nisab', () => {
    const r = calculateZakat({ ...base, cash: 200000, silverPricePerGram: 200 });
    expect(r.nisab).toBeCloseTo(122472, 0);
    expect(r.due).toBe(true);
    expect(r.zakat).toBeCloseTo(5000, 6);
  });

  it('is not due below nisab or after debts', () => {
    expect(calculateZakat({ ...base, cash: 100000, silverPricePerGram: 200 }).due).toBe(false);
    expect(calculateZakat({ ...base, cash: 200000, debts: 150000, silverPricePerGram: 200 }).due).toBe(false);
  });

  it('uses the gold nisab by weight when only gold is owned', () => {
    expect(calculateZakat({ ...base, goldGrams: 80, goldPricePerGram: 20000 }).due).toBe(false);
    const r = calculateZakat({ ...base, goldGrams: 90, goldPricePerGram: 20000 });
    expect(r.onlyGold).toBe(true);
    expect(r.zakat).toBeCloseTo(45000, 6);
  });
});
