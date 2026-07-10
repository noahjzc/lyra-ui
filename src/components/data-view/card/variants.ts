import { cva } from 'class-variance-authority';

export const cardVariants = cva(
  'min-w-0 rounded-lg border bg-ui-background text-ui-foreground transition-ui-state motion-reduce:transition-none',
  {
    variants: {
      disabled: {
        true: 'bg-ui-muted/35 text-ui-muted-foreground',
        false: '',
      },
      interactive: {
        true: 'cursor-pointer outline-none hover:border-(--ui-button-default-hover-border) hover:bg-(--ui-button-default-hover-background) focus-visible:ring-2 focus-visible:ring-(--ui-button-focus-ring) focus-visible:ring-offset-2',
        false: '',
      },
      loading: {
        true: 'pointer-events-none',
        false: '',
      },
      selected: {
        true: 'border-(--ui-button-primary-border) bg-(--ui-button-ghost-background) ring-2 ring-(--ui-button-focus-ring)',
        false: '',
      },
      variant: {
        action: 'border-ui-border/70',
        item: 'border-ui-border/70',
        plain: 'border-ui-border shadow-none',
        summary: 'border-ui-border/70 bg-(--ui-input-filled-background)',
      },
    },
    defaultVariants: {
      disabled: false,
      interactive: false,
      loading: false,
      selected: false,
      variant: 'item',
    },
  },
);

export const cardStatusVariants = cva(
  'inline-flex h-[22px] shrink-0 items-center rounded-full border px-2 text-xs font-semibold leading-none',
  {
    variants: {
      variant: {
        info: 'border-(--ui-button-ghost-border) bg-(--ui-button-ghost-background) text-(--ui-button-ghost-foreground)',
        neutral: 'border-ui-border bg-ui-muted text-ui-muted-foreground',
        success: 'border-ui-success/30 bg-ui-success/10 text-ui-success',
        warning: 'border-ui-warning/35 bg-ui-warning/10 text-ui-warning',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  },
);
