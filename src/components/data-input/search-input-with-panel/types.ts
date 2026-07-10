import type { SearchInputProps } from '../search-input';
import type {
  SearchSuggestionGroup,
  SearchSuggestionOption,
  SearchSuggestionPanelProps,
} from '../search-suggestion-panel/types';

export interface SearchInputWithPanelProps<TData = unknown>
  extends Omit<SearchInputProps, 'onValueChange' | 'value'> {
  defaultOpen?: boolean;
  groups?: SearchSuggestionGroup<TData>[];
  onOpenChange?: (open: boolean) => void;
  onOptionSelect?: (option: SearchSuggestionOption<TData>) => void;
  onValueChange?: (value: string) => void;
  open?: boolean;
  panelClassName?: string;
  panelProps?: Omit<
    SearchSuggestionPanelProps<TData>,
    'activeValue' | 'groups' | 'onActiveValueChange' | 'onSelect' | 'query'
  >;
  selectBehavior?: 'fill' | 'none' | 'search';
  value?: string;
}
