import { cva } from 'class-variance-authority';

export const searchInputRootVariants = cva(
  'group flex w-full min-w-0 items-center gap-1.5 border text-sm text-ui-foreground outline-none transition-ui-state transition-ui-transform focus-within:border-(--ui-input-focus-border) focus-within:ring-2 focus-within:ring-(--ui-input-focus-ring) data-[disabled=true]:cursor-not-allowed data-[disabled=true]:border-(--ui-input-disabled-border) data-[disabled=true]:bg-(--ui-input-disabled-background) data-[disabled=true]:text-(--ui-input-disabled-foreground) data-[disabled=true]:shadow-none data-[invalid=true]:border-(--ui-input-error-border) data-[invalid=true]:focus-within:ring-(--ui-input-error-ring)',
  {
    defaultVariants: {
      size: 'middle',
      variant: 'outlined',
    },
    variants: {
      size: {
        large: 'h-9 px-2.5',
        middle: 'h-8 px-2.5',
        small: 'h-7 px-2 text-xs',
        xlarge: 'h-10 px-3 text-sm',
      },
      variant: {
        borderless:
          'rounded-md border-transparent bg-transparent hover:bg-(--ui-input-borderless-hover-background) focus-within:border-transparent data-[invalid=true]:border-transparent data-[invalid=true]:bg-(--ui-input-error-background) data-[invalid=true]:shadow-(--ui-input-underlined-error-shadow)',
        filled:
          'rounded-md border-transparent bg-(--ui-input-filled-background) hover:border-(--ui-input-hover-border) hover:bg-(--ui-input-filled-hover-background)',
        outlined:
          'rounded-md border-(--ui-input-border) bg-(--ui-input-background) hover:border-(--ui-input-hover-border) hover:shadow-sm',
        underlined:
          'rounded-none border-x-0 border-t-0 border-b-(--ui-input-border) bg-transparent px-0 hover:border-b-(--ui-input-hover-border) focus-within:border-x-0 focus-within:border-t-0 focus-within:shadow-(--ui-input-underlined-focus-shadow) focus-within:ring-0 data-[invalid=true]:border-b-(--ui-input-error-border) data-[invalid=true]:shadow-(--ui-input-underlined-error-shadow) data-[invalid=true]:focus-within:ring-0',
      },
    },
  },
);

export const searchButtonClassName = {
  large: 'h-9 px-3.5 text-sm',
  middle: 'h-8 px-3 text-sm',
  small: 'h-7 px-2.5 text-xs',
  xlarge: 'h-10 px-4 text-sm',
} as const;
