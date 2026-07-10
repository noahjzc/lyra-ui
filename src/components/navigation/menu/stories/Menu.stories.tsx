import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ClipboardCheck,
  Database,
  FileSearch,
  FileText,
  ListChecks,
  Users,
  Wrench,
} from 'lucide-react';
import { fn } from 'storybook/test';
import { Menu, type MenuGroup } from '..';

const meta = {
  title: 'Primitives/Navigation/Menu',
  component: Menu,
  tags: ['autodocs'],
  args: {
    onOpenKeysChange: fn(),
    onSelect: fn(),
  },
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

const groups: MenuGroup[] = [
  {
    key: 'growth',
    label: '客户增长',
    items: [
      {
        badge: 126,
        children: [
          {
            href: '/crm/customers',
            key: 'customer-list',
            label: '客户列表',
          },
          {
            href: '/crm/customer-pool',
            key: 'public-pool',
            label: '公共池',
          },
          {
            disabled: true,
            disabledReason: '无权限',
            key: 'recycle-bin',
            label: '回收站',
          },
        ],
        icon: <Users className="size-4" />,
        key: 'customer',
        label: '客户管理',
      },
      {
        badge: 8,
        href: '/crm/contracts/approval',
        icon: <ClipboardCheck className="size-4" />,
        key: 'contract-approval',
        label: '合同审批',
      },
      {
        href: '/crm/tasks/follow-up',
        icon: <ListChecks className="size-4" />,
        key: 'follow-up-task',
        label: '跟进任务',
      },
    ],
  },
];

const localGroups: MenuGroup[] = [
  {
    key: 'customer-settings',
    label: '客户管理',
    items: [
      {
        href: '/crm/settings/fields',
        icon: <FileText className="size-4" />,
        key: 'fields',
        label: '字段配置',
      },
      {
        href: '/crm/settings/assignment',
        icon: <Wrench className="size-4" />,
        key: 'assignment-rules',
        label: '分配规则',
      },
      {
        href: '/crm/settings/deduplication',
        icon: <FileSearch className="size-4" />,
        key: 'deduplication-rules',
        label: '查重规则',
      },
    ],
  },
];

const longTextGroups: MenuGroup[] = [
  {
    key: 'operations',
    label: '客户增长',
    items: [
      {
        badge: '新',
        href: '/crm/operations/customer-quality',
        icon: <Database className="size-4" />,
        key: 'long-item',
        label: '跨区域重点客户经营质量与回款风险监控',
      },
      {
        disabled: true,
        disabledReason: '缺少合同审批权限',
        href: '/crm/contracts/risk-review',
        icon: <ClipboardCheck className="size-4" />,
        key: 'risk-review',
        label: '高风险合同复核',
      },
      {
        children: [
          {
            href: '/crm/customers',
            key: 'state-customer-list',
            label: '客户列表',
          },
          {
            href: '/crm/customer-pool',
            key: 'state-public-pool',
            label: '公共池',
          },
          {
            disabled: true,
            disabledReason: '已归档',
            key: 'state-recycle-bin',
            label: '回收站',
          },
        ],
        icon: <Users className="size-4" />,
        key: 'state-customer',
        label: '客户管理',
      },
    ],
  },
];

const storyContainerClassName =
  'grid min-h-[420px] content-start gap-3 rounded-lg border border-ui-border bg-ui-background p-4';

/** 左侧业务导航。 */
export const Side: Story = {
  args: {
    activeKey: 'customer-list',
    defaultOpenKeys: ['customer'],
    footer: (
      <div className="flex w-full items-center justify-between gap-3">
        <span className="text-xs text-ui-muted-foreground">客户增长工作台</span>
        <button
          className="inline-flex h-7 items-center rounded-md border border-ui-border bg-ui-background px-2 text-xs font-bold text-ui-foreground transition-ui-state hover:bg-(--ui-button-ghost-hover-background) hover:text-(--ui-button-primary-background) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ui-button-focus-ring) motion-reduce:transition-none"
          type="button"
        >
          收起
        </button>
      </div>
    ),
    groups,
  },
  render: args => (
    <div className={storyContainerClassName}>
      <Menu {...args} />
    </div>
  ),
};

/** 收起态导航；有子项时使用浮层展示子菜单。 */
export const Collapsed: Story = {
  args: {
    ...Side.args,
    collapsed: true,
  },
  render: args => (
    <div className={storyContainerClassName}>
      <Menu {...args} />
    </div>
  ),
};

/** 模块内局部导航。 */
export const Local: Story = {
  args: {
    activeKey: 'fields',
    groups: localGroups,
    variant: 'local',
  },
  render: args => (
    <div className={storyContainerClassName}>
      <Menu {...args} />
    </div>
  ),
};

/** 常见状态：active、badge、disabled、长文本与溢出。 */
export const States: Story = {
  args: {
    activeKey: 'long-item',
    defaultOpenKeys: ['state-customer'],
    footer: (
      <span className="text-xs text-ui-muted-foreground">
        跟进任务每日 09:00 刷新
      </span>
    ),
    groups: longTextGroups,
  },
  render: args => (
    <div className={storyContainerClassName}>
      <Menu {...args} />
    </div>
  ),
};
