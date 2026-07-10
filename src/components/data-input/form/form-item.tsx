import * as React from 'react';
import { cn } from '../../../internal/cn';
import { FormItemContext, useFormContext } from './context';
import {
  FormDescription,
  FormExtra,
  FormLabel,
  FormMessage,
} from './form-field';
import type { FormItemContextValue, FormItemProps } from './types';
import { columnWidth, getFieldId } from './utils';
import { itemSpanClassName, statusIconMap } from './variants';

export const FormItem = React.forwardRef<HTMLDivElement, FormItemProps>(
  (
    {
      children,
      className,
      controlId,
      error,
      extra,
      hasFeedback,
      help,
      label,
      labelCol,
      name,
      optional = false,
      required = false,
      span = 1,
      validateStatus,
      wrapperCol,
      style,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const form = useFormContext();
    const fieldId = controlId ?? getFieldId(name) ?? generatedId;
    const descriptionId =
      help != null && error == null ? `${fieldId}-description` : undefined;
    const messageId = error != null ? `${fieldId}-message` : undefined;
    const extraId = extra != null ? `${fieldId}-extra` : undefined;
    const effectiveLabelCol = labelCol ?? form.labelCol;
    const effectiveWrapperCol = wrapperCol ?? form.wrapperCol;
    const labelWidth = columnWidth(effectiveLabelCol) ?? '25%';
    const wrapperWidth = columnWidth(effectiveWrapperCol);
    const isError = validateStatus === 'error' || error != null;
    const status = validateStatus ?? (isError ? 'error' : undefined);
    const showFeedback = (hasFeedback ?? form.hasFeedback) && status != null;
    const context = React.useMemo<FormItemContextValue>(
      () => ({
        descriptionId:
          [descriptionId, extraId].filter(Boolean).join(' ') || undefined,
        disabled: form.disabled,
        error: isError,
        fieldId,
        messageId,
        readOnly: form.readOnly,
        readonly: form.readOnly,
        validateStatus: status,
      }),
      [
        descriptionId,
        extraId,
        fieldId,
        form.disabled,
        form.readOnly,
        isError,
        messageId,
        status,
      ],
    );

    return (
      <FormItemContext.Provider value={context}>
        <div
          className={cn(
            'min-w-0',
            form.layout === 'horizontal' &&
              'grid items-start gap-x-3 gap-y-1 [grid-template-columns:var(--ui-form-label-width)_minmax(0,1fr)] max-[720px]:grid-cols-1',
            form.layout === 'horizontal' &&
              showFeedback &&
              '[grid-template-columns:var(--ui-form-label-width)_minmax(0,1fr)_16px]',
            form.layout === 'vertical' && 'grid gap-1.5',
            form.layout === 'inline' &&
              'inline-grid min-w-[180px] gap-1.5 align-top',
            itemSpanClassName[span],
            className,
          )}
          data-disabled={form.disabled ? true : undefined}
          data-layout={form.layout}
          data-readonly={form.readOnly ? true : undefined}
          data-slot="form-item"
          data-status={status}
          ref={ref}
          style={
            {
              '--ui-form-label-width': labelWidth,
              '--ui-form-wrapper-width': wrapperWidth,
              ...style,
            } as React.CSSProperties
          }
          {...props}
        >
          {label != null && (
            <FormLabel
              optional={optional}
              required={required}
              data-label-wrap={form.labelWrap ? true : undefined}
            >
              {label}
            </FormLabel>
          )}
          <div
            className="grid min-w-0 gap-1"
            data-slot="form-field-body"
            style={
              wrapperWidth
                ? ({
                    maxWidth: 'var(--ui-form-wrapper-width)',
                  } as React.CSSProperties)
                : undefined
            }
          >
            {children}
            {/* 稳定 message slot：help/warning/inline error/async message 共享同一槽位，
                预留高度避免校验出现时行高跳动与相邻列错位（spec: Form Message Slot / Message Slot Stability） */}
            <div className="min-h-[20px]" data-slot="form-item-message-slot">
              {error != null ? (
                <FormMessage id={messageId} status={status ?? 'error'}>
                  {error}
                </FormMessage>
              ) : help != null ? (
                <FormDescription id={descriptionId}>{help}</FormDescription>
              ) : null}
            </div>
            {extra != null && <FormExtra id={extraId}>{extra}</FormExtra>}
          </div>
          {showFeedback && (
            <span
              className={cn(
                'mt-2 inline-flex size-4 items-center justify-center',
                status === 'error' && 'text-ui-destructive',
                status === 'success' && 'text-emerald-700',
                status === 'validating' && 'text-sky-700',
                status === 'warning' && 'text-amber-700',
                form.layout === 'horizontal' && 'max-[720px]:hidden',
              )}
              data-slot="form-feedback-icon"
            >
              {statusIconMap[status]}
            </span>
          )}
        </div>
      </FormItemContext.Provider>
    );
  },
);

FormItem.displayName = 'FormItem';
