import * as React from 'react';
import { cn } from '../../../internal/cn';
import type { TopMenuItem, TopMenuProps } from './types';
import { topMenuItemClassName, topMenuRootClassName } from './variants';

function getTopItemClassName(active: boolean, disabled: boolean) {
  return cn(
    topMenuItemClassName,
    active &&
      'bg-(--ui-button-ghost-background) font-bold text-(--ui-button-primary-background) after:absolute after:right-2.5 after:bottom-[3px] after:left-2.5 after:h-0.5 after:rounded-full after:bg-(--ui-button-primary-background)',
    disabled &&
      'cursor-not-allowed bg-ui-muted text-ui-muted-foreground hover:bg-ui-muted hover:text-ui-muted-foreground',
  );
}

/**
 * 顶部模块导航（TopMenu）。
 * 用于应用壳跨子系统入口，如 CRM / PMS / WMS。
 * 激活项使用底部 2px 主题色指示条。
 */
export function TopMenu({
  activeKey,
  'aria-label': ariaLabel = '顶部模块导航',
  className,
  items,
  onSelect,
  ...props
}: TopMenuProps) {
  const handleSelect = React.useCallback(
    (event: React.MouseEvent<HTMLElement>, item: TopMenuItem) => {
      if (item.disabled === true) {
        event.preventDefault();
        return;
      }

      item.onSelect?.(item.key);
      onSelect?.(item.key, item);
    },
    [onSelect],
  );

  const handleLinkClick = React.useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, item: TopMenuItem) => {
      if (
        event.defaultPrevented ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      handleSelect(event, item);
    },
    [handleSelect],
  );

  return (
    <nav
      aria-label={ariaLabel}
      className={cn(topMenuRootClassName, className)}
      data-slot="top-menu"
      {...props}
    >
      {items.map(item => {
        const active = item.key === activeKey;
        const disabled = item.disabled === true;
        const itemClassName = getTopItemClassName(active, disabled);

        if (disabled) {
          return (
            <span
              aria-current={active ? 'page' : undefined}
              aria-disabled="true"
              className={itemClassName}
              key={item.key}
            >
              {item.label}
            </span>
          );
        }

        if (item.href != null) {
          return (
            <a
              aria-current={active ? 'page' : undefined}
              className={itemClassName}
              href={item.href}
              key={item.key}
              onClick={event => handleLinkClick(event, item)}
            >
              {item.label}
            </a>
          );
        }

        return (
          <button
            aria-current={active ? 'page' : undefined}
            className={itemClassName}
            key={item.key}
            onClick={event => handleSelect(event, item)}
            type="button"
          >
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}
