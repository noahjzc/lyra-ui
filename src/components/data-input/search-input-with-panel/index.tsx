import * as React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../../internal/cn';
import { useOverlayZIndex, Z_BASE } from '../../../overlay/z-stack';
import { SearchInput } from '../search-input';
import {
  type SearchSuggestionOption,
  SearchSuggestionPanel,
} from '../search-suggestion-panel';
import type { SearchInputWithPanelProps } from './types';
import {
  flattenSearchSuggestionGroups,
  getNextActiveValue,
  useControllableInputValue,
  useControllableOpen,
} from './utils';

export type { SearchInputWithPanelProps } from './types';

export function SearchInputWithPanel<TData = unknown>({
  className,
  defaultOpen,
  defaultValue,
  groups = [],
  onKeyDown,
  onOpenChange,
  onOptionSelect,
  onSearch,
  onValueChange,
  open,
  panelClassName,
  panelProps,
  selectBehavior = 'search',
  value,
  ...props
}: SearchInputWithPanelProps<TData>) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const rootRef = React.useRef<HTMLSpanElement>(null);
  const [panelPosition, setPanelPosition] = React.useState<{
    left: number;
    top: number;
    width: number;
  } | null>(null);
  const [mergedOpen, setMergedOpen] = useControllableOpen({
    defaultOpen,
    onOpenChange,
    open,
  });
  const [zIndex, layerRef] = useOverlayZIndex<HTMLDivElement>(
    Z_BASE.popover,
    undefined,
    mergedOpen,
  );
  const setPanelRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      panelRef.current = node;
      layerRef(node);
    },
    [layerRef],
  );
  const [mergedValue, setMergedValue] = useControllableInputValue({
    defaultValue,
    onValueChange,
    value,
  });
  const flatOptions = React.useMemo(
    () => flattenSearchSuggestionGroups(groups),
    [groups],
  );
  const [activeValue, setActiveValue] = React.useState<string | undefined>(() =>
    getNextActiveValue({ direction: 1, options: flatOptions }),
  );
  const resolvedActiveValue =
    activeValue && flatOptions.some(option => option.value === activeValue)
      ? activeValue
      : getNextActiveValue({ direction: 1, options: flatOptions });
  const activeOption = flatOptions.find(
    option => option.value === resolvedActiveValue,
  );

  const syncPanelPosition = React.useCallback(() => {
    if (rootRef.current == null) {
      setPanelPosition(null);
      return;
    }

    const rect = rootRef.current.getBoundingClientRect();

    setPanelPosition({
      left: rect.left,
      top: rect.bottom + 4,
      width: rect.width,
    });
  }, []);

  React.useLayoutEffect(() => {
    if (!mergedOpen) {
      setPanelPosition(null);
      return;
    }

    syncPanelPosition();
  }, [mergedOpen, syncPanelPosition]);

  React.useEffect(() => {
    if (!mergedOpen) return;

    window.addEventListener('resize', syncPanelPosition);
    window.addEventListener('scroll', syncPanelPosition, true);

    return () => {
      window.removeEventListener('resize', syncPanelPosition);
      window.removeEventListener('scroll', syncPanelPosition, true);
    };
  }, [mergedOpen, syncPanelPosition]);

  React.useEffect(() => {
    if (!mergedOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (!(event.target instanceof Node)) return;

      if (
        rootRef.current?.contains(event.target) ||
        panelRef.current?.contains(event.target)
      ) {
        return;
      }

      setMergedOpen(false);
    }

    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [mergedOpen, setMergedOpen]);

  function selectOption(option: SearchSuggestionOption<TData>) {
    onOptionSelect?.(option);

    if (selectBehavior !== 'none') {
      setMergedValue(option.value);
    }

    if (selectBehavior === 'search') {
      onSearch?.(option.value);
    }

    setMergedOpen(false);
    inputRef.current?.focus();
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      setMergedOpen(true);
      setActiveValue(
        getNextActiveValue({
          activeValue: resolvedActiveValue,
          direction: event.key === 'ArrowDown' ? 1 : -1,
          options: flatOptions,
        }),
      );
      return;
    }

    if (event.key === 'Enter' && mergedOpen && activeOption) {
      event.preventDefault();
      selectOption(activeOption);
      return;
    }

    if (event.key === 'Escape' && mergedOpen) {
      event.preventDefault();
      setMergedOpen(false);
      return;
    }

    onKeyDown?.(event);
  }

  return (
    <span
      className={cn('relative block w-full min-w-0', className)}
      data-slot="search-input-with-panel"
      onFocusCapture={() => setMergedOpen(true)}
      ref={rootRef}
    >
      <SearchInput
        {...props}
        onKeyDown={handleKeyDown}
        onSearch={onSearch}
        onValueChange={nextValue => {
          setMergedValue(nextValue);
          setMergedOpen(true);
        }}
        ref={inputRef}
        value={mergedValue}
      />
      {mergedOpen &&
        panelPosition != null &&
        createPortal(
          <div
            className={cn(
              'rounded-lg border border-(--ui-input-border) bg-ui-background text-ui-foreground shadow-ui-elevation-2',
              panelClassName,
            )}
            data-slot="search-input-panel-content"
            ref={setPanelRef}
            style={{
              left: panelPosition.left,
              position: 'fixed',
              top: panelPosition.top,
              width: panelPosition.width,
              zIndex,
            }}
          >
            <SearchSuggestionPanel
              {...panelProps}
              activeValue={resolvedActiveValue}
              groups={groups}
              onActiveValueChange={setActiveValue}
              onSelect={selectOption}
              query={mergedValue}
            />
          </div>,
          document.body,
        )}
    </span>
  );
}
