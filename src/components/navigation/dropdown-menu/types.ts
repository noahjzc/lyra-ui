import type * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import type * as React from 'react';

export interface DropdownMenuItemProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> {
  /** 左侧图标（16px），匹配设计稿 item-icon 样式 */
  icon?: React.ReactNode;
  /** 右侧快捷键文案 */
  shortcut?: React.ReactNode;
  /** 危险操作变体 */
  variant?: 'default' | 'destructive';
}
