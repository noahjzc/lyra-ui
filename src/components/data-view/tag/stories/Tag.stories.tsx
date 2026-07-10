import type { Meta, StoryObj } from '@storybook/react-vite';
import { CheckCircle2, ShieldAlert } from 'lucide-react';
import { fn } from 'storybook/test';
import { Tag } from '../index';

const meta = {
  title: 'Primitives/Data View/Tag',
  component: Tag,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    onCheckedChange: fn(),
    onClose: fn(),
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

const canvasClassName =
  'grid min-h-[420px] content-start justify-items-start gap-4 bg-(--color-bg-layout) p-8 text-ui-foreground';
const panelClassName =
  'grid w-full max-w-[1180px] content-start gap-4 rounded-lg border border-ui-border bg-ui-background p-4 shadow-sm';
const rowClassName = 'flex min-w-0 flex-wrap items-center gap-2';

export const Overview: Story = {
  args: {},
  render: args => (
    <div className={canvasClassName}>
      <section className={panelClassName}>
        <div className="grid gap-1">
          <strong className="text-base">标签族谱</strong>
          <span className="text-ui-muted-foreground text-xs">
            状态、分类、筛选条件三类标签保持不同视觉层级。
          </span>
        </div>
        <div className="grid gap-3">
          <div className={rowClassName}>
            <Tag color="success" icon={<CheckCircle2 className="size-3" />}>
              已启用
            </Tag>
            <Tag color="warning">待跟进</Tag>
            <Tag color="destructive" icon={<ShieldAlert className="size-3" />}>
              高风险
            </Tag>
            <Tag color="info">系统同步</Tag>
          </div>
          <div className={rowClassName}>
            <Tag>重点客户</Tag>
            <Tag>华东区域</Tag>
            <Tag>KA 门店</Tag>
            <Tag>合同客户</Tag>
          </div>
          <div className={rowClassName}>
            <Tag.Filter label="处理人" onClose={args.onClose} value="张明" />
            <Tag.Filter
              label="等级"
              onClose={args.onClose}
              operator="包含"
              value="A/B"
            />
            <Tag.Filter
              label="金额"
              onClose={args.onClose}
              operator="≥"
              value="¥30,000"
            />
          </div>
        </div>
      </section>
    </div>
  ),
};

export const States: Story = {
  args: {},
  render: args => (
    <div className={canvasClassName}>
      <section className={panelClassName}>
        <div className="grid gap-1">
          <strong className="text-base">交互状态</strong>
          <span className="text-ui-muted-foreground text-xs">
            静态 Tag 无 Tab 停留；checkable 使用
            aria-pressed；关闭按钮独立聚焦。
          </span>
        </div>
        <div className="grid gap-3">
          <div className={rowClassName}>
            <Tag color="success">已完成</Tag>
            <Tag disabled>历史状态</Tag>
            <Tag
              checkable
              defaultChecked
              onCheckedChange={args.onCheckedChange}
            >
              行业
            </Tag>
            <Tag checkable disabled>
              不可选
            </Tag>
            <Tag
              closable
              closeLabel="移除负责人标签"
              color="info"
              onClose={args.onClose}
            >
              负责人
            </Tag>
          </div>
        </div>
      </section>
    </div>
  ),
};

export const Density: Story = {
  args: {},
  render: () => (
    <div className={canvasClassName}>
      <section className={panelClassName}>
        <div className="grid gap-3">
          <div className={rowClassName}>
            <Tag size="compact">紧凑</Tag>
            <Tag color="info" size="compact">
              筛选
            </Tag>
          </div>
          <div className={rowClassName}>
            <Tag>默认状态</Tag>
            <Tag color="success">已启用</Tag>
          </div>
          <div className={rowClassName}>
            <Tag size="large">宽松标签</Tag>
            <Tag color="warning" size="large">
              待处理
            </Tag>
          </div>
        </div>
      </section>
    </div>
  ),
};

export const FilterOverflow: Story = {
  args: {},
  render: args => (
    <div className={canvasClassName}>
      <section className={panelClassName}>
        <div className={rowClassName}>
          <Tag.Filter label="客户类型" onClose={args.onClose} value="企业" />
          <Tag.Filter label="区域" onClose={args.onClose} value="华东" />
          <Tag.Filter label="等级" onClose={args.onClose} value="A" />
          <Tag color="info">+4</Tag>
          <Tag color="info" variant="filter">
            清空
          </Tag>
        </div>
        <div className="grid w-full max-w-[360px] gap-2 rounded-lg border border-ui-border bg-ui-background p-3 shadow-sm">
          <span className="text-ui-muted-foreground text-xs font-bold">
            +4 展开预览
          </span>
          <Tag.Filter
            label="创建时间"
            onClose={args.onClose}
            value="近 30 天"
          />
          <Tag.Filter
            label="负责人"
            onClose={args.onClose}
            operator="包含"
            value="张明 / 李佳"
          />
        </div>
      </section>
    </div>
  ),
};

export const LongContent: Story = {
  args: {},
  render: args => (
    <div className={canvasClassName}>
      <section className={panelClassName}>
        <div className={rowClassName}>
          <Tag maxWidth={180}>超长业务属性标签需要省略</Tag>
          <Tag color="success">已签约</Tag>
          <Tag color="destructive">风险客户</Tag>
          <Tag.Filter
            label="复杂条件"
            maxWidth={280}
            onClose={args.onClose}
            operator="包含"
            value="金额大于等于 30000 且最近 30 天有跟进"
          />
        </div>
      </section>
    </div>
  ),
};
