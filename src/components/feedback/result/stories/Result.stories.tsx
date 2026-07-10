import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../../general';
import { Result } from '../index';

const meta = {
  title: 'Primitives/Feedback/Result',
  component: Result,
  tags: ['autodocs'],
  args: {
    title: '操作完成',
  },
} satisfies Meta<typeof Result>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: {
    actions: (
      <>
        <Button>查看结果</Button>
        <Button variant="ghost">返回列表</Button>
      </>
    ),
    description: '本次导入 126 条记录，2 条记录需要人工确认。',
    extra: (
      <div className="grid gap-1 rounded-md border border-ui-border bg-ui-muted/30 p-3 text-left text-xs">
        <div className="grid grid-cols-[88px_minmax(0,1fr)] gap-2">
          <span className="font-semibold text-ui-muted-foreground">
            批次编号
          </span>
          <span className="truncate">CRM-IMPORT-20260610-0248</span>
        </div>
        <div className="grid grid-cols-[88px_minmax(0,1fr)] gap-2">
          <span className="font-semibold text-ui-muted-foreground">
            处理范围
          </span>
          <span className="truncate">华东区经销客户、潜在线索与联系人</span>
        </div>
      </div>
    ),
    status: 'success',
    title: '客户导入完成',
  },
};

export const StateMatrix: Story = {
  render: () => (
    <div className="grid max-w-3xl grid-cols-2 gap-3">
      <Result
        density="compact"
        description="流程完成，提供查看结果或继续下一步。"
        status="success"
        title="成功"
      />
      <Result
        density="compact"
        description="展示风险摘要，并提供下载或处理异常。"
        status="warning"
        title="部分成功"
      />
      <Result
        density="compact"
        description="说明失败原因，提供重试或查看错误详情。"
        status="error"
        title="失败"
      />
      <Result
        density="compact"
        description="说明权限边界，提供申请权限或返回入口。"
        status="403"
        title="无权限"
      />
      <Result
        density="compact"
        description="记录被删除、链接失效或路由无法匹配。"
        status="404"
        title="不存在"
      />
      <Result
        density="compact"
        description="筛选后没有结果，引导清空条件或新建记录。"
        status="empty"
        title="空结果"
      />
    </div>
  ),
};

export const Density: Story = {
  render: () => (
    <div className="grid max-w-4xl grid-cols-3 gap-3">
      <Result density="compact" status="error" title="Compact" />
      <Result
        density="default"
        description="表单流程收尾区域。"
        status="warning"
        title="Default"
      />
      <Result
        density="page"
        description="整页异常状态。"
        status="403"
        title="Page"
      />
    </div>
  ),
};

export const CompactError: Story = {
  args: {
    actions: (
      <>
        <Button size="small">重试</Button>
        <Button size="small" variant="ghost">
          查看日志
        </Button>
      </>
    ),
    density: 'compact',
    description: '服务暂时不可用，请稍后重试。',
    status: 'error',
    title: '发票信息加载失败',
  },
};

export const Permission: Story = {
  args: {
    actions: (
      <>
        <Button>申请权限</Button>
        <Button variant="ghost">返回客户列表</Button>
      </>
    ),
    density: 'compact',
    description: '当前账号暂无客户价格策略查看权限。',
    status: '403',
    title: '暂无客户价格策略权限',
  },
};

export const Empty: Story = {
  args: {
    actions: (
      <>
        <Button>清空筛选</Button>
        <Button variant="ghost">新建客户</Button>
      </>
    ),
    density: 'compact',
    description: '当前筛选条件下没有匹配的客户记录。',
    status: 'empty',
    title: '没有匹配的客户记录',
  },
};

export const NotFound: Story = {
  args: {
    actions: (
      <>
        <Button>返回列表</Button>
        <Button variant="ghost">刷新页面</Button>
      </>
    ),
    density: 'compact',
    description: '记录可能已删除，或当前链接已经失效。',
    status: '404',
    title: '记录不存在或已被删除',
  },
};
