import type * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import * as React from 'react';
import { cn } from '../../../internal/cn';
import { Checkbox } from './checkbox';
import type { CheckboxCheckedState, CheckboxFieldProps } from './types';
import { checkboxFieldClassName } from './variants';

export const CheckboxField = React.forwardRef<
  React.ComponentRef<typeof CheckboxPrimitive.Root>,
  CheckboxFieldProps
>(
  (
    {
      card = false,
      checked,
      className,
      defaultChecked,
      description,
      disabled,
      helperText,
      id,
      invalid,
      label,
      onCheckedChange,
      size = 'middle',
      status,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const helperId = React.useId();
    const checkboxId = id ?? generatedId;
    const [internalChecked, setInternalChecked] =
      React.useState<typeof defaultChecked>(defaultChecked);
    const mergedChecked = checked ?? internalChecked;
    const isChecked =
      mergedChecked === true || mergedChecked === 'indeterminate';
    const isInvalid = invalid || status === 'error';

    function handleCheckedChange(nextChecked: CheckboxCheckedState) {
      if (checked == null) {
        setInternalChecked(nextChecked);
      }

      onCheckedChange?.(nextChecked);
    }

    return (
      <label
        className={cn(
          'group inline-flex min-w-0 cursor-pointer items-start text-ui-foreground transition-ui-state transition-ui-transform data-[disabled=true]:cursor-not-allowed data-[disabled=true]:text-(--ui-input-disabled-foreground)',
          checkboxFieldClassName[size],
          card &&
            'grid rounded-lg border border-(--ui-divider-soft) bg-ui-background p-2.5 hover:border-(--ui-input-hover-border) data-[checked=true]:border-(--ui-control-active-border) data-[checked=true]:bg-(--ui-button-ghost-background) data-[invalid=true]:border-(--ui-button-danger-border) data-[invalid=true]:bg-(--ui-input-error-background)',
          className,
        )}
        data-checked={isChecked ? true : undefined}
        data-disabled={disabled ? true : undefined}
        data-invalid={isInvalid ? true : undefined}
        data-slot="checkbox-field"
        htmlFor={checkboxId}
      >
        <span
          className={cn(
            'flex min-w-0 items-start gap-2',
            card && 'items-start',
          )}
        >
          <Checkbox
            aria-describedby={helperText != null ? helperId : undefined}
            checked={checked}
            defaultChecked={defaultChecked}
            disabled={disabled}
            id={checkboxId}
            invalid={isInvalid}
            onCheckedChange={handleCheckedChange}
            ref={ref}
            size={size}
            status={status}
            {...props}
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
  },
);
CheckboxField.displayName = 'CheckboxField';
