import type * as React from 'react';
import type { ImageProps } from './types';

export function resolveSize(
  value: number | string | undefined,
): number | string | undefined {
  if (typeof value === 'number') return `${value}px`;

  return value;
}

export function resolveImageStyle({
  height,
  ratio,
  style,
  width,
}: Pick<ImageProps, 'height' | 'ratio' | 'width'> & {
  style: React.CSSProperties | undefined;
}) {
  return {
    ...style,
    aspectRatio: ratio,
    height: resolveSize(height),
    width: resolveSize(width),
  } as React.CSSProperties;
}
