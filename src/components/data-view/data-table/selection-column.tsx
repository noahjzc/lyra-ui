import type { Row, RowData, Table } from '@tanstack/react-table';
import { Checkbox } from '../../data-input';

export function SelectionHeader<TData extends RowData>({
  table,
}: {
  table: Table<TData>;
}) {
  return (
    <Checkbox
      aria-label="选择当前页全部行"
      checked={
        table.getIsAllPageRowsSelected()
          ? true
          : table.getIsSomePageRowsSelected()
            ? 'indeterminate'
            : false
      }
      onCheckedChange={checked => table.toggleAllPageRowsSelected(!!checked)}
    />
  );
}

export function SelectionCell<TData extends RowData>({
  row,
}: {
  row: Row<TData>;
}) {
  return (
    <Checkbox
      aria-label={`选择第 ${row.index + 1} 行`}
      checked={row.getIsSelected()}
      disabled={!row.getCanSelect()}
      onCheckedChange={checked => row.toggleSelected(!!checked)}
    />
  );
}
