import { cva } from 'class-variance-authority';

export const inputRootVariants = cva(
  'group flex w-full min-w-0 items-center gap-1.5 border text-sm text-ui-foreground outline-none transition-ui-state transition-ui-transform focus-within:border-(--ui-input-focus-border) focus-within:ring-2 focus-within:ring-(--ui-input-focus-ring) data-[disabled=true]:cursor-not-allowed data-[disabled=true]:border-(--ui-input-disabled-border) data-[disabled=true]:bg-(--ui-input-disabled-background) data-[disabled=true]:text-(--ui-input-disabled-foreground) data-[disabled=true]:shadow-none data-[invalid=true]:border-(--ui-input-error-border) data-[invalid=true]:focus-within:ring-(--ui-input-error-ring) data-[readonly=true]:border-dashed data-[readonly=true]:bg-(--ui-input-readonly-background)',
  {
    variants: {
      variant: {
        outlined:
          'rounded-md border-(--ui-input-border) bg-(--ui-input-background) hover:border-(--ui-input-hover-border) hover:shadow-sm',
        filled:
          'rounded-md border-transparent bg-(--ui-input-filled-background) hover:border-(--ui-input-hover-border) hover:bg-(--ui-input-filled-hover-background)',
        borderless:
          'rounded-md border-transparent bg-transparent hover:bg-(--ui-input-borderless-hover-background) focus-within:border-transparent data-[invalid=true]:border-transparent data-[invalid=true]:bg-(--ui-input-error-background) data-[invalid=true]:shadow-(--ui-input-underlined-error-shadow)',
        underlined:
          'rounded-none border-x-0 border-t-0 border-b-(--ui-input-border) bg-transparent px-0 hover:border-b-(--ui-input-hover-border) focus-within:border-x-0 focus-within:border-t-0 focus-within:shadow-(--ui-input-underlined-focus-shadow) focus-within:ring-0 data-[invalid=true]:border-b-(--ui-input-error-border) data-[invalid=true]:shadow-(--ui-input-underlined-error-shadow) data-[invalid=true]:focus-within:ring-0',
      },
      size: {
        small: 'h-7 px-2 text-xs',
        middle: 'h-8 px-2.5',
        large: 'h-9 px-2.5',
      },
    },
    defaultVariants: {
      variant: 'outlined',
      size: 'middle',
    },
  },
);

export const inputElementVariants = cva(
  'min-w-0 flex-1 bg-transparent p-0 text-inherit outline-none placeholder:text-ui-muted-foreground disabled:cursor-not-allowed disabled:text-(--ui-input-disabled-foreground)',
  {
    variants: {
      size: {
        small: 'h-5 text-xs leading-5',
        middle: 'h-[22px] text-sm leading-[22px]',
        large: 'h-[22px] text-sm leading-[22px]',
      },
    },
    defaultVariants: {
      size: 'middle',
    },
  },
);

export const textareaRootVariants = cva(
  'group relative flex w-full min-w-0 border text-sm text-ui-foreground outline-none transition-ui-state transition-ui-transform focus-within:border-(--ui-input-focus-border) focus-within:ring-2 focus-within:ring-(--ui-input-focus-ring) data-[disabled=true]:cursor-not-allowed data-[disabled=true]:border-(--ui-input-disabled-border) data-[disabled=true]:bg-(--ui-input-disabled-background) data-[disabled=true]:text-(--ui-input-disabled-foreground) data-[disabled=true]:shadow-none data-[invalid=true]:border-(--ui-input-error-border) data-[invalid=true]:focus-within:ring-(--ui-input-error-ring) data-[readonly=true]:border-dashed data-[readonly=true]:bg-(--ui-input-readonly-background)',
  {
    variants: {
      variant: {
        outlined:
          'rounded-md border-(--ui-input-border) bg-(--ui-input-background) hover:border-(--ui-input-hover-border) hover:shadow-sm',
        filled:
          'rounded-md border-transparent bg-(--ui-input-filled-background) hover:border-(--ui-input-hover-border) hover:bg-(--ui-input-filled-hover-background)',
        borderless:
          'rounded-md border-transparent bg-transparent hover:bg-(--ui-input-borderless-hover-background) focus-within:border-transparent data-[invalid=true]:border-transparent data-[invalid=true]:bg-(--ui-input-error-background) data-[invalid=true]:shadow-(--ui-input-underlined-error-shadow)',
        underlined:
          'rounded-t-md rounded-b-none border-x-0 border-t-0 border-b-(--ui-input-border) bg-(--ui-surface-soft-background) hover:border-b-(--ui-input-hover-border) focus-within:border-x-0 focus-within:border-t-0 focus-within:shadow-(--ui-input-underlined-focus-shadow) focus-within:ring-0 data-[invalid=true]:border-b-(--ui-input-error-border) data-[invalid=true]:shadow-(--ui-input-underlined-error-shadow) data-[invalid=true]:focus-within:ring-0',
      },
    },
    defaultVariants: {
      variant: 'outlined',
    },
  },
);

export const textareaResizeClassName = {
  none: 'resize-none',
  vertical: 'resize-y',
} as const;

export const addonVariants = cva(
  'inline-flex shrink-0 items-center justify-center self-stretch whitespace-nowrap bg-(--ui-input-addon-background) px-2 text-xs font-bold text-ui-muted-foreground',
  {
    variants: {
      side: {
        prefix:
          '-ml-2.5 mr-0.5 rounded-l-[5px] border-ui-border border-r group-data-[size=small]:-ml-2',
        suffix:
          '-mr-2.5 ml-0.5 rounded-r-[5px] border-ui-border border-l group-data-[size=small]:-mr-2',
      },
    },
  },
);
