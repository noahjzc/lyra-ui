import { X } from 'lucide-react';
import * as React from 'react';
import { cn } from '../../../internal/cn';
import type { TextareaProps } from './types';
import { textareaResizeClassName, textareaRootVariants } from './variants';

function resolveAutoSize(autoSize: TextareaProps['autoSize']) {
  if (!autoSize) return undefined;

  return typeof autoSize === 'boolean' ? {} : autoSize;
}

function getTextareaValue(value: TextareaProps['value']) {
  return value == null ? '' : String(value);
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      allowClear = false,
      'aria-invalid': ariaInvalid,
      autoSize,
      className,
      defaultValue,
      disabled = false,
      invalid = false,
      maxLength,
      onChange,
      onClear,
      readOnly = false,
      resize = 'none',
      rows = 4,
      showCount = false,
      style,
      value,
      variant = 'outlined',
      ...props
    },
    ref,
  ) => {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const [internalValue, setInternalValue] = React.useState(
      defaultValue ?? '',
    );
    const autoSizeConfig = resolveAutoSize(autoSize);
    const mergedValue = value ?? internalValue;
    const valueText = getTextareaValue(mergedValue);
    const hasValue = valueText.length > 0;
    const count = valueText.length;
    const isInvalid = invalid || (maxLength != null && count > maxLength);
    const canClear = allowClear && hasValue && !disabled && !readOnly;

    React.useImperativeHandle(
      ref,
      () => textareaRef.current as HTMLTextAreaElement,
    );

    React.useLayoutEffect(() => {
      const textarea = textareaRef.current;

      if (!textarea || !autoSizeConfig) return;

      const lineHeight = 22;
      const minRows = autoSizeConfig.minRows ?? rows;
      const maxRows = autoSizeConfig.maxRows;
      const minHeight = minRows * lineHeight + 18;
      const maxHeight = maxRows == null ? undefined : maxRows * lineHeight + 18;
      const contentHeight =
        valueText.length === 0 ? minHeight : textarea.scrollHeight;

      textarea.style.height = 'auto';
      textarea.style.minHeight = `${minHeight}px`;
      textarea.style.maxHeight = maxHeight == null ? '' : `${maxHeight}px`;
      textarea.style.height = `${Math.max(
        minHeight,
        Math.min(contentHeight, maxHeight ?? contentHeight),
      )}px`;
      textarea.style.overflowY =
        maxHeight != null && contentHeight > maxHeight ? 'auto' : '';
    }, [autoSizeConfig, rows, valueText]);

    function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
      if (value == null) {
        setInternalValue(event.target.value);
      }

      onChange?.(event);
    }

    function handleClear() {
      if (!textareaRef.current) return;

      setInternalValue('');
      textareaRef.current.value = '';
      textareaRef.current.focus();
      onClear?.();
    }

    const countNode =
      typeof showCount === 'function'
        ? showCount(count, maxLength)
        : showCount
          ? `${count}${maxLength == null ? '' : ` / ${maxLength}`}`
          : null;

    return (
      <span
        className={cn(textareaRootVariants({ variant }), className)}
        data-disabled={disabled ? true : undefined}
        data-invalid={isInvalid ? true : undefined}
        data-readonly={readOnly ? true : undefined}
        data-slot="textarea-root"
      >
        <textarea
          aria-invalid={isInvalid ? true : ariaInvalid}
          className={cn(
            'min-h-[calc(var(--ui-textarea-rows)*22px+18px)] w-full min-w-0 flex-1 resize-inherit bg-transparent px-2.5 py-2 text-sm leading-[22px] text-inherit outline-none placeholder:text-ui-muted-foreground disabled:cursor-not-allowed disabled:text-(--ui-input-disabled-foreground)',
            textareaResizeClassName[resize],
            (countNode != null || canClear) && 'pb-7',
            canClear && 'pr-8',
          )}
          defaultValue={value == null ? defaultValue : undefined}
          disabled={disabled}
          maxLength={maxLength}
          onChange={handleChange}
          readOnly={readOnly}
          ref={textareaRef}
          rows={rows}
          style={
            {
              '--ui-textarea-rows': rows,
              ...style,
            } as React.CSSProperties
          }
          value={value}
          {...props}
        />
        {canClear && (
          <button
            aria-label="清空输入"
            className="absolute top-2 right-2 inline-flex size-5 items-center justify-center rounded text-ui-muted-foreground transition-ui-state transition-ui-transform hover:bg-ui-muted hover:text-ui-foreground active:scale-95"
            data-slot="textarea-clear"
            onClick={handleClear}
            type="button"
          >
            <X aria-hidden="true" className="size-3.5" />
          </button>
        )}
        {countNode != null && (
          <span
            className={cn(
              'absolute right-2 bottom-1.5 whitespace-nowrap text-xs font-bold text-ui-muted-foreground',
              isInvalid && 'text-ui-destructive',
            )}
            data-slot="textarea-count"
          >
            {countNode}
          </span>
        )}
      </span>
    );
  },
);

Textarea.displayName = 'Textarea';
