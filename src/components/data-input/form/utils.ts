import type { FormColumnConfig } from './types';

export function columnWidth(config?: FormColumnConfig) {
  if (!config) return undefined;
  if (config.width != null) {
    return typeof config.width === 'number'
      ? `${config.width}px`
      : config.width;
  }
  if (config.span != null) {
    return `${(Math.max(0, Math.min(24, config.span)) / 24) * 100}%`;
  }

  return undefined;
}

export function getFieldId(name?: string) {
  return name
    ? `form-field-${name.replace(/[^a-zA-Z0-9_-]+/g, '-')}`
    : undefined;
}
