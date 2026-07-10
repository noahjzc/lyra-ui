import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../../general';
import { Progress } from '../index';

const meta = {
  title: 'Primitives/Feedback/Progress',
  component: Progress,
  tags: ['autodocs'],
  args: {
    label: '客户数据导入',
    value: 68,
  },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Line: Story = {
  render: () => (
    <div className="grid max-w-xl gap-4">
      <Progress label="客户数据导入" size="large" value={68} />
      <Progress label="AI 推荐生成" size="middle" value={48} />
      <Progress label="附件上传" size="small" value={32} />
    </div>
  ),
};

export const Steps: Story = {
  render: () => (
    <div className="grid max-w-xl gap-4">
      <Progress label="客户导入流程" steps={5} value={60} variant="steps" />
      <Progress
        label="合同同步流程"
        status="success"
        steps={4}
        value={100}
        variant="steps"
      />
    </div>
  ),
};

export const Circle: Story = {
  render: () => (
    <div className="grid max-w-xl grid-cols-3 gap-3">
      <Progress label="线索清洗" value={72} variant="circle" />
      <Progress
        label="合同同步"
        status="success"
        value={100}
        variant="circle"
      />
      <Progress label="库存校验" status="error" value={32} variant="circle" />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="grid max-w-xl gap-3">
      <Progress label="批量更新进行中" status="active" value={72} />
      <Progress label="上传完成" status="success" value={100} />
      <Progress label="价格策略需复核" status="warning" value={64} />
      <Progress label="导入失败" status="error" value={32} />
    </div>
  ),
};

export const LongFilename: Story = {
  render: () => (
    <div className="grid max-w-xl gap-3">
      <Progress
        label="华东大区经销客户历史联系人与潜在线索清洗结果-2026-06-10.xlsx"
        size="small"
        value={68}
      />
      <Progress
        label="报价附件异常记录-需要财务复核并重新上传.csv"
        size="small"
        status="error"
        value={22}
      />
    </div>
  ),
};

export const FailureRetry: Story = {
  render: () => (
    <div className="grid max-w-xl gap-3 rounded-md border border-ui-border p-4">
      <Progress
        label="报价附件异常记录.csv"
        size="small"
        status="error"
        value={22}
      />
      <div className="flex items-center gap-2">
        <Button size="small">重新上传</Button>
        <Button size="small" variant="ghost">
          查看错误
        </Button>
      </div>
    </div>
  ),
};
