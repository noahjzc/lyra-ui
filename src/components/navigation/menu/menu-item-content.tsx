import { ChevronDown } from 'lucide-react';
import type * as React from 'react';
import { cn } from '../../../internal/cn';
import type { MenuSelectableItem } from './types';
import { getMenuItemText } from './utils';
import {
  collapsedBadgeClassName,
  collapsedItemClassName,
  menuArrowClassName,
  menuBadgeClassName,
  menuIconClassName,
  menuSubDotClassName,
} from './variants';

const itemBaseClassName =
  'relative flex min-w-0 items-center gap-2 rounded-[7px] px-2 text-[13px] text-ui-foreground no-underline outline-none transition-ui-state hover:bg-(--ui-button-ghost-hover-background) hover:text-(--ui-button-primary-background) focus-visible:ring-2 focus-visible:ring-(--ui-button-focus-ring) motion-reduce:transition-none';

const itemActiveIndicatorClassName = 'shadow-ui-menu-active-indicator';

const itemDepthClassName = {
  1: 'min-h-9 w-full',
  2: 'min-h-8 w-full',
};

const itemStateClassName = {
  active: cn(
    'bg-(--ui-button-ghost-background) font-bold text-(--ui-button-primary-background)',
    itemActiveIndicatorClassName,
  ),
  activePath: cn(
    'bg-(--ui-button-ghost-background) text-(--ui-button-primary-background)',
    itemActiveIndicatorClassName,
  ),
  default: '',
  disabled:
    'cursor-not-allowed text-ui-muted-foreground opacity-60 hover:bg-transparent hover:text-ui-muted-foreground',
};

export function buildMenuItemLabel(item: MenuSelectableItem): React.ReactNode {
  if (item.disabledReason == null) {
    return item.label;
  }

  return (
    <>
      {item.label}
      {' · '}
      {item.disabledReason}
    </>
  );
}

export function getReadableMenuItemLabel(
  item: MenuSelectableItem,
  fallback?: string,
): string {
  const label = getMenuItemText(item);

  return label || fallback || item.key;
}

export function getMenuItemClassName({
  compact,
  depth,
  disabled,
  leafActive,
  pathActive,
}: {
  compact: boolean;
  depth: 1 | 2;
  disabled: boolean;
  leafActive: boolean;
  pathActive: boolean;
}) {
  return cn(
    compact ? collapsedItemClassName : itemBaseClassName,
    !compact && itemDepthClassName[depth],
    disabled
      ? itemStateClassName.disabled
      : leafActive
        ? itemStateClassName.active
        : pathActive
          ? itemStateClassName.activePath
          : itemStateClassName.default,
  );
}

export function MenuItemContent({
  compact,
  disabled,
  disclosureOpen,
  hasChildren,
  item,
  showSubDot,
}: {
  compact: boolean;
  disabled: boolean;
  disclosureOpen: boolean;
  hasChildren: boolean;
  item: MenuSelectableItem;
  showSubDot: boolean;
}) {
  return (
    <>
      {item.icon != null && (
        <span
          aria-hidden="true"
          className={menuIconClassName}
          data-slot="menu-icon"
        >
          {item.icon}
        </span>
      )}
      {showSubDot && (
        <span
          aria-hidden="true"
          className={menuSubDotClassName}
          data-slot="menu-sub-dot"
        />
      )}
      {!compact && (
        <span
          aria-disabled={disabled ? 'true' : undefined}
          className="min-w-0 flex-1 truncate text-left"
          data-slot="menu-label"
        >
          {buildMenuItemLabel(item)}
        </span>
      )}
      {!compact && item.badge != null && (
        <span
          aria-hidden="true"
          className={menuBadgeClassName}
          data-slot="menu-badge"
        >
          {item.badge}
        </span>
      )}
      {compact && item.badge != null && (
        <span
          aria-hidden="true"
          className={collapsedBadgeClassName}
          data-slot="menu-badge"
        >
          {item.badge}
        </span>
      )}
      {!compact && hasChildren && (
        <ChevronDown
          aria-hidden="true"
          className={cn(menuArrowClassName, disclosureOpen && 'rotate-180')}
          data-slot="menu-arrow"
        />
      )}
    </>
  );
}
