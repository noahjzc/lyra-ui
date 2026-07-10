import type { Meta, StoryObj } from '@storybook/react-vite';
import { Watermark } from '../index';

const meta = {
  title: 'Primitives/Feedback/Watermark',
  component: Watermark,
  tags: ['autodocs'],
  args: {
    content: ['张明', '上海总部 · 2026-06-10'],
  },
} satisfies Meta<typeof Watermark>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: args => (
    <Watermark {...args} className="rounded-md border border-ui-border p-5">
      <div className="grid min-h-40 gap-2">
        <strong>记录详情</strong>
        <span className="text-ui-muted-foreground">
          张明 · 上海总部 · 2026-06-10
        </span>
      </div>
    </Watermark>
  ),
};

export const SensitiveDetail: Story = {
  render: () => (
    <Watermark
      className="rounded-md border border-ui-border p-5"
      content={['内部资料', 'CRM 客户详情']}
    >
      <section aria-label="客户详情" className="grid min-h-48 gap-3">
        <div className="grid gap-1">
          <strong>上海霖宜科技有限公司</strong>
          <span className="text-sm text-ui-muted-foreground">
            重点客户 · 华东区 · 年框协议
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3 text-sm">
          <span>联系人：张明</span>
          <span>手机号：138****2468</span>
          <span>信用等级：A</span>
        </div>
      </section>
    </Watermark>
  ),
};

export const Environment: Story = {
  render: () => (
    <Watermark
      className="rounded-md border border-ui-border p-5"
      content="预生产环境"
      rotate={-18}
    >
      <div className="grid min-h-40 gap-2">
        <strong>报价策略模拟</strong>
        <span className="text-sm text-ui-muted-foreground">
          当前数据仅用于预生产验证，不作为正式报价依据。
        </span>
      </div>
    </Watermark>
  ),
};

export const Config: Story = {
  args: {
    children: (
      <div className="grid min-h-40 gap-2 rounded-md border border-ui-border p-5">
        <strong>配置样张</strong>
        <span className="text-sm text-ui-muted-foreground">
          调整间距、角度、字号和透明度后的水印区域。
        </span>
      </div>
    ),
    content: ['Linyi CRM', 'Confidential'],
    fontSize: 18,
    gap: [220, 144],
    opacity: 0.14,
    rotate: -18,
  },
};

export const Boundary: Story = {
  render: () => (
    <div className="grid max-w-3xl gap-3">
      <Watermark
        className="rounded-md border border-ui-border p-4"
        content="内部资料"
      >
        <div className="grid min-h-28 gap-2">
          <strong>适用：敏感内容区域</strong>
          <span className="text-sm text-ui-muted-foreground">
            水印覆盖在内容之上，但不阻断查看、复制或点击明确控件。
          </span>
        </div>
      </Watermark>
      <div className="rounded-md border border-ui-border p-4">
        <strong>不适用：权限控制替代品</strong>
        <p className="m-0 mt-2 text-sm text-ui-muted-foreground">
          水印只降低截图传播风险，不能替代权限、审计或导出控制。
        </p>
      </div>
    </div>
  ),
};
