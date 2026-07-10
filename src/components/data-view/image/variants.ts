import { cva } from 'class-variance-authority';

export const imageVariants = cva(
  'relative inline-flex min-w-0 items-center justify-center overflow-hidden rounded-md border bg-ui-muted text-ui-muted-foreground transition-ui-state motion-reduce:transition-none',
  {
    variants: {
      disabled: {
        true: 'opacity-55',
        false: '',
      },
      previewable: {
        true: 'cursor-pointer hover:border-(--ui-input-hover-border)',
        false: '',
      },
      status: {
        error:
          'border-ui-destructive/30 bg-ui-destructive/10 text-ui-destructive',
        loading: 'border-ui-border bg-ui-muted text-ui-muted-foreground',
        'permission-denied':
          'border-ui-border bg-ui-muted/80 text-ui-muted-foreground',
        ready: 'border-ui-border',
      },
    },
    defaultVariants: {
      disabled: false,
      previewable: false,
      status: 'ready',
    },
  },
);

export const imageActionClassName =
  'inline-flex size-6 items-center justify-center rounded-[5px] border border-(--ui-image-action-border) bg-(--ui-image-action-background) text-(--ui-image-preview-foreground) transition-ui-state transition-ui-transform hover:bg-(--ui-image-action-hover-background) active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ui-image-action-focus-ring)';

export const imagePreviewActionClassName =
  'inline-flex size-[26px] items-center justify-center rounded-[5px] border border-(--ui-image-preview-border) bg-(--ui-image-preview-action-background) text-(--ui-image-preview-action-foreground) transition-ui-state transition-ui-transform hover:bg-(--ui-image-action-hover-background) active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ui-image-action-focus-ring) disabled:cursor-not-allowed disabled:text-(--ui-image-preview-action-disabled-foreground) disabled:hover:bg-(--ui-image-preview-action-background)';
