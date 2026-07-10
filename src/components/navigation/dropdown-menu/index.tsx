/* eslint-disable react-refresh/only-export-components -- 复合组件需要按 Radix slot 形式导出。 */
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import * as React from 'react';
import { DropdownMenuContent, DropdownMenuSubContent } from './content';
import { DropdownMenuOpenContext } from './context';
import {
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuRadioItem,
} from './item';
import { DropdownMenuLabel } from './label';
import { DropdownMenuSeparator } from './separator';
import { DropdownMenuShortcut } from './shortcut';
import { DropdownMenuSubTrigger } from './sub-trigger';

export type { DropdownMenuItemProps } from './types';

/* ------------------------------------------------------------------ */
/*  Radix 直通导出                                                      */
/* ------------------------------------------------------------------ */

export function DropdownMenu({
  defaultOpen = false,
  onOpenChange,
  open,
  ...props
}: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Root>) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isControlled = open != null;
  const mergedOpen = isControlled ? open : uncontrolledOpen;

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(nextOpen);
      }

      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange],
  );

  return (
    <DropdownMenuOpenContext.Provider value={mergedOpen}>
      <DropdownMenuPrimitive.Root
        open={mergedOpen}
        onOpenChange={handleOpenChange}
        {...props}
      />
    </DropdownMenuOpenContext.Provider>
  );
}
DropdownMenu.displayName = 'DropdownMenu';

export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
export const DropdownMenuGroup = DropdownMenuPrimitive.Group;
export const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
export const DropdownMenuSub = DropdownMenuPrimitive.Sub;
export const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

/* ------------------------------------------------------------------ */
/*  样式化组件 re-export                                                */
/* ------------------------------------------------------------------ */

export {
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
};

/* ------------------------------------------------------------------ */
/*  无前缀别名（供 import * as DropdownMenu 命名空间使用）               */
/* ------------------------------------------------------------------ */

export const Root = DropdownMenu;
export const Trigger = DropdownMenuTrigger;
export const Portal = DropdownMenuPortal;
export const Group = DropdownMenuGroup;
export const Sub = DropdownMenuSub;
export const RadioGroup = DropdownMenuRadioGroup;
export const CheckboxItem = DropdownMenuCheckboxItem;
export const RadioItem = DropdownMenuRadioItem;
export const Label = DropdownMenuLabel;
export const Separator = DropdownMenuSeparator;
export const Content = DropdownMenuContent;
export const Item = DropdownMenuItem;
export const SubTrigger = DropdownMenuSubTrigger;
export const SubContent = DropdownMenuSubContent;
