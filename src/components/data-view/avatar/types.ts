import type * as React from 'react';

export type AvatarShape = 'circle' | 'square';
export type AvatarSize = 'large' | 'middle' | 'small' | 'xlarge' | number;
export type AvatarStatus = 'away' | 'busy' | 'offline' | 'online';
export type AvatarVariant = 'app' | 'neutral' | 'org' | 'user';

export interface AvatarProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  alt?: string;
  disabled?: boolean;
  fallback?: React.ReactNode;
  icon?: React.ReactNode;
  interactive?: boolean;
  loading?: React.ImgHTMLAttributes<HTMLImageElement>['loading'];
  name?: string;
  shape?: AvatarShape;
  size?: AvatarSize;
  src?: string;
  status?: AvatarStatus;
  statusLabel?: string;
  variant?: AvatarVariant;
}

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  max?: number;
  shape?: AvatarProps['shape'];
  size?: AvatarProps['size'];
  totalLabel?: (hiddenCount: number) => string;
  variant?: AvatarVariant;
}
