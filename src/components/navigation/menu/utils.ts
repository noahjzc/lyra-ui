import type { MenuGroup, MenuItem, MenuSelectableItem } from './types';

export const EMPTY_OPEN_KEYS: readonly string[] = Object.freeze([]);

export function getMenuItemText(item: MenuSelectableItem): string {
  const textValue = item.textValue?.trim();

  if (textValue != null && textValue.length > 0) {
    return textValue;
  }

  if (typeof item.label === 'string' || typeof item.label === 'number') {
    return String(item.label);
  }

  return '';
}

export function isItemDisabled(item: MenuSelectableItem): boolean {
  return item.disabled === true;
}

export function hasActiveItem(item: MenuItem, activeKey?: string): boolean {
  if (activeKey == null) {
    return false;
  }

  if (item.key === activeKey) {
    return true;
  }

  return item.children?.some(child => child.key === activeKey) ?? false;
}

export function getAutoOpenKeys(
  groups: MenuGroup[],
  activeKey?: string,
): string[] {
  if (activeKey == null) {
    return [];
  }

  const keys: string[] = [];

  for (const group of groups) {
    for (const item of group.items) {
      if (item.children?.some(child => child.key === activeKey)) {
        keys.push(item.key);
      }
    }
  }

  return keys;
}

export function mergeOpenKeys(
  currentKeys: readonly string[],
  nextKeys: readonly string[],
): string[] {
  return Array.from(new Set([...currentKeys, ...nextKeys]));
}

export function removeOpenKey(
  currentKeys: readonly string[],
  key: string,
): string[] {
  return currentKeys.filter(openKey => openKey !== key);
}
