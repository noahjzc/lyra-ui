import { ChevronDown, ChevronUp } from 'lucide-react';
import * as React from 'react';
import { cn } from '../../../internal/cn';
import type { InputNumberProps, InputNumberValue } from './types';
import {
  addonVariants,
  inputElementVariants,
  inputRootVariants,
} from './variants';

function normalizeNumber(value: InputNumberValue, precision?: number) {
  if (value == null || Number.isNaN(value)) return null;
  if (precision == null) return value;

  return Number(value.toFixed(precision));
}

function parseNumber(value: string) {
  const normalized = value.replace(/,/g, '').trim();

  if (normalized === '') return null;

  const parsed = Number(normalized);

  return Number.isNaN(parsed) ? null : parsed;
}

function formatNumber(value: InputNumberValue, precision?: number) {
  if (value == null) return '';
  if (precision == null) return String(value);

  return value.toFixed(precision);
}

function getNextNumberValue({
  current,
  max,
  min,
  offset,
  precision,
}: {
  current: InputNumberValue;
  max?: number;
  min?: number;
  offset: number;
  precision?: number;
}) {
  const base = current ?? 0;
  const next = normalizeNumber(base + offset, precision);

  if (next == null) return null;
  if (min != null && next < min) return min;
  if (max != null && next > max) return max;

  return next;
}

export const InputNumber = React.forwardRef<HTMLInputElement, InputNumberProps>(
  (
    {
      'aria-invalid': ariaInvalid,
      className,
      controls = true,
      defaultValue = null,
      disabled = false,
      formatter,
      invalid,
      max,
      min,
      onBlur,
      onFocus,
      onKeyDown,
      onValueChange,
      parser = parseNumber,
      precision,
      prefix,
      prefixAddon,
      readOnly = false,
      size: providedSize,
      step = 1,
      suffix,
      suffixAddon,
      textAlign = 'left',
      value,
      variant = 'outlined',
      ...props
    },
    ref,
  ) => {
    const size = providedSize ?? 'middle';
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [internalValue, setInternalValue] =
      React.useState<InputNumberValue>(defaultValue);
    const [draftValue, setDraftValue] = React.useState('');
    const [focused, setFocused] = React.useState(false);
    const isValueControlled = value !== undefined;
    const mergedValue = isValueControlled ? value : internalValue;
    const normalizedValue = normalizeNumber(mergedValue, precision);
    const isOutOfRange =
      normalizedValue != null &&
      ((min != null && normalizedValue < min) ||
        (max != null && normalizedValue > max));
    const isInvalid = invalid || isOutOfRange;
    const displayValue = focused
      ? draftValue
      : formatter
        ? formatter(normalizedValue)
        : formatNumber(normalizedValue, precision);
    const canStepDown =
      !disabled &&
      !readOnly &&
      (min == null || normalizedValue == null || normalizedValue > min);
    const canStepUp =
      !disabled &&
      !readOnly &&
      (max == null || normalizedValue == null || normalizedValue < max);

    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    React.useEffect(() => {
      if (!focused) return;

      setDraftValue(formatNumber(normalizedValue, precision));
    }, [focused, normalizedValue, precision]);

    function commitValue(nextValue: InputNumberValue) {
      const normalized = normalizeNumber(nextValue, precision);

      if (!isValueControlled) {
        setInternalValue(normalized);
      }

      onValueChange?.(normalized);
    }

    function handleStep(offset: number) {
      const nextValue = getNextNumberValue({
        current: normalizedValue,
        max,
        min,
        offset,
        precision,
      });

      commitValue(nextValue);
      inputRef.current?.focus();
    }

    return (
      <span
        className={cn(
          inputRootVariants({ size, variant }),
          variant === 'underlined' && 'px-0',
          className,
        )}
        data-disabled={disabled ? true : undefined}
        data-invalid={isInvalid ? true : undefined}
        data-readonly={readOnly ? true : undefined}
        data-size={size}
        data-slot="input-number-root"
      >
        {prefixAddon != null && (
          <span className={addonVariants({ side: 'prefix' })}>
            {prefixAddon}
          </span>
        )}
        {prefix != null && (
          <span
            className="inline-flex shrink-0 items-center text-ui-muted-foreground"
            data-slot="input-number-prefix"
          >
            {prefix}
          </span>
        )}
        <input
          aria-invalid={isInvalid ? true : ariaInvalid}
          aria-valuemax={max}
          aria-valuemin={min}
          aria-valuenow={normalizedValue ?? undefined}
          className={cn(
            inputElementVariants({ size }),
            textAlign === 'right' && 'text-right tabular-nums',
          )}
          disabled={disabled}
          inputMode="decimal"
          onBlur={event => {
            setFocused(false);
            commitValue(parser(event.currentTarget.value));
            onBlur?.(event);
          }}
          onChange={event => {
            setDraftValue(event.currentTarget.value);
          }}
          onFocus={event => {
            setFocused(true);
            setDraftValue(formatNumber(normalizedValue, precision));
            onFocus?.(event);
          }}
          onKeyDown={event => {
            if (event.key === 'ArrowUp') {
              event.preventDefault();
              handleStep(step);
            }

            if (event.key === 'ArrowDown') {
              event.preventDefault();
              handleStep(-step);
            }

            onKeyDown?.(event);
          }}
          readOnly={readOnly}
          ref={inputRef}
          role="spinbutton"
          type="text"
          value={displayValue}
          {...props}
        />
        {suffix != null && (
          <span
            className="inline-flex shrink-0 items-center text-ui-muted-foreground"
            data-slot="input-number-suffix"
          >
            {suffix}
          </span>
        )}
        {controls && (
          <span
            className={cn(
              'grid flex-[0_0_24px] grid-rows-2 overflow-hidden bg-(--ui-surface-soft-background) text-ui-muted-foreground',
              variant === 'borderless' || variant === 'underlined'
                ? 'h-[30px] self-center rounded-[5px] border border-(--ui-input-border)'
                : '-mr-2.5 ml-0.5 self-stretch rounded-r-[5px] border-ui-border border-l group-data-[size=small]:-mr-2',
            )}
            data-slot="input-number-stepper"
          >
            <button
              aria-label="增加数值"
              className="grid min-h-0 flex-1 place-items-center transition-ui-state transition-ui-transform hover:bg-ui-muted hover:text-ui-foreground disabled:cursor-not-allowed disabled:opacity-40"
              disabled={!canStepUp}
              onClick={() => handleStep(step)}
              type="button"
            >
              <ChevronUp aria-hidden="true" className="size-2.5" />
            </button>
            <button
              aria-label="减少数值"
              className="grid min-h-0 flex-1 place-items-center border-ui-border border-t transition-ui-state transition-ui-transform hover:bg-ui-muted hover:text-ui-foreground disabled:cursor-not-allowed disabled:opacity-40"
              disabled={!canStepDown}
              onClick={() => handleStep(-step)}
              type="button"
            >
              <ChevronDown aria-hidden="true" className="size-2.5" />
            </button>
          </span>
        )}
        {suffixAddon != null && (
          <span className={addonVariants({ side: 'suffix' })}>
            {suffixAddon}
          </span>
        )}
      </span>
    );
  },
);

InputNumber.displayName = 'InputNumber';
