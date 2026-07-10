export type PaginationPageItem = number | `ellipsis-${number}-${number}`;

export type PaginationVariant = 'compact' | 'simple' | 'table';

export interface PaginationProps {
  current?: number;
  compact?: boolean;
  disabled?: boolean;
  loading?: boolean;
  page?: number;
  pageSize: number;
  total: number;
  pageSizeOptions?: readonly number[];
  showJumper?: boolean;
  showPageSize?: boolean;
  showQuickJump?: boolean;
  showTotal?: boolean;
  variant?: PaginationVariant;
  onChange?: (current: number, pageSize: number) => void;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}
