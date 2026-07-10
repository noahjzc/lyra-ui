import { AlertCircle, FileText, LoaderCircle } from 'lucide-react';
import { cn } from '../../../internal/cn';
import { UploadActionButton } from './action-buttons';
import type { UploadFileItem } from './types';
import { formatFileSize } from './utils';

export function UploadList({
  files,
  onDownload,
  onPreview,
  onRemove,
  onRetry,
  readOnly,
}: {
  files: UploadFileItem[];
  onDownload?: (file: UploadFileItem) => void;
  onPreview?: (file: UploadFileItem) => void;
  onRemove: (file: UploadFileItem) => void;
  onRetry?: (file: UploadFileItem) => void;
  readOnly?: boolean;
}) {
  return (
    <div className="grid overflow-hidden rounded-lg border border-(--ui-divider-soft)">
      {files.map(file => (
        <UploadListRow
          file={file}
          key={file.uid}
          onDownload={onDownload}
          onPreview={onPreview}
          onRemove={onRemove}
          onRetry={onRetry}
          readOnly={readOnly}
        />
      ))}
    </div>
  );
}

function UploadListRow({
  file,
  onDownload,
  onPreview,
  onRemove,
  onRetry,
  readOnly,
}: {
  file: UploadFileItem;
  onDownload?: (file: UploadFileItem) => void;
  onPreview?: (file: UploadFileItem) => void;
  onRemove: (file: UploadFileItem) => void;
  onRetry?: (file: UploadFileItem) => void;
  readOnly?: boolean;
}) {
  const status = file.status ?? 'done';
  const percent = Math.max(0, Math.min(100, file.percent ?? 0));
  const isError = status === 'error';
  const isUploading = status === 'uploading';

  return (
    <div
      aria-live={isUploading || isError ? 'polite' : undefined}
      className={cn(
        'grid min-h-[42px] grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-(--ui-divider-soft) border-b px-3 py-2 last:border-b-0',
        isError && 'bg-(--ui-input-error-background)',
      )}
      data-slot="upload-file-row"
      data-status={status}
    >
      <div className="grid min-w-0 gap-1">
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
              'min-w-0 truncate text-sm font-bold',
              isError && 'text-ui-destructive',
            )}
          >
            {file.name}
          </span>
        </span>
        <span className="text-xs text-ui-muted-foreground">
          {isUploading
            ? `上传中 · ${percent}% · 可取消`
            : isError
              ? (file.error ?? '上传失败')
              : `${formatFileSize(file.size)} · 已完成`}
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
        {!readOnly && (
          <UploadActionButton
            ariaLabel={`${isUploading ? '取消' : '移除'} ${file.name}`}
            onClick={() => onRemove(file)}
          >
            {isUploading ? '取消' : '移除'}
          </UploadActionButton>
        )}
      </span>
    </div>
  );
}
