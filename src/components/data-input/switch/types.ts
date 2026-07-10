import type * as SwitchPrimitive from '@radix-ui/react-switch';
import type { VariantProps } from 'class-variance-authority';
import type * as React from 'react';
import type { switchTrackVariants } from './variants';

export type SwitchSize = NonNullable<
  VariantProps<typeof switchTrackVariants>['size']
>;
export type SwitchContentVariant = NonNullable<
  VariantProps<typeof switchTrackVariants>['content']
>;

type SwitchTrackVariantProps = Omit<
  VariantProps<typeof switchTrackVariants>,
  'content'
>;

export interface SwitchProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>,
      'children' | 'content'
    >,
    SwitchTrackVariantProps {
  checkedIcon?: React.ReactNode;
  checkedText?: React.ReactNode;
  loading?: boolean;
  uncheckedIcon?: React.ReactNode;
  uncheckedText?: React.ReactNode;
}

export interface SwitchFieldProps
  extends Omit<SwitchProps, 'children' | 'size'> {
  card?: boolean;
  description?: React.ReactNode;
  helperText?: React.ReactNode;
  label: React.ReactNode;
  labelPlacement?: 'left' | 'right';
  size?: SwitchSize;
}
