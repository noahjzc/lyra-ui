import { cva } from 'class-variance-authority';
import {
  disclosurePanelContentMotionClassName,
  disclosurePanelMotionClassName,
} from '../../../internal/disclosure-motion';

export const collapsePanelMotionClassName = disclosurePanelMotionClassName;

export const collapsePanelContentMotionClassName =
  disclosurePanelContentMotionClassName;

export const collapseVariants = cva('grid w-full min-w-0 overflow-hidden', {
  variants: {
    variant: {
      bordered: 'rounded-md border border-ui-border bg-ui-background',
      ghost: 'gap-2',
      plain: 'gap-2',
    },
  },
  defaultVariants: {
    variant: 'bordered',
  },
});

export const collapseItemClassName = {
  bordered: 'border-ui-border border-b last:border-b-0',
  ghost: 'rounded-md bg-ui-background',
  plain: 'rounded-md border border-ui-border bg-ui-background',
} as const;

export const collapseHeaderClassName = {
  bordered: 'rounded-none',
  ghost: 'rounded-md',
  plain: 'rounded-md',
} as const;
export const collapseSizeClassName = {
  compact: {
    header: 'min-h-10 px-3',
    panel: 'py-2.5 pr-3 pl-10 text-sm',
    trigger: 'py-1.5',
  },
  middle: {
    header: 'min-h-11 px-3',
    panel: 'py-3 pr-4 pl-10 text-sm',
    trigger: 'py-2',
  },
} as const;
