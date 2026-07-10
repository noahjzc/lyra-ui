import type * as React from 'react';
import type { TimelineItem, TimelineStatus } from './types';

export function getTimelineItemKey(item: TimelineItem, index: number) {
  return item.key ?? index;
}

export function getTimelineStatus(status?: TimelineStatus) {
  if (status === 'success') {
    return 'done';
  }

  return status ?? 'default';
}

export function getTimelineLinkRel(
  target?: React.HTMLAttributeAnchorTarget,
  rel?: string,
) {
  if (rel != null) {
    return rel;
  }

  return target === '_blank' ? 'noreferrer' : undefined;
}
