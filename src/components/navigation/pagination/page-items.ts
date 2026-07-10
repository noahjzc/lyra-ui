import type { PaginationPageItem } from './types';

export function getPageItems(
  currentPage: number,
  pageCount: number,
): PaginationPageItem[] {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  const items = new Set([1, pageCount, currentPage]);

  if (currentPage > 2) items.add(currentPage - 1);
  if (currentPage < pageCount - 1) items.add(currentPage + 1);
  if (currentPage <= 3) items.add(2).add(3);
  if (currentPage >= pageCount - 2) items.add(pageCount - 1).add(pageCount - 2);

  const sortedItems = Array.from(items).sort((a, b) => a - b);

  return sortedItems.flatMap((item, index) => {
    const previous = sortedItems[index - 1];

    if (previous != null && item - previous > 1) {
      return [`ellipsis-${previous}-${item}`, item] as const;
    }

    return [item] as const;
  });
}
