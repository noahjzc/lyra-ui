import * as PopoverPrimitive from '@radix-ui/react-popover';
import { Clock, X } from 'lucide-react';
import * as React from 'react';
import { cn } from '../../../internal/cn';
import { useOverlayZIndex, Z_BASE } from '../../../overlay/z-stack';
import { TimePanel } from './panel';
import type { TimeParts, TimePickerProps } from './types';
import {
  formatTime,
  getNowParts,
  parseTime,
  updateTimePart,
  useControllableTimeValue,
} from './utils';
import { timePickerTriggerVariants } from './variants';

export const TimePicker = React.forwardRef<HTMLDivElement, TimePickerProps>(
  (
    {
      allowClear = false,
      className,
      defaultValue,
      disabled = false,
      disabledTime,
      format = 'HH:mm',
      invalid,
      loadError,
      loading = false,
      minuteStep = 1,
      onOpenChange,
      onRetry,
      onValueChange,
      placeholder = '请选择时间',
      secondStep = 1,
      showSecond,
      size = 'middle',
      status,
      value,
      variant = 'outlined',
      ...props
    },
    ref,
  ) => {
    const [open, setOpen] = React.useState(false);
    const [overlayZIndex, layerRef] = useOverlayZIndex<HTMLDivElement>(
      Z_BASE.popover,
      undefined,
      open,
    );
    const [mergedValue, setMergedValue] = useControllableTimeValue({
      defaultValue,
      onValueChange,
      value,
    });
    const resolvedShowSecond = showSecond ?? format === 'HH:mm:ss';
    const currentParts = parseTime(mergedValue);
    const displayValue = currentParts
      ? formatTime(currentParts, resolvedShowSecond)
      : placeholder;
    const hasValue = currentParts != null;
    const canClear = allowClear && hasValue && !disabled;
    const isInvalid = invalid || status === 'error';

    function updateOpen(nextOpen: boolean) {
      if (disabled) return;

      setOpen(nextOpen);
      onOpenChange?.(nextOpen);
    }

    function commitParts(nextParts: TimeParts | undefined) {
      setMergedValue(
        nextParts ? formatTime(nextParts, resolvedShowSecond) : undefined,
      );
    }

    function handleClear(event: React.MouseEvent<HTMLButtonElement>) {
      event.preventDefault();
      event.stopPropagation();
      commitParts(undefined);
    }

    return (
      <PopoverPrimitive.Root onOpenChange={updateOpen} open={open}>
        <div
          className={cn('relative w-full min-w-0', className)}
          ref={ref}
          {...props}
        >
          <PopoverPrimitive.Trigger asChild>
            <button
              aria-expanded={open}
              aria-haspopup="dialog"
              className={cn(
                timePickerTriggerVariants({ size, variant }),
                variant === 'underlined' && 'px-0',
                canClear && 'pr-14',
              )}
              data-disabled={disabled ? true : undefined}
              data-invalid={isInvalid ? true : undefined}
              data-slot="time-picker-trigger"
              data-state={open ? 'open' : 'closed'}
              disabled={disabled}
              type="button"
            >
              <span
                className={cn(
                  'min-w-0 flex-1 truncate text-left tabular-nums',
                  !hasValue && 'font-medium text-ui-muted-foreground',
                )}
                data-slot="time-picker-value"
              >
                {displayValue}
              </span>
              <Clock
                aria-hidden="true"
                className="size-4 shrink-0 text-ui-muted-foreground"
              />
            </button>
          </PopoverPrimitive.Trigger>
          {canClear && (
            <button
              aria-label="清空时间"
              className="absolute top-1/2 right-7 grid size-5 -translate-y-1/2 place-items-center rounded text-ui-muted-foreground transition-ui-state transition-ui-transform hover:bg-ui-muted hover:text-ui-foreground active:scale-95"
              data-slot="time-picker-clear"
              onClick={handleClear}
              type="button"
            >
              <X aria-hidden="true" className="size-3.5" />
            </button>
          )}
          <PopoverPrimitive.Portal>
            <PopoverPrimitive.Content
              align="start"
              className="bg-transparent p-0 text-ui-foreground shadow-none data-[state=closed]:animate-ui-layer-out data-[state=open]:animate-ui-layer-in"
              data-slot="time-picker-content"
              ref={layerRef}
              role="dialog"
              sideOffset={4}
              style={{ zIndex: overlayZIndex }}
            >
              <TimePanel
                disabledTime={disabledTime}
                loadError={loadError}
                loading={loading}
                minuteStep={minuteStep}
                onClear={() => commitParts(undefined)}
                onConfirm={() => updateOpen(false)}
                onNow={() => commitParts(getNowParts())}
                onRetry={onRetry}
                onSelect={(unit, next) =>
                  commitParts(updateTimePart(currentParts, unit, next))
                }
                secondStep={secondStep}
                showSecond={resolvedShowSecond}
                value={currentParts}
              />
            </PopoverPrimitive.Content>
          </PopoverPrimitive.Portal>
        </div>
      </PopoverPrimitive.Root>
    );
  },
);

TimePicker.displayName = 'TimePicker';
