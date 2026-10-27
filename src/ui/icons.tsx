import React from 'react';
import Svg, { Circle, G, Line, Path, Polygon, Rect } from 'react-native-svg';

// Hand-drawn line icons in an Iznik-tile style: teal strokes with gold accents.
interface P { size?: number; color: string; accent: string }

export function QuranIcon({ size = 44, color, accent }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Path d="M8 12c6-2 11-1 16 3v24c-5-4-10-5-16-3z" fill="none" stroke={color} strokeWidth={2.4} strokeLinejoin="round" />
      <Path d="M40 12c-6-2-11-1-16 3v24c5-4 10-5 16-3z" fill="none" stroke={color} strokeWidth={2.4} strokeLinejoin="round" />
      <Polygon points="16,19 17.5,22 21,22.4 18.4,24.6 19.2,28 16,26.2 12.8,28 13.6,24.6 11,22.4 14.5,22" fill={accent} />
      <Line x1="28" y1="21" x2="36" y2="20" stroke={accent} strokeWidth={2} strokeLinecap="round" />
      <Line x1="28" y1="26" x2="36" y2="25" stroke={accent} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export function KaabaIcon({ size = 44, color, accent }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Polygon points="24,8 40,14 40,34 24,40 8,34 8,14" fill={color} />
      <Polygon points="24,8 40,14 24,20 8,14" fill={color} opacity={0.75} />
      <Path d="M8 19l16 6 16-6" fill="none" stroke={accent} strokeWidth={2.4} />
      <Rect x="28" y="27" width="5" height="8" fill={accent} opacity={0.9} />
    </Svg>
  );
}

export function MosqueClockIcon({ size = 44, color, accent }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Path d="M12 40V24c0-7 5-11 12-14 7 3 12 7 12 14v16z" fill="none" stroke={color} strokeWidth={2.4} strokeLinejoin="round" />
      <Line x1="24" y1="4" x2="24" y2="10" stroke={accent} strokeWidth={2} />
      <Line x1="6" y1="40" x2="6" y2="18" stroke={color} strokeWidth={2.4} />
      <Line x1="42" y1="40" x2="42" y2="18" stroke={color} strokeWidth={2.4} />
      <Circle cx="24" cy="28" r="7" fill="none" stroke={accent} strokeWidth={2.2} />
      <Path d="M24 24v4l3 2" fill="none" stroke={accent} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export function TasbeehIcon({ size = 44, color, accent }: P) {
  const beads = Array.from({ length: 11 }, (_, i) => {
    const a = (Math.PI * 2 * i) / 11 - Math.PI / 2;
    return { x: 24 + 13 * Math.cos(a), y: 21 + 13 * Math.sin(a) };
  });
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      {beads.map((b, i) => <Circle key={i} cx={b.x} cy={b.y} r={3} fill={i === 0 ? accent : color} />)}
      <Line x1="24" y1="34" x2="24" y2="44" stroke={accent} strokeWidth={2.4} strokeLinecap="round" />
    </Svg>
  );
}

export function GlobeIcon({ size = 44, color, accent }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Circle cx="24" cy="24" r="16" fill="none" stroke={color} strokeWidth={2.4} />
      <Path d="M24 8c-6 5-6 27 0 32M24 8c6 5 6 27 0 32M8 24h32" fill="none" stroke={color} strokeWidth={2} />
      <Path d="M30 13a7 7 0 1 0 0 10a5.5 5.5 0 1 1 0-10z" fill={accent} />
    </Svg>
  );
}

export function GearIcon({ size = 44, color, accent }: P) {
  const teeth = Array.from({ length: 8 }, (_, i) => (i * 360) / 8);
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <G>
        {teeth.map((deg) => (
          <Rect key={deg} x="21.5" y="6" width="5" height="8" rx="1.5" fill={color} transform={`rotate(${deg} 24 24)`} />
        ))}
      </G>
      <Circle cx="24" cy="24" r="12" fill="none" stroke={color} strokeWidth={4} />
      <Circle cx="24" cy="24" r="4.5" fill={accent} />
    </Svg>
  );
}

/** Eight-pointed star (Rub el Hizb), used as a decorative divider. */
export function Star8({ size = 18, color }: { size?: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect x="5" y="5" width="14" height="14" fill={color} />
      <Rect x="5" y="5" width="14" height="14" fill={color} transform="rotate(45 12 12)" />
    </Svg>
  );
}
