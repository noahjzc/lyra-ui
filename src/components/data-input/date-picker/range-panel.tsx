import dayjs, { type Dayjs } from 'dayjs';
import type * as React from 'react';
import { cn } from '../../../internal/cn';
import { TimeColumns as TimeColumnsBase, type TimeUnit } from '../time-columns';
import { CalendarPanel } from './calendar-panel';
import {
  PanelFooter,
  PanelHeader,
  PanelState,
  RangeCalendarHeader,
} from './panel-controls';
import type {
  DatePickerMode,
  DatePickerPreset,
  DatePickerRangeValue,
  RangePart,
} from './types';
import { mergeDateWithTime, parseDate } from './utils';
import {
  dateTimePanelBodyClassName,
  dateTimePanelWidthClassName,
} from './variants';

export function RangePanel({
  disabledDate,
  disabledTime,
  loadError,
  loading,
  mode,
  onClear,
  onConfirm,
  onMonthChange,
  onPresetSelect,
  onRangeDateSelect,
  onRangePartChange,
  onRangeTimeSelect,
  onRetry,
  presets,
  rangePart,
  value,
  viewDate,
}: {
  disabledDate?: (date: Dayjs) => boolean;
  disabledTime?: (date: Dayjs, part: TimeUnit, value: number) => boolean;
  loadError?: React.ReactNode;
  loading?: boolean;
  mode: DatePickerMode;
  onClear: () => void;
  onConfirm: () => void;
  onMonthChange: (date: Dayjs) => void;
  onPresetSelect: (preset: DatePickerPreset) => void;
  onRangeDateSelect: (date: Dayjs) => void;
  onRangePartChange: (part: RangePart) => void;
  onRangeTimeSelect: (part: TimeUnit, value: number) => void;
  onRetry?: () => void;
  presets?: DatePickerPreset[];
  rangePart: RangePart;
  value: DatePickerRangeValue;
  viewDate: Dayjs;
}) {
  const [start, end] = value;
  const activeValue = rangePart === 'start' ? start : end;
  const activeDate = parseDate(activeValue, viewDate);

  if (mode === 'dateTimeRange') {
    return (
      <div
        className={cn(
          'grid gap-2.5 rounded-lg border border-(--ui-input-border) bg-ui-background p-3 shadow-(--ui-time-picker-panel-shadow)',
          dateTimePanelWidthClassName,
        )}
        data-slot="date-time-range-panel"
      >
        <div
          className="grid grid-cols-2 gap-1 rounded-lg border border-(--ui-divider-soft) bg-(--ui-input-addon-background) p-[3px]"
          data-slot="date-range-tabs"
        >
          {(['start', 'end'] as const).map(part => (
            <button
              className={cn(
                'grid min-h-[42px] gap-0.5 rounded-md border border-transparent px-2 py-1.5 text-left text-xs transition-ui-state',
                rangePart === part
                  ? 'border-(--ui-control-active-border) bg-ui-background text-(--ui-button-default-hover-foreground) shadow-(--ui-time-preset-active-shadow)'
                  : 'text-ui-muted-foreground hover:bg-ui-background',
              )}
              key={part}
              onClick={() => onRangePartChange(part)}
              type="button"
            >
              <strong>{part === 'start' ? '开始' : '结束'}</strong>
              <span className="truncate">
                {(part === 'start' ? start : end) ?? '未选择'}
              </span>
            </button>
          ))}
        </div>
        {loading || loadError != null ? (
          <PanelState
            loadError={loadError}
            loading={loading}
            onRetry={onRetry}
          />
        ) : (
          <div className={dateTimePanelBodyClassName}>
            <div>
              <PanelHeader
                mode="date"
                onMonthChange={onMonthChange}
                onPanelModeChange={() => undefined}
                viewDate={viewDate}
              />
              <CalendarPanel
                disabledDate={disabledDate}
                onSelect={date =>
                  onRangeDateSelect(mergeDateWithTime(date, activeDate))
                }
                rangeValue={value}
                selectedDate={activeDate}
                viewDate={viewDate}
              />
            </div>
            <TimeColumnsBase
              disabledTime={(part, next) =>
                disabledTime?.(activeDate, part, next) ?? false
              }
              onSelect={onRangeTimeSelect}
              value={{
                hour: activeDate.hour(),
                minute: activeDate.minute(),
                second: activeDate.second(),
              }}
              variant="date-picker"
            />
          </div>
        )}
        <div className="grid gap-1 rounded-md border border-(--ui-divider-soft) bg-(--ui-surface-muted-background) p-2 text-xs text-ui-muted-foreground">
          <span>
            当前编辑：{rangePart === 'start' ? '开始时间' : '结束时间'}
          </span>
          <span>
            {rangePart === 'start' ? '结束时间' : '开始时间'}：
            {(rangePart === 'start' ? end : start) ?? '未选择'}
          </span>
        </div>
        <PanelFooter
          label={start && end ? `${start} → ${end}` : '请选择完整范围'}
          onClear={onClear}
          onConfirm={onConfirm}
          onToday={() => onRangeDateSelect(dayjs())}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'grid rounded-lg bg-ui-background',
        presets?.length
          ? 'w-[764px] grid-cols-[112px_minmax(0,1fr)] overflow-hidden border border-(--ui-input-border) p-0 shadow-(--ui-time-picker-panel-shadow)'
          : 'w-[652px] gap-2.5 border border-(--ui-input-border) p-3 shadow-(--ui-time-picker-panel-shadow)',
      )}
      data-slot="date-range-panel"
    >
      {presets?.length ? (
        <div
          className="grid content-start gap-0.5 border-(--ui-divider-soft) border-r bg-(--ui-surface-soft-background) px-2 py-2.5"
          data-slot="date-range-presets"
        >
          {presets.map(preset => (
            <button
              className="min-h-[30px] rounded-md px-2 text-left text-xs font-semibold text-(--ui-control-foreground) transition-ui-state hover:bg-(--ui-control-hover-background) hover:text-(--ui-button-default-hover-foreground)"
              key={preset.value.toString()}
              onClick={() => onPresetSelect(preset)}
              type="button"
            >
              {preset.label}
            </button>
          ))}
        </div>
      ) : null}
      <div className={cn('grid gap-2.5', presets?.length && 'p-3 pb-2')}>
        <RangeCalendarHeader
          onMonthChange={onMonthChange}
          viewDate={viewDate}
        />
        {loading || loadError != null ? (
          <PanelState
            loadError={loadError}
            loading={loading}
            onRetry={onRetry}
          />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <CalendarPanel
                disabledDate={disabledDate}
                onSelect={onRangeDateSelect}
                rangeValue={value}
                selectedDate={start ? parseDate(start) : undefined}
                showOutsideDays={false}
                viewDate={viewDate}
              />
            </div>
            <div>
              <CalendarPanel
                disabledDate={disabledDate}
                onSelect={onRangeDateSelect}
                rangeValue={value}
                selectedDate={end ? parseDate(end) : undefined}
                showOutsideDays={false}
                viewDate={viewDate.add(1, 'month')}
              />
            </div>
          </div>
        )}
        <PanelFooter
          label={start && end ? `${start} → ${end}` : '请选择完整范围'}
          onClear={onClear}
          onConfirm={onConfirm}
          onToday={() => onRangeDateSelect(dayjs())}
        />
      </div>
    </div>
  );
}
