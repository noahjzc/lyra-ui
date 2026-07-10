import { LoaderCircle, Search, X } from 'lucide-react';
import * as React from 'react';
import { cn } from '../../../internal/cn';
import { useControllableSearchValue } from './hooks';
import type { SearchInputProps } from './types';
import { searchButtonClassName, searchInputRootVariants } from './variants';

export type {
  SearchInputProps,
  SearchInputSize,
  SearchInputStatus,
} from './types';

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      allowClear = true,
      'aria-invalid': ariaInvalid,
      className,
      defaultValue,
      disabled = false,
      invalid,
      loading = false,
      onChange,
      onClear,
      onKeyDown,
      onSearch,
      onValueChange,
      placeholder = '搜索...',
      searchButton = false,
      shortcut,
      size = 'middle',
      status,
      value,
      variant = 'outlined',
      ...props
    },
    ref,
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [mergedValue, setMergedValue] = useControllableSearchValue({
      defaultValue,
      onValueChange,
      value,
    });
    const isInvalid = invalid || status === 'error';
    const hasValue = mergedValue.length > 0;
    const canClear = allowClear && hasValue && !disabled && !loading;

    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    function updateValue(event: React.ChangeEvent<HTMLInputElement>) {
      setMergedValue(event.currentTarget.value);
      onChange?.(event);
    }

    function clearValue() {
      setMergedValue('');
      onClear?.();
      inputRef.current?.focus();
    }

    function submitSearch() {
      if (disabled || loading) return;

      onSearch?.(mergedValue);
    }

    function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
      onKeyDown?.(event);

      if (event.defaultPrevented) return;

      if (event.key === 'Enter') {
        submitSearch();
      }

      if (event.key === 'Escape' && hasValue) {
        event.preventDefault();
        clearValue();
      }
    }

    const inputNode = (
      <span
        className={cn(
          searchInputRootVariants({ size, variant }),
          variant === 'underlined' && 'px-0',
          className,
        )}
        data-disabled={disabled ? true : undefined}
        data-invalid={isInvalid ? true : undefined}
        data-loading={loading ? true : undefined}
        data-slot="search-input-root"
      >
        <Search
          aria-hidden="true"
          className="size-4 shrink-0 text-ui-muted-foreground"
        />
        <input
          aria-busy={loading ? true : props['aria-busy']}
          aria-invalid={isInvalid ? true : ariaInvalid}
          className="min-w-0 flex-1 bg-transparent p-0 text-inherit outline-none placeholder:text-ui-muted-foreground disabled:cursor-not-allowed disabled:text-(--ui-input-disabled-foreground)"
          defaultValue={value == null ? defaultValue : undefined}
          disabled={disabled}
          onChange={updateValue}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          ref={inputRef}
          type="search"
          value={value}
          {...props}
        />
        {loading ? (
          <span
            className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-ui-muted-foreground"
            data-slot="search-input-loading"
          >
            <LoaderCircle
              aria-hidden="true"
              className="size-3.5 animate-spin text-(--ui-button-default-hover-foreground) motion-reduce:animate-none"
            />
            搜索中
          </span>
        ) : shortcut != null ? (
          <span
            className="shrink-0 rounded border border-ui-border bg-(--ui-surface-muted-background) px-1.5 py-0.5 text-xs font-bold text-ui-muted-foreground"
            data-slot="search-input-shortcut"
          >
            {shortcut}
          </span>
        ) : null}
        {canClear && (
          <button
            aria-label="清空搜索"
            className="inline-flex size-5 shrink-0 items-center justify-center rounded text-ui-muted-foreground transition-ui-state transition-ui-transform hover:bg-ui-muted hover:text-ui-foreground active:scale-95"
            data-slot="search-input-clear"
            onClick={clearValue}
            type="button"
          >
            <X aria-hidden="true" className="size-3.5" />
          </button>
        )}
      </span>
    );

    if (!searchButton) {
      return inputNode;
    }

    return (
      <span className="flex w-full min-w-0 items-center gap-2">
        {inputNode}
        <button
          className={cn(
            'inline-flex shrink-0 items-center justify-center rounded-md border border-(--ui-button-primary-background) bg-(--ui-button-primary-background) font-extrabold text-(--ui-inverse-foreground) transition-ui-state transition-ui-transform hover:border-(--ui-button-default-hover-foreground) hover:bg-(--ui-button-default-hover-foreground) active:scale-95 disabled:cursor-not-allowed disabled:border-(--ui-input-disabled-border) disabled:bg-(--ui-input-disabled-background) disabled:text-(--ui-input-disabled-foreground)',
            searchButtonClassName[size ?? 'middle'],
          )}
          data-slot="search-input-submit"
          disabled={disabled || loading}
          onClick={submitSearch}
          type="button"
        >
          {typeof searchButton === 'boolean' ? '搜索' : searchButton}
        </button>
      </span>
    );
  },
);

SearchInput.displayName = 'SearchInput';
