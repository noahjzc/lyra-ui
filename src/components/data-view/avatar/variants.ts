import { cva } from 'class-variance-authority';

export const avatarVariants = cva(
  'relative inline-flex shrink-0 select-none items-center justify-center overflow-hidden border font-extrabold transition-ui-state motion-reduce:transition-none',
  {
    variants: {
      interactive: {
        true: 'outline-none hover:border-(--ui-input-hover-border) hover:bg-(--ui-input-filled-background) hover:shadow-sm focus-visible:ring-2 focus-visible:ring-(--ui-button-focus-ring)',
        false: '',
      },
      shape: {
        circle: 'rounded-full',
        square: 'rounded-lg',
      },
      size: {
        large: 'size-10 text-sm',
        middle: 'size-8 text-xs',
        small: 'size-6 text-[11px]',
        xlarge: 'size-12 text-base',
      },
      variant: {
        app: 'border-(--ui-avatar-app-border) bg-(--ui-avatar-app-background) text-(--ui-avatar-app-foreground)',
        neutral: 'border-ui-border bg-ui-muted text-ui-foreground',
        org: 'border-(--ui-button-ghost-border) bg-(--ui-button-ghost-background) text-(--ui-button-ghost-foreground)',
        user: 'border-(--ui-avatar-user-border) bg-(--ui-avatar-user-background) text-(--ui-avatar-user-foreground)',
      },
    },
    defaultVariants: {
      interactive: false,
      shape: 'circle',
      size: 'middle',
      variant: 'user',
    },
  },
);

export const avatarStatusClassName = {
  away: 'bg-amber-300',
  busy: 'bg-ui-warning',
  offline: 'bg-ui-muted-foreground',
  online: 'bg-ui-success',
} as const;

export const avatarStatusSizeClassName = {
  small: 'size-1.5',
  middle: 'size-2',
  large: 'size-2',
  xlarge: 'size-2',
} as const;
