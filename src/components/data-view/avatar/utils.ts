import { Building2, User } from 'lucide-react';
import * as React from 'react';
import type { AvatarProps } from './types';

export function getInitials(name: string | undefined) {
  const normalizedName = name?.trim();

  if (!normalizedName) return '';

  const parts = normalizedName.split(/\s+/).filter(Boolean);

  if (parts.length > 1) {
    return parts
      .slice(0, 2)
      .map(part => part[0])
      .join('')
      .toUpperCase();
  }

  return normalizedName.slice(0, 2).toUpperCase();
}

export function getDefaultIcon(shape: AvatarProps['shape']) {
  if (shape === 'square') {
    return React.createElement(Building2, { className: 'size-1/2' });
  }

  return React.createElement(User, { className: 'size-1/2' });
}

export function resolveSizeStyle(
  size: AvatarProps['size'],
  style: React.CSSProperties | undefined,
): React.CSSProperties | undefined {
  if (typeof size !== 'number') return style;

  return {
    ...style,
    fontSize: Math.max(11, Math.floor(size / 2.8)),
    height: size,
    width: size,
  };
}
