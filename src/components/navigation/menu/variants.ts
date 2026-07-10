export const menuRootClassName =
  'grid min-w-0 overflow-hidden rounded-lg border border-ui-border bg-ui-background text-ui-foreground';

export const menuWidthClassName = {
  collapsed: 'w-14',
  local: 'w-full max-w-60',
  side: 'w-[228px]',
};

export const menuViewportClassName =
  'grid min-h-0 content-start gap-2.5 overflow-y-auto p-2';

export const menuGroupClassName = 'grid min-w-0 content-start gap-1';

export const menuGroupTitleClassName =
  'flex min-h-7 items-center px-2 text-xs font-bold text-ui-muted-foreground';

export const menuListClassName = 'grid min-w-0 gap-1';

export const menuItemWrapperClassName = 'min-w-0';

export const menuItemWrapperWithSubmenuClassName = 'grid min-w-0 gap-1';

export const menuSubmenuPanelClassName = 'min-h-0 overflow-hidden';

export const menuFooterClassName =
  'flex h-10 items-center justify-between border-t border-ui-border bg-ui-muted/40 px-2 text-xs text-ui-muted-foreground';

export const menuIconClassName =
  'inline-flex size-[18px] shrink-0 items-center justify-center rounded-[5px] border border-ui-border bg-ui-muted text-[11px] font-bold text-ui-muted-foreground';

export const menuBadgeClassName =
  'inline-flex h-[18px] min-w-[22px] shrink-0 items-center justify-center rounded-full border border-(--ui-button-primary-border) bg-(--ui-button-ghost-background) px-1.5 text-[11px] font-bold text-(--ui-button-primary-background)';

export const menuArrowClassName =
  'size-4 shrink-0 text-ui-muted-foreground transition-ui-transform motion-reduce:transition-none';

export const menuSubListClassName = 'grid min-w-0 gap-0.5 pl-9';

export const collapsedMenuSubListClassName = 'grid min-w-0 gap-0.5';

export const menuSubDotClassName =
  'absolute left-[-12px] size-[5px] rounded-full bg-ui-border';

export const collapsedMenuListClassName = 'grid gap-2 p-2';

export const collapsedItemClassName =
  'relative inline-flex size-9 items-center justify-center rounded-[7px] border border-ui-border bg-ui-muted text-xs font-bold text-ui-muted-foreground outline-none transition-ui-state hover:bg-(--ui-button-ghost-hover-background) hover:text-(--ui-button-primary-background) focus-visible:ring-2 focus-visible:ring-(--ui-button-focus-ring) motion-reduce:transition-none';

export const collapsedBadgeClassName =
  'absolute -top-1 -right-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full border border-(--ui-button-primary-border) bg-(--ui-button-ghost-background) px-1 text-[10px] font-bold text-(--ui-button-primary-background)';

export const collapsedPopoverClassName =
  'grid w-44 gap-1 p-2 shadow-ui-elevation-4';

export const topMenuRootClassName =
  'flex h-[42px] min-w-0 items-center gap-1 rounded-lg border border-ui-border bg-ui-background px-2';

export const topMenuItemClassName =
  'relative inline-flex h-8 min-w-0 items-center rounded-md px-3 text-[13px] text-ui-foreground no-underline outline-none transition-ui-state hover:bg-(--ui-button-ghost-hover-background) hover:text-(--ui-button-primary-background) focus-visible:ring-2 focus-visible:ring-(--ui-button-focus-ring) motion-reduce:transition-none';
