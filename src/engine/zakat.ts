// Zakat on wealth, Hanafi method. Nisab is 52.5 tola of silver (612.36 g) or
// 7.5 tola of gold (87.48 g); 1 tola = 11.664 g. When wealth is mixed, the
// Hanafi position commonly taught is to use the silver nisab, which is better
// for the poor. Rate 2.5% after a full lunar year. To be confirmed by a mufti.

export const TOLA_GRAMS = 11.664;
export const SILVER_NISAB_G = 52.5 * TOLA_GRAMS;
export const GOLD_NISAB_G = 7.5 * TOLA_GRAMS;

export interface ZakatInput {
  goldGrams: number; silverGrams: number; goldPricePerGram: number; silverPricePerGram: number;
  cash: number; businessStock: number; receivables: number; debts: number;
}

export interface ZakatResult { total: number; nisab: number; due: boolean; zakat: number; onlyGold: boolean }

export function calculateZakat(i: ZakatInput): ZakatResult {
  const n = (x: number) => (Number.isFinite(x) && x > 0 ? x : 0);
  const gold = n(i.goldGrams) * n(i.goldPricePerGram);
  const silver = n(i.silverGrams) * n(i.silverPricePerGram);
  const others = n(i.cash) + n(i.businessStock) + n(i.receivables);
  const total = Math.max(0, gold + silver + others - n(i.debts));
  // Only gold and nothing else: the gold nisab applies by weight; otherwise the silver nisab by value.
  const onlyGold = n(i.goldGrams) > 0 && silver === 0 && others === 0;
  const nisab = onlyGold ? GOLD_NISAB_G * n(i.goldPricePerGram) : SILVER_NISAB_G * n(i.silverPricePerGram);
  const due = onlyGold ? n(i.goldGrams) >= GOLD_NISAB_G && total > 0 : nisab > 0 && total >= nisab;
  return { total, nisab, due, zakat: due ? total * 0.025 : 0, onlyGold };
}
