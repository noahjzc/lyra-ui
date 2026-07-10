import { Check, Copy, X } from 'lucide-react';
import * as React from 'react';
import { cn } from '../../../internal/cn';
import type { InputProps } from './types';
import {
  addonVariants,
  inputElementVariants,
  inputRootVariants,
} from './variants';

function getInputValue(value: InputProps['value']) {
  return value == null ? '' : String(value);
}

function getCopyConfig(copyable: InputProps['copyable']) {
  if (!copyable) return undefined;

  return typeof copyable === 'boolean' ? {} : copyable;
}

export const InputBase = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      allowClear = false,
      'aria-invalid': ariaInvalid,
      className,
      copyable = false,
      defaultValue,
      disabled = false,
      invalid,
      maxLength,
      onClear,
      onChange,
      prefix,
      prefixAddon,
      readOnly = false,
      showCount = false,
      size = 'middle',
      suffix,
      suffixAddon,
      type = 'text',
      value,
      variant = 'outlined',
      ...props
    },
    ref,
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [internalValue, setInternalValue] = React.useState(
      defaultValue ?? '',
    );
    const [copied, setCopied] = React.useState(false);
    const copyConfig = getCopyConfig(copyable);
    const mergedValue = value ?? internalValue;
    const valueText = getInputValue(mergedValue);
    const hasValue = valueText.length > 0;
    const count = valueText.length;
    const isInvalid = invalid || (maxLength != null && count > maxLength);
    const canClear =
      allowClear && !showCount && hasValue && !disabled && !readOnly;
    const canCopy = copyConfig != null && hasValue && !disabled;

    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
      if (value == null) {
        setInternalValue(event.target.value);
      }

      onChange?.(event);
    }

    function handleClear() {
      if (!inputRef.current) return;

      setInternalValue('');
      inputRef.current.value = '';
      inputRef.current.focus();
      onClear?.();
    }

    async function handleCopy() {
      if (!valueText) return;

      await navigator.clipboard?.writeText(valueText);
      copyConfig?.onCopy?.(valueText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
      inputRef.current?.focus();
    }

    const countNode =
      typeof showCount === 'function'
        ? showCount(count, maxLength)
        : showCount
          ? `${count}${maxLength == null ? '' : ` / ${maxLength}`}`
          : null;

    return (
      <span
        className={cn(
          inputRootVariants({ size, variant }),
          variant === 'underlined' && 'px-0',
          className,
        )}
        data-disabled={disabled ? true : undefined}
        data-invalid={isInvalid ? true : undefined}
        data-readonly={readOnly ? true : undefined}
        data-size={size}
        data-slot="input-root"
      >
        {prefixAddon != null && (
          <span className={addonVariants({ side: 'prefix' })}>
            {prefixAddon}
          </span>
        )}
        {prefix != null && (
          <span
            className="inline-flex shrink-0 items-center text-ui-muted-foreground"
            data-slot="input-prefix"
          >
            {prefix}
          </span>
        )}
        <input
          aria-invalid={isInvalid ? true : ariaInvalid}
          className={inputElementVariants({ size })}
          defaultValue={value == null ? defaultValue : undefined}
          disabled={disabled}
          maxLength={maxLength}
          onChange={handleChange}
          readOnly={readOnly}
          ref={inputRef}
          type={type}
          value={value}
          {...props}
        />
        {countNode != null && (
          <span
            className={cn(
              'shrink-0 whitespace-nowrap text-xs font-bold text-ui-muted-foreground',
              isInvalid && 'text-ui-destructive',
            )}
            data-slot="input-count"
          >
            {countNode}
          </span>
        )}
        {canClear && (
          <button
            aria-label="清空输入"
            className="inline-flex size-5 shrink-0 items-center justify-center rounded text-ui-muted-foreground transition-ui-state transition-ui-transform hover:bg-ui-muted hover:text-ui-foreground active:scale-95"
            data-slot="input-clear"
            onClick={handleClear}
            type="button"
          >
            <X aria-hidden="true" className="size-3.5" />
          </button>
        )}
        {suffix != null && (
          <span
            className="inline-flex shrink-0 items-center text-ui-muted-foreground"
            data-slot="input-suffix"
          >
            {suffix}
          </span>
        )}
        {canCopy && (
          <button
            aria-label={
              copied
                ? (copyConfig.copiedLabel ?? '已复制')
                : (copyConfig.label ?? '复制')
            }
            className="inline-flex h-6 shrink-0 items-center justify-center gap-1 rounded border border-(--ui-button-ghost-border) bg-(--ui-button-ghost-background) px-2 text-xs font-extrabold text-(--ui-button-ghost-foreground) transition-ui-state transition-ui-transform hover:border-(--ui-button-ghost-hover-border) hover:bg-(--ui-button-ghost-hover-background) active:scale-95"
            data-slot="input-copy"
            onClick={handleCopy}
            type="button"
          >
            {copied ? (
              <Check aria-hidden="true" className="size-3" />
            ) : (
              <Copy aria-hidden="true" className="size-3" />
            )}
            {copied
              ? (copyConfig.copiedLabel ?? '已复制')
              : (copyConfig.label ?? '复制')}
          </button>
        )}
        {suffixAddon != null && (
          <span className={addonVariants({ side: 'suffix' })}>
            {suffixAddon}
          </span>
        )}
      </span>
    );
  },
);

InputBase.displayName = 'Input';
