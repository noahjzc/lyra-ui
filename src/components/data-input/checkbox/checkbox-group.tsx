import * as React from 'react';
import { cn } from '../../../internal/cn';
import { CheckboxField } from './checkbox-field';
import type { CheckboxCheckedState, CheckboxGroupProps } from './types';
import { resolveNextGroupValue } from './utils';

export const CheckboxGroup = React.forwardRef<
  HTMLFieldSetElement,
  CheckboxGroupProps
>(
  (
    {
      card = false,
      className,
      columns = 2,
      defaultValue = [],
      direction = 'grid',
      disabled = false,
      disabledOptions = [],
      helperText,
      invalid,
      legend,
      minOptionWidth = card ? 180 : 144,
      onValueChange,
      options,
      size = 'middle',
      status,
      style,
      value,
      ...props
    },
    ref,
  ) => {
    const helperId = React.useId();
    const [internalValue, setInternalValue] =
      React.useState<string[]>(defaultValue);
    const mergedValue = value ?? internalValue;
    const disabledValueSet = React.useMemo(
      () => new Set(disabledOptions),
      [disabledOptions],
    );
    const isInvalid = invalid || status === 'error';

    function updateValue(optionValue: string, checked: CheckboxCheckedState) {
      if (disabled || disabledValueSet.has(optionValue)) return;

      const nextValue = resolveNextGroupValue({
        checked,
        currentValue: mergedValue,
        optionValue,
      });

      if (value == null) {
        setInternalValue(nextValue);
      }

      onValueChange?.(nextValue);
    }

    return (
      <fieldset
        aria-describedby={
          helperText != null ? helperId : props['aria-describedby']
        }
        aria-invalid={isInvalid ? true : props['aria-invalid']}
        className={cn('grid min-w-0 gap-2 border-0 p-0', className)}
        data-disabled={disabled ? true : undefined}
        data-invalid={isInvalid ? true : undefined}
        data-slot="checkbox-group"
        disabled={disabled}
        ref={ref}
        style={
          {
            '--ui-checkbox-group-columns': columns,
            '--ui-checkbox-group-option-min-width': `${minOptionWidth}px`,
            ...style,
          } as React.CSSProperties
        }
        {...props}
      >
        {legend != null && (
          <legend
            className="mb-1 text-xs font-extrabold text-ui-muted-foreground"
            data-slot="checkbox-group-legend"
          >
            {legend}
          </legend>
        )}
        <div
          className={cn(
            'gap-x-3 gap-y-2',
            direction === 'horizontal' && 'flex flex-wrap items-center',
            direction === 'vertical' && 'grid grid-cols-1',
            direction === 'grid' &&
              'grid grid-cols-[repeat(auto-fit,minmax(min(100%,max(var(--ui-checkbox-group-option-min-width),calc((100%-(var(--ui-checkbox-group-columns)-1)*0.75rem)/var(--ui-checkbox-group-columns)))),1fr))]',
          )}
          data-slot="checkbox-group-options"
        >
          {options.map(option => {
            const optionDisabled =
              disabled || option.disabled || disabledValueSet.has(option.value);

            return (
              <CheckboxField
                card={card}
                checked={mergedValue.includes(option.value)}
                description={option.description}
                disabled={optionDisabled}
                invalid={isInvalid}
                key={option.value}
                label={option.label}
                onCheckedChange={nextChecked =>
                  updateValue(option.value, nextChecked)
                }
                size={size}
                status={status}
              />
            );
          })}
        </div>
        {helperText != null && (
          <p
            className={cn(
              'm-0 text-ui-muted-foreground text-xs leading-4',
              isInvalid && 'text-ui-destructive',
            )}
            id={helperId}
          >
            {helperText}
          </p>
        )}
      </fieldset>
    );
  },
);
CheckboxGroup.displayName = 'CheckboxGroup';
