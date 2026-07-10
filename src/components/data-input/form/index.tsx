/* eslint-disable react-refresh/only-export-components -- Form 需要保留 Form.Item 等复合组件 API。 */
import * as React from 'react';
import { cn } from '../../../internal/cn';
import { FormContext } from './context';
import {
  FormControl,
  FormDescription,
  FormExtra,
  FormLabel,
  FormMessage,
} from './form-field';
import { FormFooter } from './form-footer';
import { FormItem } from './form-item';
import { FormGrid, FormSection } from './form-layout';
import { FormReadonlyValue } from './form-readonly-value';
import type { FormContextValue, FormProps } from './types';

export {
  FormContext,
  FormItemContext,
  useFormContext,
  useFormItemContext,
} from './context';
export {
  FormControl,
  FormDescription,
  FormExtra,
  FormLabel,
  FormMessage,
} from './form-field';
export { FormFooter } from './form-footer';
export { FormItem } from './form-item';
export { FormGrid, FormSection } from './form-layout';
export { FormReadonlyValue } from './form-readonly-value';

export type {
  FormColumnConfig,
  FormContextValue,
  FormControlProps,
  FormDescriptionProps,
  FormExtraProps,
  FormFooterProps,
  FormGridProps,
  FormItemContextValue,
  FormItemProps,
  FormLabelProps,
  FormLayout,
  FormMessageProps,
  FormProps,
  FormReadonlyValueProps,
  FormRequiredMark,
  FormSectionProps,
  FormSize,
  FormValidateStatus,
} from './types';

const FormBase = React.forwardRef<HTMLFormElement, FormProps>(
  (
    {
      children,
      className,
      disabled = false,
      hasFeedback = false,
      labelCol = { span: 6 },
      labelWrap = false,
      layout = 'vertical',
      readOnly,
      readonly = false,
      requiredMark = true,
      size = 'middle',
      wrapperCol = { span: 18 },
      ...props
    },
    ref,
  ) => {
    const effectiveReadOnly = readOnly ?? readonly;
    const context = React.useMemo<FormContextValue>(
      () => ({
        disabled,
        hasFeedback,
        labelCol,
        labelWrap,
        layout,
        readOnly: effectiveReadOnly,
        readonly: effectiveReadOnly,
        requiredMark,
        size,
        wrapperCol,
      }),
      [
        disabled,
        hasFeedback,
        labelCol,
        labelWrap,
        layout,
        effectiveReadOnly,
        requiredMark,
        size,
        wrapperCol,
      ],
    );

    return (
      <FormContext.Provider value={context}>
        <form
          aria-disabled={disabled ? true : undefined}
          className={cn(
            'min-w-0 text-ui-foreground',
            layout === 'inline'
              ? 'flex flex-wrap items-start gap-x-3 gap-y-2'
              : 'grid gap-3',
            className,
          )}
          data-disabled={disabled ? true : undefined}
          data-layout={layout}
          data-readonly={effectiveReadOnly ? true : undefined}
          data-size={size}
          ref={ref}
          {...props}
        >
          {children}
        </form>
      </FormContext.Provider>
    );
  },
);

FormBase.displayName = 'Form';

export const Form = Object.assign(FormBase, {
  Control: FormControl,
  Description: FormDescription,
  Extra: FormExtra,
  Footer: FormFooter,
  Grid: FormGrid,
  Item: FormItem,
  Label: FormLabel,
  Message: FormMessage,
  ReadonlyValue: FormReadonlyValue,
  Section: FormSection,
});
