import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button } from '../../../general';
import { Alert } from '../index';

const meta = {
  title: 'Primitives/Feedback/Alert',
  component: Alert,
  tags: ['autodocs'],
  args: {
    onClose: fn(),
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <div className="grid max-w-2xl gap-3">
      <Alert
        description="客户资料已通过基础校验，可以进入下一步审批。"
        title="校验通过"
        variant="success"
      />
      <Alert
        description="系统将在夜间自动同步客户标签。"
        title="同步提示"
        variant="info"
      />
      <Alert
        description="客户资料缺少统一社会信用代码，保存后将无法进入授信审批。"
        title="资料不完整"
        variant="warning"
      />
      <Alert
        description="授信额度保存失败，请检查审批配置后重试。"
        title="保存失败"
        variant="error"
      />
    </div>
  ),
};

export const WithAction: Story = {
  render: () => (
    <Alert
      action={
        <div className="flex flex-wrap gap-2">
          <Button size="small" variant="warning">
            查看原因
          </Button>
          <Button size="small">稍后处理</Button>
        </div>
      }
      description="客户资料缺少关键证照，当前记录只能暂存，不能提交审批。"
      title="需要补齐资料"
      variant="warning"
    />
  ),
};

export const Closable: Story = {
  args: {
    closeLabel: '关闭工作区提示',
    closable: true,
    description: '此提示用于当前工作区，关闭后不会影响客户记录状态。',
    title: '工作区提示',
    variant: 'info',
  },
};

export const LongContent: Story = {
  render: () => (
    <div className="max-w-md">
      <Alert
        description="客户主体名称、注册地址、统一社会信用代码与证照扫描件存在多处不一致，继续保存可能导致授信审批、合同归档和后续开票流程全部进入人工复核。"
        title="客户资料存在较长的风险说明"
        variant="warning"
      />
    </div>
  ),
};

export const Boundary: Story = {
  render: () => (
    <div className="grid max-w-2xl gap-3">
      <Alert
        description="此类提示持续显示在页面内，用于解释当前上下文。"
        title="页面内提示"
        variant="info"
      />
      <Alert
        action={<Button size="small">进入通知中心</Button>}
        description="需要跨页面追踪、带处理状态或异步送达的内容，应升级为 Notification。"
        title="边界示例"
        variant="warning"
      />
    </div>
  ),
};
