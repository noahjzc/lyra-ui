import * as SwitchPrimitive from '@radix-ui/react-switch';
import * as React from 'react';
import { cn } from '../../../internal/cn';
import type { SwitchProps } from './types';
import { getContentVariant } from './utils';
import {
  switchSpinnerClassName,
  switchThumbClassName,
  switchThumbTranslateClassName,
  switchTrackVariants,
} from './variants';

function omitRuntimeContent<T extends object>(props: T) {
  const { content, ...rootProps } = props as T & { content?: unknown };

  void content;
  return rootProps;
}

export const Switch = React.forwardRef<
  React.ComponentRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(
  (
    {
      checked,
      checkedIcon,
      checkedText,
      className,
      defaultChecked,
      disabled = false,
      loading = false,
      onCheckedChange,
      size: providedSize,
      uncheckedIcon,
      uncheckedText,
      ...props
    },
    ref,
  ) => {
    const size = providedSize ?? 'middle';
    const [internalChecked, setInternalChecked] =
      React.useState(defaultChecked);
    const mergedChecked = checked ?? internalChecked;
    const content = getContentVariant({
      checkedIcon,
      checkedText,
      uncheckedIcon,
      uncheckedText,
    });
    const effectiveDisabled = disabled || loading;
    const contentNode = mergedChecked
      ? (checkedText ?? checkedIcon)
      : (uncheckedText ?? uncheckedIcon);
    const rootProps = omitRuntimeContent(props);

    function handleCheckedChange(nextChecked: boolean) {
      if (loading) return;

      if (checked == null) {
        setInternalChecked(nextChecked);
      }

      onCheckedChange?.(nextChecked);
    }

    return (
      <SwitchPrimitive.Root
        aria-busy={loading ? true : props['aria-busy']}
        checked={checked}
        className={cn(switchTrackVariants({ content, size }), className)}
        data-loading={loading ? true : undefined}
        data-slot="switch-control"
        defaultChecked={defaultChecked}
        disabled={effectiveDisabled}
        onCheckedChange={handleCheckedChange}
        ref={ref}
        {...rootProps}
      >
        {content !== 'none' && contentNode != null && (
          <span
            aria-hidden="true"
            className={cn(
              'pointer-events-none absolute top-1/2 z-0 flex -translate-y-1/2 items-center justify-center font-extrabold text-xs leading-none',
              mergedChecked
                ? 'left-3 text-(--ui-inverse-foreground)'
                : 'right-3 text-(--ui-control-muted-foreground)',
            )}
            data-slot="switch-content"
          >
            {contentNode}
          </span>
        )}
        <SwitchPrimitive.Thumb
          className={cn(
            'pointer-events-none relative z-10 block rounded-full bg-(--ui-input-background) shadow-(--ui-switch-thumb-shadow) transition-ui-state transition-ui-transform motion-reduce:transition-none',
            switchThumbClassName[size],
            switchThumbTranslateClassName[content][size],
          )}
          data-slot="switch-thumb"
        >
          {loading && (
            <span
              aria-hidden="true"
              className={cn(
                '-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 rounded-full border-(--ui-input-disabled-border) border-t-(--ui-input-focus-border) animate-spin motion-reduce:animate-none',
                switchSpinnerClassName[size],
              )}
              data-slot="switch-spinner"
            />
          )}
        </SwitchPrimitive.Thumb>
      </SwitchPrimitive.Root>
    );
  },
);
Switch.displayName = SwitchPrimitive.Root.displayName;
