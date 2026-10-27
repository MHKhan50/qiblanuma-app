// Colours drawn from Iznik tile work: deep teal, turquoise and a muted gold.
export interface Palette {
  bg: string; card: string; text: string; muted: string;
  accent: string; gold: string; border: string; danger: string;
}

export const LIGHT: Palette = {
  bg: '#F6F3EC', card: '#FFFFFF', text: '#14232B', muted: '#5C6B73',
  accent: '#0E6E6E', gold: '#B08A3E', border: '#E2DCCF', danger: '#B3452F',
};

export const DARK: Palette = {
  bg: '#0B1418', card: '#14232B', text: '#EDE7DA', muted: '#9AA8AE',
  accent: '#3FB7B0', gold: '#D4B06A', border: '#22343D', danger: '#E07A5F',
};
