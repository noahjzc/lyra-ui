import * as PopoverPrimitive from '@radix-ui/react-popover';
import { ChevronDown, Search, X } from 'lucide-react';
import * as React from 'react';
import { cn } from '../../../internal/cn';
import { useOverlayZIndex, Z_BASE } from '../../../overlay/z-stack';
import { useControllableValues } from './hooks';
import { MultiSelectOptions, SelectFieldState } from './options';
import type {
  MultiSelectProps,
  SelectOption,
  SelectOptionValue,
} from './types';
import { filterOptions, flattenOptions, getOptionText } from './utils';
import { selectTriggerVariants } from './variants';

export const MultiSelect = React.forwardRef<HTMLDivElement, MultiSelectProps>(
  (props, ref) => {
    const isValueControlled = Object.hasOwn(props, 'value');
    const {
      className,
      clearable = false,
      defaultValue = [],
      disabled = false,
      emptyText = '暂无匹配选项',
      groups,
      invalid,
      maxTagCount = 2,
      onOpenChange,
      onSearchChange,
      onValueChange,
      options,
      placeholder = '请选择',
      renderOption,
      searchable = false,
      searchPlaceholder = '搜索选项名称',
      searchValue,
      size = 'middle',
      status,
      triggerAriaLabel,
      value,
      variant = 'outlined',
      ...rootProps
    } = props;
    const listboxId = React.useId();
    const searchInputRef = React.useRef<HTMLInputElement>(null);
    const [open, setOpen] = React.useState(false);
    const [zIndex, layerRef] = useOverlayZIndex<HTMLDivElement>(
      Z_BASE.popover,
      undefined,
      open,
    );
    const [internalSearchValue, setInternalSearchValue] = React.useState('');
    const [selectedValues, setSelectedValues] = useControllableValues({
      controlled: isValueControlled,
      defaultValue,
      onValueChange,
      value,
    });
    const mergedSearchValue = searchValue ?? internalSearchValue;
    const selectedValueSet = React.useMemo(
      () => new Set(selectedValues),
      [selectedValues],
    );
    const flatOptions = React.useMemo(
      () => flattenOptions({ groups, options }),
      [groups, options],
    );
    const selectedOptions = React.useMemo(
      () =>
        selectedValues
          .map(selectedValue =>
            flatOptions.find(option => option.value === selectedValue),
          )
          .filter((option): option is SelectOption => option != null),
      [flatOptions, selectedValues],
    );
    const visibleSelectedOptions = selectedOptions.slice(0, maxTagCount);
    const overflowCount = Math.max(0, selectedOptions.length - maxTagCount);
    const filteredGroups = React.useMemo(() => {
      if (groups == null) return undefined;

      return groups
        .map(group => ({
          ...group,
          options: filterOptions(group.options, mergedSearchValue),
        }))
        .filter(group => group.options.length > 0);
    }, [groups, mergedSearchValue]);
    const filteredOptions = React.useMemo(
      () =>
        groups == null
          ? filterOptions(options ?? [], mergedSearchValue)
          : (filteredGroups?.flatMap(group => group.options) ?? []),
      [filteredGroups, groups, mergedSearchValue, options],
    );
    const isInvalid = invalid || status === 'error';
    const canClear = clearable && selectedValues.length > 0 && !disabled;
    const selectedSummary =
      selectedOptions.length > 0
        ? selectedOptions.map(option => option.label).join('，')
        : placeholder;

    function updateOpen(nextOpen: boolean) {
      if (disabled) return;

      setOpen(nextOpen);
      onOpenChange?.(nextOpen);
    }

    function updateSearch(nextValue: string) {
      if (searchValue == null) {
        setInternalSearchValue(nextValue);
      }

      onSearchChange?.(nextValue);
    }

    function toggleValue(optionValue: SelectOptionValue, checked?: boolean) {
      if (disabled) return;

      const nextChecked = checked ?? !selectedValueSet.has(optionValue);
      const nextValues = nextChecked
        ? selectedValues.includes(optionValue)
          ? selectedValues
          : [...selectedValues, optionValue]
        : selectedValues.filter(selectedValue => selectedValue !== optionValue);

      setSelectedValues(nextValues);
    }

    React.useEffect(() => {
      if (!open || !searchable) return;

      window.setTimeout(() => searchInputRef.current?.focus(), 0);
    }, [open, searchable]);

    return (
      <PopoverPrimitive.Root onOpenChange={updateOpen} open={open}>
        <div
          className={cn('relative w-full min-w-0', className)}
          ref={ref}
          {...rootProps}
        >
          <PopoverPrimitive.Trigger asChild>
            <div
              aria-controls={open ? listboxId : undefined}
              aria-expanded={open}
              aria-haspopup="listbox"
              aria-label={
                triggerAriaLabel ??
                (typeof selectedSummary === 'string'
                  ? selectedSummary
                  : undefined)
              }
              className={cn(
                selectTriggerVariants({ size, variant }),
                'cursor-pointer',
                variant === 'underlined' && 'px-0',
              )}
              data-disabled={disabled ? true : undefined}
              data-invalid={isInvalid ? true : undefined}
              data-slot="multi-select-trigger"
              data-state={open ? 'open' : 'closed'}
              onKeyDown={event => {
                if (event.key === 'Escape') {
                  updateOpen(false);
                }

                if (
                  event.key === 'Enter' ||
                  event.key === ' ' ||
                  event.key === 'ArrowDown'
                ) {
                  event.preventDefault();
                  updateOpen(true);
                }
              }}
              role="combobox"
              tabIndex={disabled ? -1 : 0}
            >
              <span
                className={cn(
                  'flex min-w-0 flex-1 items-center gap-1 overflow-hidden text-left',
                  selectedOptions.length === 0 &&
                    'font-medium text-ui-muted-foreground',
                )}
                data-slot="multi-select-value"
              >
                {selectedOptions.length === 0 ? (
                  placeholder
                ) : (
                  <>
                    {visibleSelectedOptions.map(option => (
                      <span
                        className="inline-flex min-h-6 max-w-[96px] shrink-0 items-center gap-1.5 rounded-full border border-(--ui-select-tag-border) bg-(--ui-select-tag-background) px-2 text-xs font-bold leading-4 text-(--ui-select-tag-foreground)"
                        data-slot="multi-select-tag"
                        key={option.value}
                      >
                        <span className="truncate">{option.label}</span>
                        <button
                          aria-label={`移除 ${getOptionText(option)}`}
                          className="grid size-3.5 place-items-center rounded-full text-(--ui-button-default-hover-foreground) transition-colors hover:bg-(--ui-select-tag-hover-background)"
                          onClick={event => {
                            event.preventDefault();
                            event.stopPropagation();
                            toggleValue(option.value, false);
                          }}
                          type="button"
                        >
                          <X aria-hidden="true" className="size-2.5" />
                        </button>
                      </span>
                    ))}
                    {overflowCount > 0 && (
                      <span
                        className="inline-flex min-h-6 shrink-0 items-center rounded-full border border-ui-border bg-(--ui-input-addon-background) px-2 text-xs font-bold leading-4 text-ui-muted-foreground"
                        data-slot="multi-select-overflow"
                      >
                        +{overflowCount}
                      </span>
                    )}
                  </>
                )}
              </span>
              {canClear && (
                <button
                  aria-label="清空选择"
                  className="grid size-5 shrink-0 place-items-center rounded text-ui-muted-foreground transition-ui-state transition-ui-transform hover:bg-ui-muted hover:text-ui-foreground active:scale-95"
                  data-slot="multi-select-clear"
                  onClick={event => {
                    event.preventDefault();
                    event.stopPropagation();
                    setSelectedValues([]);
                  }}
                  type="button"
                >
                  <X aria-hidden="true" className="size-3.5" />
                </button>
              )}
              <ChevronDown
                aria-hidden="true"
                className="size-3.5 shrink-0 text-ui-muted-foreground transition-ui-transform group-data-[state=open]:rotate-180"
              />
            </div>
          </PopoverPrimitive.Trigger>
          <PopoverPrimitive.Portal>
            <PopoverPrimitive.Content
              align="start"
              aria-multiselectable="true"
              className="grid max-h-80 min-w-(--radix-popover-trigger-width) gap-2 overflow-auto rounded-lg border border-(--ui-input-border) bg-ui-background p-2 text-ui-foreground shadow-ui-elevation-2 data-[state=closed]:animate-ui-layer-out data-[state=open]:animate-ui-layer-in"
              data-slot="multi-select-content"
              id={listboxId}
              onOpenAutoFocus={event => {
                if (searchable) {
                  event.preventDefault();
                }
              }}
              role="listbox"
              ref={layerRef}
              sideOffset={4}
              style={{ zIndex }}
            >
              {searchable && (
                <label className="flex min-h-[30px] items-center gap-2 rounded-md border border-ui-border bg-(--ui-surface-soft-background) px-2.5 text-xs text-ui-muted-foreground">
                  <Search aria-hidden="true" className="size-3.5" />
                  <input
                    aria-label="搜索选项"
                    className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-ui-muted-foreground"
                    onChange={event => updateSearch(event.currentTarget.value)}
                    onKeyDown={event => {
                      if (event.key === 'Escape') {
                        updateOpen(false);
                      }
                    }}
                    placeholder={searchPlaceholder}
                    ref={searchInputRef}
                    value={mergedSearchValue}
                  />
                </label>
              )}
              {filteredOptions.length === 0 ? (
                <SelectFieldState>{emptyText}</SelectFieldState>
              ) : (
                <MultiSelectOptions
                  filteredGroups={filteredGroups}
                  filteredOptions={filteredOptions}
                  onToggle={toggleValue}
                  renderOption={renderOption}
                  selectedValueSet={selectedValueSet}
                />
              )}
              <div
                className="flex min-h-8 items-center justify-between border-ui-border border-t pt-2 text-xs text-ui-muted-foreground"
                data-slot="multi-select-footer"
              >
                <span>已选择 {selectedValues.length} 项</span>
                <button
                  className="font-extrabold text-(--ui-input-focus-border) disabled:cursor-not-allowed disabled:text-(--ui-input-disabled-foreground)"
                  disabled={selectedValues.length === 0 || disabled}
                  onClick={() => setSelectedValues([])}
                  type="button"
                >
                  清空
                </button>
              </div>
            </PopoverPrimitive.Content>
          </PopoverPrimitive.Portal>
        </div>
      </PopoverPrimitive.Root>
    );
  },
);

MultiSelect.displayName = 'MultiSelect';
