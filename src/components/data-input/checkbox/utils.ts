import type { CheckboxCheckedState } from './types';

export function resolveNextGroupValue({
  checked,
  currentValue,
  optionValue,
}: {
  checked: CheckboxCheckedState;
  currentValue: string[];
  optionValue: string;
}) {
  if (checked === true) {
    return currentValue.includes(optionValue)
      ? currentValue
      : [...currentValue, optionValue];
  }

  return currentValue.filter(value => value !== optionValue);
}
