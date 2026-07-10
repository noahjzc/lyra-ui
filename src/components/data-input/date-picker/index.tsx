import * as PopoverPrimitive from '@radix-ui/react-popover';
import type { Dayjs } from 'dayjs';
import * as React from 'react';
import { cn } from '../../../internal/cn';
import { useOverlayZIndex, Z_BASE } from '../../../overlay/z-stack';
import type { TimeUnit } from '../time-columns';
import { RangePanel, SinglePanel } from './panels';
import { DatePickerClearButton, DatePickerTriggerButton } from './trigger';
import type {
  DatePickerProps,
  DatePickerRangeValue,
  DatePickerSingleValue,
  DatePickerValue,
  DateRangePickerProps,
  PanelMode,
  RangePart,
} from './types';
import {
  getDisplayValue,
  getInitialPanelMode,
  getPlaceholder,
  getViewDate,
  isRangeMode,
  isTimeMode,
  normalizeRange,
  parseDate,
  resolvePresetValue,
  serializeByMode,
  updateTimePart,
} from './utils';

export type {
  DatePickerMode,
  DatePickerPreset,
  DatePickerProps,
  DatePickerRangeValue,
  DatePickerSingleValue,
  DatePickerSize,
  DatePickerStatus,
  DatePickerValue,
  DateRangePickerProps,
} from './types';

function useControllableDateValue({
  controlled,
  defaultValue,
  onValueChange,
  value,
}: {
  controlled?: boolean;
  defaultValue?: DatePickerValue;
  onValueChange?: (value: DatePickerValue) => void;
  value?: DatePickerValue;
}) {
  const [internalValue, setInternalValue] =
    React.useState<DatePickerValue>(defaultValue);
  const isControlled = controlled ?? value !== undefined;
  const mergedValue = isControlled ? value : internalValue;

  const setValue = React.useCallback(
    (nextValue: DatePickerValue) => {
      if (!isControlled) {
        setInternalValue(nextValue);
      }

      onValueChange?.(nextValue);
    },
    [isControlled, onValueChange],
  );

  return [mergedValue, setValue] as const;
}

export const DatePicker = React.forwardRef<HTMLDivElement, DatePickerProps>(
  (props, ref) => {
    const isValueControlled = Object.hasOwn(props, 'value');
    const {
      allowClear = false,
      className,
      defaultValue,
      disabled = false,
      disabledDate,
      disabledTime,
      invalid,
      loadError,
      loading = false,
      mode = 'date',
      onOpenChange,
      onRetry,
      onValueChange,
      placeholder,
      presets,
      size = 'middle',
      status,
      triggerAriaLabel,
      value,
      variant = 'outlined',
      ...rootProps
    } = props;
    const [open, setOpen] = React.useState(false);
    const [overlayZIndex, layerRef] = useOverlayZIndex<HTMLDivElement>(
      Z_BASE.popover,
      undefined,
      open,
    );
    const [panelMode, setPanelMode] = React.useState<PanelMode>(
      getInitialPanelMode(mode),
    );
    const [rangePart, setRangePart] = React.useState<RangePart>('start');
    const [mergedValue, setMergedValue] = useControllableDateValue({
      controlled: isValueControlled,
      defaultValue,
      onValueChange,
      value,
    });
    const [viewDate, setViewDate] = React.useState(() =>
      getViewDate(mode, mergedValue),
    );
    const isInvalid = invalid || status === 'error';
    const rangeValue = normalizeRange(mergedValue);
    const singleValue = Array.isArray(mergedValue)
      ? undefined
      : (mergedValue as DatePickerSingleValue);
    const hasValue = isRangeMode(mode)
      ? rangeValue.some(Boolean)
      : singleValue != null;
    const canClear = allowClear && hasValue && !disabled;
    const resolvedPlaceholder = getPlaceholder(mode, placeholder);
    const valueText = getDisplayValue({
      mode,
      placeholder: resolvedPlaceholder,
      value: mergedValue,
    });

    function updateOpen(nextOpen: boolean) {
      if (disabled) return;

      if (nextOpen) {
        setPanelMode(getInitialPanelMode(mode));
        setViewDate(getViewDate(mode, mergedValue));
      }

      setOpen(nextOpen);
      onOpenChange?.(nextOpen);
    }

    function commitSingle(nextDate: Dayjs, close = !isTimeMode(mode)) {
      setMergedValue(serializeByMode(nextDate, mode));
      setViewDate(nextDate);

      if (close) {
        updateOpen(false);
      }
    }

    function commitRangeDate(nextDate: Dayjs) {
      const [start, end] = rangeValue;
      const serialized = serializeByMode(nextDate, mode);

      if (rangePart === 'start' || !start || (start && end)) {
        setMergedValue([serialized, undefined]);
        setRangePart('end');
        setViewDate(nextDate);
        return;
      }

      const startDate = parseDate(start);
      const nextDateBeforeStart = nextDate.isBefore(startDate);
      const nextRange: DatePickerRangeValue = nextDateBeforeStart
        ? [serialized, start]
        : [start, serialized];

      setMergedValue(nextRange);
      setRangePart('start');

      if (nextDateBeforeStart) {
        setViewDate(nextDate);
      }
    }

    function commitRangeTime(part: TimeUnit, next: number) {
      const [start, end] = rangeValue;
      const targetValue = rangePart === 'start' ? start : end;
      const baseDate = parseDate(targetValue, viewDate);
      const nextDate = updateTimePart(baseDate, part, next);
      const serialized = serializeByMode(nextDate, mode);
      const nextRange: DatePickerRangeValue =
        rangePart === 'start' ? [serialized, end] : [start, serialized];

      setMergedValue(nextRange);
      setViewDate(nextDate);
    }

    function handleClear(event: React.MouseEvent<HTMLButtonElement>) {
      event.preventDefault();
      event.stopPropagation();
      setMergedValue(isRangeMode(mode) ? [undefined, undefined] : undefined);
    }

    return (
      <PopoverPrimitive.Root onOpenChange={updateOpen} open={open}>
        <div
          className={cn('relative w-full min-w-0', className)}
          ref={ref}
          {...rootProps}
        >
          <PopoverPrimitive.Trigger asChild>
            <DatePickerTriggerButton
              canClear={canClear}
              disabled={disabled}
              isInvalid={isInvalid}
              mode={mode}
              open={open}
              placeholder={resolvedPlaceholder}
              size={size}
              triggerAriaLabel={triggerAriaLabel}
              valueText={valueText}
              variant={variant}
            />
          </PopoverPrimitive.Trigger>
          {canClear && <DatePickerClearButton onClear={handleClear} />}
          <PopoverPrimitive.Portal>
            <PopoverPrimitive.Content
              align="start"
              className="bg-transparent p-0 text-ui-foreground shadow-none data-[state=closed]:animate-ui-layer-out data-[state=open]:animate-ui-layer-in"
              data-slot="date-picker-content"
              ref={layerRef}
              role="dialog"
              sideOffset={4}
              style={{ zIndex: overlayZIndex }}
            >
              {isRangeMode(mode) ? (
                <RangePanel
                  disabledDate={disabledDate}
                  disabledTime={disabledTime}
                  loadError={loadError}
                  loading={loading}
                  mode={mode}
                  onClear={() =>
                    setMergedValue(
                      isRangeMode(mode) ? [undefined, undefined] : undefined,
                    )
                  }
                  onConfirm={() => updateOpen(false)}
                  onMonthChange={setViewDate}
                  onPresetSelect={preset => {
                    const nextValue = resolvePresetValue(preset);
                    setMergedValue(nextValue);
                    setViewDate(parseDate(nextValue[0]));
                    setRangePart('start');
                  }}
                  onRangeDateSelect={commitRangeDate}
                  onRangePartChange={setRangePart}
                  onRangeTimeSelect={commitRangeTime}
                  onRetry={onRetry}
                  presets={presets}
                  rangePart={rangePart}
                  value={rangeValue}
                  viewDate={viewDate}
                />
              ) : (
                <SinglePanel
                  disabledDate={disabledDate}
                  disabledTime={disabledTime}
                  loadError={loadError}
                  loading={loading}
                  mode={mode}
                  onClear={() => setMergedValue(undefined)}
                  onConfirm={() => updateOpen(false)}
                  onMonthChange={setViewDate}
                  onPanelModeChange={setPanelMode}
                  onRetry={onRetry}
                  onSelect={commitSingle}
                  panelMode={panelMode}
                  value={singleValue}
                  viewDate={viewDate}
                />
              )}
            </PopoverPrimitive.Content>
          </PopoverPrimitive.Portal>
        </div>
      </PopoverPrimitive.Root>
    );
  },
);

DatePicker.displayName = 'DatePicker';

export const DateRangePicker = React.forwardRef<
  HTMLDivElement,
  DateRangePickerProps
>(({ mode = 'dateRange', onValueChange, ...props }, ref) => (
  <DatePicker
    mode={mode}
    onValueChange={nextValue => onValueChange?.(normalizeRange(nextValue))}
    ref={ref}
    {...props}
  />
));

DateRangePicker.displayName = 'DateRangePicker';
