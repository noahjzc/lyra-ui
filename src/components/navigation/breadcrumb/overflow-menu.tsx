import * as React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../../internal/cn';
import { useOverlayZIndex, Z_BASE } from '../../../overlay/z-stack';
import type { BreadcrumbItem } from './types';

/**
 * 折叠节点溢出菜单。
 * 用 createPortal 挂载到 body，click-outside / Escape 关闭。
 * 浮层位置通过 useLayoutEffect 捕获 trigger 坐标，避免 render 期间读取 ref。
 */
export function OverflowMenu({
  compact,
  items,
}: {
  compact: boolean;
  items: BreadcrumbItem[];
}) {
  const [open, setOpen] = React.useState(false);
  const [position, setPosition] = React.useState<{
    left: number;
    top: number;
  } | null>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const [zIndex, layerRef] = useOverlayZIndex<HTMLDivElement>(
    Z_BASE.popover,
    undefined,
    open,
  );
  const setMenuRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      menuRef.current = node;
      layerRef(node);
    },
    [layerRef],
  );

  // 打开时同步 trigger 坐标，关闭时清空
  React.useLayoutEffect(() => {
    if (!open || triggerRef.current == null) {
      setPosition(null);

      return;
    }

    const rect = triggerRef.current.getBoundingClientRect();

    setPosition({ left: rect.left, top: rect.bottom + 4 });
  }, [open]);

  // click outside / Escape 关闭
  React.useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current != null &&
        !menuRef.current.contains(event.target as Node) &&
        triggerRef.current != null &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const triggerClassName = cn(
    'inline-flex h-6 items-center rounded-[5px] px-px text-ui-muted-foreground outline-none transition-ui-state hover:bg-(--ui-button-ghost-background) hover:text-(--ui-button-primary-background) focus-visible:ring-2 focus-visible:ring-(--ui-button-focus-ring)',
    compact ? 'text-xs' : 'text-[13px]',
  );

  return (
    <>
      <button
        ref={triggerRef}
        aria-label="展开中间路径"
        className={triggerClassName}
        onClick={() => setOpen(prev => !prev)}
        type="button"
      >
        …
      </button>
      {open &&
        position != null &&
        createPortal(
          <div
            ref={setMenuRef}
            className="grid gap-1 rounded-lg border border-ui-border bg-ui-background p-1.5 shadow-ui-elevation-2"
            role="menu"
            style={{
              left: position.left,
              position: 'fixed',
              top: position.top,
              width: 188,
              zIndex,
            }}
          >
            {items.map(item => {
              const itemContent = (
                <>
                  {item.icon != null && (
                    <span aria-hidden="true" className="inline-flex shrink-0">
                      {item.icon}
                    </span>
                  )}
                  <span className="min-w-0 truncate">{item.label}</span>
                </>
              );

              const itemClassName =
                'flex min-h-[30px] items-center gap-[5px] rounded-md px-2 text-[13px] text-ui-foreground no-underline outline-none transition-ui-state hover:bg-(--ui-button-ghost-background) hover:font-bold hover:text-(--ui-button-primary-background)';

              if (item.href != null) {
                return (
                  <a
                    className={itemClassName}
                    href={item.href}
                    key={item.key ?? String(item.label)}
                    onClick={() => {
                      item.onClick?.();
                      setOpen(false);
                    }}
                    role="menuitem"
                  >
                    {itemContent}
                  </a>
                );
              }

              return (
                <button
                  className={itemClassName}
                  key={item.key ?? String(item.label)}
                  onClick={() => {
                    item.onClick?.();
                    setOpen(false);
                  }}
                  role="menuitem"
                  type="button"
                >
                  {itemContent}
                </button>
              );
            })}
          </div>,
          document.body,
        )}
    </>
  );
}
