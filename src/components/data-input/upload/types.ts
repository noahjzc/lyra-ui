import type * as React from 'react';

export type UploadVariant = 'button' | 'dragger' | 'picture';
export type UploadStatus = 'done' | 'error' | 'ready' | 'uploading';

export interface UploadFileItem {
  error?: React.ReactNode;
  file?: File;
  name: string;
  percent?: number;
  size?: number;
  status?: UploadStatus;
  thumbUrl?: string;
  uid: string;
  url?: string;
}

export interface UploadBeforeResult {
  error?: React.ReactNode;
  ok: boolean;
}

export interface UploadProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    'defaultValue' | 'onChange'
  > {
  accept?: string;
  beforeUpload?: (
    file: File,
    currentFiles: UploadFileItem[],
  ) => UploadBeforeResult | boolean | Promise<UploadBeforeResult | boolean>;
  buttonText?: React.ReactNode;
  defaultValue?: UploadFileItem[];
  directory?: boolean;
  disabled?: boolean;
  dragText?: React.ReactNode;
  hint?: React.ReactNode;
  maxCount?: number;
  maxSize?: number;
  multiple?: boolean;
  onDownload?: (file: UploadFileItem) => void;
  onPreview?: (file: UploadFileItem) => void;
  onRemove?: (file: UploadFileItem) => void;
  onRetry?: (file: UploadFileItem) => void;
  onValueChange?: (files: UploadFileItem[]) => void;
  pictureSize?: number;
  readOnly?: boolean;
  value?: UploadFileItem[];
  variant?: UploadVariant;
}

export interface DirectoryInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  directory?: string;
  webkitdirectory?: string;
}
