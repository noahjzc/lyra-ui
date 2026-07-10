import { AlertCircle, Eye, ImageIcon, Plus, Trash2 } from 'lucide-react';
import type * as React from 'react';
import { cn } from '../../../internal/cn';
import { PictureActionButton } from './action-buttons';
import type { UploadFileItem } from './types';

export function UploadPictureWall({
  accept,
  disabled,
  files,
  hint,
  hintId,
  inputNode,
  onOpen,
  onPreview,
  onRemove,
  onRetry,
  pictureSize,
  readOnly,
}: {
  accept?: string;
  disabled: boolean;
  files: UploadFileItem[];
  hint?: React.ReactNode;
  hintId: string;
  inputNode: React.ReactNode;
  onOpen: () => void;
  onPreview?: (file: UploadFileItem) => void;
  onRemove: (file: UploadFileItem) => void;
  onRetry?: (file: UploadFileItem) => void;
  pictureSize: number;
  readOnly: boolean;
}) {
  return (
    <div className="grid gap-1.5">
      {inputNode}
      <div className="flex flex-wrap gap-2" data-slot="upload-picture-wall">
        {files.map(file => (
          <UploadPictureItem
            file={file}
            key={file.uid}
            onPreview={onPreview}
            onRemove={onRemove}
            onRetry={onRetry}
            readOnly={readOnly}
            size={pictureSize}
          />
        ))}
        <button
          aria-describedby={hint != null ? hintId : undefined}
          className="grid place-items-center rounded-lg border border-dashed border-(--ui-button-ghost-hover-border) bg-gradient-to-br from-(--ui-button-ghost-background)/70 to-(--ui-input-background) text-xs font-bold text-(--ui-button-default-hover-foreground) transition-ui-state transition-ui-transform hover:border-(--ui-button-primary-background) hover:bg-(--ui-control-hover-background) active:scale-95 disabled:cursor-not-allowed disabled:border-(--ui-input-disabled-border) disabled:bg-(--ui-input-disabled-background) disabled:text-(--ui-input-disabled-foreground)"
          data-slot="upload-picture-trigger"
          disabled={disabled}
          onClick={onOpen}
          style={{ height: pictureSize, width: pictureSize }}
          type="button"
        >
          <span className="grid h-full w-full grid-rows-[24px_16px_16px] place-items-center content-center gap-1 px-2 py-3">
            <span className="grid size-6 place-items-center text-(--ui-button-primary-background)">
              <Plus aria-hidden="true" className="size-5" />
            </span>
            <span className="text-xs font-extrabold leading-4">上传图片</span>
            <span className="min-h-4 text-[11px] font-semibold leading-4 text-ui-muted-foreground">
              {accept != null ? accept.replaceAll(',', ' / ') : ''}
            </span>
          </span>
        </button>
      </div>
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

function UploadPictureItem({
  file,
  onPreview,
  onRemove,
  onRetry,
  readOnly,
  size,
}: {
  file: UploadFileItem;
  onPreview?: (file: UploadFileItem) => void;
  onRemove: (file: UploadFileItem) => void;
  onRetry?: (file: UploadFileItem) => void;
  readOnly: boolean;
  size: number;
}) {
  const status = file.status ?? 'done';
  const percent = Math.max(0, Math.min(100, file.percent ?? 0));
  const isError = status === 'error';
  const isUploading = status === 'uploading';

  return (
    <fieldset
      aria-label={
        isUploading
          ? `${file.name} 上传中 ${percent}%`
          : readOnly
            ? `${file.name} 只读`
            : file.name
      }
      className={cn(
        'group relative grid min-w-0 overflow-hidden rounded-lg border border-(--ui-input-border) bg-(--ui-surface-muted-background) p-0 text-xs text-ui-muted-foreground',
        isError &&
          'border-(--ui-button-danger-border) bg-(--ui-input-error-background) text-ui-destructive',
      )}
      data-slot="upload-picture-item"
      data-status={status}
      style={{ height: size, width: size }}
    >
      {isError ? (
        <>
          {!readOnly && onRemove ? (
            <button
              aria-label={`删除 ${file.name}`}
              className="absolute top-1.5 right-1.5 z-(--ui-layer-action-z-index) grid size-5 place-items-center rounded-full text-(--ui-button-danger-foreground) opacity-0 transition-ui-state transition-ui-transform hover:bg-(--ui-button-danger-hover-background) focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-(--ui-button-danger-focus-border) focus-visible:outline-offset-1 group-hover:opacity-100 group-focus-within:opacity-100"
              onClick={() => onRemove(file)}
              type="button"
            >
              <Trash2 aria-hidden="true" className="size-3.5" />
            </button>
          ) : null}
          <span className="relative z-10 grid h-full w-full grid-rows-[24px_16px_16px] place-items-center content-center gap-1 px-2 py-3 text-center">
            <span className="grid size-6 place-items-center text-(--ui-upload-error-icon-foreground)">
              <AlertCircle aria-hidden="true" className="size-5" />
            </span>
            <strong className="text-xs leading-4">上传失败</strong>
            {onRetry && !readOnly ? (
              <button
                aria-label={`重试 ${file.name}`}
                className="h-4 rounded px-1.5 text-[11px] font-extrabold leading-4 text-(--ui-button-danger-foreground) transition-ui-state hover:text-(--ui-upload-danger-hover-foreground) focus-visible:outline-2 focus-visible:outline-(--ui-button-danger-focus-border) focus-visible:outline-offset-1"
                onClick={() => onRetry(file)}
                type="button"
              >
                重试
              </button>
            ) : (
              <span className="min-h-4" />
            )}
          </span>
        </>
      ) : file.thumbUrl ? (
        <img
          alt={file.name}
          className={cn(
            'h-full w-full object-cover',
            isUploading && 'saturate-75',
          )}
          src={file.thumbUrl}
        />
      ) : (
        <span className="grid place-items-center gap-1 p-2 text-center">
          <ImageIcon aria-hidden="true" className="size-5" />
          <span className="line-clamp-2">{file.name}</span>
        </span>
      )}
      {file.thumbUrl && !isError && !isUploading && (
        <span className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-(--ui-image-preview-background)/65 to-transparent px-2 pt-5 pb-1 text-left text-[11px] font-extrabold text-(--ui-inverse-foreground)">
          {file.name}
        </span>
      )}
      {isUploading && (
        <span className="absolute inset-0 grid place-items-center bg-(--ui-image-preview-background)/42 px-2 text-center text-(--ui-inverse-foreground)">
          <span className="grid gap-1">
            <strong className="text-xs leading-none">上传中</strong>
            <span className="text-[11px] font-extrabold leading-none">
              {percent}%
            </span>
          </span>
        </span>
      )}
      {isUploading && (
        <span
          aria-live="polite"
          className="absolute inset-x-2 bottom-2 h-1.5 overflow-hidden rounded-full bg-(--ui-upload-progress-track-background)"
        >
          <span
            className="block h-full rounded-full bg-(--ui-button-primary-background)"
            style={{ width: `${percent}%` }}
          />
        </span>
      )}
      {!isUploading && !isError && (
        <span
          className={cn(
            'absolute inset-0 hidden place-items-center bg-(--ui-image-preview-background)/58 text-(--ui-inverse-foreground) group-hover:grid group-focus-within:grid',
            readOnly && 'grid bg-(--ui-image-preview-background)/36',
          )}
        >
          <span className="inline-flex gap-1">
            {readOnly ? (
              <span className="font-extrabold">只读</span>
            ) : onPreview ? (
              <PictureActionButton
                ariaLabel={`预览 ${file.name}`}
                onClick={() => onPreview(file)}
              >
                <Eye aria-hidden="true" className="size-4" />
              </PictureActionButton>
            ) : null}
            {!readOnly && (
              <PictureActionButton
                ariaLabel={`删除 ${file.name}`}
                onClick={() => onRemove(file)}
              >
                <Trash2 aria-hidden="true" className="size-4" />
              </PictureActionButton>
            )}
          </span>
        </span>
      )}
    </fieldset>
  );
}
