import type { MouseEventHandler, ReactNode } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../data-view/tooltip';
import { menuItemWrapperClassName } from './variants';

export function MenuLeafItem({
  className,
  compact,
  content,
  depth,
  href,
  leafActive,
  onLinkClick,
  onSelect,
  readableLabel,
}: {
  className: string;
  compact: boolean;
  content: ReactNode;
  depth: 1 | 2;
  href?: string;
  leafActive: boolean;
  onLinkClick: MouseEventHandler<HTMLAnchorElement>;
  onSelect: () => void;
  readableLabel: string;
}) {
  const leafNode =
    href != null ? (
      <a
        aria-current={leafActive ? 'page' : undefined}
        aria-label={compact ? readableLabel : undefined}
        className={className}
        data-slot="menu-item"
        href={href}
        onClick={onLinkClick}
      >
        {content}
      </a>
    ) : (
      <button
        aria-current={leafActive ? 'page' : undefined}
        aria-label={compact ? readableLabel : undefined}
        className={className}
        data-slot="menu-item"
        onClick={onSelect}
        type="button"
      >
        {content}
      </button>
    );

  return (
    <div
      className={menuItemWrapperClassName}
      data-depth={depth}
      data-slot="menu-item-wrapper"
    >
      {compact ? (
        <Tooltip>
          <TooltipTrigger asChild>{leafNode}</TooltipTrigger>
          <TooltipContent side="right">{readableLabel}</TooltipContent>
        </Tooltip>
      ) : (
        leafNode
      )}
    </div>
  );
}
