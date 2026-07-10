import * as React from 'react';
import { cn } from '../../../internal/cn';
import type { StatisticProps } from './types';
import {
  formatStatisticValue,
  getSize,
  getTrendText,
  normalizeTrend,
} from './utils';
import {
  loadingVariants,
  statisticVariants,
  statusClassName,
  titleVariants,
  trendClassName,
  trendIcon,
  valueVariants,
} from './variants';

export type {
  StatisticProps,
  StatisticSize,
  StatisticStatus,
  StatisticTrend,
  StatisticTrendDirection,
  StatisticVariant,
} from './types';

export const Statistic = React.forwardRef<HTMLDivElement, StatisticProps>(
  (
    {
      className,
      compact = false,
      description,
      emptyText,
      extra,
      formatter,
      loading = false,
      meta,
      precision,
      prefix,
      size,
      status = 'default',
      statusText,
      title,
      trend,
      unit,
      value,
      variant = 'plain',
      ...props
    },
    ref,
  ) => {
    const resolvedSize = getSize({ compact, size, variant });
    const trendConfig = normalizeTrend(trend);
    const TrendIcon =
      trendConfig == null ? null : trendIcon[trendConfig.direction];
    const valueNode = formatStatisticValue({
      emptyText,
      formatter,
      precision,
      status,
      value,
    });
    const hasFooter =
      trendConfig != null ||
      description != null ||
      statusText != null ||
      meta != null;

    return (
      <div
        aria-busy={loading ? true : undefined}
        className={cn(statisticVariants({ variant }), className)}
        data-slot="statistic"
        data-status={status}
        ref={ref}
        {...props}
      >
        <div
          className={cn(
            variant === 'inline'
              ? 'contents'
              : 'flex min-w-0 items-center justify-between gap-2',
          )}
          data-slot="statistic-header"
        >
          <div
            className={titleVariants({ size: resolvedSize, variant })}
            data-slot="statistic-title"
          >
            {title}
          </div>
          {extra != null && (
            <div className="shrink-0" data-slot="statistic-extra">
              {extra}
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid gap-2" data-slot="statistic-loading">
            <span className={loadingVariants({ size: resolvedSize })} />
          </div>
        ) : (
          <div
            className={valueVariants({
              size: resolvedSize,
              status,
            })}
            data-slot="statistic-value"
          >
            {prefix != null && (
              <span className="shrink-0 text-[0.65em] font-medium text-ui-muted-foreground">
                {prefix}
              </span>
            )}
            <span className="min-w-0 truncate">{valueNode}</span>
            {unit != null && (
              <span className="shrink-0 text-xs font-medium text-ui-muted-foreground">
                {unit}
              </span>
            )}
          </div>
        )}

        {hasFooter && (
          <div
            className={cn(
              'flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-xs',
              variant === 'inline' && 'contents',
            )}
            data-slot="statistic-footer"
          >
            {trendConfig != null && TrendIcon != null && (
              <span
                className={cn(
                  'inline-flex min-w-0 items-center gap-0.5 font-medium',
                  trendClassName[trendConfig.direction],
                )}
                data-slot="statistic-trend"
              >
                <TrendIcon aria-hidden="true" className="size-3.5 shrink-0" />
                <span className="truncate">
                  {trendConfig.value ??
                    trendConfig.label ??
                    getTrendText(trendConfig.direction)}
                </span>
              </span>
            )}
            {statusText != null && (
              <span
                className={cn('min-w-0 truncate', statusClassName[status])}
                data-slot="statistic-status-text"
              >
                {statusText}
              </span>
            )}
            {description != null && (
              <span
                className="min-w-0 truncate text-ui-muted-foreground"
                data-slot="statistic-description"
              >
                {description}
              </span>
            )}
            {meta != null && (
              <span
                className="min-w-0 truncate text-ui-muted-foreground"
                data-slot="statistic-meta"
              >
                {meta}
              </span>
            )}
          </div>
        )}
      </div>
    );
  },
);
Statistic.displayName = 'Statistic';
