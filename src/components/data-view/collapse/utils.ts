import type { CollapseProps, CollapseType, CollapseValue } from './types';

export function normalizeValue(
  value: CollapseValue | undefined,
  type: CollapseType,
) {
  if (Array.isArray(value)) {
    return type === 'single' ? value.slice(0, 1) : value;
  }

  if (value == null || value === '') return [];

  return [value];
}

export function serializeValue(value: string[], type: CollapseType) {
  return type === 'single' ? (value[0] ?? '') : value;
}

export function getItemDomId(
  prefix: string,
  itemKey: string,
  itemIndex: number,
  slot: string,
) {
  return `${prefix}-${slot}-${itemIndex}-${itemKey.replace(/[^a-zA-Z0-9_-]/g, '-')}`;
}

export function getNextValue({
  collapsible,
  itemKey,
  openKeys,
  type,
}: {
  collapsible: NonNullable<CollapseProps['collapsible']>;
  itemKey: string;
  openKeys: string[];
  type: CollapseType;
}) {
  const isOpen = openKeys.includes(itemKey);

  if (type === 'single') {
    return isOpen && collapsible ? [] : [itemKey];
  }

  if (isOpen) {
    return collapsible
      ? openKeys.filter(openKey => openKey !== itemKey)
      : openKeys;
  }

  return [...openKeys, itemKey];
}
