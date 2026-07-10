import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Bell,
  CheckCircle2,
  Copy,
  Filter,
  Search,
  Settings,
  TriangleAlert,
  User,
} from 'lucide-react';
import { Icon } from '../index';

const meta = {
  title: 'Primitives/General/Icon',
  component: Icon,
  tags: ['autodocs'],
  args: {
    icon: Search,
    label: '搜索',
    size: 16,
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      {[14, 16, 18, 20, 24].map(size => (
        <div
          className="grid justify-items-center gap-2 rounded-md border border-ui-border p-3"
          key={size}
        >
          <Icon icon={Filter} size={size} />
          <span className="text-xs text-ui-muted-foreground">{size}</span>
        </div>
      ))}
    </div>
  ),
};

export const Tones: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Icon icon={Search} tone="neutral" />
      <Icon icon={Filter} tone="primary" />
      <Icon icon={Bell} tone="info" />
      <Icon icon={CheckCircle2} tone="success" />
      <Icon icon={TriangleAlert} tone="warning" />
      <Icon icon={TriangleAlert} tone="danger" />
      <Icon icon={Settings} tone="disabled" />
    </div>
  ),
};

export const Contexts: Story = {
  render: () => (
    <div className="grid gap-3">
      <div className="flex items-center gap-2 rounded-md border border-ui-border p-3">
        <Icon icon={Bell} />
        <Icon icon={Settings} />
        <Icon icon={User} />
      </div>
      <div className="flex items-center gap-2 rounded-md border border-ui-border p-3 text-sm">
        <Icon icon={Search} />
        记录名称 / 人员 / 手机号
        <Icon className="ml-auto" icon={Copy} label="复制" />
      </div>
    </div>
  ),
};
