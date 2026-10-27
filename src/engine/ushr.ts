// Ushr on crops from ushri land (Hanafi): 10% when watered by rain, rivers or
// natural springs (barani), 5% (nisf-ushr) when watered at cost (tube-well,
// canal water that is paid for, bought water). Imam Abu Hanifa: no nisab, due on
// any quantity, and the costs of seed, fertiliser and labour are not deducted.
// When both kinds of water are used, the kind used for most of the season decides.
export type Irrigation = 'rain' | 'paid' | 'mixed';

export interface UshrInput {
  /** Harvest quantity in any unit (kg or maunds). */
  quantity: number;
  irrigation: Irrigation;
  /** For 'mixed': share of the season watered at cost, 0..1. */
  paidShare?: number;
  /** Optional price per unit, to show the value. */
  pricePerUnit?: number;
}

export function ushrRate(input: Pick<UshrInput, 'irrigation' | 'paidShare'>): number {
  if (input.irrigation === 'rain') return 0.1;
  if (input.irrigation === 'paid') return 0.05;
  return (input.paidShare ?? 0) > 0.5 ? 0.05 : 0.1;
}

export function calculateUshr(input: UshrInput): { rate: number; due: number; value: number | null } {
  const q = Math.max(0, input.quantity || 0);
  const rate = ushrRate(input);
  const due = q * rate;
  return { rate, due, value: input.pricePerUnit ? due * input.pricePerUnit : null };
}

/** 1 maund (man) = 40 kg as used in Pakistani grain markets. */
export const KG_PER_MAUND = 40;
