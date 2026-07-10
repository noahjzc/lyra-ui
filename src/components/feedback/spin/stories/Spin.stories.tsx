import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert } from '../../alert';
import { Spin } from '../index';

const meta = {
  title: 'Primitives/Feedback/Spin',
  component: Spin,
  tags: ['autodocs'],
} satisfies Meta<typeof Spin>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    label: '客户资料加载中',
    size: 'md',
  },
};

export const Overlay: Story = {
  render: () => (
    <Spin overlay label="客户列表刷新中">
      <div className="grid h-32 gap-2 rounded-md border border-ui-border bg-ui-background p-4">
        <div className="h-4 w-40 rounded bg-ui-muted" />
        <div className="h-4 w-full rounded bg-ui-muted" />
        <div className="h-4 w-2/3 rounded bg-ui-muted" />
      </div>
    </Spin>
  ),
};

export const Inline: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <span className="text-sm text-ui-foreground">客户名称</span>
      <Spin label="字段校验中" overlay={false} size="sm" />
    </div>
  ),
};

export const ErrorHandOff: Story = {
  render: () => (
    <div className="grid max-w-lg gap-3">
      <Spin label="重新加载客户联系人" spinning={false} />
      <Alert
        description="联系人列表加载失败，当前区域交由 Alert 承载可见错误状态。"
        title="加载失败"
        variant="error"
      />
    </div>
  ),
};

export const ReducedMotion: Story = {
  render: () => <Spin label="遵循系统减少动态效果设置" size="lg" />,
};
