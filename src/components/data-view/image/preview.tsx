import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Download, RotateCw, X, ZoomIn, ZoomOut } from 'lucide-react';
import * as React from 'react';
import { useOverlayZIndex, Z_BASE } from '../../../overlay/z-stack';
import type { ImagePreviewProps } from './types';
import { imagePreviewActionClassName } from './variants';

export function ImagePreview({
  alt,
  closeLabel,
  downloadable,
  downloadLabel,
  onDownload,
  previewToolbar,
  src,
}: ImagePreviewProps) {
  const [scale, setScale] = React.useState(1);
  const [rotation, setRotation] = React.useState(0);
  const [overlayZIndex, layerRef] = useOverlayZIndex<HTMLDivElement>(
    Z_BASE.imagePreview,
  );

  function handleZoomOut() {
    setScale(current => Math.max(0.5, Number((current - 0.25).toFixed(2))));
  }

  function handleZoomIn() {
    setScale(current => Math.min(2, Number((current + 0.25).toFixed(2))));
  }

  function handleRotate() {
    setRotation(current => (current + 90) % 360);
  }

  function handleDownloadClick(event: React.MouseEvent<HTMLAnchorElement>) {
    if (onDownload == null) {
      return;
    }

    event.preventDefault();
    onDownload?.();
  }

  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        className="fixed inset-0 bg-(--ui-image-preview-overlay-background) data-[state=closed]:animate-ui-fade-out data-[state=open]:animate-ui-fade-in"
        style={{ zIndex: overlayZIndex - 1 }}
      />
      <DialogPrimitive.Content
        aria-label={`预览${alt}`}
        className="fixed top-1/2 left-1/2 grid max-h-[calc(100vh-48px)] w-[min(960px,calc(100vw-32px))] -translate-x-1/2 -translate-y-1/2 gap-2 rounded-lg bg-(--ui-image-preview-background) p-3 text-(--ui-image-preview-foreground) shadow-ui-elevation-6 outline-none data-[state=closed]:animate-ui-dialog-out data-[state=open]:animate-ui-dialog-in"
        ref={layerRef}
        style={{ zIndex: overlayZIndex }}
      >
        <DialogPrimitive.Title className="sr-only">
          预览{alt}
        </DialogPrimitive.Title>
        <div className="flex items-center justify-end gap-1.5">
          {previewToolbar ?? (
            <>
              <button
                aria-label="缩小预览"
                className={imagePreviewActionClassName}
                disabled={scale <= 0.5}
                onClick={handleZoomOut}
                type="button"
              >
                <ZoomOut aria-hidden="true" className="size-3.5" />
              </button>
              <button
                aria-label="放大预览"
                className={imagePreviewActionClassName}
                disabled={scale >= 2}
                onClick={handleZoomIn}
                type="button"
              >
                <ZoomIn aria-hidden="true" className="size-3.5" />
              </button>
              <button
                aria-label="旋转图片"
                className={imagePreviewActionClassName}
                onClick={handleRotate}
                type="button"
              >
                <RotateCw aria-hidden="true" className="size-3.5" />
              </button>
              {downloadable ? (
                <a
                  aria-label={downloadLabel}
                  className={imagePreviewActionClassName}
                  download
                  href={src}
                  onClick={handleDownloadClick}
                >
                  <Download aria-hidden="true" className="size-3.5" />
                </a>
              ) : (
                <button
                  aria-label={downloadLabel}
                  className={imagePreviewActionClassName}
                  disabled
                  type="button"
                >
                  <Download aria-hidden="true" className="size-3.5" />
                </button>
              )}
            </>
          )}
          <DialogPrimitive.Close asChild>
            <button
              aria-label={closeLabel}
              className={imagePreviewActionClassName}
              type="button"
            >
              <X aria-hidden="true" className="size-3.5" />
            </button>
          </DialogPrimitive.Close>
        </div>
        <div className="grid min-h-[240px] place-items-center overflow-auto rounded-md border border-(--ui-image-preview-border) bg-(--ui-image-preview-content-background) p-3">
          <img
            alt={alt}
            className="max-h-[calc(100vh-150px)] max-w-full rounded-md object-contain transition-ui-transform motion-reduce:transition-none"
            src={src}
            style={{
              transform: `scale(${scale}) rotate(${rotation}deg)`,
            }}
          />
        </div>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
