import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check, Minus } from 'lucide-react';
import * as React from 'react';
import { cn } from '../../../internal/cn';
import type { CheckboxProps } from './types';
import { checkboxIconClassName, checkboxVariants } from './variants';

export const Checkbox = React.forwardRef<
  React.ComponentRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(
  (
    {
      className,
      checked,
      defaultChecked,
      invalid,
      onCheckedChange,
      size: providedSize,
      status,
      ...props
    },
    ref,
  ) => {
    const size = providedSize ?? 'middle';
    const [internalChecked, setInternalChecked] =
      React.useState<typeof defaultChecked>(defaultChecked);
    const indicatorState = checked ?? internalChecked;
    const isInvalid = invalid || status === 'error';

    return (
      <CheckboxPrimitive.Root
        aria-invalid={isInvalid ? true : props['aria-invalid']}
        checked={checked}
        className={cn(checkboxVariants({ size }), className)}
        data-invalid={isInvalid ? true : undefined}
        data-slot="checkbox-control"
        defaultChecked={defaultChecked}
        onCheckedChange={nextChecked => {
          setInternalChecked(nextChecked);
          onCheckedChange?.(nextChecked);
        }}
        ref={ref}
        {...props}
      >
        <CheckboxPrimitive.Indicator className="grid place-items-center text-current transition-ui-transform data-[state=checked]:scale-100 data-[state=unchecked]:scale-75">
          {indicatorState === 'indeterminate' ? (
            <Minus
              aria-hidden="true"
              className={checkboxIconClassName[size]}
              data-testid="checkbox-minus"
            />
          ) : (
            <Check
              aria-hidden="true"
              className={checkboxIconClassName[size]}
              data-testid="checkbox-check"
            />
          )}
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    );
  },
);
Checkbox.displayName = CheckboxPrimitive.Root.displayName;
