import { cva } from 'class-variance-authority';

export const timelineVariants = cva(
  'grid min-w-0 list-none p-0 text-sm text-ui-foreground',
  {
    variants: {
      density: {
        compact: 'gap-0',
        default: 'gap-0',
      },
      variant: {
        default: '',
        panel: 'rounded-lg border border-ui-border bg-ui-background p-3',
        plain: '',
      },
    },
    defaultVariants: {
      density: 'default',
      variant: 'default',
    },
  },
);

export const timelineItemVariants = cva(
  'relative grid min-w-0 grid-cols-[5.25rem_1.125rem_minmax(0,1fr)] gap-2',
  {
    variants: {
      density: {
        compact:
          'grid-cols-[3.5rem_1rem_minmax(0,1fr)] pb-2 text-[13px] last:pb-0',
        default: 'pb-3.5 last:pb-0',
      },
      disabled: {
        false: '',
        true: 'opacity-55',
      },
    },
    defaultVariants: {
      density: 'default',
      disabled: false,
    },
  },
);

export const timelineTimeClassName =
  'min-w-0 truncate text-xs leading-5 text-ui-muted-foreground';

export const timelineRailClassName = 'relative flex justify-center';

export const timelineLineClassName =
  'absolute top-[18px] bottom-[-14px] w-px bg-ui-border';

export const timelineBodyClassName = 'grid min-w-0 gap-0.5';

export const timelineActionClassName =
  'grid min-w-0 rounded-md text-left outline-none transition-ui-state hover:bg-(--ui-button-ghost-hover-background) focus-visible:ring-2 focus-visible:ring-(--ui-button-focus-ring)';

export const timelineTitleVariants = cva(
  'min-w-0 truncate text-[13px] font-semibold leading-[1.5]',
  {
    variants: {
      current: {
        false: 'text-ui-foreground',
        true: 'text-(--ui-button-primary-background)',
      },
    },
    defaultVariants: {
      current: false,
    },
  },
);

export const timelineDotClassName = {
  current:
    'size-2.5 border-ui-background bg-(--ui-button-primary-background) ring-2 ring-(--ui-accent-soft-ring)',
  default:
    'size-[9px] border-ui-background bg-(--ui-timeline-dot-muted-background) ring-1 ring-ui-border',
  done: 'size-[9px] border-ui-background bg-ui-success ring-1 ring-ui-success/30',
  error:
    'size-[9px] border-ui-background bg-ui-destructive ring-1 ring-ui-destructive/25',
  pending:
    'size-[9px] border-(--ui-button-primary-border) bg-ui-background ring-1 ring-(--ui-accent-soft-ring)',
  success:
    'size-[9px] border-ui-background bg-ui-success ring-1 ring-ui-success/30',
  warning:
    'size-[9px] border-ui-background bg-ui-warning ring-1 ring-ui-warning/30',
} as const;
