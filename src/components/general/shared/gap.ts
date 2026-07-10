type GapToken = 4 | 6 | 8 | 10 | 12 | 16 | 20 | 24;
type GapAlias = 'small' | 'middle' | 'large';

export type GapSize =
  | GapToken
  | GapAlias
  | [GapToken | GapAlias, GapToken | GapAlias];

const GAP_SIZE_MAP = {
  small: 4,
  middle: 8,
  large: 12,
} as const;

export function resolveGap(gap: GapSize = 8) {
  const [rowGap, columnGap] = Array.isArray(gap) ? gap : [gap, gap];

  return {
    rowGap: resolveGapValue(rowGap),
    columnGap: resolveGapValue(columnGap),
  };
}

function resolveGapValue(gap: GapToken | GapAlias) {
  const value = typeof gap === 'number' ? gap : GAP_SIZE_MAP[gap];

  return `${value}px`;
}
