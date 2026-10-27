import React from 'react';
import Svg, { Circle, Defs, G, LinearGradient, Path, Polygon, Rect, Stop, Text as SvgText } from 'react-native-svg';

// Feature icons in a Turkish-Sufi style: each glyph sits in a Seljuk eight-pointed
// star medallion (Iznik teal with a gold rim), like the tiles of Konya and Bursa.
// Glyphs: tulip (lale), whirling dervish (sema), kandil lamp, mihrab, rehal ...
export type IconName =
  | 'quran' | 'mosque' | 'kaaba' | 'tasbih' | 'dua' | 'calendar' | 'tracker' | 'timetable' | 'nearby'
  | 'tulip' | 'kandil' | 'book' | 'library' | 'allah' | 'crescent' | 'hajj' | 'quill' | 'zakat' | 'wheat'
  | 'scales' | 'globe' | 'gear' | 'dervish' | 'home' | 'qibla';

const GOLD = '#E3C27A';
const IVORY = '#FFF8E7';

function starPath(cx: number, cy: number, r: number): string {
  // Two overlapping squares give the Seljuk eight-pointed star outline.
  const pts: string[] = [];
  for (let i = 0; i < 16; i++) {
    const a = (Math.PI / 8) * i - Math.PI / 2;
    const rad = i % 2 === 0 ? r : r * 0.8;
    pts.push(`${(cx + rad * Math.cos(a)).toFixed(2)},${(cy + rad * Math.sin(a)).toFixed(2)}`);
  }
  return pts.join(' ');
}

function Glyph({ name, c, a }: { name: IconName; c: string; a: string }) {
  switch (name) {
    case 'quran':
      return (
        <G>
          <Path d="M20 40 L44 26 M44 40 L20 26" stroke={a} strokeWidth={2.4} strokeLinecap="round" />
          <Path d="M18 26 C24 22 29 22 32 25 C35 22 40 22 46 26 L46 30 C40 27 35 27 32 30 C29 27 24 27 18 30 Z" fill={c} />
        </G>
      );
    case 'mosque':
    case 'home':
      return (
        <G>
          <Path d="M22 44 V34 C22 27 27 23 32 21 C37 23 42 27 42 34 V44 Z" fill={c} />
          <Rect x={16} y={26} width={3.2} height={18} fill={c} />
          <Path d="M16 26 L17.6 20 L19.2 26 Z" fill={c} />
          <Rect x={44.8} y={26} width={3.2} height={18} fill={c} />
          <Path d="M44.8 26 L46.4 20 L48 26 Z" fill={c} />
          <Path d="M32 21 V16" stroke={a} strokeWidth={1.6} />
          <Path d="M29 44 V38 C29 35 35 35 35 38 V44 Z" fill={a} />
        </G>
      );
    case 'kaaba':
    case 'qibla':
      return (
        <G>
          <Polygon points="32,18 46,24 46,40 32,46 18,40 18,24" fill="#1B1B1B" />
          <Polygon points="32,18 46,24 32,30 18,24" fill="#333" />
          <Path d="M18 28 L32 34 L46 28" stroke={a} strokeWidth={2.4} fill="none" />
          {name === 'qibla' && <Path d="M32 10 L35 16 L29 16 Z" fill={a} />}
        </G>
      );
    case 'hajj':
      return (
        <G>
          <Circle cx={32} cy={32} r={14} fill="none" stroke={a} strokeWidth={1.4} strokeDasharray="3 2.5" />
          <Polygon points="32,24 40,27 40,37 32,40 24,37 24,27" fill="#1B1B1B" />
          <Path d="M24 30 L32 33 L40 30" stroke={a} strokeWidth={1.8} fill="none" />
        </G>
      );
    case 'tasbih':
      return (
        <G>
          {Array.from({ length: 12 }, (_, i) => {
            const t = (Math.PI * 2 * i) / 12;
            return <Circle key={i} cx={32 + 10 * Math.cos(t)} cy={29 + 10 * Math.sin(t)} r={2.2} fill={i === 3 ? a : c} />;
          })}
          <Path d="M32 39 V44 M30 44 L32 48 L34 44 Z" stroke={a} strokeWidth={1.6} fill={a} />
        </G>
      );
    case 'dua':
      return (
        <G>
          <Path d="M20 26 C20 36 24 42 31 44 L31 30 C29 27 26 24 20 26 Z" fill={c} />
          <Path d="M44 26 C44 36 40 42 33 44 L33 30 C35 27 38 24 44 26 Z" fill={c} />
          <Circle cx={32} cy={20} r={2.4} fill={a} />
        </G>
      );
    case 'calendar':
    case 'crescent':
      return (
        <G>
          <Circle cx={29} cy={32} r={12} fill={c} />
          <Circle cx={33.5} cy={29.5} r={10.5} fill="#0E6E6E" />
          <Polygon points={starPoints(41, 27, 4.2, 1.7)} fill={a} />
          {name === 'calendar' && <Path d="M18 46 H46" stroke={a} strokeWidth={2} />}
        </G>
      );
    case 'tracker':
      return (
        <G>
          <Polygon points={starPath(32, 32, 13)} fill="none" stroke={c} strokeWidth={2} />
          <Path d="M25 32 L30 37 L40 26" stroke={a} strokeWidth={3.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </G>
      );
    case 'timetable':
      return (
        <G>
          <Path d="M20 46 V30 C20 22 26 17 32 15 C38 17 44 22 44 30 V46 Z" fill="none" stroke={c} strokeWidth={2.2} />
          <Circle cx={32} cy={33} r={7} fill="none" stroke={a} strokeWidth={2} />
          <Path d="M32 29 V33 L35 35" stroke={a} strokeWidth={1.8} strokeLinecap="round" />
        </G>
      );
    case 'nearby':
      return (
        <G>
          <Path d="M32 48 C24 38 20 33 20 27 A12 12 0 0 1 44 27 C44 33 40 38 32 48 Z" fill={c} />
          <Path d="M27 31 V27 C27 24 30 22 32 21 C34 22 37 24 37 27 V31 Z" fill="#0E6E6E" />
          <Path d="M32 21 V18" stroke="#0E6E6E" strokeWidth={1.4} />
        </G>
      );
    case 'tulip':
      return (
        <G transform="translate(32 34) scale(1.35) translate(-32 -32)">
          <Path d="M32 46 C32 40 32 36 32 32" stroke={c} strokeWidth={2} />
          <Path d="M32 42 C27 41 24 37 24 34 C28 35 31 38 32 42 Z" fill={c} />
          <Path d="M32 32 C25 31 23 24 25 17 C28 20 30 22 32 26 C34 22 36 20 39 17 C41 24 39 31 32 32 Z" fill={a} />
          <Path d="M32 26 C31 22 31 19 32 15 C33 19 33 22 32 26 Z" fill={IVORY} />
        </G>
      );
    case 'kandil':
      return (
        <G>
          <Path d="M32 12 V18" stroke={a} strokeWidth={1.4} />
          <Path d="M24 22 H40 L37 36 C36 40 28 40 27 36 Z" fill={c} />
          <Path d="M24 22 L26 18 H38 L40 22" fill={a} />
          <Path d="M32 26 C30 29 30 31 32 33 C34 31 34 29 32 26 Z" fill={a} />
          <Path d="M30 40 L32 46 L34 40" fill={a} />
        </G>
      );
    case 'book':
      return (
        <G>
          <Path d="M18 24 C24 21 29 22 32 25 V44 C29 41 24 40 18 43 Z" fill={c} />
          <Path d="M46 24 C40 21 35 22 32 25 V44 C35 41 40 40 46 43 Z" fill={c} opacity={0.85} />
          <Path d="M40 14 L30 34" stroke={a} strokeWidth={2.2} strokeLinecap="round" />
          <Path d="M40 14 L43 12 L41 16 Z" fill={a} />
        </G>
      );
    case 'library':
      return (
        <G>
          <Rect x={18} y={20} width={6} height={26} rx={1} fill={c} />
          <Rect x={25.5} y={17} width={6} height={29} rx={1} fill={a} />
          <Rect x={33} y={22} width={6} height={24} rx={1} fill={c} />
          <Path d="M41 23 L46.5 21.5 L52 44 L46.5 45.5 Z" fill={a} transform="translate(-3 0)" />
          <Path d="M18 46 H46" stroke={c} strokeWidth={1.6} />
        </G>
      );
    case 'allah':
      return (
        <SvgText x={32} y={40} fontSize={22} fontWeight="bold" fill={a} textAnchor="middle">الله</SvgText>
      );
    case 'quill':
      return (
        <G>
          <Rect x={18} y={20} width={22} height={26} rx={2} fill={IVORY} />
          <Path d="M22 28 H34 M22 33 H34 M22 38 H30" stroke="#0E6E6E" strokeWidth={1.4} />
          <Path d="M48 14 C40 18 34 26 32 38 C38 32 44 26 48 14 Z" fill={a} />
        </G>
      );
    case 'zakat':
      return (
        <G>
          <Rect x={20} y={36} width={24} height={5} rx={2.5} fill={a} />
          <Rect x={22} y={30} width={22} height={5} rx={2.5} fill={c} />
          <Rect x={20} y={24} width={24} height={5} rx={2.5} fill={a} />
          <Circle cx={32} cy={17} r={4} fill={c} />
          <Circle cx={33.6} cy={16} r={3.2} fill="#0E6E6E" />
        </G>
      );
    case 'wheat':
      return (
        <G>
          <Path d="M32 48 V18" stroke={a} strokeWidth={1.8} />
          {[20, 26, 32, 38].map((y) => (
            <G key={y}>
              <Path d={`M32 ${y + 4} C27 ${y + 3} 25 ${y} 25 ${y - 3} C29 ${y - 2} 31 ${y} 32 ${y + 4} Z`} fill={a} />
              <Path d={`M32 ${y + 4} C37 ${y + 3} 39 ${y} 39 ${y - 3} C35 ${y - 2} 33 ${y} 32 ${y + 4} Z`} fill={c} />
            </G>
          ))}
        </G>
      );
    case 'scales':
      return (
        <G>
          <Path d="M32 16 V44 M24 46 H40 M18 22 H46" stroke={c} strokeWidth={2.2} strokeLinecap="round" />
          <Path d="M18 22 L13 34 H23 Z M46 22 L41 34 H51 Z" fill="none" stroke={a} strokeWidth={1.6} />
          <Path d="M13 34 C14 38 22 38 23 34 Z M41 34 C42 38 50 38 51 34 Z" fill={a} />
          <Circle cx={32} cy={15} r={2.2} fill={a} />
        </G>
      );
    case 'globe':
      return (
        <G>
          <Circle cx={32} cy={32} r={13} fill="none" stroke={c} strokeWidth={2} />
          <Path d="M19 32 H45 M32 19 C26 25 26 39 32 45 C38 39 38 25 32 19" fill="none" stroke={a} strokeWidth={1.6} />
        </G>
      );
    case 'gear':
      return (
        <G>
          <Polygon points={starPath(32, 32, 14)} fill={c} />
          <Circle cx={32} cy={32} r={5} fill="#0E6E6E" />
          <Circle cx={32} cy={32} r={2} fill={a} />
        </G>
      );
    case 'dervish':
      // A Mevlevi semazen: tall sikke hat, raised arms, flowing tennure skirt.
      return (
        <G>
          <Rect x={30.2} y={12} width={3.6} height={8} rx={1.6} fill={a} />
          <Circle cx={32} cy={22} r={2.8} fill={c} />
          <Path d="M32 25 L22 18 M32 25 L42 21" stroke={c} strokeWidth={2} strokeLinecap="round" />
          <Path d="M29 25 H35 L46 46 C38 49 26 49 18 46 Z" fill={c} />
          <Path d="M22 44 C28 46 36 46 42 44" stroke={a} strokeWidth={1.4} fill="none" />
        </G>
      );
    default:
      return null;
  }
}

function starPoints(cx: number, cy: number, R: number, r: number): string {
  const p: string[] = [];
  for (let i = 0; i < 10; i++) {
    const t = -Math.PI / 2 + (i * Math.PI) / 5;
    const rad = i % 2 === 0 ? R : r;
    p.push(`${(cx + rad * Math.cos(t)).toFixed(2)},${(cy + rad * Math.sin(t)).toFixed(2)}`);
  }
  return p.join(' ');
}

/** A feature icon. `bare` draws only the glyph (for the tab bar). */
export default function SufiIcon({ name, size = 52, bare, tint }: { name: IconName; size?: number; bare?: boolean; tint?: string }) {
  const id = `md-${name}`;
  if (bare) {
    return (
      <Svg width={size} height={size} viewBox="10 10 44 44">
        <Glyph name={name} c={tint ?? '#0E6E6E'} a={GOLD === tint ? '#0E6E6E' : '#B08A3E'} />
      </Svg>
    );
  }
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      <Defs>
        <LinearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#13807F" />
          <Stop offset="1" stopColor="#063F3F" />
        </LinearGradient>
      </Defs>
      <Polygon points={starPath(32, 32, 31)} fill={GOLD} />
      <Polygon points={starPath(32, 32, 28.5)} fill={`url(#${id})`} />
      <Polygon points={starPath(32, 32, 25)} fill="none" stroke={GOLD} strokeWidth={0.6} opacity={0.6} />
      <Glyph name={name} c={IVORY} a={GOLD} />
    </Svg>
  );
}

/** Screen headers pass their emoji; these get the matching Sufi icon instead. */
export const EMOJI_ICON: Record<string, IconName> = {
  '🏫': 'tulip', '🎓': 'book', '🕯️': 'kandil', '📚': 'library', '✨': 'allah', '🕋': 'hajj', '👶': 'crescent',
  '🌾': 'wheat', '⚖️': 'scales', '📍': 'nearby', '🗓️': 'timetable', '📔': 'quill', '🤲': 'dua',
};
