import type * as React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../data-view/tooltip';
import { buildMenuItemLabel } from './menu-item-content';
import type { MenuSelectableItem } from './types';
import { menuItemWrapperClassName } from './variants';

export function MenuDisabledItem({
  className,
  compact,
  content,
  depth,
  item,
  leafActive,
}: {
  className: string;
  compact: boolean;
  content: React.ReactNode;
  depth: 1 | 2;
  item: MenuSelectableItem;
  leafActive: boolean;
}) {
  const disabledNode = (
    <span
      aria-current={leafActive ? 'page' : undefined}
      aria-disabled="true"
      className={className}
      data-slot="menu-item"
    >
      {compact && <span className="sr-only">{buildMenuItemLabel(item)}</span>}
      {content}
    </span>
  );

  return (
    <div
      className={menuItemWrapperClassName}
      data-depth={depth}
      data-slot="menu-item-wrapper"
    >
      {compact ? (
        <Tooltip>
          <TooltipTrigger asChild>{disabledNode}</TooltipTrigger>
          <TooltipContent side="right">
            {buildMenuItemLabel(item)}
          </TooltipContent>
        </Tooltip>
      ) : (
        disabledNode
      )}
    </div>
  );
}
