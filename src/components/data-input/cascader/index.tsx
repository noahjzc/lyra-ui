import * as PopoverPrimitive from '@radix-ui/react-popover';
import * as React from 'react';
import { cn } from '../../../internal/cn';
import { useOverlayZIndex, Z_BASE } from '../../../overlay/z-stack';
import {
  CascaderColumns,
  CascaderSearchField,
  CascaderSearchList,
} from './panel';
import { CascaderClearButton, CascaderTriggerButton } from './trigger';
import type {
  CascaderOption,
  CascaderPathValue,
  CascaderProps,
  CascaderValue,
} from './types';
import {
  canCommitPath,
  canExpand,
  filterPathOptions,
  findPathOptions,
  flattenPathOptions,
  getColumns,
  getPathLabel,
  isSamePath,
  normalizeSelectedPaths,
  pathKey,
} from './utils';

export type {
  CascaderOption,
  CascaderPathValue,
  CascaderProps,
  CascaderSize,
  CascaderStatus,
  CascaderValue,
} from './types';

function useControllableCascaderValue({
  defaultValue,
  multiple,
  onValueChange,
  value,
}: {
  defaultValue?: CascaderValue;
  multiple: boolean;
  onValueChange?: (value: CascaderValue) => void;
  value?: CascaderValue;
}) {
  const [internalValue, setInternalValue] =
    React.useState<CascaderValue>(defaultValue);
  const mergedValue = value ?? internalValue;

  const setValue = React.useCallback(
    (nextValue: CascaderValue) => {
      if (value == null) {
        setInternalValue(nextValue);
      }

      onValueChange?.(nextValue);
    },
    [onValueChange, value],
  );

  return [
    normalizeSelectedPaths(mergedValue, multiple),
    setValue,
    mergedValue,
  ] as const;
}

export const Cascader = React.forwardRef<HTMLDivElement, CascaderProps>(
  (
    {
      allowClear = false,
      changeOnSelect = false,
      className,
      defaultValue,
      disabled = false,
      displayRender,
      emptyText = '暂无匹配路径',
      invalid,
      loadData,
      loadingText = '加载中',
      maxTagCount = 1,
      multiple = false,
      onOpenChange,
      onSearchChange,
      onValueChange,
      options,
      placeholder = '请选择',
      searchPlaceholder = '搜索选项路径',
      searchValue,
      showSearch = false,
      size = 'middle',
      status,
      value,
      variant = 'outlined',
      ...props
    },
    ref,
  ) => {
    const listboxId = React.useId();
    const contentRef = React.useRef<HTMLDivElement>(null);
    const triggerRef = React.useRef<HTMLButtonElement>(null);
    const searchInputRef = React.useRef<HTMLInputElement>(null);
    const focusPanelOnOpenRef = React.useRef(false);
    const [open, setOpen] = React.useState(false);
    const [overlayZIndex, layerRef] = useOverlayZIndex(
      Z_BASE.popover,
      contentRef,
      open,
    );
    const [activePath, setActivePath] = React.useState<CascaderPathValue>([]);
    const [internalSearchValue, setInternalSearchValue] = React.useState('');
    const [loadingPathKeys, setLoadingPathKeys] = React.useState(
      () => new Set<string>(),
    );
    const [selectedPaths, setSelectedValue] = useControllableCascaderValue({
      defaultValue,
      multiple,
      onValueChange,
      value,
    });
    const mergedSearchValue = searchValue ?? internalSearchValue;
    const selectedPathKeys = React.useMemo(
      () => new Set(selectedPaths.map(pathKey)),
      [selectedPaths],
    );
    const columns = React.useMemo(
      () => getColumns(options, activePath),
      [activePath, options],
    );
    const allSearchPaths = React.useMemo(
      () => flattenPathOptions(options, changeOnSelect),
      [changeOnSelect, options],
    );
    const filteredSearchPaths = React.useMemo(
      () => filterPathOptions(allSearchPaths, mergedSearchValue),
      [allSearchPaths, mergedSearchValue],
    );
    const isInvalid = invalid || status === 'error';
    const hasValue = selectedPaths.length > 0;
    const canClear = allowClear && hasValue && !disabled;
    const selectedLabels = selectedPaths.map(path =>
      getPathLabel(options, path, displayRender),
    );
    const visibleLabels = selectedLabels.slice(0, maxTagCount);
    const visibleTagKeys = selectedPaths.slice(0, maxTagCount).map(pathKey);
    const overflowCount = Math.max(0, selectedLabels.length - maxTagCount);

    function updateOpen(nextOpen: boolean) {
      if (disabled) return;

      if (nextOpen && selectedPaths[0]) {
        setActivePath(selectedPaths[0].slice(0, -1));
      }

      if (nextOpen) {
        focusPanelOnOpenRef.current = true;
      }

      setOpen(nextOpen);
      onOpenChange?.(nextOpen);
    }

    function updateSearch(nextValue: string) {
      if (searchValue == null) {
        setInternalSearchValue(nextValue);
      }

      onSearchChange?.(nextValue);
    }

    function commitPath(nextPath: CascaderPathValue) {
      if (!canCommitPath(findPathOptions(options, nextPath), changeOnSelect)) {
        return;
      }

      if (multiple) {
        const exists = selectedPaths.some(path => isSamePath(path, nextPath));
        const nextPaths = exists
          ? selectedPaths.filter(path => !isSamePath(path, nextPath))
          : [...selectedPaths, nextPath];

        setSelectedValue(nextPaths.length ? nextPaths : undefined);
        return;
      }

      setSelectedValue(nextPath);
      updateOpen(false);
      triggerRef.current?.focus();
    }

    async function loadPath(nextPath: CascaderPathValue) {
      const selectedOptions = findPathOptions(options, nextPath);

      if (!loadData || selectedOptions.length === 0) return;

      const key = pathKey(nextPath);

      setLoadingPathKeys(prev => new Set(prev).add(key));

      try {
        await loadData(selectedOptions);
      } finally {
        setLoadingPathKeys(prev => {
          const next = new Set(prev);
          next.delete(key);
          return next;
        });
      }
    }

    function handleOptionSelect(option: CascaderOption, prefix: string[]) {
      if (option.disabled) return;

      const nextPath = [...prefix, option.value];
      const expandable = canExpand(option);

      setActivePath(nextPath);

      if (expandable) {
        if (!option.children?.length) {
          void loadPath(nextPath);
        }

        if (changeOnSelect) {
          commitPath(nextPath);
        }

        return;
      }

      commitPath(nextPath);
    }

    function handleClear(event: React.MouseEvent<HTMLButtonElement>) {
      event.preventDefault();
      event.stopPropagation();
      setSelectedValue(undefined);
      setActivePath([]);
      triggerRef.current?.focus();
    }

    React.useEffect(() => {
      if (!open) {
        focusPanelOnOpenRef.current = false;
        return;
      }

      if (!focusPanelOnOpenRef.current) return;

      focusPanelOnOpenRef.current = false;

      if (!showSearch) {
        window.setTimeout(() => {
          const activeOption =
            contentRef.current?.querySelector<HTMLButtonElement>(
              '[data-slot="cascader-option"][data-active="true"]:not(:disabled)',
            );
          const firstOption =
            contentRef.current?.querySelector<HTMLButtonElement>(
              '[data-slot="cascader-option"]:not(:disabled)',
            );

          (activeOption ?? firstOption)?.focus({ preventScroll: true });
        }, 0);
        return;
      }

      window.setTimeout(() => searchInputRef.current?.focus(), 0);
    }, [open, showSearch]);

    return (
      <PopoverPrimitive.Root onOpenChange={updateOpen} open={open}>
        <div
          className={cn('relative w-full min-w-0', className)}
          ref={ref}
          {...props}
        >
          <PopoverPrimitive.Trigger asChild>
            <CascaderTriggerButton
              canClear={canClear}
              disabled={disabled}
              isInvalid={isInvalid}
              listboxId={listboxId}
              multiple={multiple}
              open={open}
              overflowCount={overflowCount}
              placeholder={placeholder}
              ref={triggerRef}
              selectedLabels={visibleLabels}
              selectedTagKeys={visibleTagKeys}
              size={size}
              variant={variant}
            />
          </PopoverPrimitive.Trigger>
          {canClear && <CascaderClearButton onClear={handleClear} />}
          <PopoverPrimitive.Portal>
            <PopoverPrimitive.Content
              align="start"
              className="grid max-w-[min(760px,calc(100vw-32px))] gap-2 rounded-lg border border-(--ui-input-border) bg-ui-background p-2 text-ui-foreground shadow-ui-elevation-2 data-[state=closed]:animate-ui-layer-out data-[state=open]:animate-ui-layer-in"
              data-slot="cascader-content"
              id={listboxId}
              onOpenAutoFocus={event => {
                event.preventDefault();
              }}
              ref={layerRef}
              role="dialog"
              sideOffset={4}
              style={{ zIndex: overlayZIndex }}
            >
              {showSearch && (
                <CascaderSearchField
                  onRequestClose={() => updateOpen(false)}
                  onSearchChange={updateSearch}
                  placeholder={searchPlaceholder}
                  searchInputRef={searchInputRef}
                  value={mergedSearchValue}
                />
              )}
              {showSearch && mergedSearchValue.trim() ? (
                <CascaderSearchList
                  emptyText={emptyText}
                  onSelect={commitPath}
                  paths={filteredSearchPaths}
                  selectedPathKeys={selectedPathKeys}
                />
              ) : (
                <CascaderColumns
                  activePath={activePath}
                  columns={columns}
                  loadingPathKeys={loadingPathKeys}
                  loadingText={loadingText}
                  onSelect={handleOptionSelect}
                  selectedPathKeys={selectedPathKeys}
                />
              )}
            </PopoverPrimitive.Content>
          </PopoverPrimitive.Portal>
        </div>
      </PopoverPrimitive.Root>
    );
  },
);

Cascader.displayName = 'Cascader';
