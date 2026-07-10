import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import * as React from 'react';
import { cn } from '../../../internal/cn';
import type { RadioProps } from './types';
import { radioControlVariants, radioIndicatorClassName } from './variants';

export const Radio = React.forwardRef<
  React.ComponentRef<typeof RadioGroupPrimitive.Item>,
  RadioProps
>(
  (
    { className, disabled, invalid, size: providedSize, status, ...props },
    ref,
  ) => {
    const size = providedSize ?? 'middle';
    const isInvalid = invalid || status === 'error';

    return (
      <RadioGroupPrimitive.Item
        aria-invalid={isInvalid ? true : props['aria-invalid']}
        className={cn(radioControlVariants({ size }), className)}
        data-invalid={isInvalid ? true : undefined}
        data-slot="radio-control"
        disabled={disabled}
        ref={ref}
        {...props}
      >
        <RadioGroupPrimitive.Indicator
          className={cn(
            'block rounded-full bg-current',
            radioIndicatorClassName[size],
          )}
          data-slot="radio-indicator"
        />
      </RadioGroupPrimitive.Item>
    );
  },
);
Radio.displayName = 'Radio';
