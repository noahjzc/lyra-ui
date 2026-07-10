import * as React from 'react';
import { cn } from '../../../internal/cn';
import {
  type DisclosureMotionState,
  disclosurePanelContentMotionClassName,
  disclosurePanelMotionClassName,
} from '../../../internal/disclosure-motion';
import { MenuSubmenu } from './menu-submenu';
import type { MenuItem, MenuSelectableItem, MenuSubItem } from './types';
import {
  menuItemWrapperWithSubmenuClassName,
  menuSubmenuPanelClassName,
} from './variants';

type MenuItemWithChildren = MenuItem & { children: MenuSubItem[] };

export function MenuSubmenuItem({
  activeKey,
  className,
  content,
  contentId,
  disclosureMotion,
  disclosureState,
  item,
  onSelect,
  onToggle,
  preventLinkDefault,
  readableLabel,
  variant,
}: {
  activeKey?: string;
  className: string;
  content: React.ReactNode;
  contentId: string;
  disclosureMotion?: DisclosureMotionState;
  disclosureState: { open: boolean; present: boolean; visible: boolean };
  item: MenuItemWithChildren;
  preventLinkDefault: boolean;
  readableLabel: string;
  variant: 'local' | 'side';
  onSelect: (item: MenuSelectableItem) => void;
  onToggle: () => void;
}) {
  const submenuContentRef = React.useRef<HTMLDivElement>(null);
  const [submenuHeight, setSubmenuHeight] = React.useState(0);
  const submenuActiveKey = item.children.find(
    child => child.key === activeKey,
  )?.key;

  // biome-ignore lint/correctness/useExhaustiveDependencies: 菜单项变更后必须重新测量子菜单高度。
  React.useLayoutEffect(() => {
    const contentNode = submenuContentRef.current;

    if (contentNode == null) {
      return;
    }

    setSubmenuHeight(contentNode.scrollHeight);
  }, [item]);

  return (
    <div
      className={menuItemWrapperWithSubmenuClassName}
      data-depth={1}
      data-slot="menu-item-wrapper"
    >
      <button
        aria-controls={contentId}
        aria-expanded={disclosureState.open}
        aria-label={readableLabel}
        className={className}
        data-slot="menu-item"
        id={`${contentId}-trigger`}
        onClick={onToggle}
        type="button"
      >
        {content}
      </button>
      <div
        className={cn(
          disclosurePanelMotionClassName,
          disclosureState.open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
        data-slot="menu-submenu-motion"
        onTransitionEnd={event =>
          disclosureMotion?.handleDisclosureTransitionEnd(event, item.key)
        }
        style={{
          height: disclosureState.open ? submenuHeight : 0,
          transitionProperty: 'height, grid-template-rows',
        }}
      >
        <section
          aria-hidden={disclosureState.open ? undefined : true}
          className={menuSubmenuPanelClassName}
          data-slot="menu-submenu-panel"
          inert={disclosureState.open ? undefined : true}
        >
          <div
            className={
              disclosureState.visible
                ? disclosurePanelContentMotionClassName.open
                : disclosurePanelContentMotionClassName.closed
            }
            data-slot="menu-submenu-content"
            ref={submenuContentRef}
          >
            <MenuSubmenu
              activeKey={submenuActiveKey}
              id={contentId}
              items={item.children}
              labelledBy={`${contentId}-trigger`}
              parentKey={item.key}
              parentLabel={readableLabel}
              preventLinkDefault={preventLinkDefault}
              variant={variant}
              onSelect={onSelect}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
