import type * as React from 'react';
import type { DisclosureMotionState } from '../../../internal/disclosure-motion';

export interface MenuGroup {
  key: string;
  label: React.ReactNode;
  items: MenuItem[];
}

export interface MenuSubItem {
  key: string;
  label: React.ReactNode;
  /** label 不是纯文本时，用于折叠态可访问名称。 */
  textValue?: string;
  icon?: React.ReactNode;
  href?: string;
  badge?: React.ReactNode;
  disabled?: boolean;
  disabledReason?: React.ReactNode;
  /** 二级菜单项是叶子节点，不支持继续嵌套。 */
  children?: never;
  onSelect?: (key: string) => void;
}

export interface MenuItem {
  key: string;
  label: React.ReactNode;
  /** label 不是纯文本时，用于折叠态可访问名称。 */
  textValue?: string;
  icon?: React.ReactNode;
  href?: string;
  badge?: React.ReactNode;
  disabled?: boolean;
  disabledReason?: React.ReactNode;
  /** 仅一级菜单项支持 children 形成二级菜单，二级项不得继续嵌套。 */
  children?: MenuSubItem[];
  onSelect?: (key: string) => void;
}

export type MenuSelectableItem = MenuItem | MenuSubItem;

export interface MenuProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'children' | 'onSelect'> {
  activeKey?: string;
  collapsed?: boolean;
  defaultOpenKeys?: readonly string[];
  footer?: React.ReactNode;
  groups: MenuGroup[];
  openKeys?: readonly string[];
  variant?: 'side' | 'local';
  onOpenKeysChange?: (openKeys: string[]) => void;
  onSelect?: (key: string, item: MenuSelectableItem) => void;
}

export interface MenuItemRenderProps {
  activeKey?: string;
  active?: boolean;
  activePath?: boolean;
  collapsed?: boolean;
  depth: 1 | 2;
  disclosureMotion?: DisclosureMotionState;
  item: MenuSelectableItem;
  open?: boolean;
  popoverLabel?: string;
  preventLinkDefault: boolean;
  variant: NonNullable<MenuProps['variant']>;
  onOpenChange?: (key: string, open: boolean) => void;
  onSelect: (item: MenuSelectableItem) => void;
}

export interface MenuSubmenuProps {
  activeKey?: string;
  collapsed?: boolean;
  id?: string;
  items: MenuSubItem[];
  labelledBy?: string;
  parentKey: string;
  parentLabel: string;
  preventLinkDefault: boolean;
  variant: NonNullable<MenuProps['variant']>;
  onSelect: (item: MenuSelectableItem) => void;
}

export interface MenuGroupProps {
  activeKey?: string;
  collapsed?: boolean;
  disclosureMotion?: DisclosureMotionState;
  group: MenuGroup;
  openKeys: string[];
  preventLinkDefault: boolean;
  variant: NonNullable<MenuProps['variant']>;
  onOpenChange: (key: string, open: boolean) => void;
  onSelect: (item: MenuSelectableItem) => void;
}

export interface TopMenuItem {
  key: string;
  label: React.ReactNode;
  href?: string;
  disabled?: boolean;
  onSelect?: (key: string) => void;
}

export interface TopMenuProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'children' | 'onSelect'> {
  activeKey?: string;
  items: TopMenuItem[];
  onSelect?: (key: string, item: TopMenuItem) => void;
}
