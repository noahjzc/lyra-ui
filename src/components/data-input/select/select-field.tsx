import * as PopoverPrimitive from '@radix-ui/react-popover';
import { ChevronDown, Search, X } from 'lucide-react';
import * as React from 'react';
import { cn } from '../../../internal/cn';
import { useOverlayZIndex, Z_BASE } from '../../../overlay/z-stack';
import { useControllableValue } from './hooks';
import { SelectFieldOptions, SelectFieldState } from './options';
import type { SelectFieldProps, SelectOption } from './types';
import { filterOptions, flattenOptions } from './utils';
import { selectTriggerVariants } from './variants';

export const SelectField = React.forwardRef<HTMLDivElement, SelectFieldProps>(
  (props, ref) => {
    const isValueControlled = Object.hasOwn(props, 'value');
    const {
      className,
      clearable = false,
      defaultValue,
      disabled = false,
      emptyText = '暂无匹配选项',
      groups,
      invalid,
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
    const [selectedValue, setSelectedValue] = useControllableValue({
      controlled: isValueControlled,
      defaultValue,
      onValueChange,
      value,
    });
    const mergedSearchValue = searchValue ?? internalSearchValue;
    const flatOptions = React.useMemo(
      () => flattenOptions({ groups, options }),
      [groups, options],
    );
    const selectedOption = flatOptions.find(
      option => option.value === selectedValue,
    );
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
    const canClear =
      clearable && selectedValue != null && !disabled && selectedOption != null;

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

    function handleSelect(option: SelectOption) {
      if (option.disabled) return;

      setSelectedValue(option.value);
      updateOpen(false);
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
            <button
              aria-controls={open ? listboxId : undefined}
              aria-expanded={open}
              aria-haspopup="listbox"
              aria-label={
                triggerAriaLabel ??
                (typeof selectedOption?.label === 'string'
                  ? selectedOption.label
                  : typeof placeholder === 'string'
                    ? placeholder
                    : undefined)
              }
              className={cn(
                selectTriggerVariants({ size, variant }),
                variant === 'underlined' && 'px-0',
              )}
              data-disabled={disabled ? true : undefined}
              data-invalid={isInvalid ? true : undefined}
              data-slot="select-field-trigger"
              data-state={open ? 'open' : 'closed'}
              disabled={disabled}
              role="combobox"
              type="button"
            >
              <span
                className={cn(
                  'min-w-0 flex-1 truncate text-left',
                  canClear && 'pr-10',
                  selectedOption == null &&
                    'font-medium text-ui-muted-foreground',
                )}
                data-slot="select-field-value"
              >
                {selectedOption?.label ?? placeholder}
              </span>
              <ChevronDown
                aria-hidden="true"
                className="size-3.5 shrink-0 text-ui-muted-foreground transition-ui-transform group-data-[state=open]:rotate-180"
              />
            </button>
          </PopoverPrimitive.Trigger>
          {canClear && (
            <button
              aria-label="清空选择"
              className="absolute top-1/2 right-8 grid size-5 -translate-y-1/2 place-items-center rounded text-ui-muted-foreground transition-ui-state transition-ui-transform hover:bg-ui-muted hover:text-ui-foreground active:scale-95"
              data-slot="select-field-clear"
              onClick={event => {
                event.stopPropagation();
                setSelectedValue(undefined);
              }}
              type="button"
            >
              <X aria-hidden="true" className="size-3.5" />
            </button>
          )}
          <PopoverPrimitive.Portal>
            <PopoverPrimitive.Content
              align="start"
              className="grid max-h-80 min-w-(--radix-popover-trigger-width) gap-2 overflow-auto rounded-lg border border-(--ui-input-border) bg-ui-background p-2 text-ui-foreground shadow-ui-elevation-2 data-[state=closed]:animate-ui-layer-out data-[state=open]:animate-ui-layer-in"
              data-slot="select-field-content"
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
                <SelectFieldOptions
                  filteredGroups={filteredGroups}
                  filteredOptions={filteredOptions}
                  onSelect={handleSelect}
                  renderOption={renderOption}
                  selectedValue={selectedValue}
                />
              )}
            </PopoverPrimitive.Content>
          </PopoverPrimitive.Portal>
        </div>
      </PopoverPrimitive.Root>
    );
  },
);

SelectField.displayName = 'SelectField';
