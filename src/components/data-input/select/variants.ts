import { cva } from 'class-variance-authority';

export const selectTriggerVariants = cva(
  'group flex w-full min-w-0 items-center justify-between gap-2 border text-sm text-ui-foreground outline-none transition-ui-state transition-ui-transform focus:border-(--ui-input-focus-border) focus:ring-2 focus:ring-(--ui-input-focus-ring) data-[state=open]:border-(--ui-input-focus-border) data-[state=open]:ring-2 data-[state=open]:ring-(--ui-input-focus-ring) data-[disabled=true]:cursor-not-allowed data-[disabled=true]:border-(--ui-input-disabled-border) data-[disabled=true]:bg-(--ui-input-disabled-background) data-[disabled=true]:text-(--ui-input-disabled-foreground) data-[disabled=true]:shadow-none data-[invalid=true]:border-(--ui-input-error-border) data-[invalid=true]:focus:ring-(--ui-input-error-ring) data-[invalid=true]:data-[state=open]:ring-(--ui-input-error-ring)',
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
      },
      variant: {
        borderless:
          'rounded-md border-transparent bg-transparent hover:bg-(--ui-input-borderless-hover-background) focus:border-transparent data-[invalid=true]:border-transparent data-[invalid=true]:bg-(--ui-input-error-background) data-[invalid=true]:shadow-(--ui-input-underlined-error-shadow)',
        filled:
          'rounded-md border-transparent bg-(--ui-input-filled-background) hover:border-(--ui-input-hover-border) hover:bg-(--ui-input-filled-hover-background)',
        outlined:
          'rounded-md border-(--ui-input-border) bg-(--ui-input-background) hover:border-(--ui-input-hover-border) hover:shadow-sm',
        underlined:
          'rounded-none border-x-0 border-t-0 border-b-(--ui-input-border) bg-transparent px-0 hover:border-b-(--ui-input-hover-border) focus:border-x-0 focus:border-t-0 focus:ring-0 focus:shadow-(--ui-input-underlined-focus-shadow) data-[state=open]:border-x-0 data-[state=open]:border-t-0 data-[state=open]:ring-0 data-[state=open]:shadow-(--ui-input-underlined-focus-shadow) data-[invalid=true]:border-b-(--ui-input-error-border) data-[invalid=true]:shadow-(--ui-input-underlined-error-shadow)',
      },
    },
  },
);

export const selectItemClassName =
  'relative flex min-h-8 w-full cursor-default select-none items-center justify-between gap-3 rounded-md px-2 py-1.5 text-sm text-ui-foreground outline-none transition-ui-state transition-ui-transform focus:bg-(--ui-input-filled-background) data-[highlighted]:bg-(--ui-input-filled-background) data-[state=checked]:bg-(--ui-button-ghost-background) data-[state=checked]:font-extrabold data-[state=checked]:text-(--ui-button-ghost-foreground) data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed data-[disabled]:text-(--ui-input-disabled-foreground)';
