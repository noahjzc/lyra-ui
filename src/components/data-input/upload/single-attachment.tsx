import { AlertCircle, FileText, LoaderCircle } from 'lucide-react';
import type * as React from 'react';
import { cn } from '../../../internal/cn';
import { UploadActionButton } from './action-buttons';
import type { UploadFileItem } from './types';
import { formatFileSize } from './utils';

export function UploadSingleAttachment({
  disabled,
  file,
  hint,
  hintId,
  inputNode,
  onDownload,
  onOpen,
  onPreview,
  onRemove,
  onRetry,
  readOnly,
  replaceDisabled,
}: {
  disabled: boolean;
  file: UploadFileItem;
  hint?: React.ReactNode;
  hintId: string;
  inputNode: React.ReactNode;
  onDownload?: (file: UploadFileItem) => void;
  onOpen: () => void;
  onPreview?: (file: UploadFileItem) => void;
  onRemove: (file: UploadFileItem) => void;
  onRetry?: (file: UploadFileItem) => void;
  readOnly: boolean;
  replaceDisabled: boolean;
}) {
  const status = file.status ?? 'done';
  const isError = status === 'error';
  const isUploading = status === 'uploading';
  const percent = Math.max(0, Math.min(100, file.percent ?? 0));

  return (
    <div className="grid justify-items-start gap-1.5">
      {inputNode}
      <div
        className={cn(
          'grid w-full min-w-0 max-w-md gap-1.5 rounded-lg border border-(--ui-input-border) bg-(--ui-input-background) px-3 py-2',
          isError &&
            'border-(--ui-button-danger-border) bg-(--ui-input-error-background)',
          disabled &&
            'border-(--ui-input-disabled-border) bg-(--ui-control-disabled-background)',
        )}
        data-slot="upload-single-attachment"
        data-status={status}
      >
        <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
          <span className="flex min-w-0 items-center gap-2">
            {isError ? (
              <AlertCircle
                aria-hidden="true"
                className="size-4 text-ui-destructive"
              />
            ) : isUploading ? (
              <LoaderCircle
                aria-hidden="true"
                className="size-4 animate-spin text-(--ui-button-default-hover-foreground) motion-reduce:animate-none"
              />
            ) : (
              <FileText
                aria-hidden="true"
                className="size-4 text-(--ui-control-muted-foreground)"
              />
            )}
            <span
              className={cn(
                'min-w-0 truncate text-sm font-bold text-ui-foreground',
                isError && 'text-ui-destructive',
              )}
            >
              {file.name}
            </span>
          </span>
          <span className="inline-flex shrink-0 items-center gap-1">
            {isError && onRetry && !readOnly ? (
              <UploadActionButton
                ariaLabel={`重试 ${file.name}`}
                onClick={() => onRetry(file)}
              >
                重试
              </UploadActionButton>
            ) : null}
            {!isError && onPreview ? (
              <UploadActionButton
                ariaLabel={`预览 ${file.name}`}
                onClick={() => onPreview(file)}
              >
                预览
              </UploadActionButton>
            ) : null}
            {!isError && onDownload ? (
              <UploadActionButton
                ariaLabel={`下载 ${file.name}`}
                onClick={() => onDownload(file)}
              >
                下载
              </UploadActionButton>
            ) : null}
            {!readOnly && !disabled && (
              <UploadActionButton
                ariaLabel={`替换 ${file.name}`}
                disabled={replaceDisabled}
                onClick={onOpen}
              >
                替换
              </UploadActionButton>
            )}
            {!readOnly && (
              <UploadActionButton
                ariaLabel={`${isUploading ? '取消' : '移除'} ${file.name}`}
                disabled={disabled}
                onClick={() => onRemove(file)}
              >
                {isUploading ? '取消' : '移除'}
              </UploadActionButton>
            )}
          </span>
        </div>
        <span className="text-xs text-ui-muted-foreground">
          {isUploading
            ? `上传中 · ${percent}% · 可取消`
            : isError
              ? (file.error ?? '上传失败，请重试')
              : `${formatFileSize(file.size)} · ${readOnly ? '只读' : '已完成'}`}
        </span>
        {isUploading && (
          <span className="h-1.5 overflow-hidden rounded-full bg-(--ui-divider-soft)">
            <span
              className="block h-full rounded-full bg-(--ui-button-primary-background)"
              style={{ width: `${percent}%` }}
            />
          </span>
        )}
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
