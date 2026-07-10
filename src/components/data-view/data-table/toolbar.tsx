import type * as React from 'react';
import { cn } from '../../../internal/cn';

export function DataTableToolbar({
  actions,
  children,
  className,
  description,
  title,
}: {
  actions?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  description?: React.ReactNode;
  title?: React.ReactNode;
}) {
  if (
    title == null &&
    description == null &&
    children == null &&
    actions == null
  ) {
    return null;
  }

  return (
    <div
      className={cn(
        'flex min-w-0 flex-wrap items-center justify-between gap-3 border-ui-border border-b px-3 py-2.5',
        className,
      )}
      data-slot="data-table-toolbar"
    >
      {(title != null || description != null) && (
        <div className="grid min-w-0 gap-0.5" data-slot="data-table-title">
          {title != null && (
            <div className="truncate text-sm font-extrabold text-ui-foreground">
              {title}
            </div>
          )}
          {description != null && (
            <div className="truncate text-xs text-ui-muted-foreground">
              {description}
            </div>
          )}
        </div>
      )}
      <div
        className="ml-auto flex min-w-0 flex-wrap items-center justify-end gap-2"
        data-slot="data-table-tools"
      >
        {children}
        {actions}
      </div>
    </div>
  );
}

export function DataTableFilterBar({
  children,
  label = '当前筛选条件',
}: {
  children?: React.ReactNode;
  label?: string;
}) {
  if (children == null) return null;

  return (
    <fieldset
      className="flex min-w-0 flex-wrap items-center gap-2 border-ui-border border-b bg-(--ui-surface-soft-background) px-3 py-2"
      data-slot="data-table-filter-bar"
    >
      <legend className="sr-only">{label}</legend>
      {children}
    </fieldset>
  );
}

export function DataTableSelectionBar({
  children,
  selectedCount,
  summary,
}: {
  children?: React.ReactNode;
  selectedCount: number;
  summary: React.ReactNode;
}) {
  if (selectedCount === 0 && children == null) return null;

  return (
    <div
      className="flex min-w-0 flex-wrap items-center justify-between gap-3 border-ui-border border-b bg-(--ui-button-ghost-background) px-3 py-2 text-sm"
      data-slot="data-table-selection-bar"
    >
      <div className="min-w-0 text-ui-foreground">{summary}</div>
      {children != null && (
        <div className="flex shrink-0 items-center gap-2">{children}</div>
      )}
    </div>
  );
}
