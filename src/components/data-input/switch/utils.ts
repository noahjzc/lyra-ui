import type { SwitchContentVariant, SwitchProps } from './types';

export function getContentVariant({
  checkedIcon,
  checkedText,
  uncheckedIcon,
  uncheckedText,
}: Pick<
  SwitchProps,
  'checkedIcon' | 'checkedText' | 'uncheckedIcon' | 'uncheckedText'
>): SwitchContentVariant {
  if (checkedText != null || uncheckedText != null) return 'text';
  if (checkedIcon != null || uncheckedIcon != null) return 'icon';

  return 'none';
}
