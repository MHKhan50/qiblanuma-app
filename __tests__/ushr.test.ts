import { calculateUshr, ushrRate } from '../src/engine/ushr';

describe('ushr (Hanafi)', () => {
  it('10% rain-fed, 5% paid water, majority decides when mixed', () => {
    expect(calculateUshr({ quantity: 400, irrigation: 'rain' }).due).toBe(40);
    expect(calculateUshr({ quantity: 400, irrigation: 'paid', pricePerUnit: 4000 })).toEqual({ rate: 0.05, due: 20, value: 80000 });
    expect(ushrRate({ irrigation: 'mixed', paidShare: 0.7 })).toBe(0.05);
    expect(ushrRate({ irrigation: 'mixed', paidShare: 0.3 })).toBe(0.1);
  });
  it('has no nisab: small harvests still pay', () => {
    expect(calculateUshr({ quantity: 3, irrigation: 'rain' }).due).toBeCloseTo(0.3, 5);
    expect(calculateUshr({ quantity: -5, irrigation: 'rain' }).due).toBe(0);
  });
});
