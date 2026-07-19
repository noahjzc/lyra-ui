import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
  DataTable,
  type DataTableColumn,
} from '../../src/components/data-view';

interface CustomerRow {
  id: string;
  level: string;
  name: string;
}

const rows: CustomerRow[] = [
  { id: '1', level: 'A', name: '上海客户' },
  { id: '2', level: 'B', name: '北京客户' },
];

const columns: DataTableColumn<CustomerRow>[] = [
  {
    accessorKey: 'name',
    enableSorting: true,
    header: '客户名称',
    id: 'name',
    meta: { pinned: 'left', width: 160 },
  },
  { accessorKey: 'level', header: '等级', id: 'level' },
  {
    cell: () => <button type="button">查看</button>,
    header: '操作',
    id: 'action',
    meta: { align: 'right', pinned: 'right', width: 80 },
  },
];

function getRowByText(text: string) {
  const row = screen.getByText(text).closest('tr');

  expect(row).not.toBeNull();

  return row as HTMLTableRowElement;
}

describe('DataTable primitive', () => {
  it('renders rows, pinned columns and row click', async () => {
    const user = userEvent.setup();
    const onRowClick = vi.fn();

    render(
      <DataTable
        columns={columns}
        data={rows}
        getRowId={row => row.id}
        onRowClick={onRowClick}
      />,
    );

    expect(screen.getByRole('columnheader', { name: /客户名称/ })).toHaveClass(
      'ly-data-table-cell-pinned-left',
      'ly-data-table-cell-pinned-left-edge',
    );
    expect(screen.getByRole('columnheader', { name: '操作' })).toHaveClass(
      'ly-data-table-cell-pinned-right',
      'ly-data-table-cell-pinned-right-edge',
    );
    expect(screen.getByRole('cell', { name: '上海客户' })).toBeInTheDocument();

    await user.click(getRowByText('北京客户'));

    expect(onRowClick).toHaveBeenCalledWith(rows[1]);
  });

  it('lets the internal scroll region fill available height', () => {
    render(<DataTable className="h-full" columns={columns} data={rows} />);

    expect(
      screen.getByRole('table').closest('[data-slot="data-table"]'),
    ).toHaveClass('flex', 'min-h-0', 'flex-col');
    expect(
      document.querySelector('[data-slot="data-table-scroll"]'),
    ).toHaveClass('min-h-0', 'flex-1', 'overflow-auto');
  });

  it('does not trigger row click from an inner action', async () => {
    const user = userEvent.setup();
    const onRowClick = vi.fn();

    render(<DataTable columns={columns} data={rows} onRowClick={onRowClick} />);

    await user.click(screen.getAllByRole('button', { name: '查看' })[0]);

    expect(onRowClick).not.toHaveBeenCalled();
  });

  it('supports sorting state and aria-sort', async () => {
    const user = userEvent.setup();

    render(<DataTable columns={columns} data={rows} />);

    await user.click(screen.getByRole('button', { name: /客户名称/ }));

    expect(
      screen.getByRole('columnheader', { name: /客户名称/ }),
    ).toHaveAttribute('aria-sort', 'ascending');
  });

  it('supports selection and footer summary', async () => {
    const user = userEvent.setup();
    const onRowSelectionChange = vi.fn();

    render(
      <DataTable
        columns={columns}
        data={rows}
        getRowId={row => row.id}
        onRowSelectionChange={onRowSelectionChange}
        selectable
      />,
    );

    await user.click(screen.getByRole('checkbox', { name: '选择第 1 行' }));

    expect(onRowSelectionChange).toHaveBeenCalled();
    expect(screen.getByText('已选择 1 条数据')).toBeInTheDocument();
  });

  it('only marks the outside edge in a pinned column group', () => {
    render(<DataTable columns={columns} data={rows} selectable />);

    const selectionHeader = screen
      .getByRole('checkbox', { name: '选择当前页全部行' })
      .closest('th');
    const nameHeader = screen.getByRole('columnheader', { name: /客户名称/ });

    expect(selectionHeader).toHaveClass('ly-data-table-cell-pinned-left');
    expect(selectionHeader).not.toHaveClass(
      'ly-data-table-cell-pinned-left-edge',
    );
    expect(nameHeader).toHaveClass(
      'ly-data-table-cell-pinned-left',
      'ly-data-table-cell-pinned-left-edge',
    );
  });

  it('respects controlled pinning when it explicitly unpins meta-pinned columns', () => {
    render(
      <DataTable
        columnPinning={{ left: [], right: [] }}
        columns={columns}
        data={rows}
      />,
    );

    const nameHeader = screen.getByRole('columnheader', { name: /客户名称/ });
    const nameCell = screen.getByRole('cell', { name: '上海客户' });
    const actionHeader = screen.getByRole('columnheader', { name: '操作' });
    const actionCell = screen.getAllByRole('cell', { name: '查看' })[0];

    [nameHeader, nameCell, actionHeader, actionCell].forEach(element => {
      expect(element).not.toHaveAttribute('data-pinned');
      expect(element).not.toHaveClass('ly-data-table-cell-pinned-left');
      expect(element).not.toHaveClass('ly-data-table-cell-pinned-right');
      expect(element.style.left).toBe('');
      expect(element.style.right).toBe('');
    });
  });

  it('normalizes uncontrolled pinning as the selectable column is added and removed', () => {
    const { rerender } = render(
      <DataTable columns={columns} data={rows} selectable={false} />,
    );

    rerender(<DataTable columns={columns} data={rows} selectable />);

    const selectionHeader = screen
      .getByRole('checkbox', { name: '选择当前页全部行' })
      .closest('th');
    const selectionCell = screen
      .getByRole('checkbox', { name: '选择第 1 行' })
      .closest('td');
    const nameHeader = screen.getByRole('columnheader', { name: /客户名称/ });
    const nameCell = screen.getByRole('cell', { name: '上海客户' });

    expect(selectionHeader).toHaveClass('ly-data-table-cell-pinned-left');
    expect(selectionCell).toHaveClass('ly-data-table-cell-pinned-left');
    expect(nameHeader).toHaveClass('ly-data-table-cell-pinned-left');
    expect(nameCell).toHaveClass('ly-data-table-cell-pinned-left');
    expect(selectionHeader).toHaveStyle({ left: '0px' });
    expect(selectionCell).toHaveStyle({ left: '0px' });
    expect(nameHeader).toHaveStyle({ left: '44px' });
    expect(nameCell).toHaveStyle({ left: '44px' });

    rerender(<DataTable columns={columns} data={rows} selectable={false} />);

    expect(
      screen.queryByRole('checkbox', { name: '选择当前页全部行' }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /客户名称/ })).toHaveStyle({
      left: '0px',
    });
  });

  it('honors explicit default selection pinning when selectable is initially enabled', () => {
    render(
      <DataTable
        columns={columns}
        data={rows}
        defaultColumnPinning={{
          left: ['__select__', 'name'],
          right: ['action'],
        }}
        selectable
      />,
    );

    const selectionHeader = screen
      .getByRole('checkbox', { name: '选择当前页全部行' })
      .closest('th');
    const selectionCell = screen
      .getByRole('checkbox', { name: '选择第 1 行' })
      .closest('td');
    const nameHeader = screen.getByRole('columnheader', { name: /客户名称/ });
    const nameCell = screen.getByRole('cell', { name: '上海客户' });

    expect(selectionHeader).toHaveClass('ly-data-table-cell-pinned-left');
    expect(selectionCell).toHaveClass('ly-data-table-cell-pinned-left');
    expect(selectionHeader).toHaveStyle({ left: '0px' });
    expect(selectionCell).toHaveStyle({ left: '0px' });
    expect(nameHeader).toHaveStyle({ left: '44px' });
    expect(nameCell).toHaveStyle({ left: '44px' });
  });

  it('restores explicit default selection pinning after the selectable column becomes visible', () => {
    const { rerender } = render(
      <DataTable
        columns={columns}
        data={rows}
        defaultColumnPinning={{
          left: ['__select__', 'name'],
          right: ['action'],
        }}
        selectable={false}
      />,
    );

    expect(
      screen.queryByRole('checkbox', { name: '选择当前页全部行' }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /客户名称/ })).toHaveStyle({
      left: '0px',
    });

    rerender(
      <DataTable
        columns={columns}
        data={rows}
        defaultColumnPinning={{
          left: ['__select__', 'name'],
          right: ['action'],
        }}
        selectable
      />,
    );

    const selectionHeader = screen
      .getByRole('checkbox', { name: '选择当前页全部行' })
      .closest('th');
    const nameHeader = screen.getByRole('columnheader', { name: /客户名称/ });

    expect(selectionHeader).toHaveClass('ly-data-table-cell-pinned-left');
    expect(selectionHeader).toHaveStyle({ left: '0px' });
    expect(nameHeader).toHaveStyle({ left: '44px' });
  });

  it('does not auto-add the selectable column to controlled pinning', () => {
    render(
      <DataTable
        columnPinning={{ left: ['name'], right: ['action'] }}
        columns={columns}
        data={rows}
        selectable
      />,
    );

    const selectionHeader = screen
      .getByRole('checkbox', { name: '选择当前页全部行' })
      .closest('th');
    const nameHeader = screen.getByRole('columnheader', { name: /客户名称/ });

    expect(selectionHeader).not.toHaveClass('ly-data-table-cell-pinned-left');
    expect(selectionHeader).not.toHaveStyle({ left: '0px' });
    expect(nameHeader).toHaveStyle({ left: '0px' });
  });

  it('supports column visibility', () => {
    render(
      <DataTable
        columnVisibility={{ level: false }}
        columns={columns}
        data={rows}
      />,
    );

    expect(
      screen.queryByRole('columnheader', { name: '等级' }),
    ).not.toBeInTheDocument();
  });

  it('supports controlled column order', () => {
    const orderedColumns: DataTableColumn<CustomerRow>[] = [
      { accessorKey: 'name', header: '客户名称', id: 'name' },
      { accessorKey: 'level', header: '等级', id: 'level' },
      {
        cell: () => <button type="button">查看</button>,
        header: '操作',
        id: 'action',
      },
    ];

    render(
      <DataTable
        columnOrder={['level', 'name', 'action']}
        columns={orderedColumns}
        data={rows}
      />,
    );

    const headers = screen
      .getAllByRole('columnheader')
      .map(header => header.textContent);

    expect(headers).toEqual(['等级', '客户名称', '操作']);
  });

  it('renders pagination footer and emits page changes', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <DataTable
        columns={columns}
        data={rows}
        pagination={{ current: 1, onChange, pageSize: 1, total: 2 }}
      />,
    );

    await user.click(screen.getByRole('button', { name: '下一页' }));

    expect(onChange).toHaveBeenCalledWith(2, 1);
  });

  it('does not paginate server-provided page data again in manual pagination mode', () => {
    render(
      <DataTable
        columns={columns}
        data={rows}
        manualPagination
        pagination={{ current: 2, pageSize: 2, total: 4 }}
      />,
    );

    expect(screen.getByRole('cell', { name: '上海客户' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: '北京客户' })).toBeInTheDocument();
  });

  it('preserves server ordering in manual sorting mode', async () => {
    const user = userEvent.setup();
    const onSortingChange = vi.fn();
    const serverOrderedRows = [rows[1], rows[0]];

    render(
      <DataTable
        columns={columns}
        data={serverOrderedRows}
        manualSorting
        onSortingChange={onSortingChange}
        sorting={[{ desc: false, id: 'name' }]}
      />,
    );

    expect(
      screen
        .getAllByRole('row')
        .slice(1)
        .map(row => row.textContent),
    ).toEqual(['北京客户B查看', '上海客户A查看']);

    await user.click(screen.getByRole('button', { name: /客户名称/ }));

    expect(onSortingChange).toHaveBeenCalledTimes(1);
  });

  it('renders empty, loading and error states', () => {
    const { rerender } = render(<DataTable columns={columns} data={[]} />);

    expect(screen.getByText('暂无数据')).toBeInTheDocument();

    rerender(<DataTable columns={columns} data={[]} loading />);

    expect(document.querySelectorAll('.animate-pulse').length).toBeGreaterThan(
      0,
    );

    rerender(
      <DataTable
        columns={columns}
        data={[]}
        error="加载失败"
        onRetry={vi.fn()}
      />,
    );

    expect(screen.getByText('加载失败')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /重试/ })).toBeInTheDocument();
  });

  it('renders toolbar, filters, density and expanded rows', () => {
    render(
      <DataTable
        actions={<button type="button">新建客户</button>}
        columns={columns}
        data={rows}
        density="comfortable"
        description="按最近跟进时间倒序"
        filters={<span>客户类型 = 企业</span>}
        renderExpandedRow={row => <span>展开 {row.original.name}</span>}
        title="客户列表"
        toolbar={<input aria-label="搜索客户名称或编号" />}
      />,
    );

    expect(screen.getByText('客户列表')).toBeInTheDocument();
    expect(screen.getByText('按最近跟进时间倒序')).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: '搜索客户名称或编号' }),
    ).toBeInTheDocument();
    expect(screen.getByText('客户类型 = 企业')).toBeInTheDocument();
    expect(screen.getByText('展开 上海客户')).toBeInTheDocument();
    expect(
      screen.getByRole('table').closest('[data-slot="data-table"]'),
    ).toHaveAttribute('data-density', 'comfortable');
  });

  it('renders header accessory when meta.headerAccessory is provided', () => {
    render(
      <DataTable
        columns={[
          ...columns.filter(column => column.id !== 'action'),
          {
            id: '__actions__',
            header: () => '操作',
            cell: () => null,
            meta: {
              headerAccessory: (
                <button type="button" aria-label="表格设置">
                  设置
                </button>
              ),
            },
          },
        ]}
        data={rows}
      />,
    );

    expect(
      screen.getByRole('button', { name: '表格设置' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: '操作' }),
    ).toBeInTheDocument();
  });

  it('does not render header accessory for grouped placeholder headers', () => {
    render(
      <DataTable
        columns={[
          {
            header: '客户信息',
            columns: [
              {
                accessorKey: 'name',
                header: '客户名称',
                id: 'name',
              },
            ],
          },
          {
            accessorKey: 'level',
            header: '等级',
            id: 'level',
            meta: {
              headerAccessory: (
                <button type="button" aria-label="等级设置">
                  设置
                </button>
              ),
            },
          },
        ]}
        data={rows}
      />,
    );

    expect(screen.getAllByRole('button', { name: '等级设置' })).toHaveLength(1);
  });

  it('keeps sortable header accessory outside sorting trigger', async () => {
    const user = userEvent.setup();
    const onAccessoryClick = vi.fn();

    render(
      <DataTable
        columns={[
          {
            accessorKey: 'name',
            enableSorting: true,
            header: '客户名称',
            id: 'name',
            meta: {
              headerAccessory: (
                <button
                  aria-label="客户名称设置"
                  onClick={onAccessoryClick}
                  type="button"
                >
                  设置
                </button>
              ),
            },
          },
          { accessorKey: 'level', header: '等级', id: 'level' },
        ]}
        data={rows}
      />,
    );

    const nameHeader = screen.getByRole('columnheader', {
      name: '客户名称',
    });

    await user.click(screen.getByRole('button', { name: '客户名称设置' }));

    expect(onAccessoryClick).toHaveBeenCalledTimes(1);
    expect(nameHeader).not.toHaveAttribute('aria-sort', 'ascending');

    await user.click(screen.getByRole('button', { name: '客户名称' }));

    expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
  });
});
