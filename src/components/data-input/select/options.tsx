import { Check } from 'lucide-react';
import type * as React from 'react';
import { cn } from '../../../internal/cn';
import { Checkbox } from '../checkbox';
import type {
  SelectOption,
  SelectOptionGroup,
  SelectOptionValue,
} from './types';
import { getOptionText } from './utils';
import { selectItemClassName } from './variants';

export function SelectFieldState({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex min-h-[92px] items-center justify-center gap-2 rounded-md border border-(--ui-input-border) border-dashed bg-(--ui-surface-soft-background) px-3 text-xs text-ui-muted-foreground"
      data-slot="select-field-state"
    >
      {children}
    </div>
  );
}

export function SelectFieldOptions({
  filteredGroups,
  filteredOptions,
  onSelect,
  renderOption,
  selectedValue,
}: {
  filteredGroups?: SelectOptionGroup[];
  filteredOptions: SelectOption[];
  onSelect: (option: SelectOption) => void;
  renderOption?: (option: SelectOption) => React.ReactNode;
  selectedValue?: SelectOptionValue;
}) {
  if (filteredGroups != null) {
    return (
      <>
        {filteredGroups.map(group => (
          <div className="grid gap-1" key={String(group.label)}>
            <div
              className="px-2 py-1 text-xs font-extrabold text-ui-muted-foreground"
              data-slot="select-field-group-label"
            >
              {group.label}
            </div>
            {group.options.map(option => (
              <SelectFieldOption
                key={option.value}
                onSelect={onSelect}
                option={option}
                renderOption={renderOption}
                selected={option.value === selectedValue}
              />
            ))}
          </div>
        ))}
      </>
    );
  }

  return (
    <>
      {filteredOptions.map(option => (
        <SelectFieldOption
          key={option.value}
          onSelect={onSelect}
          option={option}
          renderOption={renderOption}
          selected={option.value === selectedValue}
        />
      ))}
    </>
  );
}

function SelectFieldOption({
  onSelect,
  option,
  renderOption,
  selected,
}: {
  onSelect: (option: SelectOption) => void;
  option: SelectOption;
  renderOption?: (option: SelectOption) => React.ReactNode;
  selected: boolean;
}) {
  return (
    <button
      aria-disabled={option.disabled ? true : undefined}
      aria-selected={selected}
      className={cn(
        selectItemClassName,
        option.description != null && 'min-h-11 items-start py-1.5',
      )}
      data-disabled={option.disabled ? true : undefined}
      data-selected={selected ? true : undefined}
      data-slot="select-field-option"
      onClick={() => onSelect(option)}
      role="option"
      type="button"
    >
      {renderOption ? (
        renderOption(option)
      ) : (
        <span className="grid min-w-0 gap-0.5 text-left">
          <span className="truncate">{option.label}</span>
          {option.description != null && (
            <span className="truncate text-xs font-medium text-ui-muted-foreground">
              {option.description}
            </span>
          )}
        </span>
      )}
      {option.disabledReason != null && (
        <span className="shrink-0 text-xs text-ui-muted-foreground">
          {option.disabledReason}
        </span>
      )}
      {selected && (
        <Check
          aria-hidden="true"
          className="ml-auto size-3.5 shrink-0 text-(--ui-input-focus-border)"
        />
      )}
    </button>
  );
}

export function MultiSelectOptions({
  filteredGroups,
  filteredOptions,
  onToggle,
  renderOption,
  selectedValueSet,
}: {
  filteredGroups?: SelectOptionGroup[];
  filteredOptions: SelectOption[];
  onToggle: (value: SelectOptionValue, checked?: boolean) => void;
  renderOption?: (option: SelectOption) => React.ReactNode;
  selectedValueSet: Set<SelectOptionValue>;
}) {
  if (filteredGroups != null) {
    return (
      <>
        {filteredGroups.map(group => (
          <div className="grid gap-1" key={String(group.label)}>
            <div
              className="px-2 py-1 text-xs font-extrabold text-ui-muted-foreground"
              data-slot="select-field-group-label"
            >
              {group.label}
            </div>
            {group.options.map(option => (
              <MultiSelectOption
                key={option.value}
                onToggle={onToggle}
                option={option}
                renderOption={renderOption}
                selected={selectedValueSet.has(option.value)}
              />
            ))}
          </div>
        ))}
      </>
    );
  }

  return (
    <>
      {filteredOptions.map(option => (
        <MultiSelectOption
          key={option.value}
          onToggle={onToggle}
          option={option}
          renderOption={renderOption}
          selected={selectedValueSet.has(option.value)}
        />
      ))}
    </>
  );
}

function MultiSelectOption({
  onToggle,
  option,
  renderOption,
  selected,
}: {
  onToggle: (value: SelectOptionValue, checked?: boolean) => void;
  option: SelectOption;
  renderOption?: (option: SelectOption) => React.ReactNode;
  selected: boolean;
}) {
  return (
    <div
      aria-disabled={option.disabled ? true : undefined}
      aria-selected={selected}
      className={cn(
        selectItemClassName,
        'cursor-pointer justify-start',
        option.description != null && 'min-h-11 items-start py-1.5',
      )}
      data-disabled={option.disabled ? true : undefined}
      data-selected={selected ? true : undefined}
      data-slot="multi-select-option"
      onClick={event => {
        if (option.disabled) return;
        if (
          event.target instanceof Element &&
          event.target.closest('[data-slot="checkbox-control"]')
        ) {
          return;
        }

        onToggle(option.value);
      }}
      onKeyDown={event => {
        if (option.disabled) return;
        if (event.key !== 'Enter' && event.key !== ' ') return;

        event.preventDefault();
        onToggle(option.value);
      }}
      role="option"
      tabIndex={option.disabled ? -1 : 0}
    >
      <span className="grid shrink-0 place-items-center">
        <Checkbox
          aria-label={`选择 ${getOptionText(option)}`}
          checked={selected}
          disabled={option.disabled}
          onCheckedChange={checked => {
            onToggle(option.value, checked === true);
          }}
          size="middle"
        />
      </span>
      {renderOption ? (
        renderOption(option)
      ) : (
        <span className="grid min-w-0 flex-1 gap-0.5 text-left">
          <span className="truncate">{option.label}</span>
          {option.description != null && (
            <span className="truncate text-xs font-medium text-ui-muted-foreground">
              {option.description}
            </span>
          )}
        </span>
      )}
      {option.disabledReason != null && (
        <span className="ml-auto shrink-0 text-xs text-ui-muted-foreground">
          {option.disabledReason}
        </span>
      )}
    </div>
  );
}
