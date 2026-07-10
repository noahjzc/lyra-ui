import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../../general';
import { Notification, NotificationList } from '../index';

const meta = {
  title: 'Primitives/Feedback/Notification',
  component: Notification,
  tags: ['autodocs'],
  args: {
    description: '客户导入批次 CRM-IMPORT-20260610-0248 已完成。',
    meta: '2 分钟前 · 审批中心',
    title: '导入完成',
    type: 'success',
  },
} satisfies Meta<typeof Notification>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <div className="grid justify-items-start gap-3">
      <Notification
        description="客户资料已保存。"
        meta="刚刚 · 客户中心"
        title="保存成功"
        type="success"
      />
      <Notification
        description="字段设置将在刷新后生效。"
        meta="1 分钟前 · 系统设置"
        title="设置已更新"
      />
      <Notification
        description="有 18 条客户记录因为手机号重复被跳过。"
        meta="2 分钟前 · 导入任务"
        title="部分记录未导入"
        type="warning"
      />
      <Notification
        description="附件上传失败，请重新选择文件后再试。"
        meta="3 分钟前 · 附件服务"
        title="上传失败"
        type="error"
      />
    </div>
  ),
};

export const Actionable: Story = {
  render: () => (
    <Notification
      action={
        <Button size="small" variant="link">
          查看详情
        </Button>
      }
      description="客户导入批次 CRM-IMPORT-20260610-0248 已完成。"
      meta="2 分钟前 · 审批中心"
      title="导入完成"
      type="success"
    />
  ),
};

export const LongContent: Story = {
  render: () => (
    <Notification
      description="系统已完成客户导入校验，其中 18 条客户记录因为手机号重复被跳过，7 条记录因为必填字段缺失进入待处理队列，请在导入记录中查看详情并补全资料后重新提交。"
      meta="2 分钟前 · 导入任务 · 需要复核"
      title="导入完成，部分客户资料需要处理"
      type="warning"
    />
  ),
};

export const Viewport: Story = {
  render: () => (
    <div className="relative h-72 rounded-md border border-ui-border bg-ui-muted/30">
      <NotificationList className="absolute top-4 right-4">
        <Notification
          description="客户导入批次 CRM-IMPORT-20260610-0248 已完成。"
          meta="2 分钟前 · 审批中心"
          title="导入完成"
          type="success"
        />
        <Notification
          action={
            <Button size="small" variant="link">
              处理
            </Button>
          }
          description="有 18 条客户记录因为手机号重复被跳过。"
          meta="3 分钟前 · 导入任务"
          title="部分记录未导入"
          type="warning"
        />
      </NotificationList>
    </div>
  ),
};
