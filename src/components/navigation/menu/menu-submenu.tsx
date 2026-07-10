import { MenuItem } from './menu-item';
import type { MenuSubmenuProps } from './types';
import {
  collapsedMenuSubListClassName,
  menuSubListClassName,
} from './variants';

export function MenuSubmenu({
  activeKey,
  collapsed = false,
  id,
  items,
  labelledBy,
  parentKey,
  parentLabel,
  preventLinkDefault,
  variant,
  onSelect,
}: MenuSubmenuProps) {
  return (
    <ul
      aria-label={labelledBy == null ? parentLabel : undefined}
      aria-labelledby={labelledBy}
      className={
        collapsed ? collapsedMenuSubListClassName : menuSubListClassName
      }
      id={id}
      data-parent-key={parentKey}
      data-slot="menu-submenu"
    >
      {items.map(item => (
        <li key={item.key}>
          <MenuItem
            active={item.key === activeKey}
            collapsed={collapsed}
            depth={2}
            item={item}
            preventLinkDefault={preventLinkDefault}
            variant={variant}
            onSelect={onSelect}
          />
        </li>
      ))}
    </ul>
  );
}
