import type * as React from 'react';

export interface SearchSuggestionRenderState<TData = unknown> {
  active: boolean;
  option: SearchSuggestionOption<TData>;
  query: string;
  selected: boolean;
}

export interface SearchSuggestionOption<TData = unknown> {
  data?: TData;
  description?: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
  label?: React.ReactNode;
  meta?: React.ReactNode;
  render?: (
    option: SearchSuggestionOption<TData>,
    state: SearchSuggestionRenderState<TData>,
  ) => React.ReactNode;
  value: string;
}

export interface SearchSuggestionGroup<TData = unknown> {
  key?: string;
  label?: React.ReactNode;
  options: SearchSuggestionOption<TData>[];
}

export interface SearchSuggestionPanelProps<TData = unknown>
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  activeValue?: string;
  emptyText?: React.ReactNode;
  error?: React.ReactNode;
  groups?: SearchSuggestionGroup<TData>[];
  loading?: boolean;
  loadingText?: React.ReactNode;
  onActiveValueChange?: (value: string) => void;
  onRetry?: () => void;
  onSelect?: (option: SearchSuggestionOption<TData>) => void;
  query?: string;
  renderOption?: (
    option: SearchSuggestionOption<TData>,
    state: SearchSuggestionRenderState<TData>,
  ) => React.ReactNode;
  selectedValue?: string;
}
