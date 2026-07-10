import { cva } from 'class-variance-authority';

export const tooltipContentVariants = cva(
  'max-w-[280px] rounded-md border border-(--ui-tooltip-border) bg-(--ui-tooltip-background) text-(--ui-tooltip-foreground) shadow-ui-elevation-0 data-[state=closed]:animate-ui-layer-out data-[state=delayed-open]:animate-ui-layer-in data-[state=instant-open]:animate-ui-layer-in',
  {
    variants: {
      size: {
        compact: 'px-2 py-1 text-xs leading-[18px]',
        default: 'px-2.5 py-1.5 text-sm leading-[22px]',
      },
    },
    defaultVariants: {
      size: 'compact',
    },
  },
);
