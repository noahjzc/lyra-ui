import type { SelectOption, SelectOptionGroup } from './types';

export function flattenOptions({
  groups,
  options,
}: {
  groups?: SelectOptionGroup[];
  options?: SelectOption[];
}) {
  if (groups != null) {
    return groups.flatMap(group => group.options);
  }

  return options ?? [];
}

export function getOptionText(option: SelectOption) {
  if (typeof option.label === 'string') return option.label;
  if (typeof option.description === 'string') return option.description;

  return option.value;
}

export function filterOptions(options: SelectOption[], searchValue: string) {
  const keyword = searchValue.trim().toLowerCase();

  if (!keyword) return options;

  return options.filter(option =>
    getOptionText(option).toLowerCase().includes(keyword),
  );
}
