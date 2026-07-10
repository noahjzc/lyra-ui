import { ChevronsRight, X } from 'lucide-react';
import * as React from 'react';
import { cn } from '../../../internal/cn';
import { cascaderTriggerVariants } from './variants';

export const CascaderTriggerButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    canClear: boolean;
    disabled: boolean;
    isInvalid: boolean;
    listboxId?: string;
    multiple: boolean;
    open: boolean;
    overflowCount: number;
    placeholder: React.ReactNode;
    selectedLabels: React.ReactNode[];
    selectedTagKeys: string[];
    size?: 'large' | 'middle' | 'small' | null;
    variant?: 'borderless' | 'filled' | 'outlined' | 'underlined' | null;
  }
>(
  (
    {
      canClear,
      disabled,
      isInvalid,
      listboxId,
      multiple,
      open,
      overflowCount,
      placeholder,
      selectedLabels,
      selectedTagKeys,
      size,
      variant,
      ...props
    },
    ref,
  ) => (
    <button
      aria-controls={open ? listboxId : undefined}
      aria-expanded={open}
      aria-haspopup="dialog"
      className={cn(
        cascaderTriggerVariants({ size, variant }),
        variant === 'underlined' && 'px-0',
        canClear ? 'pr-16' : 'pr-8',
      )}
      data-disabled={disabled ? true : undefined}
      data-invalid={isInvalid ? true : undefined}
      data-slot="cascader-trigger"
      data-state={open ? 'open' : 'closed'}
      disabled={disabled}
      ref={ref}
      type="button"
      {...props}
    >
      <CascaderTriggerValue
        multiple={multiple}
        overflowCount={overflowCount}
        placeholder={placeholder}
        selectedLabels={selectedLabels}
        selectedTagKeys={selectedTagKeys}
      />
      <ChevronsRight
        aria-hidden="true"
        className="absolute top-1/2 right-2 size-3.5 -translate-y-1/2 text-ui-muted-foreground transition-ui-transform group-data-[state=open]:rotate-90"
      />
    </button>
  ),
);

CascaderTriggerButton.displayName = 'CascaderTriggerButton';

export function CascaderClearButton({
  onClear,
}: {
  onClear: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <button
      aria-label="清空级联选择"
      className="absolute top-1/2 right-8 z-10 grid size-5 -translate-y-1/2 place-items-center rounded text-ui-muted-foreground transition-ui-state transition-ui-transform hover:bg-ui-muted hover:text-ui-foreground active:scale-95"
      data-slot="cascader-clear"
      onClick={onClear}
      type="button"
    >
      <X aria-hidden="true" className="size-3.5" />
    </button>
  );
}

function CascaderTriggerValue({
  multiple,
  overflowCount,
  placeholder,
  selectedLabels,
  selectedTagKeys,
}: {
  multiple: boolean;
  overflowCount: number;
  placeholder: React.ReactNode;
  selectedLabels: React.ReactNode[];
  selectedTagKeys: string[];
}) {
  if (selectedLabels.length === 0) {
    return (
      <span className="min-w-0 flex-1 truncate text-left font-medium text-ui-muted-foreground">
        {placeholder}
      </span>
    );
  }

  if (multiple) {
    return (
      <span
        className="flex min-w-0 flex-1 items-center gap-1 overflow-hidden"
        data-slot="cascader-tags"
      >
        {selectedLabels.map((label, index) => (
          <span
            className="inline-flex min-w-0 max-w-[70%] items-center rounded border border-(--ui-accent-soft-border) bg-(--ui-button-ghost-background) px-1.5 py-0.5 text-xs font-bold text-(--ui-button-default-hover-foreground)"
            data-slot="cascader-tag"
            key={selectedTagKeys[index]}
          >
            <span className="truncate">{label}</span>
          </span>
        ))}
        {overflowCount > 0 && (
          <span className="inline-flex shrink-0 rounded border border-ui-border bg-(--ui-surface-muted-background) px-1.5 py-0.5 text-xs font-bold text-ui-muted-foreground">
            +{overflowCount}
          </span>
        )}
      </span>
    );
  }

  return (
    <span
      className="min-w-0 flex-1 truncate text-left"
      data-slot="cascader-value"
    >
      {selectedLabels[0]}
    </span>
  );
}
