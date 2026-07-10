import type {
  StatisticProps,
  StatisticSize,
  StatisticStatus,
  StatisticTrend,
  StatisticTrendDirection,
} from './types';

export function formatStatisticValue({
  emptyText,
  formatter,
  precision,
  status,
  value,
}: Pick<
  StatisticProps,
  'emptyText' | 'formatter' | 'precision' | 'status' | 'value'
>) {
  if (value == null || value === '') return getEmptyText(emptyText, status);
  if (formatter != null) return formatter(value);
  if (typeof value === 'number') {
    return value.toLocaleString('zh-CN', {
      maximumFractionDigits: precision,
      minimumFractionDigits: precision,
    });
  }

  return value;
}

export function getEmptyText(
  emptyText: StatisticProps['emptyText'],
  status: StatisticStatus | undefined,
) {
  if (emptyText != null) return emptyText;
  if (status === 'error' || status === 'permission') return '--';

  return '-';
}

export function normalizeTrend(trend: StatisticTrend | undefined) {
  if (trend == null) return undefined;
  if (typeof trend === 'string') {
    return {
      direction: trend,
    };
  }

  return trend;
}

export function getSize({
  compact,
  size,
  variant,
}: Pick<StatisticProps, 'compact' | 'size' | 'variant'>): StatisticSize {
  if (size != null) return size;
  if (variant === 'inline') return 'inline';
  if (compact) return 'compact';

  return 'default';
}

export function getTrendText(direction: StatisticTrendDirection) {
  return direction;
}
