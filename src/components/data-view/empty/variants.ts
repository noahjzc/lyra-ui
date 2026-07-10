import { cva } from 'class-variance-authority';

export const emptyVariants = cva(
  'flex min-w-0 flex-col items-center justify-center text-center text-ui-muted-foreground',
  {
    variants: {
      compact: {
        true: 'gap-2 py-6',
        false: 'gap-3 py-10',
      },
    },
    defaultVariants: {
      compact: false,
    },
  },
);

export const emptyVisualVariants = cva(
  'inline-flex shrink-0 items-center justify-center rounded-full border',
  {
    variants: {
      compact: {
        true: 'size-10',
        false: 'size-14',
      },
      type: {
        'error-empty':
          'border-ui-destructive/25 bg-ui-destructive/10 text-ui-destructive',
        'no-data':
          'border-(--ui-button-ghost-border) bg-(--ui-button-ghost-background) text-(--ui-button-ghost-foreground)',
        'no-permission':
          'border-ui-warning/30 bg-ui-warning/10 text-ui-warning',
        'no-result':
          'border-ui-processing/25 bg-ui-processing/10 text-ui-processing',
        'not-configured': 'border-ui-assist/25 bg-ui-assist/10 text-ui-assist',
      },
    },
    defaultVariants: {
      compact: false,
      type: 'no-data',
    },
  },
);
