import type { MouseEvent } from 'react';
import * as React from 'react';
import { MenuCollapsedSubmenuItem } from './menu-collapsed-submenu-item';
import { MenuDisabledItem } from './menu-disabled-item';
import {
  getMenuItemClassName,
  getReadableMenuItemLabel,
  MenuItemContent,
} from './menu-item-content';
import { MenuLeafItem } from './menu-leaf-item';
import { MenuSubmenuItem } from './menu-submenu-item';
import type {
  MenuItemRenderProps,
  MenuItem as MenuItemType,
  MenuSelectableItem,
  MenuSubItem,
} from './types';
import { isItemDisabled } from './utils';

type MenuItemWithChildren = MenuItemType & { children: MenuSubItem[] };

function hasMenuChildren(
  depth: 1 | 2,
  item: MenuSelectableItem,
): item is MenuItemWithChildren {
  return (
    depth === 1 &&
    'children' in item &&
    item.children != null &&
    item.children.length > 0
  );
}

export function MenuItem({
  activeKey,
  active = false,
  activePath = false,
  collapsed = false,
  depth,
  disclosureMotion,
  item,
  onOpenChange,
  onSelect,
  open = false,
  popoverLabel,
  preventLinkDefault,
  variant,
}: MenuItemRenderProps) {
  const [popoverOpen, setPopoverOpen] = React.useState(false);
  const contentId = React.useId();
  const hasChildren = hasMenuChildren(depth, item);
  const disabled = isItemDisabled(item);
  const leafActive = active && !hasChildren;
  const pathActive = (activePath || active) && hasChildren;
  const compact = collapsed && depth === 1;
  const readableLabel = getReadableMenuItemLabel(item, popoverLabel);
  const disclosureState =
    hasChildren && !compact && disclosureMotion != null
      ? disclosureMotion.getDisclosureState(item.key)
      : { open, present: open, visible: open };
  const itemClassName = getMenuItemClassName({
    compact,
    depth,
    disabled,
    leafActive,
    pathActive,
  });
  const content = (
    <MenuItemContent
      compact={compact}
      disabled={disabled}
      disclosureOpen={disclosureState.open}
      hasChildren={hasChildren}
      item={item}
      showSubDot={depth === 2 && !collapsed}
    />
  );

  const handleSelect = React.useCallback(() => {
    if (disabled) {
      return;
    }

    item.onSelect?.(item.key);
    onSelect(item);
  }, [disabled, item, onSelect]);

  const handleLinkClick = React.useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.altKey ||
        event.ctrlKey ||
        event.shiftKey
      ) {
        return;
      }

      if (preventLinkDefault) {
        event.preventDefault();
      }

      handleSelect();
    },
    [handleSelect, preventLinkDefault],
  );

  const handleToggle = React.useCallback(() => {
    if (disabled || !hasChildren) {
      return;
    }

    onOpenChange?.(item.key, !open);
  }, [disabled, hasChildren, item.key, onOpenChange, open]);

  if (disabled) {
    return (
      <MenuDisabledItem
        className={itemClassName}
        compact={compact}
        content={content}
        depth={depth}
        item={item}
        leafActive={leafActive}
      />
    );
  }

  if (compact && hasChildren) {
    return (
      <MenuCollapsedSubmenuItem
        activeKey={activeKey}
        className={itemClassName}
        content={content}
        contentId={contentId}
        item={item}
        open={popoverOpen}
        readableLabel={readableLabel}
        preventLinkDefault={preventLinkDefault}
        variant={variant}
        onOpenChange={setPopoverOpen}
        onSelect={onSelect}
      />
    );
  }

  if (hasChildren) {
    return (
      <MenuSubmenuItem
        activeKey={activePath ? activeKey : undefined}
        className={itemClassName}
        content={content}
        contentId={contentId}
        disclosureMotion={disclosureMotion}
        disclosureState={disclosureState}
        item={item}
        readableLabel={readableLabel}
        preventLinkDefault={preventLinkDefault}
        variant={variant}
        onSelect={onSelect}
        onToggle={handleToggle}
      />
    );
  }

  return (
    <MenuLeafItem
      className={itemClassName}
      compact={compact}
      content={content}
      depth={depth}
      href={item.href}
      leafActive={leafActive}
      readableLabel={readableLabel}
      onLinkClick={handleLinkClick}
      onSelect={handleSelect}
    />
  );
}
