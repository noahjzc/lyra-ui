import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../data-input/select';

export interface PaginationPageSizeProps {
  disabled?: boolean;
  onChange: (pageSize: number) => void;
  options: readonly number[];
  pageSize: number;
}

export function PaginationPageSize({
  disabled = false,
  onChange,
  options,
  pageSize,
}: PaginationPageSizeProps) {
  return (
    <div
      className="flex shrink-0 items-center gap-2 whitespace-nowrap"
      data-slot="pagination-page-size"
    >
      <span aria-hidden="true" className="shrink-0 whitespace-nowrap">
        每页
      </span>
      <Select
        disabled={disabled}
        onValueChange={value => onChange(Number(value))}
        value={String(pageSize)}
      >
        <SelectTrigger
          aria-label="每页条数"
          className="w-[104px] min-w-[104px] shrink-0 whitespace-nowrap"
          size="middle"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map(option => (
            <SelectItem key={option} value={String(option)}>
              {option} 条/页
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
