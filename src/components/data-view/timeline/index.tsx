import { Loader2 } from 'lucide-react';
import { cn } from '../../../internal/cn';
import { Empty } from '../empty';
import type { TimelineItem, TimelineProps } from './types';
import {
  getTimelineItemKey,
  getTimelineLinkRel,
  getTimelineStatus,
} from './utils';
import {
  timelineActionClassName,
  timelineBodyClassName,
  timelineDotClassName,
  timelineItemVariants,
  timelineLineClassName,
  timelineRailClassName,
  timelineTimeClassName,
  timelineTitleVariants,
  timelineVariants,
} from './variants';

export type { TimelineItem, TimelineProps, TimelineStatus } from './types';

function TimelineTime({ item }: { item: TimelineItem }) {
  if (item.time == null) {
    return <span className={timelineTimeClassName} />;
  }

  if (item.dateTime != null) {
    return (
      <time className={timelineTimeClassName} dateTime={item.dateTime}>
        {item.time}
      </time>
    );
  }

  return <span className={timelineTimeClassName}>{item.time}</span>;
}

function TimelineContent({ item }: { item: TimelineItem }) {
  const status = getTimelineStatus(item.status);

  return (
    <div className={timelineBodyClassName}>
      <span
        className={timelineTitleVariants({ current: status === 'current' })}
        data-slot="timeline-title"
      >
        {item.title}
      </span>
      {item.content != null && (
        <span
          className="line-clamp-2 min-w-0 text-xs leading-5 text-ui-muted-foreground"
          data-slot="timeline-content"
        >
          {item.content}
        </span>
      )}
      {item.meta != null && (
        <span
          className="min-w-0 truncate text-xs leading-[1.5] text-ui-muted-foreground/80"
          data-slot="timeline-meta"
        >
          {item.meta}
        </span>
      )}
    </div>
  );
}

function TimelineItemBody({
  item,
  isLast,
}: {
  isLast: boolean;
  item: TimelineItem;
}) {
  const status = getTimelineStatus(item.status);

  return (
    <>
      <TimelineTime item={item} />
      <span aria-hidden="true" className={timelineRailClassName}>
        {!isLast && <span className={timelineLineClassName} />}
        <span
          className={cn(
            'relative z-[1] mt-[5px] shrink-0 rounded-full border-2',
            timelineDotClassName[status],
          )}
          data-slot="timeline-dot"
        >
          {item.dot}
        </span>
      </span>
      <TimelineContent item={item} />
    </>
  );
}

export function Timeline({
  className,
  compact = false,
  density,
  empty,
  items,
  loading = false,
  variant = 'default',
  ...props
}: TimelineProps) {
  if (items.length === 0 && !loading) {
    return <>{empty ?? <Empty compact type="no-data" />}</>;
  }

  const resolvedDensity = density ?? (compact ? 'compact' : 'default');

  return (
    <ol
      aria-label={props['aria-label'] ?? '时间线'}
      className={cn(
        timelineVariants({ density: resolvedDensity, variant }),
        className,
      )}
      data-slot="timeline"
      {...props}
    >
      {items.map((item, index) => {
        const clickable = item.onClick != null && !item.disabled;
        const linked = item.href != null && !item.disabled;
        const itemBody = (
          <TimelineItemBody
            isLast={index === items.length - 1 && !loading}
            item={item}
          />
        );

        return (
          <li
            className={cn(
              timelineItemVariants({
                density: resolvedDensity,
                disabled: item.disabled ?? false,
              }),
              (clickable || linked) && 'rounded-md',
            )}
            data-slot="timeline-item"
            key={getTimelineItemKey(item, index)}
          >
            {clickable ? (
              <button
                aria-label={item.ariaLabel}
                className={cn(
                  timelineActionClassName,
                  'col-span-3 grid-cols-subgrid',
                )}
                onClick={item.onClick}
                type="button"
              >
                {itemBody}
              </button>
            ) : linked ? (
              <a
                aria-label={item.ariaLabel}
                className={cn(
                  timelineActionClassName,
                  'col-span-3 grid-cols-subgrid no-underline',
                )}
                href={item.href}
                rel={getTimelineLinkRel(item.target, item.rel)}
                target={item.target}
              >
                {itemBody}
              </a>
            ) : (
              itemBody
            )}
          </li>
        );
      })}
      {loading && (
        <li
          className="flex items-center gap-2 pt-1 text-xs text-ui-muted-foreground"
          data-slot="timeline-loading"
        >
          <Loader2
            aria-hidden="true"
            className="size-3.5 animate-spin motion-reduce:animate-none"
          />
          加载更多
        </li>
      )}
    </ol>
  );
}
