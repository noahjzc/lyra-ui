import * as React from 'react';
import type { SelectOptionValue } from './types';

export function useControllableValue({
  controlled,
  defaultValue,
  onValueChange,
  value,
}: {
  controlled?: boolean;
  defaultValue?: SelectOptionValue;
  onValueChange?: (value: SelectOptionValue | undefined) => void;
  value?: SelectOptionValue;
}) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const isControlled = controlled ?? value !== undefined;
  const mergedValue = isControlled ? value : internalValue;

  const setValue = React.useCallback(
    (nextValue: SelectOptionValue | undefined) => {
      if (!isControlled) {
        setInternalValue(nextValue);
      }

      onValueChange?.(nextValue);
    },
    [isControlled, onValueChange],
  );

  return [mergedValue, setValue] as const;
}

export function useControllableValues({
  controlled,
  defaultValue = [],
  onValueChange,
  value,
}: {
  controlled?: boolean;
  defaultValue?: SelectOptionValue[];
  onValueChange?: (value: SelectOptionValue[]) => void;
  value?: SelectOptionValue[];
}) {
  const [internalValue, setInternalValue] =
    React.useState<SelectOptionValue[]>(defaultValue);
  const isControlled = controlled ?? value !== undefined;
  const mergedValue = isControlled ? (value ?? []) : internalValue;

  const setValue = React.useCallback(
    (nextValue: SelectOptionValue[]) => {
      if (!isControlled) {
        setInternalValue(nextValue);
      }

      onValueChange?.(nextValue);
    },
    [isControlled, onValueChange],
  );

  return [mergedValue, setValue] as const;
}
