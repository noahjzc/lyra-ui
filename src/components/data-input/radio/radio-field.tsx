import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import * as React from 'react';
import { cn } from '../../../internal/cn';
import { Radio } from './radio';
import type { RadioFieldProps, RadioOptionFieldProps } from './types';
import { radioFieldClassName } from './variants';

export function RadioOptionField({
  card = false,
  checked,
  className,
  controlRef,
  description,
  disabled,
  helperText,
  id,
  invalid,
  label,
  size = 'middle',
  status,
  value,
  ...props
}: RadioOptionFieldProps) {
  const generatedId = React.useId();
  const helperId = React.useId();
  const radioId = id ?? generatedId;
  const hasDetails = description != null || helperText != null;
  const isInvalid = invalid || status === 'error';

  return (
    <label
      className={cn(
        'group inline-flex min-h-6 min-w-0 cursor-pointer text-ui-foreground transition-ui-state transition-ui-transform data-[disabled=true]:cursor-not-allowed data-[disabled=true]:text-(--ui-input-disabled-foreground)',
        radioFieldClassName[size],
        hasDetails ? 'items-start' : 'items-center',
        card &&
          'grid rounded-lg border border-(--ui-divider-soft) bg-ui-background p-2.5 hover:border-(--ui-input-hover-border) data-[checked=true]:border-(--ui-control-active-border) data-[checked=true]:bg-(--ui-button-ghost-background) data-[invalid=true]:border-(--ui-button-danger-border) data-[invalid=true]:bg-(--ui-input-error-background)',
        className,
      )}
      data-checked={checked ? true : undefined}
      data-disabled={disabled ? true : undefined}
      data-invalid={isInvalid ? true : undefined}
      data-slot="radio-field"
      htmlFor={radioId}
      {...props}
    >
      <span
        className={cn(
          'flex min-w-0 gap-2',
          hasDetails ? 'items-start' : 'items-center',
        )}
      >
        <Radio
          aria-describedby={helperText != null ? helperId : undefined}
          disabled={disabled}
          id={radioId}
          invalid={isInvalid}
          ref={controlRef}
          size={size}
          status={status}
          value={value}
        />
        <span className="grid min-w-0 gap-0.5">
          <strong
            className={cn(
              'font-bold text-ui-foreground text-sm leading-5',
              size === 'small' && 'text-xs',
              isInvalid && 'text-ui-destructive',
            )}
          >
            {label}
          </strong>
          {description != null && (
            <span className="text-ui-muted-foreground text-xs leading-4">
              {description}
            </span>
          )}
          {helperText != null && (
            <span
              className={cn(
                'text-ui-muted-foreground text-xs leading-4',
                isInvalid && 'text-ui-destructive',
              )}
              id={helperId}
            >
              {helperText}
            </span>
          )}
        </span>
      </span>
    </label>
  );
}

export const RadioField = React.forwardRef<
  React.ComponentRef<typeof RadioGroupPrimitive.Item>,
  RadioFieldProps
>(
  (
    {
      checked,
      defaultChecked,
      disabled,
      name,
      onCheckedChange,
      value = 'on',
      ...props
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = React.useState(
      defaultChecked ? value : undefined,
    );
    const mergedChecked = checked ?? internalValue === value;

    function updateValue(nextValue: string) {
      if (checked == null) {
        setInternalValue(nextValue);
      }

      onCheckedChange?.(nextValue === value);
    }

    return (
      <RadioGroupPrimitive.Root
        className="inline-grid"
        disabled={disabled}
        name={name}
        onValueChange={updateValue}
        value={
          checked == null ? (internalValue ?? '') : mergedChecked ? value : ''
        }
      >
        <RadioOptionField
          checked={mergedChecked}
          controlRef={ref}
          disabled={disabled}
          value={value}
          {...props}
        />
      </RadioGroupPrimitive.Root>
    );
  },
);
RadioField.displayName = 'RadioField';
