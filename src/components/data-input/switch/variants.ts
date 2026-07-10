import { cva } from 'class-variance-authority';

export const switchTrackVariants = cva(
  'relative inline-flex shrink-0 items-center rounded-full bg-(--ui-switch-track-background) p-[3px] outline-none shadow-(--ui-switch-track-shadow) transition-ui-state transition-ui-transform hover:shadow-(--ui-switch-track-hover-shadow) active:scale-95 focus-visible:ring-2 focus-visible:ring-(--ui-input-focus-ring) data-[state=checked]:bg-(--ui-input-focus-border) disabled:cursor-not-allowed disabled:scale-100 disabled:opacity-50 data-[loading=true]:cursor-wait data-[loading=true]:opacity-100',
  {
    compoundVariants: [
      { className: 'w-12', content: 'icon', size: 'small' },
      { className: 'w-14', content: 'icon', size: 'middle' },
      { className: 'w-16', content: 'icon', size: 'large' },
      { className: 'w-16', content: 'text', size: 'small' },
      { className: 'w-[72px]', content: 'text', size: 'middle' },
      { className: 'w-[84px]', content: 'text', size: 'large' },
    ],
    defaultVariants: {
      content: 'none',
      size: 'middle',
    },
    variants: {
      content: {
        icon: '',
        none: '',
        text: '',
      },
      size: {
        large: 'h-9 w-[60px]',
        middle: 'h-8 w-[52px]',
        small: 'h-7 w-11',
      },
    },
  },
);

export const switchThumbClassName = {
  large: 'size-[30px]',
  middle: 'size-[26px]',
  small: 'size-[22px]',
} as const;

export const switchThumbTranslateClassName = {
  icon: {
    large: 'data-[state=checked]:translate-x-7',
    middle: 'data-[state=checked]:translate-x-6',
    small: 'data-[state=checked]:translate-x-5',
  },
  none: {
    large: 'data-[state=checked]:translate-x-6',
    middle: 'data-[state=checked]:translate-x-5',
    small: 'data-[state=checked]:translate-x-4',
  },
  text: {
    large: 'data-[state=checked]:translate-x-12',
    middle: 'data-[state=checked]:translate-x-10',
    small: 'data-[state=checked]:translate-x-9',
  },
} as const;

export const switchSpinnerClassName = {
  large: 'size-4 border-2',
  middle: 'size-3.5 border-2',
  small: 'size-3 border-[1.5px]',
} as const;

export const switchFieldClassName = {
  large: 'gap-2 text-sm leading-5',
  middle: 'gap-2 text-sm leading-5',
  small: 'gap-1.5 text-xs leading-5',
} as const;
