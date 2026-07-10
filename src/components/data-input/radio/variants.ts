import { cva } from 'class-variance-authority';

export const radioControlVariants = cva(
  'inline-grid shrink-0 place-items-center rounded-full border border-(--ui-input-border) bg-(--ui-input-background) text-(--ui-input-focus-border) transition-ui-state transition-ui-transform hover:border-(--ui-input-hover-border) focus-visible:border-(--ui-input-focus-border) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ui-input-focus-ring) active:scale-95 disabled:scale-100 disabled:border-(--ui-input-disabled-border) disabled:bg-(--ui-input-disabled-background) data-[state=checked]:border-(--ui-input-focus-border) data-[invalid=true]:border-(--ui-input-error-border) data-[invalid=true]:ring-2 data-[invalid=true]:ring-(--ui-input-error-ring) disabled:data-[state=checked]:border-(--ui-control-checked-disabled-border) disabled:data-[state=checked]:bg-(--ui-control-checked-disabled-background)',
  {
    defaultVariants: {
      size: 'middle',
    },
    variants: {
      size: {
        large: 'size-[18px]',
        middle: 'size-4',
        small: 'size-3.5',
      },
    },
  },
);

export const radioIndicatorClassName = {
  large: 'size-2.5',
  middle: 'size-2',
  small: 'size-1.5',
} as const;

export const radioFieldClassName = {
  large: 'gap-2 text-sm leading-5',
  middle: 'gap-2 text-sm leading-5',
  small: 'gap-1.5 text-xs leading-5',
} as const;

export const radioButtonClassName = {
  large: 'h-9 px-3.5 text-sm',
  middle: 'h-8 px-3 text-sm',
  small: 'h-7 px-2 text-xs',
} as const;

export const radioButtonGroupClassName = {
  large: 'min-h-9',
  middle: 'min-h-8',
  small: 'min-h-7',
} as const;
