import { AlertCircle, LoaderCircle, RefreshCw, SearchX } from 'lucide-react';
import type * as React from 'react';
import { cn } from '../../../internal/cn';
import type {
  SearchSuggestionOption,
  SearchSuggestionPanelProps,
} from './types';

export type {
  SearchSuggestionGroup,
  SearchSuggestionOption,
  SearchSuggestionPanelProps,
  SearchSuggestionRenderState,
} from './types';

function DefaultSearchSuggestionOption<TData>({
  option,
}: {
  option: SearchSuggestionOption<TData>;
}) {
  return (
    <>
      {option.icon != null && (
        <span
          className="mt-0.5 shrink-0 text-ui-muted-foreground"
          data-slot="search-suggestion-option-icon"
        >
          {option.icon}
        </span>
      )}
      <span className="grid min-w-0 flex-1 gap-0.5">
        <span
          className="truncate font-semibold text-ui-foreground"
          data-slot="search-suggestion-option-label"
        >
          {option.label ?? option.value}
        </span>
        {option.description != null && (
          <span
            className="truncate text-xs text-ui-muted-foreground"
            data-slot="search-suggestion-option-description"
          >
            {option.description}
          </span>
        )}
      </span>
      {option.meta != null && (
        <span
          className="shrink-0 text-xs font-bold text-ui-muted-foreground"
          data-slot="search-suggestion-option-meta"
        >
          {option.meta}
        </span>
      )}
    </>
  );
}

function SearchSuggestionState({
  action,
  children,
  icon,
}: {
  action?: React.ReactNode;
  children: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <output
      className="grid min-h-28 place-items-center rounded-md border border-dashed border-(--ui-input-border) bg-(--ui-surface-muted-background) px-4 py-5 text-center"
      data-slot="search-suggestion-state"
    >
      <span className="grid justify-items-center gap-2">
        <span className="text-ui-muted-foreground">{icon}</span>
        <span className="text-xs font-medium text-ui-muted-foreground">
          {children}
        </span>
        {action}
      </span>
    </output>
  );
}

export function SearchSuggestionPanel<TData = unknown>({
  activeValue,
  className,
  emptyText = '暂无匹配结果',
  error,
  groups = [],
  loading = false,
  loadingText = '搜索中',
  onActiveValueChange,
  onRetry,
  onSelect,
  query = '',
  renderOption,
  selectedValue,
  ...props
}: SearchSuggestionPanelProps<TData>) {
  const hasOptions = groups.some(group => group.options.length > 0);

  if (loading) {
    return (
      <div
        className={cn('grid min-w-72 gap-2 p-1.5', className)}
        data-slot="search-suggestion-panel"
        {...props}
      >
        <SearchSuggestionState
          icon={
            <LoaderCircle
              aria-hidden="true"
              className="size-4 animate-spin text-(--ui-button-default-hover-foreground) motion-reduce:animate-none"
            />
          }
        >
          {loadingText}
        </SearchSuggestionState>
      </div>
    );
  }

  if (error != null) {
    return (
      <div
        className={cn('grid min-w-72 gap-2 p-1.5', className)}
        data-slot="search-suggestion-panel"
        {...props}
      >
        <SearchSuggestionState
          action={
            onRetry ? (
              <button
                className="inline-flex h-7 items-center justify-center gap-1 rounded-md border border-(--ui-input-border) bg-ui-background px-2.5 text-xs font-bold text-(--ui-control-foreground) transition-ui-state transition-ui-transform hover:bg-(--ui-control-hover-background) hover:text-(--ui-button-default-hover-foreground) active:scale-95"
                onClick={onRetry}
                type="button"
              >
                <RefreshCw aria-hidden="true" className="size-3" />
                重试
              </button>
            ) : undefined
          }
          icon={
            <AlertCircle
              aria-hidden="true"
              className="size-4 text-ui-destructive"
            />
          }
        >
          {error}
        </SearchSuggestionState>
      </div>
    );
  }

  if (!hasOptions) {
    return (
      <div
        className={cn('grid min-w-72 gap-2 p-1.5', className)}
        data-slot="search-suggestion-panel"
        {...props}
      >
        <SearchSuggestionState
          icon={<SearchX aria-hidden="true" className="size-4" />}
        >
          {emptyText}
        </SearchSuggestionState>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'grid max-h-72 min-w-72 gap-1 overflow-y-auto p-1.5',
        className,
      )}
      data-slot="search-suggestion-panel"
      role="listbox"
      {...props}
    >
      {groups.map(group => (
        <div
          className="grid gap-1"
          data-slot="search-suggestion-group"
          key={group.key ?? String(group.label ?? 'default')}
        >
          {group.label != null && (
            <div
              className="px-2 py-1 text-xs font-extrabold text-ui-muted-foreground"
              data-slot="search-suggestion-group-label"
            >
              {group.label}
            </div>
          )}
          {group.options.map(option => {
            const active = activeValue === option.value;
            const selected = selectedValue === option.value;
            const state = { active, option, query, selected };
            const optionNode = option.render?.(option, state) ??
              renderOption?.(option, state) ?? (
                <DefaultSearchSuggestionOption option={option} />
              );

            return (
              <button
                aria-disabled={option.disabled ? true : undefined}
                aria-selected={selected ? true : undefined}
                className={cn(
                  'flex min-h-9 w-full min-w-0 items-start gap-2 rounded-md px-2 py-1.5 text-left text-sm outline-none transition-ui-state transition-ui-transform hover:bg-(--ui-control-hover-background) focus:bg-(--ui-control-hover-background) active:scale-[0.99]',
                  active &&
                    'bg-(--ui-control-hover-background) text-(--ui-button-default-hover-foreground)',
                  selected &&
                    'font-extrabold text-(--ui-button-default-hover-foreground)',
                  option.disabled &&
                    'cursor-not-allowed bg-transparent text-(--ui-input-disabled-foreground) hover:bg-transparent',
                )}
                data-active={active ? true : undefined}
                data-slot="search-suggestion-option"
                disabled={option.disabled}
                key={option.value}
                onClick={() => {
                  if (!option.disabled) {
                    onSelect?.(option);
                  }
                }}
                onMouseMove={() => {
                  if (!option.disabled) {
                    onActiveValueChange?.(option.value);
                  }
                }}
                role="option"
                type="button"
              >
                {optionNode}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
