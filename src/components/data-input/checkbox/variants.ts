import { cva } from 'class-variance-authority';

export const checkboxVariants = cva(
  'peer inline-grid shrink-0 place-items-center border border-(--ui-input-border) bg-(--ui-input-background) text-(--ui-inverse-foreground) outline-none transition-ui-state transition-ui-transform hover:border-(--ui-input-hover-border) active:scale-95 focus-visible:border-(--ui-input-focus-border) focus-visible:ring-2 focus-visible:ring-(--ui-input-focus-ring) disabled:cursor-not-allowed disabled:scale-100 disabled:border-(--ui-input-disabled-border) disabled:bg-(--ui-input-disabled-background) disabled:text-(--ui-input-disabled-foreground) data-[invalid=true]:border-(--ui-input-error-border) data-[invalid=true]:ring-2 data-[invalid=true]:ring-(--ui-input-error-ring) data-[state=checked]:border-(--ui-input-focus-border) data-[state=checked]:bg-(--ui-input-focus-border) data-[state=indeterminate]:border-(--ui-input-focus-border) data-[state=indeterminate]:bg-(--ui-input-focus-border) disabled:data-[state=checked]:border-(--ui-control-checked-disabled-border) disabled:data-[state=checked]:bg-(--ui-control-checked-disabled-background) disabled:data-[state=indeterminate]:border-(--ui-control-checked-disabled-border) disabled:data-[state=indeterminate]:bg-(--ui-control-checked-disabled-background)',
  {
    defaultVariants: {
      size: 'middle',
    },
    variants: {
      size: {
        large: 'size-[18px] rounded-[5px]',
        middle: 'size-4 rounded',
        small: 'size-3.5 rounded-[3px]',
      },
    },
  },
);

export const checkboxIconClassName = {
  large: 'size-3.5',
  middle: 'size-3',
  small: 'size-2.5',
} as const;

export const checkboxFieldClassName = {
  large: 'gap-2 text-sm leading-5',
  middle: 'gap-2 text-sm leading-5',
  small: 'gap-1.5 text-xs leading-5',
} as const;
