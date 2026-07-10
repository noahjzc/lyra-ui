import { Check, ChevronRight, LoaderCircle, Search } from 'lucide-react';
import * as React from 'react';
import { cn } from '../../../internal/cn';
import type {
  CascaderColumn,
  CascaderOption,
  CascaderPathOption,
  CascaderPathValue,
} from './types';
import { canExpand, pathKey } from './utils';

export function CascaderSearchField({
  onSearchChange,
  onRequestClose,
  placeholder,
  searchInputRef,
  value,
}: {
  onRequestClose: () => void;
  onSearchChange: (value: string) => void;
  placeholder: string;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  value: string;
}) {
  return (
    <label className="flex min-h-[30px] items-center gap-2 rounded-md border border-ui-border bg-(--ui-surface-soft-background) px-2.5 text-xs text-ui-muted-foreground">
      <Search aria-hidden="true" className="size-3.5" />
      <input
        aria-label="搜索级联路径"
        className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-ui-muted-foreground"
        onChange={event => onSearchChange(event.currentTarget.value)}
        onKeyDown={event => {
          if (event.key === 'Escape') {
            onRequestClose();
          }
        }}
        placeholder={placeholder}
        ref={searchInputRef}
        value={value}
      />
    </label>
  );
}

export function CascaderColumns({
  activePath,
  columns,
  loadingPathKeys,
  loadingText,
  onSelect,
  selectedPathKeys,
}: {
  activePath: CascaderPathValue;
  columns: CascaderColumn[];
  loadingPathKeys: Set<string>;
  loadingText: React.ReactNode;
  onSelect: (option: CascaderOption, prefix: CascaderPathValue) => void;
  selectedPathKeys: Set<string>;
}) {
  return (
    <div
      className="flex max-w-full overflow-x-auto rounded-md border border-(--ui-divider-soft)"
      data-slot="cascader-columns"
      role="tree"
    >
      {columns.map(column => (
        <div
          className="grid max-h-72 min-h-48 w-48 shrink-0 content-start gap-1 overflow-y-auto border-(--ui-divider-soft) border-r p-1.5 last:border-r-0"
          data-slot="cascader-column"
          key={`${column.level}-${column.prefix.join('/')}`}
        >
          {column.options.length === 0 ? (
            <CascaderState>暂无下级</CascaderState>
          ) : (
            column.options.map(option => {
              const nextPath = [...column.prefix, option.value];
              const key = pathKey(nextPath);
              const active = activePath[column.level] === option.value;
              const selected = selectedPathKeys.has(key);
              const loading = option.loading || loadingPathKeys.has(key);

              return (
                <CascaderOptionButton
                  active={active}
                  disabled={option.disabled}
                  key={key}
                  loading={loading}
                  loadingText={loadingText}
                  onSelect={() => onSelect(option, column.prefix)}
                  option={option}
                  pathKey={key}
                  selected={selected}
                />
              );
            })
          )}
        </div>
      ))}
    </div>
  );
}

function CascaderOptionButton({
  active,
  disabled,
  loading,
  loadingText,
  onSelect,
  option,
  pathKey,
  selected,
}: {
  active: boolean;
  disabled?: boolean;
  loading?: boolean;
  loadingText: React.ReactNode;
  onSelect: () => void;
  option: CascaderOption;
  pathKey: string;
  selected: boolean;
}) {
  const expandable = canExpand(option);

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    const buttons = Array.from(
      event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>(
        '[data-slot="cascader-option"]:not(:disabled)',
      ) ?? [],
    );
    const index = buttons.indexOf(event.currentTarget);

    if (index < 0) return;

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      buttons[
        Math.max(
          0,
          Math.min(
            buttons.length - 1,
            index + (event.key === 'ArrowDown' ? 1 : -1),
          ),
        )
      ]?.focus();
    }

    if (event.key === 'ArrowRight' && expandable) {
      event.preventDefault();
      onSelect();
    }
  }

  return (
    <button
      aria-disabled={disabled ? true : undefined}
      aria-selected={selected ? true : undefined}
      className={cn(
        'flex min-h-9 w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-sm outline-none transition-ui-state transition-ui-transform hover:bg-(--ui-control-hover-background) focus:bg-(--ui-control-hover-background) active:scale-[0.99]',
        active &&
          'bg-(--ui-control-hover-background) text-(--ui-button-default-hover-foreground)',
        selected &&
          'font-extrabold text-(--ui-button-default-hover-foreground)',
        disabled &&
          'cursor-not-allowed bg-transparent text-(--ui-input-disabled-foreground) hover:bg-transparent',
      )}
      data-active={active ? true : undefined}
      data-path-key={pathKey}
      data-slot="cascader-option"
      disabled={disabled}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      role="treeitem"
      type="button"
    >
      <span className="grid min-w-0 gap-0.5">
        <span className="truncate">{option.label}</span>
        {disabled && option.disabledReason != null && (
          <span className="truncate text-xs font-medium text-ui-muted-foreground">
            {option.disabledReason}
          </span>
        )}
        {loading && (
          <span className="text-xs font-medium text-ui-muted-foreground">
            {loadingText}
          </span>
        )}
      </span>
      <span className="inline-flex shrink-0 items-center gap-1 text-ui-muted-foreground">
        {selected && <Check aria-hidden="true" className="size-3.5" />}
        {loading ? (
          <LoaderCircle
            aria-hidden="true"
            className="size-3.5 animate-spin text-(--ui-button-default-hover-foreground) motion-reduce:animate-none"
          />
        ) : expandable ? (
          <ChevronRight aria-hidden="true" className="size-3.5" />
        ) : null}
      </span>
    </button>
  );
}

export function CascaderSearchList({
  emptyText,
  onSelect,
  paths,
  selectedPathKeys,
}: {
  emptyText: React.ReactNode;
  onSelect: (path: CascaderPathValue) => void;
  paths: CascaderPathOption[];
  selectedPathKeys: Set<string>;
}) {
  if (paths.length === 0) {
    return <CascaderState>{emptyText}</CascaderState>;
  }

  return (
    <div
      className="grid max-h-72 min-w-72 gap-1 overflow-y-auto rounded-md border border-(--ui-divider-soft) p-1.5"
      data-slot="cascader-search-list"
      role="listbox"
    >
      {paths.map(path => {
        const selected = selectedPathKeys.has(pathKey(path.value));

        return (
          <button
            aria-selected={selected ? true : undefined}
            className={cn(
              'flex min-h-9 items-center justify-between gap-3 rounded-md px-2 py-1.5 text-left text-sm outline-none transition-ui-state hover:bg-(--ui-control-hover-background) focus:bg-(--ui-control-hover-background)',
              selected &&
                'bg-(--ui-button-ghost-background) font-extrabold text-(--ui-button-default-hover-foreground)',
            )}
            data-slot="cascader-search-option"
            key={pathKey(path.value)}
            onClick={() => onSelect(path.value)}
            role="option"
            type="button"
          >
            <span className="line-clamp-2 min-w-0">
              {path.nodes.map((node, index) => (
                <React.Fragment key={`${node.value}-${index}`}>
                  {index > 0 && (
                    <span className="px-1 text-ui-muted-foreground">/</span>
                  )}
                  <span>{node.label}</span>
                </React.Fragment>
              ))}
            </span>
            {selected && <Check aria-hidden="true" className="size-3.5" />}
          </button>
        );
      })}
    </div>
  );
}

function CascaderState({ children }: { children: React.ReactNode }) {
  return (
    <output
      aria-live="polite"
      className="grid min-h-24 place-items-center rounded-md bg-(--ui-surface-muted-background) px-4 py-6 text-center text-sm text-ui-muted-foreground"
      data-slot="cascader-state"
    >
      {children}
    </output>
  );
}
