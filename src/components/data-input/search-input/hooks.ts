import * as React from 'react';

export function useControllableSearchValue({
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
