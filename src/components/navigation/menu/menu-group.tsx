import { MenuItem } from './menu-item';
import type { MenuGroupProps } from './types';
import { hasActiveItem } from './utils';
import {
  menuGroupClassName,
  menuGroupTitleClassName,
  menuListClassName,
} from './variants';

export function MenuGroup({
  activeKey,
  collapsed = false,
  disclosureMotion,
  group,
  onOpenChange,
  onSelect,
  openKeys,
  preventLinkDefault,
  variant,
}: MenuGroupProps) {
  return (
    <section className={menuGroupClassName} data-slot="menu-group">
      {!collapsed && (
        <div className={menuGroupTitleClassName} data-slot="menu-group-title">
          {group.label}
        </div>
      )}
      <div className={menuListClassName} data-slot="menu-group-list">
        {group.items.map(item => {
          const open = openKeys.includes(item.key);

          return (
            <MenuItem
              active={item.key === activeKey}
              activeKey={activeKey}
              activePath={hasActiveItem(item, activeKey)}
              collapsed={collapsed}
              depth={1}
              disclosureMotion={disclosureMotion}
              item={item}
              key={item.key}
              open={open}
              preventLinkDefault={preventLinkDefault}
              variant={variant}
              onOpenChange={onOpenChange}
              onSelect={onSelect}
            />
          );
        })}
      </div>
    </section>
  );
}
