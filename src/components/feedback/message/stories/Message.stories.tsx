import type { Meta, StoryObj } from '@storybook/react-vite';
import { Message, MessageViewport } from '../index';

const meta = {
  title: 'Primitives/Feedback/Message',
  component: Message,
  tags: ['autodocs'],
  args: {
    content: '保存成功',
    type: 'success',
  },
} satisfies Meta<typeof Message>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <div className="grid justify-items-start gap-3">
      <Message content="客户资料已保存" type="success" />
      <Message content="字段设置已应用" type="info" />
      <Message content="导入完成，但部分记录需要复核" type="warning" />
      <Message content="上传失败，请重试" type="error" />
      <Message content="正在同步客户资料" type="loading" />
    </div>
  ),
};

export const Lifecycle: Story = {
  render: () => (
    <div className="grid justify-items-start gap-3">
      <Message content="正在导入客户记录" type="loading" />
      <Message content="客户记录导入完成" type="success" />
      <Message
        closable
        closeLabel="关闭导入完成消息"
        content="客户导入记录已归档"
        type="info"
      />
    </div>
  ),
};

export const LongTextBoundary: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Message 截断长文案；需要说明、操作或查看详情时使用 Notification。',
      },
    },
  },
  render: () => (
    <Message
      content="导入完成，但有 18 条客户记录因为手机号重复被跳过，请在导入记录中查看详情。"
      type="warning"
    />
  ),
};

export const Viewport: Story = {
  render: () => (
    <div className="relative h-40 rounded-md border border-ui-border bg-ui-muted/30">
      <MessageViewport className="absolute top-4">
        <Message content="保存成功" type="success" />
      </MessageViewport>
    </div>
  ),
};
