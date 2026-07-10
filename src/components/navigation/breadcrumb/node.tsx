import { cn } from '../../../internal/cn';
import type { BreadcrumbItem, BreadcrumbProps } from './types';

/**
 * 面包屑路径节点。
 * - 当前节点（最后一个）：bold，不可点击，max-w-[320px]
 * - 前级节点：链接弱化色，hover 增强，max-w-[180px]
 */
export function BreadcrumbNode({
  compact,
  isCurrent,
  item,
  renderItem,
}: {
  compact: boolean;
  isCurrent: boolean;
  item: BreadcrumbItem;
  renderItem?: BreadcrumbProps['renderItem'];
}) {
  const content = renderItem?.(item, -1) ?? (
    <>
      {item.icon != null && (
        <span aria-hidden="true" className="inline-flex shrink-0">
          {item.icon}
        </span>
      )}
      <span className="min-w-0 truncate">{item.label}</span>
    </>
  );

  if (isCurrent) {
    return (
      <span
        aria-current="page"
        className={cn(
          'inline-flex min-w-0 max-w-[320px] items-center gap-[5px] font-bold text-ui-foreground',
          compact ? 'h-5 text-xs' : 'h-6 text-[13px]',
        )}
      >
        {content}
      </span>
    );
  }

  const linkClassName = cn(
    'inline-flex min-w-0 max-w-[180px] items-center gap-[5px] rounded-[5px] text-ui-muted-foreground outline-none transition-ui-state hover:bg-(--ui-button-ghost-background) hover:text-(--ui-button-primary-background) focus-visible:ring-2 focus-visible:ring-(--ui-button-focus-ring)',
    compact ? 'h-5 text-xs' : 'h-6 text-[13px]',
  );

  if (item.href != null) {
    return (
      <a className={linkClassName} href={item.href}>
        {content}
      </a>
    );
  }

  if (item.onClick != null) {
    return (
      <button className={linkClassName} onClick={item.onClick} type="button">
        {content}
      </button>
    );
  }

  // 无 href 无 onClick 视为不可导航节点
  return (
    <span
      className={cn(
        'inline-flex min-w-0 max-w-[180px] items-center gap-[5px] text-ui-muted-foreground',
        compact ? 'h-5 text-xs' : 'h-6 text-[13px]',
      )}
    >
      {content}
    </span>
  );
}
