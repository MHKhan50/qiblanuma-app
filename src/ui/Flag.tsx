import React from 'react';
import Svg, { Circle, Defs, G, LinearGradient, Path, Polygon, Rect, Stop, Text as SvgText } from 'react-native-svg';

// Banners for the Muslim states, drawn in the app so they always show (no
// download needed). Most medieval states had no single official flag; these use
// the colours and emblems traditionally associated with each dynasty.
import { FLAG_SPECS } from './flagSpecs';

function Star8({ cx, cy, r, color }: { cx: number; cy: number; r: number; color: string }) {
  const s = r * 0.72;
  return (
    <G>
      <Rect x={cx - s} y={cy - s} width={s * 2} height={s * 2} fill={color} />
      <Rect x={cx - s} y={cy - s} width={s * 2} height={s * 2} fill={color} rotation={45} origin={`${cx}, ${cy}`} />
    </G>
  );
}

function starPoints(cx: number, cy: number, R: number, r: number): string {
  const p: string[] = [];
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rad = i % 2 === 0 ? R : r;
    p.push(`${(cx + rad * Math.cos(a)).toFixed(2)},${(cy + rad * Math.sin(a)).toFixed(2)}`);
  }
  return p.join(' ');
}

export default function Flag({ id, width = 36, height = 24 }: { id: string; width?: number; height?: number }) {
  const f = FLAG_SPECS[id] ?? FLAG_SPECS.auliya;
  const W = 60;
  const H = 40;
  const x0 = f.stripe ? 15 : 0;
  const cx = x0 + (W - x0) / 2;
  const cy = H / 2;
  let emblem: React.ReactNode = null;
  switch (f.emblem) {
    case 'crescentStar':
    case 'crescent':
      emblem = (
        <G>
          <Circle cx={cx - 3} cy={cy} r={11} fill={f.fg} />
          <Circle cx={cx} cy={cy} r={9} fill={f.bg} />
          {f.emblem === 'crescentStar' && <Polygon points={starPoints(cx + 7, cy, 5, 2)} fill={f.fg} />}
        </G>
      );
      break;
    case 'shahada':
      emblem = (
        <SvgText x={cx} y={cy + 5} fontSize={11} fontWeight="bold" fill={f.fg} textAnchor="middle">
          لا إله إلا الله
        </SvgText>
      );
      break;
    case 'star8':
      emblem = <Star8 cx={cx} cy={cy} r={11} color={f.fg} />;
      break;
    case 'sun':
      emblem = (
        <G>
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i * Math.PI) / 6;
            return <Path key={i} d={`M${cx} ${cy} L${cx + 14 * Math.cos(a - 0.12)} ${cy + 14 * Math.sin(a - 0.12)} L${cx + 14 * Math.cos(a + 0.12)} ${cy + 14 * Math.sin(a + 0.12)} Z`} fill={f.fg} />;
          })}
          <Circle cx={cx} cy={cy} r={7} fill={f.fg} />
        </G>
      );
      break;
    case 'rings':
      emblem = (
        <G>
          <Circle cx={cx} cy={cy - 6} r={4.5} fill="none" stroke={f.fg} strokeWidth={2} />
          <Circle cx={cx - 6} cy={cy + 5} r={4.5} fill="none" stroke={f.fg} strokeWidth={2} />
          <Circle cx={cx + 6} cy={cy + 5} r={4.5} fill="none" stroke={f.fg} strokeWidth={2} />
        </G>
      );
      break;
    case 'globe':
      emblem = (
        <G>
          <Circle cx={cx} cy={cy} r={12} fill="none" stroke={f.fg} strokeWidth={2} />
          <Path d={`M${cx - 12} ${cy} H${cx + 12} M${cx} ${cy - 12} C${cx - 8} ${cy - 6} ${cx - 8} ${cy + 6} ${cx} ${cy + 12} C${cx + 8} ${cy + 6} ${cx + 8} ${cy - 6} ${cx} ${cy - 12}`} fill="none" stroke={f.fg} strokeWidth={1.6} />
        </G>
      );
      break;
    case 'swords':
      emblem = (
        <G>
          <Path d={`M${cx - 12} ${cy + 10} L${cx + 12} ${cy - 10} M${cx - 12} ${cy - 10} L${cx + 12} ${cy + 10}`} stroke={f.fg} strokeWidth={2.4} strokeLinecap="round" />
          <Circle cx={cx} cy={cy} r={4} fill={f.fg} />
        </G>
      );
      break;
    default:
      break;
  }
  return (
    <Svg width={width} height={height} viewBox={`0 0 ${W} ${H}`}>
      <Defs>
        <LinearGradient id={`sheen-${id}`} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0.18} />
          <Stop offset="1" stopColor="#000000" stopOpacity={0.12} />
        </LinearGradient>
      </Defs>
      <Rect x={0} y={0} width={W} height={H} rx={4} fill={f.bg} stroke="#00000022" strokeWidth={1} />
      {f.stripe && <Rect x={0} y={0} width={15} height={H} rx={4} fill={f.stripe} />}
      {emblem}
      <Rect x={0} y={0} width={W} height={H} rx={4} fill={`url(#sheen-${id})`} />
    </Svg>
  );
}
