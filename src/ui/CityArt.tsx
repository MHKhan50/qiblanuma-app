import React from 'react';
import Svg, { Circle, Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

// Drawn skyline used when no free photo of the city has been downloaded yet:
// a dusk sky in one of several palettes, a crescent and a mosque silhouette.
const SKIES = [
  ['#0E6E6E', '#F2C230'], ['#1E3A8A', '#F97316'], ['#4C1D95', '#F472B6'], ['#065F46', '#A3E635'],
  ['#7C2D12', '#FBBF24'], ['#0F172A', '#38BDF8'], ['#831843', '#FDBA74'], ['#134E4A', '#5EEAD4'],
];

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export default function CityArt({ id, size = 56 }: { id: string; size?: number }) {
  const h = hash(id);
  const [top, bottom] = SKIES[h % SKIES.length];
  const variant = (h >> 3) % 3;
  return (
    <Svg width={size} height={size} viewBox="0 0 60 60">
      <Defs>
        <LinearGradient id={`sky-${id}`} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={top} />
          <Stop offset="1" stopColor={bottom} />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width="60" height="60" rx="12" fill={`url(#sky-${id})`} />
      <Circle cx="46" cy="14" r="6" fill="#FFF7D6" />
      <Circle cx="48.5" cy="12.5" r="5" fill={top} />
      {/* minarets */}
      <Rect x={variant === 2 ? 6 : 9} y="22" width="4" height="32" fill="#0B1418" opacity={0.85} />
      <Path d={`M${variant === 2 ? 6 : 9} 22 L${variant === 2 ? 8 : 11} 15 L${variant === 2 ? 10 : 13} 22 Z`} fill="#0B1418" opacity={0.85} />
      <Rect x={variant === 2 ? 50 : 47} y="22" width="4" height="32" fill="#0B1418" opacity={0.85} />
      <Path d={`M${variant === 2 ? 50 : 47} 22 L${variant === 2 ? 52 : 49} 15 L${variant === 2 ? 54 : 51} 22 Z`} fill="#0B1418" opacity={0.85} />
      {/* main dome and hall */}
      <Path d="M16 54 V38 H44 V54 Z" fill="#0B1418" opacity={0.85} />
      <Path d={variant === 1 ? 'M18 38 Q30 18 42 38 Z' : 'M19 38 C19 26 41 26 41 38 Z'} fill="#0B1418" opacity={0.85} />
      <Path d="M30 26 V20" stroke="#0B1418" strokeWidth={1.4} opacity={0.85} />
      {variant !== 1 && <Path d="M13 44 C13 38 20 38 20 44 Z M40 44 C40 38 47 38 47 44 Z" fill="#0B1418" opacity={0.85} />}
      <Path d="M27 54 V47 C27 44 33 44 33 47 V54 Z" fill={bottom} opacity={0.9} />
    </Svg>
  );
}
