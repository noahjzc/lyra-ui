/* eslint-disable react-refresh/only-export-components -- Tag 需要保留 Tag.Checkable 和 Tag.Group 复合组件 API。 */
import { cva } from 'class-variance-authority';
import { X } from 'lucide-react';
import * as React from 'react';
import { cn } from '../../../internal/cn';
import type { TagContentProps, TagFilterProps, TagProps } from './types';

export type {
  TagColor,
  TagContentProps,
  TagFilterProps,
  TagProps,
  TagSize,
  TagVariant,
} from './types';

const tagVariants = cva(
  'inline-flex max-w-full min-w-0 items-center justify-center gap-1 whitespace-nowrap rounded-[5px] border font-medium leading-none outline-none transition-ui-state transition-ui-transform focus-visible:ring-2 focus-visible:ring-(--ui-button-focus-ring) disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60 aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:opacity-60 motion-reduce:transition-none',
  {
    variants: {
      checked: {
        true: 'border-(--ui-button-primary-border) bg-(--ui-button-primary-background) text-(--ui-button-primary-foreground)',
        false: '',
      },
      color: {
        assist: 'border-ui-assist/20 bg-ui-assist/10 text-ui-assist',
        destructive:
          'border-ui-destructive/20 bg-ui-destructive/10 text-ui-destructive',
        info: 'border-(--ui-accent-soft-border) bg-(--ui-button-ghost-background) text-(--ui-button-ghost-foreground)',
        neutral:
          'border-ui-border bg-(--ui-surface-muted-background) text-ui-foreground',
        primary:
          'border-(--ui-accent-soft-border) bg-(--ui-button-ghost-background) text-(--ui-button-primary-background)',
        processing:
          'border-ui-processing/20 bg-ui-processing/10 text-ui-processing',
        success: 'border-ui-success/20 bg-ui-success/10 text-ui-success',
        warning: 'border-ui-warning/20 bg-ui-warning/10 text-ui-warning',
      },
      size: {
        compact: 'h-[22px] px-[7px] text-[11px]',
        large: 'h-7 px-2.5 text-[13px]',
        middle: 'h-6 px-2 text-xs',
      },
      variant: {
        category: '',
        filter: 'border-dashed',
        status: '',
      },
    },
    defaultVariants: {
      checked: false,
      color: 'neutral',
      size: 'middle',
      variant: 'category',
    },
  },
);

const filterSizeClassName = {
  compact: 'h-[22px] text-[11px]',
  middle: 'h-6 text-xs',
} as const;

function resolveMaxWidth(
  maxWidth: TagProps['maxWidth'],
  style: React.CSSProperties | undefined,
): React.CSSProperties | undefined {
  if (maxWidth == null) return style;

  return {
    ...style,
    maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
  };
}

function isControlledChecked(checked: TagProps['checked']) {
  return checked != null;
}

function TagContent({
  children,
  closeLabel,
  closable,
  disabled,
  icon,
  onClose,
}: TagContentProps) {
  return (
    <>
      {icon != null && (
        <span
          aria-hidden="true"
          className="inline-flex shrink-0 items-center"
          data-slot="tag-icon"
        >
          {icon}
        </span>
      )}
      <span className="min-w-0 truncate" data-slot="tag-label">
        {children}
      </span>
      {closable && (
        <button
          aria-label={closeLabel}
          className="-mr-1 inline-flex size-[18px] shrink-0 items-center justify-center rounded text-current opacity-70 transition-ui-state transition-ui-transform hover:bg-ui-muted hover:opacity-100 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ui-button-focus-ring)"
          disabled={disabled}
          onClick={event => {
            event.stopPropagation();
            onClose?.(event);
          }}
          type="button"
        >
          <X aria-hidden="true" className="size-3" />
        </button>
      )}
    </>
  );
}

export const TagBase = React.forwardRef<HTMLSpanElement, TagProps>(
  (
    {
      checkable = false,
      checked,
      children,
      className,
      closeLabel = '移除标签',
      closable = false,
      color = 'neutral',
      defaultChecked = false,
      disabled = false,
      icon,
      maxWidth,
      onCheckedChange,
      onClick,
      onClose,
      size = 'middle',
      style,
      variant = 'category',
      ...props
    },
    ref,
  ) => {
    const controlled = isControlledChecked(checked);
    const [internalChecked, setInternalChecked] =
      React.useState(defaultChecked);
    const mergedChecked = controlled ? Boolean(checked) : internalChecked;
    const interactive = checkable || (onClick != null && !closable);
    const classNames = cn(
      tagVariants({
        checked: checkable ? mergedChecked : false,
        color,
        size,
        variant,
      }),
      interactive &&
        !disabled &&
        'cursor-pointer hover:border-(--ui-button-default-hover-border) hover:bg-(--ui-button-default-hover-background) active:scale-[0.98]',
      className,
    );
    const resolvedStyle = resolveMaxWidth(maxWidth, style);
    const content = (
      <TagContent
        closeLabel={closeLabel}
        closable={closable}
        disabled={disabled}
        icon={icon}
        onClose={onClose}
      >
        {children}
      </TagContent>
    );

    if (interactive) {
      return (
        <button
          aria-pressed={checkable ? mergedChecked : undefined}
          className={classNames}
          data-slot="tag"
          disabled={disabled}
          onClick={event => {
            onClick?.(event);
            if (!checkable) return;

            const nextChecked = !mergedChecked;
            if (!controlled) {
              setInternalChecked(nextChecked);
            }
            onCheckedChange?.(nextChecked);
          }}
          style={resolvedStyle}
          type="button"
        >
          {content}
        </button>
      );
    }

    return (
      <span
        aria-disabled={disabled ? true : undefined}
        className={classNames}
        data-slot="tag"
        ref={ref}
        style={resolvedStyle}
        {...props}
      >
        {content}
      </span>
    );
  },
);

TagBase.displayName = 'Tag';

export const TagFilter = React.forwardRef<HTMLSpanElement, TagFilterProps>(
  (
    {
      className,
      closeLabel,
      disabled = false,
      label,
      maxWidth,
      onClose,
      operator = '=',
      size = 'middle',
      style,
      value,
      ...props
    },
    ref,
  ) => {
    const resolvedStyle = resolveMaxWidth(maxWidth, style);
    const fallbackCloseLabel = `移除${String(label)}筛选`;

    return (
      <span
        aria-disabled={disabled ? true : undefined}
        className={cn(
          'inline-flex max-w-full min-w-0 overflow-hidden rounded-[5px] border border-(--ui-accent-soft-border) bg-(--ui-button-ghost-background) text-(--ui-button-ghost-foreground) font-medium leading-none transition-ui-state focus-within:ring-2 focus-within:ring-(--ui-button-focus-ring)',
          filterSizeClassName[size],
          disabled && 'pointer-events-none cursor-not-allowed opacity-60',
          className,
        )}
        data-slot="tag-filter"
        ref={ref}
        style={resolvedStyle}
        {...props}
      >
        <span
          className="inline-flex h-full shrink-0 items-center border-(--ui-accent-soft-border) border-r px-1.5 font-semibold"
          data-slot="tag-filter-label"
        >
          {label}
        </span>
        {operator != null && (
          <span
            className="inline-flex h-full shrink-0 items-center border-(--ui-accent-soft-border) border-r bg-(--ui-tag-filter-operator-background) px-1.5 text-ui-muted-foreground"
            data-slot="tag-filter-operator"
          >
            {operator}
          </span>
        )}
        <span
          className="inline-flex h-full min-w-0 items-center px-1.5"
          data-slot="tag-filter-value"
        >
          <span className="block min-w-0 truncate">{value}</span>
        </span>
        {onClose != null && (
          <button
            aria-label={closeLabel ?? fallbackCloseLabel}
            className="inline-flex h-full w-[22px] shrink-0 items-center justify-center text-current transition-ui-state transition-ui-transform hover:bg-(--ui-tag-filter-action-hover-background) active:scale-95 focus-visible:outline-none"
            disabled={disabled}
            onClick={event => {
              event.stopPropagation();
              onClose(event);
            }}
            type="button"
          >
            <X aria-hidden="true" className="size-3" />
          </button>
        )}
      </span>
    );
  },
);

TagFilter.displayName = 'Tag.Filter';

export const Tag = Object.assign(TagBase, {
  Filter: TagFilter,
});
