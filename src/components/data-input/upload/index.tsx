import * as React from 'react';
import { cn } from '../../../internal/cn';
import {
  UploadButton,
  UploadDragger,
  UploadList,
  UploadPictureWall,
  UploadSingleAttachment,
} from './components';
import { useUploadFiles } from './hooks';
import type { DirectoryInputProps, UploadFileItem, UploadProps } from './types';
import { formatFileSize, matchesAccept, normalizeBeforeResult } from './utils';

export type {
  DirectoryInputProps,
  UploadBeforeResult,
  UploadFileItem,
  UploadProps,
  UploadStatus,
  UploadVariant,
} from './types';

export const Upload = React.forwardRef<HTMLDivElement, UploadProps>(
  (
    {
      accept,
      beforeUpload,
      buttonText = '上传附件',
      className,
      defaultValue,
      directory = false,
      disabled = false,
      dragText = '拖拽文件到这里，或点击选择',
      hint,
      maxCount,
      maxSize,
      multiple = false,
      onDownload,
      onPreview,
      onRemove,
      onRetry,
      onValueChange,
      pictureSize = 96,
      readOnly = false,
      value,
      variant = 'button',
      ...props
    },
    ref,
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const uidRef = React.useRef(0);
    const hintId = React.useId();
    const [dragActive, setDragActive] = React.useState(false);
    const [files, setFiles] = useUploadFiles({
      defaultValue,
      onValueChange,
      value,
    });
    const canAddMore = maxCount == null || files.length < maxCount;
    const canOpenButtonTrigger = !disabled && !readOnly && canAddMore;
    const canReplaceSingleFile = !disabled && !readOnly && !multiple;
    const inputProps: DirectoryInputProps = directory
      ? { directory: '', webkitdirectory: '' }
      : {};

    function nextUid() {
      uidRef.current += 1;
      return `upload-${Date.now()}-${uidRef.current}`;
    }

    function openFileDialog() {
      if (disabled || readOnly) return;

      inputRef.current?.click();
    }

    function removeFile(file: UploadFileItem) {
      if (disabled || readOnly) return;

      const nextFiles = files.filter(item => item.uid !== file.uid);

      setFiles(nextFiles);
      onRemove?.(file);
    }

    async function buildUploadItem(
      file: File,
      currentFiles: UploadFileItem[],
    ): Promise<UploadFileItem> {
      if (maxSize != null && file.size > maxSize) {
        return {
          error: `文件超过 ${formatFileSize(maxSize)}`,
          file,
          name: file.name,
          size: file.size,
          status: 'error',
          uid: nextUid(),
        };
      }

      if (!matchesAccept(file, accept)) {
        return {
          error: '文件类型不支持',
          file,
          name: file.name,
          size: file.size,
          status: 'error',
          uid: nextUid(),
        };
      }

      if (beforeUpload) {
        const result = normalizeBeforeResult(
          await beforeUpload(file, currentFiles),
        );

        if (!result.ok) {
          return {
            error: result.error ?? '上传前校验失败',
            file,
            name: file.name,
            size: file.size,
            status: 'error',
            uid: nextUid(),
          };
        }
      }

      return {
        file,
        name: file.name,
        size: file.size,
        status: 'ready',
        uid: nextUid(),
      };
    }

    async function addFiles(fileList: FileList | File[]) {
      if (disabled || readOnly) return;

      const incomingFiles = Array.from(fileList);
      const existingCount = multiple ? files.length : 0;
      const remainingCount =
        maxCount == null ? incomingFiles.length : maxCount - existingCount;
      const acceptedFiles = multiple
        ? incomingFiles.slice(0, Math.max(0, remainingCount))
        : incomingFiles.slice(0, 1);
      const limitedError =
        maxCount != null && incomingFiles.length > remainingCount
          ? [
              {
                error: `最多上传 ${maxCount} 个文件`,
                name: incomingFiles[remainingCount]?.name ?? '超出数量限制',
                status: 'error' as const,
                uid: nextUid(),
              },
            ]
          : [];
      const nextItems = await Promise.all(
        acceptedFiles.map(file => buildUploadItem(file, files)),
      );
      const nextFiles = multiple
        ? [...files, ...nextItems, ...limitedError]
        : [...nextItems, ...limitedError];

      setFiles(nextFiles);

      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
      if (!event.currentTarget.files) return;

      void addFiles(event.currentTarget.files);
    }

    function handleDrop(event: React.DragEvent<HTMLButtonElement>) {
      event.preventDefault();
      setDragActive(false);
      void addFiles(event.dataTransfer.files);
    }

    const inputNode = (
      <input
        accept={accept}
        aria-hidden="true"
        className="hidden"
        disabled={disabled || readOnly}
        multiple={multiple}
        onChange={handleInputChange}
        ref={inputRef}
        tabIndex={-1}
        type="file"
        {...inputProps}
      />
    );

    return (
      <div
        className={cn('grid min-w-0 gap-2 text-ui-foreground', className)}
        data-disabled={disabled ? true : undefined}
        data-slot="upload-root"
        ref={ref}
        {...props}
      >
        {variant === 'dragger' ? (
          <UploadDragger
            active={dragActive}
            disabled={disabled || readOnly || !canAddMore}
            hint={hint}
            hintId={hintId}
            inputNode={inputNode}
            onDragActiveChange={setDragActive}
            onDrop={handleDrop}
            onOpen={openFileDialog}
            text={dragText}
          />
        ) : variant === 'picture' ? (
          <UploadPictureWall
            accept={accept}
            disabled={disabled || readOnly || !canAddMore}
            files={files}
            hint={hint}
            hintId={hintId}
            inputNode={inputNode}
            onOpen={openFileDialog}
            onPreview={onPreview}
            onRemove={removeFile}
            onRetry={onRetry}
            pictureSize={pictureSize}
            readOnly={readOnly}
          />
        ) : !multiple && files.length > 0 ? (
          <UploadSingleAttachment
            disabled={disabled}
            file={files[0]}
            hint={hint}
            hintId={hintId}
            inputNode={inputNode}
            onDownload={onDownload}
            onOpen={openFileDialog}
            onPreview={onPreview}
            onRemove={removeFile}
            onRetry={onRetry}
            readOnly={readOnly}
            replaceDisabled={!canReplaceSingleFile}
          />
        ) : (
          <UploadButton
            disabled={!canOpenButtonTrigger}
            hint={hint}
            hintId={hintId}
            inputNode={inputNode}
            onOpen={openFileDialog}
          >
            {files.length > 0 && !multiple ? '替换' : buttonText}
          </UploadButton>
        )}
        {variant !== 'picture' && (multiple || files.length === 0) && (
          <UploadList
            files={files}
            onDownload={onDownload}
            onPreview={onPreview}
            onRemove={removeFile}
            onRetry={onRetry}
            readOnly={readOnly}
          />
        )}
      </div>
    );
  },
);

Upload.displayName = 'Upload';
