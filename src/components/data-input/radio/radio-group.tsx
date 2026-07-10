import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import * as React from 'react';
import { cn } from '../../../internal/cn';
import { RadioOptionField } from './radio-field';
import type { RadioGroupProps } from './types';
import { radioButtonClassName, radioButtonGroupClassName } from './variants';

export const RadioGroup = React.forwardRef<
  HTMLFieldSetElement,
  RadioGroupProps
>(
  (
    {
      className,
      columns = 2,
      defaultValue,
      direction = 'grid',
      disabled = false,
      disabledOptions = [],
      helperText,
      invalid,
      legend,
      variant = 'default',
      minOptionWidth = variant === 'card' ? 180 : 144,
      name,
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
    const legendId = React.useId();
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const mergedValue = value ?? internalValue;
    const disabledValueSet = React.useMemo(
      () => new Set(disabledOptions),
      [disabledOptions],
    );
    const isInvalid = invalid || status === 'error';

    function updateValue(nextValue: string) {
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
        data-slot="radio-group"
        disabled={disabled}
        ref={ref}
        style={
          {
            '--ui-radio-group-columns': columns,
            '--ui-radio-group-option-min-width': `${minOptionWidth}px`,
            ...style,
          } as React.CSSProperties
        }
        {...props}
      >
        {legend != null && (
          <legend
            className="mb-1 text-xs font-extrabold text-ui-muted-foreground"
            data-slot="radio-group-legend"
            id={legendId}
          >
            {legend}
          </legend>
        )}
        <RadioGroupPrimitive.Root
          aria-describedby={
            helperText != null ? helperId : props['aria-describedby']
          }
          aria-invalid={isInvalid ? true : props['aria-invalid']}
          aria-label={legend == null ? props['aria-label'] : undefined}
          aria-labelledby={legend != null ? legendId : undefined}
          className={cn(
            'gap-x-4 gap-y-2',
            direction === 'horizontal' && 'flex flex-wrap items-center',
            direction === 'vertical' && 'grid grid-cols-1',
            direction === 'grid' &&
              'grid grid-cols-[repeat(auto-fit,minmax(min(100%,max(var(--ui-radio-group-option-min-width),calc((100%-(var(--ui-radio-group-columns)-1)*1rem)/var(--ui-radio-group-columns)))),1fr))]',
            variant === 'button' &&
              cn(
                'inline-flex w-fit items-center rounded-lg border border-(--ui-input-border) bg-(--ui-input-addon-background) p-0.5',
                radioButtonGroupClassName[size],
              ),
          )}
          data-slot="radio-group-options"
          defaultValue={value == null ? defaultValue : undefined}
          disabled={disabled}
          name={name}
          onValueChange={updateValue}
          value={value == null ? internalValue : value}
        >
          {options.map(option => {
            const optionDisabled =
              disabled || option.disabled || disabledValueSet.has(option.value);
            const optionChecked = mergedValue === option.value;

            if (variant === 'button') {
              return (
                <RadioGroupPrimitive.Item
                  className={cn(
                    'relative inline-flex cursor-pointer items-center justify-center rounded-md font-bold text-ui-muted-foreground transition-ui-state transition-ui-transform hover:bg-ui-background hover:text-ui-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ui-input-focus-ring) active:scale-95 data-[state=checked]:bg-ui-background data-[state=checked]:text-(--ui-input-focus-border) data-[state=checked]:shadow-sm disabled:cursor-not-allowed disabled:text-(--ui-input-disabled-foreground)',
                    radioButtonClassName[size],
                  )}
                  data-slot="radio-button"
                  disabled={optionDisabled}
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </RadioGroupPrimitive.Item>
              );
            }

            return (
              <RadioOptionField
                card={variant === 'card'}
                checked={optionChecked}
                description={option.description}
                disabled={optionDisabled}
                invalid={isInvalid}
                key={option.value}
                label={option.label}
                size={size}
                status={status}
                value={option.value}
              />
            );
          })}
        </RadioGroupPrimitive.Root>
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
RadioGroup.displayName = 'RadioGroup';
