import type * as React from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../data-view/popover';
import { MenuSubmenu } from './menu-submenu';
import type { MenuItem, MenuSelectableItem, MenuSubItem } from './types';
import {
  collapsedPopoverClassName,
  menuItemWrapperClassName,
} from './variants';

type MenuItemWithChildren = MenuItem & { children: MenuSubItem[] };

export function MenuCollapsedSubmenuItem({
  activeKey,
  className,
  content,
  contentId,
  item,
  onOpenChange,
  onSelect,
  open,
  preventLinkDefault,
  readableLabel,
  variant,
}: {
  activeKey?: string;
  className: string;
  content: React.ReactNode;
  contentId: string;
  item: MenuItemWithChildren;
  open: boolean;
  preventLinkDefault: boolean;
  readableLabel: string;
  variant: 'local' | 'side';
  onOpenChange: (open: boolean) => void;
  onSelect: (item: MenuSelectableItem) => void;
}) {
  const submenuActiveKey = item.children.find(
    child => child.key === activeKey,
  )?.key;

  const handleSelect = (selectedItem: MenuSelectableItem) => {
    onSelect(selectedItem);
    onOpenChange(false);
  };

  return (
    <div
      className={menuItemWrapperClassName}
      data-depth={1}
      data-slot="menu-item-wrapper"
    >
      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <button
            aria-controls={contentId}
            aria-expanded={open}
            aria-label={readableLabel}
            className={className}
            data-slot="menu-item"
            type="button"
          >
            {content}
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          aria-label={`${readableLabel}子菜单`}
          className={collapsedPopoverClassName}
          role="dialog"
          showArrow={false}
          side="right"
        >
          <MenuSubmenu
            activeKey={submenuActiveKey}
            collapsed
            id={contentId}
            items={item.children}
            parentKey={item.key}
            parentLabel={readableLabel}
            preventLinkDefault={preventLinkDefault}
            variant={variant}
            onSelect={handleSelect}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
