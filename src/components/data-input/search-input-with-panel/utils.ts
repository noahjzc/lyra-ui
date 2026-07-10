import * as React from 'react';
import type {
  SearchSuggestionGroup,
  SearchSuggestionOption,
} from '../search-suggestion-panel/types';

export function flattenSearchSuggestionGroups<TData>(
  groups: SearchSuggestionGroup<TData>[] = [],
) {
  return groups.flatMap(group => group.options);
}

export function useControllableOpen({
  defaultOpen = false,
  onOpenChange,
  open,
}: {
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
}) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const mergedOpen = open ?? internalOpen;

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (open == null) {
        setInternalOpen(nextOpen);
      }

      onOpenChange?.(nextOpen);
    },
    [onOpenChange, open],
  );

  return [mergedOpen, setOpen] as const;
}

export function useControllableInputValue({
  defaultValue = '',
  onValueChange,
  value,
}: {
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  value?: string;
}) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const mergedValue = value ?? internalValue;

  const setValue = React.useCallback(
    (nextValue: string) => {
      if (value == null) {
        setInternalValue(nextValue);
      }

      onValueChange?.(nextValue);
    },
    [onValueChange, value],
  );

  return [mergedValue, setValue] as const;
}

export function getNextActiveValue<TData>({
  activeValue,
  direction,
  options,
}: {
  activeValue?: string;
  direction: 1 | -1;
  options: SearchSuggestionOption<TData>[];
}) {
  const enabledOptions = options.filter(option => !option.disabled);

  if (enabledOptions.length === 0) return undefined;

  const currentIndex = enabledOptions.findIndex(
    option => option.value === activeValue,
  );
  const nextIndex =
    currentIndex < 0
      ? direction > 0
        ? 0
        : enabledOptions.length - 1
      : (currentIndex + direction + enabledOptions.length) %
        enabledOptions.length;

  return enabledOptions[nextIndex]?.value;
}
