import { AlertCircle, CheckCircle2, Info, LoaderCircle } from 'lucide-react';
import type * as React from 'react';
import type { FormValidateStatus } from './types';

export const statusIconMap: Record<FormValidateStatus, React.ReactNode> = {
  error: <AlertCircle aria-hidden="true" className="size-4" />,
  success: <CheckCircle2 aria-hidden="true" className="size-4" />,
  validating: (
    <LoaderCircle
      aria-hidden="true"
      className="size-4 animate-spin motion-reduce:animate-none"
    />
  ),
  warning: <Info aria-hidden="true" className="size-4" />,
};

export const itemSpanClassName = {
  1: '',
  2: 'min-[760px]:col-span-2',
  3: 'min-[760px]:col-span-2 min-[1180px]:col-span-3',
  full: 'col-span-full',
} as const;

export const gridColumnClassName = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 min-[760px]:grid-cols-2',
  3: 'grid-cols-1 min-[760px]:grid-cols-2 min-[1180px]:grid-cols-3',
} as const;

export const footerJustifyClassName = {
  between: 'justify-between',
  end: 'justify-end',
  start: 'justify-start',
} as const;

export const messageStatusClassName = {
  error: 'text-ui-destructive',
  success: 'text-emerald-700',
  validating: 'text-sky-700',
  warning: 'text-amber-700',
} as const;
