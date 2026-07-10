import type * as React from 'react';

export function UploadActionButton({
  ariaLabel,
  children,
  disabled,
  onClick,
}: {
  ariaLabel?: string;
  children: React.ReactNode;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={ariaLabel}
      className="inline-flex h-7 items-center justify-center rounded-md px-2 text-xs font-bold text-(--ui-button-default-hover-foreground) transition-ui-state hover:bg-(--ui-control-hover-background) disabled:cursor-not-allowed disabled:text-ui-muted-foreground"
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

export function PictureActionButton({
  ariaLabel,
  children,
  onClick,
}: {
  ariaLabel?: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={ariaLabel}
      className="inline-grid size-8 place-items-center rounded-md text-(--ui-inverse-foreground) transition-ui-state hover:text-(--ui-accent-soft-border) focus-visible:outline-2 focus-visible:outline-(--ui-upload-picture-action-focus-outline) focus-visible:outline-offset-2"
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
