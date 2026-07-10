import type { Meta, StoryObj } from '@storybook/react-vite';
import { RefreshCw } from 'lucide-react';
import { fn } from 'storybook/test';
import { Button } from '../../../general';
import { Avatar } from '../../avatar';
import { Tag } from '../../tag';
import { DataTable, type DataTableColumn } from '../index';

interface CustomerRow {
  amount: number;
  code: string;
  followAt: string;
  id: string;
  level: string;
  location: string;
  name: string;
  owner: string;
  status: string;
}

const data: CustomerRow[] = [
  {
    amount: 128000,
    code: 'CU-2026-0187',
    followAt: '今天 09:30',
    id: '1',
    level: 'A',
    location: '上海',
    name: '华东供应链集团',
    owner: '周明',
    status: '已签约',
  },
  {
    amount: 86000,
    code: 'CU-2026-0164',
    followAt: '昨天 18:20',
    id: '2',
    level: 'B',
    location: '苏州',
    name: '冷链运输有限公司',
    owner: '李佳',
    status: '待复核',
  },
];

const columns: DataTableColumn<CustomerRow>[] = [
  {
    accessorKey: 'name',
    enableSorting: true,
    cell: ({ row }) => (
      <div className="grid min-w-0 gap-0.5">
        <strong className="truncate font-extrabold">{row.original.name}</strong>
        <span className="truncate text-xs text-ui-muted-foreground">
          {row.original.code} · {row.original.location}
        </span>
      </div>
    ),
    header: '客户名称',
    id: 'name',
    meta: { pinned: 'left', width: 220 },
  },
  { accessorKey: 'level', header: '等级', id: 'level' },
  {
    cell: ({ row }) =>
      row.original.status === '已签约' ? (
        <Tag color="success">已签约</Tag>
      ) : (
        <Tag color="warning">待复核</Tag>
      ),
    header: '状态',
    id: 'status',
  },
  {
    accessorKey: 'amount',
    enableSorting: true,
    header: '金额',
    id: 'amount',
    meta: { align: 'right' },
  },
  {
    cell: ({ row }) => (
      <span className="inline-flex min-w-0 items-center gap-1.5">
        <Avatar name={row.original.owner} size="small" />
        <span className="truncate">{row.original.owner}</span>
      </span>
    ),
    header: '负责人',
    id: 'owner',
  },
  { accessorKey: 'followAt', header: '最近跟进', id: 'followAt' },
  {
    cell: () => (
      <span className="inline-flex items-center justify-end gap-1.5">
        <Button size="small" variant="link">
          查看
        </Button>
        <Button size="small" variant="link">
          跟进
        </Button>
      </span>
    ),
    header: '操作',
    id: 'action',
    meta: { align: 'right', pinned: 'right', width: 116 },
  },
];

const meta = {
  title: 'Primitives/Data View/DataTable',
  component: DataTable<CustomerRow>,
  tags: ['autodocs'],
} satisfies Meta<typeof DataTable<CustomerRow>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    actions: (
      <>
        <Button
          aria-label="刷新列表"
          icon={<RefreshCw className="size-3.5" />}
          size="small"
          variant="ghost"
        />
        <Button size="small" variant="primary">
          新建客户
        </Button>
      </>
    ),
    columns,
    data,
    defaultRowSelection: {
      1: true,
    },
    description: '按最近跟进时间倒序',
    emptyAction: (
      <Button size="small" variant="primary">
        新建客户
      </Button>
    ),
    emptyText: '暂无客户',
    filters: (
      <>
        <Tag.Filter label="客户类型" value="企业" />
        <Tag.Filter label="区域" value="华东" />
        <Tag.Filter label="跟进时间" value="近 30 天" />
        <Button size="small" variant="ghost">
          清空
        </Button>
      </>
    ),
    getRowId: row => row.id,
    onRowClick: fn(),
    pagination: {
      current: 1,
      onChange: fn(),
      pageSize: 10,
      total: 128,
    },
    renderExpandedRow: () => (
      <>
        <span>展开内容：最近报价单 2 份</span>
        <span>合同到期：2026-06-16</span>
        <span>备注：需要财务确认授信</span>
      </>
    ),
    selectable: true,
    selectionActions: (
      <>
        <Button size="small" variant="ghost">
          分配负责人
        </Button>
        <Button size="small" variant="ghost">
          导出
        </Button>
      </>
    ),
    title: '客户列表',
    toolbar: (
      <label className="inline-flex h-8 min-w-64 items-center gap-2 rounded-md border border-(--ui-input-border) bg-(--ui-input-background) px-2.5 text-xs text-ui-muted-foreground">
        <span>搜索</span>
        <input
          aria-label="搜索客户名称或编号"
          className="min-w-0 flex-1 bg-transparent text-sm text-ui-foreground outline-none"
          placeholder="客户名称 / 编号"
          type="search"
        />
      </label>
    ),
  },
};

export const States: Story = {
  args: {
    columns,
    data,
  },
  render: args => (
    <div className="grid gap-4">
      <DataTable
        {...args}
        columns={columns.slice(0, 3)}
        data={[]}
        loading
        title="加载中"
      />
      <DataTable
        {...args}
        columns={columns.slice(0, 3)}
        data={[]}
        emptyAction={
          <Button size="small" variant="primary">
            新建客户
          </Button>
        }
        emptyDescription="保留工具栏，表格 body 展示 Empty，不撑开整页。"
        emptyText="暂无客户"
        title="空数据"
      />
      <DataTable
        {...args}
        columns={columns.slice(0, 3)}
        data={[]}
        error="接口超时"
        onRetry={fn()}
        title="加载失败"
      />
    </div>
  ),
};

export const Density: Story = {
  args: {
    columns,
    data,
  },
  render: args => (
    <div className="grid gap-4">
      <DataTable {...args} columns={columns} data={data} density="compact" />
      <DataTable {...args} columns={columns} data={data} />
      <DataTable
        {...args}
        columns={columns}
        data={data}
        density="comfortable"
      />
    </div>
  ),
};
