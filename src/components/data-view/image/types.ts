import type * as React from 'react';

export type ImageObjectFit =
  | 'contain'
  | 'cover'
  | 'fill'
  | 'none'
  | 'scale-down';

export type ImageStatus = 'error' | 'loading' | 'permission-denied' | 'ready';

export interface ImageProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  actions?: React.ReactNode;
  alt: string;
  caption?: React.ReactNode;
  disabled?: boolean;
  downloadLabel?: string;
  downloadable?: boolean;
  errorText?: React.ReactNode;
  fallback?: React.ReactNode;
  height?: number | string;
  imageLoading?: React.ImgHTMLAttributes<HTMLImageElement>['loading'];
  loading?: React.ImgHTMLAttributes<HTMLImageElement>['loading'];
  objectFit?: ImageObjectFit;
  onDownload?: () => void;
  onPreviewChange?: (open: boolean) => void;
  permissionText?: React.ReactNode;
  preview?: boolean;
  previewCloseLabel?: string;
  previewLabel?: string;
  previewOpen?: boolean;
  previewToolbar?: React.ReactNode;
  ratio?: number | string;
  status?: ImageStatus;
  src?: string;
  width?: number | string;
}

export interface ImagePreviewProps {
  alt: string;
  closeLabel: string;
  downloadable: boolean;
  downloadLabel: string;
  onDownload?: () => void;
  previewToolbar?: React.ReactNode;
  src: string;
}
