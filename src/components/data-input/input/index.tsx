import { InputBase } from './input';
import { InputNumber } from './input-number';
import { Textarea } from './textarea';

export { InputNumber } from './input-number';
export { Textarea } from './textarea';
export type {
  InputCopyableConfig,
  InputNumberProps,
  InputNumberValue,
  InputProps,
  TextareaAutoSizeConfig,
  TextareaProps,
} from './types';

export const Input = Object.assign(InputBase, {
  Number: InputNumber,
  Textarea,
});
