import { UploadCloud } from 'lucide-react';
import type * as React from 'react';
import { cn } from '../../../internal/cn';

export function UploadButton({
  children,
  disabled,
  hint,
  hintId,
  inputNode,
  onOpen,
}: {
  children: React.ReactNode;
  disabled: boolean;
  hint?: React.ReactNode;
  hintId: string;
  inputNode: React.ReactNode;
  onOpen: () => void;
}) {
  return (
    <div className="grid justify-items-start gap-1.5">
      {inputNode}
      <button
        aria-describedby={hint != null ? hintId : undefined}
        className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-(--ui-button-ghost-border) bg-(--ui-button-ghost-background) px-3 text-sm font-extrabold text-(--ui-button-ghost-foreground) transition-ui-state transition-ui-transform hover:border-(--ui-button-ghost-hover-border) hover:bg-(--ui-button-ghost-hover-background) active:scale-95 disabled:cursor-not-allowed disabled:border-(--ui-input-disabled-border) disabled:bg-(--ui-input-disabled-background) disabled:text-(--ui-input-disabled-foreground)"
        data-slot="upload-trigger"
        disabled={disabled}
        onClick={onOpen}
        type="button"
      >
        <UploadCloud aria-hidden="true" className="size-4" />
        {children}
      </button>
      {hint != null && (
        <p
          className="m-0 text-xs leading-4 text-ui-muted-foreground"
          id={hintId}
        >
          {hint}
        </p>
      )}
    </div>
  );
}

export function UploadDragger({
  active,
  disabled,
  hint,
  hintId,
  inputNode,
  onDragActiveChange,
  onDrop,
  onOpen,
  text,
}: {
  active: boolean;
  disabled: boolean;
  hint?: React.ReactNode;
  hintId: string;
  inputNode: React.ReactNode;
  onDragActiveChange: (active: boolean) => void;
  onDrop: (event: React.DragEvent<HTMLButtonElement>) => void;
  onOpen: () => void;
  text: React.ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      {inputNode}
      <button
        aria-describedby={hint != null ? hintId : undefined}
        className={cn(
          'grid min-h-32 place-items-center rounded-lg border border-dashed border-(--ui-input-border) bg-(--ui-surface-soft-background) px-4 py-5 text-center outline-none transition-ui-state transition-ui-transform focus:border-(--ui-input-focus-border) focus:ring-2 focus:ring-(--ui-input-focus-ring)',
          active &&
            'border-(--ui-control-active-border) bg-(--ui-control-hover-background)',
          disabled &&
            'cursor-not-allowed border-(--ui-input-disabled-border) bg-(--ui-input-disabled-background) text-(--ui-input-disabled-foreground)',
        )}
        data-slot="upload-dragger"
        disabled={disabled}
        onClick={onOpen}
        onDragEnter={event => {
          event.preventDefault();
          if (!disabled) onDragActiveChange(true);
        }}
        onDragLeave={event => {
          event.preventDefault();
          onDragActiveChange(false);
        }}
        onDragOver={event => event.preventDefault()}
        onDrop={onDrop}
        onKeyDown={event => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onOpen();
          }
        }}
        type="button"
      >
        <span className="grid justify-items-center gap-2">
          <UploadCloud
            aria-hidden="true"
            className="size-7 text-(--ui-button-default-hover-foreground)"
          />
          <strong className="text-sm">{text}</strong>
          {hint != null && (
            <span
              className="max-w-md text-xs leading-5 text-ui-muted-foreground"
              id={hintId}
            >
              {hint}
            </span>
          )}
        </span>
      </button>
    </div>
  );
}
