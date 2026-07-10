import type * as SwitchPrimitive from '@radix-ui/react-switch';
import * as React from 'react';
import { cn } from '../../../internal/cn';
import { Switch } from './switch';
import type { SwitchFieldProps } from './types';
import { switchFieldClassName } from './variants';

export const SwitchField = React.forwardRef<
  React.ComponentRef<typeof SwitchPrimitive.Root>,
  SwitchFieldProps
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
      label,
      labelPlacement = 'right',
      loading,
      onCheckedChange,
      size = 'middle',
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const helperId = React.useId();
    const switchId = id ?? generatedId;
    const [internalChecked, setInternalChecked] =
      React.useState(defaultChecked);
    const mergedChecked = checked ?? internalChecked;
    const hasDetails = description != null || helperText != null;

    function handleCheckedChange(nextChecked: boolean) {
      if (checked == null) {
        setInternalChecked(nextChecked);
      }

      onCheckedChange?.(nextChecked);
    }

    const textNode = (
      <span className="grid min-w-0 gap-0.5" data-slot="switch-field-content">
        <strong
          className={cn(
            'font-bold text-ui-foreground text-sm leading-5',
            size === 'small' && 'text-xs',
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
            className="text-ui-muted-foreground text-xs leading-4"
            id={helperId}
          >
            {helperText}
          </span>
        )}
      </span>
    );

    const switchNode = (
      <Switch
        aria-describedby={helperText != null ? helperId : undefined}
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        id={switchId}
        loading={loading}
        onCheckedChange={handleCheckedChange}
        ref={ref}
        size={size}
        {...props}
      />
    );

    return (
      <label
        className={cn(
          'group inline-flex min-w-0 cursor-pointer text-ui-foreground transition-ui-state transition-ui-transform data-[disabled=true]:cursor-not-allowed data-[disabled=true]:text-(--ui-input-disabled-foreground)',
          switchFieldClassName[size],
          hasDetails ? 'items-start' : 'items-center',
          card &&
            'grid rounded-lg border border-(--ui-divider-soft) bg-ui-background p-2.5 hover:border-(--ui-input-hover-border) data-[checked=true]:border-(--ui-control-active-border) data-[checked=true]:bg-(--ui-button-ghost-background)',
          className,
        )}
        data-checked={mergedChecked ? true : undefined}
        data-disabled={disabled || loading ? true : undefined}
        data-slot="switch-field"
        htmlFor={switchId}
      >
        <span
          className={cn(
            'flex min-w-0 gap-2',
            hasDetails ? 'items-start' : 'items-center',
          )}
        >
          {labelPlacement === 'left' ? (
            <>
              {textNode}
              {switchNode}
            </>
          ) : (
            <>
              {switchNode}
              {textNode}
            </>
          )}
        </span>
      </label>
    );
  },
);
SwitchField.displayName = 'SwitchField';
