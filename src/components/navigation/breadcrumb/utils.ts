import type { BreadcrumbItem } from './types';

/**
 * 计算可见节点与隐藏节点。
 * 超过 maxItems 时，保留首尾 edgeCount 个，其余折叠。
 */
export function resolveItems(
  items: BreadcrumbItem[],
  maxItems: number,
): {
  hiddenItems: BreadcrumbItem[];
  visibleItems: BreadcrumbItem[];
  /** 折叠按钮在 visibleItems 中的插入位置索引 */
  insertIndex: number;
} {
  if (items.length <= maxItems) {
    return { hiddenItems: [], visibleItems: items, insertIndex: -1 };
  }

  const edgeCount = Math.max(1, Math.floor((maxItems - 1) / 2));
  const startItems = items.slice(0, edgeCount);
  const endItems = items.slice(items.length - edgeCount);

  return {
    hiddenItems: items.slice(edgeCount, items.length - edgeCount),
    visibleItems: [...startItems, ...endItems],
    insertIndex: startItems.length,
  };
}
