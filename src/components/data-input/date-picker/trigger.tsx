import { CalendarDays, Clock, X } from 'lucide-react';
import * as React from 'react';
import { cn } from '../../../internal/cn';
import type { DatePickerMode } from './types';
import { isRangeMode, isTimeMode } from './utils';
import { datePickerTriggerVariants } from './variants';

export const DatePickerTriggerButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    canClear: boolean;
    disabled: boolean;
    isInvalid: boolean;
    mode: DatePickerMode;
    open: boolean;
    placeholder: React.ReactNode;
    size?: 'large' | 'middle' | 'small' | null;
    triggerAriaLabel?: string;
    valueText: React.ReactNode;
    variant?: 'borderless' | 'filled' | 'outlined' | 'underlined' | null;
  }
>(
  (
    {
      canClear,
      disabled,
      isInvalid,
      mode,
      open,
      placeholder,
      size,
      triggerAriaLabel,
      valueText,
      variant,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={triggerAriaLabel}
        className={cn(
          datePickerTriggerVariants({ size, variant }),
          variant === 'underlined' && 'px-0',
          canClear && 'pr-14',
        )}
        data-disabled={disabled ? true : undefined}
        data-invalid={isInvalid ? true : undefined}
        data-slot="date-picker-trigger"
        data-state={open ? 'open' : 'closed'}
        disabled={disabled}
        ref={ref}
        type="button"
        {...props}
      >
        <DatePickerTriggerValue
          mode={mode}
          placeholder={placeholder}
          valueText={valueText}
        />
        {isTimeMode(mode) ? (
          <Clock
            aria-hidden="true"
            className="size-4 shrink-0 text-ui-muted-foreground"
          />
        ) : (
          <CalendarDays
            aria-hidden="true"
            className="size-4 shrink-0 text-ui-muted-foreground"
          />
        )}
      </button>
    );
  },
);

DatePickerTriggerButton.displayName = 'DatePickerTriggerButton';

export function DatePickerClearButton({
  onClear,
}: {
  onClear: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <button
      aria-label="清空日期"
      className="absolute top-1/2 right-7 grid size-5 -translate-y-1/2 place-items-center rounded text-ui-muted-foreground transition-ui-state transition-ui-transform hover:bg-ui-muted hover:text-ui-foreground active:scale-95"
      data-slot="date-picker-clear"
      onClick={onClear}
      type="button"
    >
      <X aria-hidden="true" className="size-3.5" />
    </button>
  );
}

function DatePickerTriggerValue({
  mode,
  placeholder,
  valueText,
}: {
  mode: DatePickerMode;
  placeholder: React.ReactNode;
  valueText: React.ReactNode;
}) {
  const isPlaceholder = valueText === placeholder;

  if (isRangeMode(mode)) {
    const [start, end] =
      typeof valueText === 'string' && valueText.includes('→')
        ? (valueText.split(' → ') as [string, string])
        : [String(valueText), ''];

    return (
      <span
        className={cn(
          'grid min-w-0 flex-1 grid-cols-[minmax(0,1fr)_18px_minmax(0,1fr)] items-center gap-2 text-left',
          isPlaceholder && 'font-medium text-ui-muted-foreground',
        )}
        data-slot="date-picker-value"
      >
        <span className="truncate">{start}</span>
        <span className="grid size-[18px] place-items-center text-xs font-bold text-ui-muted-foreground">
          →
        </span>
        <span className="truncate">{end}</span>
      </span>
    );
  }

  return (
    <span
      className={cn(
        'min-w-0 flex-1 truncate text-left',
        isPlaceholder && 'font-medium text-ui-muted-foreground',
      )}
      data-slot="date-picker-value"
    >
      {valueText}
    </span>
  );
}
