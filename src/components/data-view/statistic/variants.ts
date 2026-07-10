import { cva } from 'class-variance-authority';
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  TriangleAlert,
} from 'lucide-react';

export const statisticVariants = cva('min-w-0 text-ui-foreground', {
  variants: {
    variant: {
      card: 'grid gap-2 rounded-lg border border-ui-border bg-ui-background p-3 shadow-sm',
      inline: 'flex items-center gap-2',
      plain: 'grid gap-1.5',
      summary:
        'grid gap-2 rounded-lg border border-ui-border bg-ui-background p-3',
    },
  },
  defaultVariants: {
    variant: 'plain',
  },
});

export const titleVariants = cva(
  'min-w-0 truncate font-semibold text-ui-muted-foreground',
  {
    variants: {
      size: {
        compact: 'text-xs',
        default: 'text-xs',
        inline: 'text-xs',
      },
      variant: {
        card: '',
        inline: 'shrink-0',
        plain: '',
        summary: '',
      },
    },
    defaultVariants: {
      size: 'default',
      variant: 'plain',
    },
  },
);

export const valueVariants = cva(
  'flex min-w-0 items-baseline gap-1 font-semibold tabular-nums tracking-normal text-ui-foreground',
  {
    variants: {
      size: {
        compact: 'text-lg leading-6',
        default: 'text-2xl leading-none',
        inline: 'text-base leading-5',
      },
      status: {
        default: '',
        empty: 'text-ui-muted-foreground',
        error: 'text-ui-muted-foreground',
        'not-configured': 'text-ui-muted-foreground',
        permission: 'text-ui-muted-foreground',
        stale: '',
      },
    },
    defaultVariants: {
      size: 'default',
      status: 'default',
    },
  },
);

export const loadingVariants = cva(
  'animate-pulse rounded bg-ui-muted motion-reduce:animate-none',
  {
    variants: {
      size: {
        compact: 'h-6 w-24',
        default: 'h-7 w-28',
        inline: 'h-5 w-20',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
);

export const trendClassName = {
  down: 'text-ui-destructive',
  neutral: 'text-ui-muted-foreground',
  up: 'text-ui-success',
  warning: 'text-ui-warning',
} as const;

export const statusClassName = {
  default: 'text-ui-muted-foreground',
  empty: 'text-ui-muted-foreground',
  error: 'text-ui-destructive',
  'not-configured': 'text-ui-muted-foreground',
  permission: 'text-ui-muted-foreground',
  stale: 'text-ui-warning',
} as const;

export const trendIcon = {
  down: ArrowDownRight,
  neutral: ArrowRight,
  up: ArrowUpRight,
  warning: TriangleAlert,
} as const;
