import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Download, Eye, ImageOff, LockKeyhole } from 'lucide-react';
import * as React from 'react';
import { cn } from '../../../internal/cn';
import { ImagePreview } from './preview';
import type { ImageProps, ImageStatus } from './types';
import { resolveImageStyle } from './utils';
import { imageActionClassName, imageVariants } from './variants';

export type {
  ImageObjectFit,
  ImagePreviewProps,
  ImageProps,
  ImageStatus,
} from './types';

function getFallbackText(status: ImageStatus) {
  if (status === 'permission-denied') return '无预览权限';
  if (status === 'loading') return '加载中';

  return '图片不可用';
}

export const Image = React.forwardRef<HTMLDivElement, ImageProps>(
  (
    {
      actions,
      alt,
      caption,
      className,
      disabled = false,
      downloadLabel = `下载${alt}`,
      downloadable = false,
      errorText,
      fallback,
      height,
      imageLoading,
      loading,
      objectFit = 'cover',
      onDownload,
      onPreviewChange,
      permissionText,
      preview = false,
      previewCloseLabel = '关闭预览',
      previewLabel = `预览${alt}`,
      previewOpen,
      previewToolbar,
      ratio = 1,
      src,
      status,
      style,
      width = 80,
      ...props
    },
    ref,
  ) => {
    const [failedSrc, setFailedSrc] = React.useState<string | undefined>();
    const [internalPreviewOpen, setInternalPreviewOpen] = React.useState(false);
    const hasSrc = src != null && src !== '';
    const effectiveStatus: ImageStatus =
      status ?? (failedSrc === src || !hasSrc ? 'error' : 'ready');
    const hasImage = hasSrc && effectiveStatus === 'ready';
    const open = previewOpen ?? internalPreviewOpen;
    const previewable = preview && hasImage && !disabled;
    const downloadableAction = downloadable && hasSrc;
    const showOverlay =
      (previewable || downloadableAction || actions != null) &&
      !disabled &&
      hasImage;
    const showFallbackActions =
      !hasImage &&
      !disabled &&
      effectiveStatus !== 'loading' &&
      (downloadableAction || actions != null);
    const loadingStrategy = imageLoading ?? loading ?? 'lazy';

    function setPreviewOpen(nextOpen: boolean) {
      if (previewOpen == null) {
        setInternalPreviewOpen(nextOpen);
      }

      onPreviewChange?.(nextOpen);
    }

    function handleImageError() {
      setFailedSrc(src);
    }

    function handleDownload(event: React.MouseEvent<HTMLAnchorElement>) {
      if (onDownload == null) {
        return;
      }

      event.preventDefault();
      onDownload();
    }

    const downloadAction = downloadableAction ? (
      <a
        aria-label={downloadLabel}
        className={imageActionClassName}
        download
        href={src}
        onClick={handleDownload}
      >
        <Download aria-hidden="true" className="size-3.5" />
      </a>
    ) : null;

    const imageNode = hasImage ? (
      <img
        alt={alt}
        className="h-full w-full"
        loading={loadingStrategy}
        onError={handleImageError}
        src={src}
        style={{ objectFit }}
      />
    ) : (
      <div
        className={cn(
          'grid h-full w-full place-items-center gap-1 p-2 text-center text-xs font-semibold',
          effectiveStatus === 'loading' &&
            'animate-pulse motion-reduce:animate-none',
        )}
        data-slot="image-fallback"
        role={effectiveStatus === 'error' ? 'alert' : 'status'}
      >
        {fallback ?? (
          <>
            {effectiveStatus === 'permission-denied' ? (
              <LockKeyhole aria-hidden="true" className="size-5" />
            ) : (
              <ImageOff aria-hidden="true" className="size-5" />
            )}
            <span>
              {effectiveStatus === 'error'
                ? (errorText ?? getFallbackText(effectiveStatus))
                : effectiveStatus === 'permission-denied'
                  ? (permissionText ?? getFallbackText(effectiveStatus))
                  : getFallbackText(effectiveStatus)}
            </span>
          </>
        )}
        {showFallbackActions && (
          <div
            className="mt-1.5 flex items-center justify-center gap-1.5"
            data-slot="image-fallback-actions"
          >
            {downloadAction}
            {actions}
          </div>
        )}
      </div>
    );

    const imageBox = (
      <div
        aria-disabled={disabled ? true : undefined}
        className={cn(
          imageVariants({ disabled, previewable, status: effectiveStatus }),
          showOverlay && 'group',
          className,
        )}
        data-slot="image"
        ref={ref}
        style={resolveImageStyle({ height, ratio, style, width })}
        {...props}
      >
        {imageNode}
        {showOverlay && (
          <div
            className="absolute inset-x-0 bottom-0 flex justify-center gap-1.5 bg-(--ui-image-actions-background) p-2 opacity-0 transition-ui-state group-hover:opacity-100 focus-within:opacity-100 motion-reduce:transition-none"
            data-slot="image-actions"
          >
            {previewable && (
              <DialogPrimitive.Trigger asChild>
                <button
                  aria-label={previewLabel}
                  className={imageActionClassName}
                  type="button"
                >
                  <Eye aria-hidden="true" className="size-3.5" />
                </button>
              </DialogPrimitive.Trigger>
            )}
            {downloadAction}
            {actions}
          </div>
        )}
      </div>
    );

    return (
      <figure className="inline-grid min-w-0 gap-1.5">
        {previewable ? (
          <DialogPrimitive.Root open={open} onOpenChange={setPreviewOpen}>
            {imageBox}
            <ImagePreview
              alt={alt}
              closeLabel={previewCloseLabel}
              downloadable={downloadableAction || onDownload != null}
              downloadLabel={downloadLabel}
              onDownload={onDownload}
              previewToolbar={previewToolbar}
              src={src}
            />
          </DialogPrimitive.Root>
        ) : (
          imageBox
        )}
        {caption != null && (
          <figcaption className="min-w-0 truncate text-xs font-semibold text-ui-muted-foreground">
            {caption}
          </figcaption>
        )}
      </figure>
    );
  },
);
Image.displayName = 'Image';
