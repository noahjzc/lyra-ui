import * as PopoverPrimitive from '@radix-ui/react-popover';
import { Clock, X } from 'lucide-react';
import * as React from 'react';
import { cn } from '../../../internal/cn';
import { useOverlayZIndex, Z_BASE } from '../../../overlay/z-stack';
import { TimeRangePanel } from './panel';
import type { RangePart, TimeParts, TimeRangePickerProps } from './types';
import {
  formatTime,
  getNowParts,
  parseTime,
  updateTimePart,
  useControllableRangeValue,
} from './utils';
import { timePickerTriggerVariants } from './variants';

export const TimeRangePicker = React.forwardRef<
  HTMLDivElement,
  TimeRangePickerProps
>(
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
      placeholder = ['开始时间', '结束时间'],
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
    const [rangePart, setRangePart] = React.useState<RangePart>('start');
    const [mergedValue, setMergedValue] = useControllableRangeValue({
      defaultValue,
      onValueChange,
      value,
    });
    const resolvedShowSecond = showSecond ?? format === 'HH:mm:ss';
    const [start, end] = mergedValue;
    const startParts = parseTime(start);
    const endParts = parseTime(end);
    const activeParts = rangePart === 'start' ? startParts : endParts;
    const hasValue = startParts != null || endParts != null;
    const canClear = allowClear && hasValue && !disabled;
    const isInvalid = invalid || status === 'error';
    const [startPlaceholder, endPlaceholder] = Array.isArray(placeholder)
      ? placeholder
      : ['开始时间', '结束时间'];

    function updateOpen(nextOpen: boolean) {
      if (disabled) return;

      setOpen(nextOpen);
      onOpenChange?.(nextOpen);
    }

    function commitPart(part: RangePart, nextParts: TimeParts | undefined) {
      const nextValue = nextParts
        ? formatTime(nextParts, resolvedShowSecond)
        : undefined;

      setMergedValue(part === 'start' ? [nextValue, end] : [start, nextValue]);
    }

    function handleClear(event: React.MouseEvent<HTMLButtonElement>) {
      event.preventDefault();
      event.stopPropagation();
      setMergedValue([undefined, undefined]);
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
              data-slot="time-range-picker-trigger"
              data-state={open ? 'open' : 'closed'}
              disabled={disabled}
              type="button"
            >
              <span
                className={cn(
                  'grid min-w-0 flex-1 grid-cols-[minmax(0,1fr)_18px_minmax(0,1fr)] items-center gap-2 text-left tabular-nums',
                  !hasValue && 'font-medium text-ui-muted-foreground',
                )}
                data-slot="time-range-picker-value"
              >
                <span className="truncate">
                  {startParts
                    ? formatTime(startParts, resolvedShowSecond)
                    : startPlaceholder}
                </span>
                <span className="grid size-[18px] place-items-center text-xs font-bold text-ui-muted-foreground">
                  →
                </span>
                <span className="truncate">
                  {endParts
                    ? formatTime(endParts, resolvedShowSecond)
                    : endPlaceholder}
                </span>
              </span>
              <Clock
                aria-hidden="true"
                className="size-4 shrink-0 text-ui-muted-foreground"
              />
            </button>
          </PopoverPrimitive.Trigger>
          {canClear && (
            <button
              aria-label="清空时间范围"
              className="absolute top-1/2 right-7 grid size-5 -translate-y-1/2 place-items-center rounded text-ui-muted-foreground transition-ui-state transition-ui-transform hover:bg-ui-muted hover:text-ui-foreground active:scale-95"
              data-slot="time-range-picker-clear"
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
              data-slot="time-range-picker-content"
              ref={layerRef}
              role="dialog"
              sideOffset={4}
              style={{ zIndex: overlayZIndex }}
            >
              <TimeRangePanel
                activeParts={activeParts}
                disabledTime={disabledTime}
                end={end}
                loadError={loadError}
                loading={loading}
                minuteStep={minuteStep}
                onClear={() => setMergedValue([undefined, undefined])}
                onConfirm={() => updateOpen(false)}
                onNow={() => commitPart(rangePart, getNowParts())}
                onRangePartChange={setRangePart}
                onRetry={onRetry}
                onSelect={(unit, next) =>
                  commitPart(rangePart, updateTimePart(activeParts, unit, next))
                }
                rangePart={rangePart}
                secondStep={secondStep}
                showSecond={resolvedShowSecond}
                start={start}
              />
            </PopoverPrimitive.Content>
          </PopoverPrimitive.Portal>
        </div>
      </PopoverPrimitive.Root>
    );
  },
);

TimeRangePicker.displayName = 'TimeRangePicker';
