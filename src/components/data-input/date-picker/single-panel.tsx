import dayjs, { type Dayjs } from 'dayjs';
import type * as React from 'react';
import { cn } from '../../../internal/cn';
import { TimeColumns as TimeColumnsBase, type TimeUnit } from '../time-columns';
import { CalendarPanel, MonthPanel, YearPanel } from './calendar-panel';
import { PanelFooter, PanelHeader, PanelState } from './panel-controls';
import type { DatePickerMode, DatePickerSingleValue, PanelMode } from './types';
import {
  isTimeMode,
  mergeDateWithTime,
  parseDate,
  updateTimePart,
} from './utils';
import {
  dateTimePanelBodyClassName,
  dateTimePanelWidthClassName,
} from './variants';

export function SinglePanel({
  disabledDate,
  disabledTime,
  loadError,
  loading,
  mode,
  onClear,
  onConfirm,
  onMonthChange,
  onPanelModeChange,
  onRetry,
  onSelect,
  panelMode,
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
  onPanelModeChange: (mode: PanelMode) => void;
  onRetry?: () => void;
  onSelect: (date: Dayjs, close?: boolean) => void;
  panelMode: PanelMode;
  value?: DatePickerSingleValue;
  viewDate: Dayjs;
}) {
  const selectedDate = value ? parseDate(value) : undefined;

  function handleMonthSelect(date: Dayjs) {
    if (mode === 'month') {
      onSelect(date);
      return;
    }

    onMonthChange(date);
    onPanelModeChange('date');
  }

  function handleYearSelect(date: Dayjs) {
    if (mode === 'year') {
      onSelect(date);
      return;
    }

    onMonthChange(date);
    onPanelModeChange(mode === 'month' ? 'month' : 'date');
  }

  return (
    <div
      className={cn(
        'grid gap-2.5 rounded-lg border border-(--ui-input-border) bg-ui-background p-3 shadow-(--ui-time-picker-panel-shadow)',
        isTimeMode(mode) ? dateTimePanelWidthClassName : 'w-[316px]',
      )}
      data-slot="date-picker-panel"
    >
      <PanelHeader
        mode={panelMode}
        onMonthChange={onMonthChange}
        onPanelModeChange={onPanelModeChange}
        viewDate={viewDate}
      />
      {loading || loadError != null ? (
        <PanelState loadError={loadError} loading={loading} onRetry={onRetry} />
      ) : panelMode === 'year' ? (
        <YearPanel
          mode={mode}
          onSelect={handleYearSelect}
          selectedDate={selectedDate}
          viewDate={viewDate}
        />
      ) : panelMode === 'month' ? (
        <MonthPanel
          mode={mode}
          onSelect={handleMonthSelect}
          selectedDate={selectedDate}
          viewDate={viewDate}
        />
      ) : isTimeMode(mode) ? (
        <div className={dateTimePanelBodyClassName}>
          <CalendarPanel
            disabledDate={disabledDate}
            onSelect={date => onSelect(mergeDateWithTime(date, selectedDate))}
            selectedDate={selectedDate}
            viewDate={viewDate}
          />
          <TimeColumnsBase
            disabledTime={(part, next) =>
              disabledTime?.(selectedDate ?? viewDate, part, next) ?? false
            }
            onSelect={(part, next) =>
              onSelect(
                updateTimePart(selectedDate ?? viewDate, part, next),
                false,
              )
            }
            value={{
              hour: (selectedDate ?? viewDate).hour(),
              minute: (selectedDate ?? viewDate).minute(),
              second: (selectedDate ?? viewDate).second(),
            }}
            variant="date-picker"
          />
        </div>
      ) : (
        <CalendarPanel
          disabledDate={disabledDate}
          onSelect={date => onSelect(date)}
          selectedDate={selectedDate}
          viewDate={viewDate}
        />
      )}
      {isTimeMode(mode) && (
        <PanelFooter
          label={
            selectedDate?.format('YYYY-MM-DD HH:mm:ss') ?? '请选择日期时间'
          }
          onClear={onClear}
          onConfirm={onConfirm}
          onToday={() => onSelect(dayjs(), false)}
        />
      )}
    </div>
  );
}
