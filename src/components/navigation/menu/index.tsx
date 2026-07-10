import * as React from 'react';
import { cn } from '../../../internal/cn';
import { useDisclosureMotion } from '../../../internal/disclosure-motion';
import { TooltipProvider } from '../../data-view/tooltip';
import { MenuGroup } from './menu-group';
import { TopMenu } from './top-menu';
import type { MenuProps, MenuSelectableItem } from './types';
import {
  EMPTY_OPEN_KEYS,
  getAutoOpenKeys,
  mergeOpenKeys,
  removeOpenKey,
} from './utils';
import {
  menuFooterClassName,
  menuRootClassName,
  menuViewportClassName,
  menuWidthClassName,
} from './variants';

export { TopMenu };
export type {
  MenuGroup,
  MenuItem,
  MenuProps,
  MenuSelectableItem,
  MenuSubItem,
  TopMenuItem,
  TopMenuProps,
} from './types';

export function Menu({
  activeKey,
  className,
  collapsed = false,
  defaultOpenKeys = EMPTY_OPEN_KEYS,
  footer,
  groups,
  onOpenKeysChange,
  onSelect,
  openKeys,
  variant = 'side',
  ...props
}: MenuProps) {
  const effectiveCollapsed = variant === 'side' && collapsed;
  const controlled = openKeys != null;
  const [internalOpenKeys, setInternalOpenKeys] = React.useState<string[]>(
    () => [...defaultOpenKeys],
  );
  const [manuallyClosedKeys, setManuallyClosedKeys] = React.useState<
    Set<string>
  >(() => new Set());

  // biome-ignore lint/correctness/useExhaustiveDependencies: activeKey 切换时必须重置用户手动关闭的子菜单。
  React.useEffect(() => {
    setManuallyClosedKeys(new Set());
  }, [activeKey]);

  const autoOpenKeys = React.useMemo(
    () => getAutoOpenKeys(groups, activeKey),
    [activeKey, groups],
  );
  const visibleAutoOpenKeys = React.useMemo(
    () => autoOpenKeys.filter(key => !manuallyClosedKeys.has(key)),
    [autoOpenKeys, manuallyClosedKeys],
  );
  const baseOpenKeys = openKeys ?? internalOpenKeys;
  const resolvedOpenKeys = React.useMemo(
    () =>
      controlled
        ? [...baseOpenKeys]
        : mergeOpenKeys(baseOpenKeys, visibleAutoOpenKeys),
    [baseOpenKeys, controlled, visibleAutoOpenKeys],
  );
  const motionOpenKeys = effectiveCollapsed
    ? EMPTY_OPEN_KEYS
    : resolvedOpenKeys;
  const disclosureMotion = useDisclosureMotion(motionOpenKeys);

  const handleOpenChange = React.useCallback(
    (key: string, nextOpen: boolean) => {
      const nextKeys = nextOpen
        ? mergeOpenKeys(baseOpenKeys, [key])
        : removeOpenKey(baseOpenKeys, key);

      if (!controlled) {
        setInternalOpenKeys(nextKeys);
        setManuallyClosedKeys(current => {
          const next = new Set(current);

          if (nextOpen) {
            next.delete(key);
          } else {
            next.add(key);
          }

          return next;
        });
      }

      onOpenKeysChange?.(nextKeys);
    },
    [baseOpenKeys, controlled, onOpenKeysChange],
  );

  const handleSelect = React.useCallback(
    (item: MenuSelectableItem) => {
      onSelect?.(item.key, item);
    },
    [onSelect],
  );

  const preventLinkDefault = onSelect != null;
  const widthClassName = effectiveCollapsed
    ? menuWidthClassName.collapsed
    : menuWidthClassName[variant];

  return (
    <TooltipProvider>
      <nav
        aria-label={props['aria-label'] ?? '导航菜单'}
        className={cn(menuRootClassName, widthClassName, className)}
        data-collapsed={effectiveCollapsed || undefined}
        data-slot="menu"
        data-variant={variant}
        {...props}
      >
        <div className={menuViewportClassName} data-slot="menu-viewport">
          {groups.map(group => (
            <MenuGroup
              activeKey={activeKey}
              collapsed={effectiveCollapsed}
              disclosureMotion={disclosureMotion}
              group={group}
              key={group.key}
              openKeys={resolvedOpenKeys}
              preventLinkDefault={preventLinkDefault}
              variant={variant}
              onOpenChange={handleOpenChange}
              onSelect={handleSelect}
            />
          ))}
        </div>
        {footer != null && !effectiveCollapsed && (
          <div className={menuFooterClassName} data-slot="menu-footer">
            {footer}
          </div>
        )}
      </nav>
    </TooltipProvider>
  );
}
