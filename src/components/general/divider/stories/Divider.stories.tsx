import type { Meta, StoryObj } from '@storybook/react-vite';
import { Filter, RefreshCw, Save } from 'lucide-react';
import { Button, IconButton } from '../../button';
import { Divider } from '../index';

const meta = {
  title: 'Primitives/General/Divider',
  component: Divider,
  tags: ['autodocs'],
  argTypes: {
    align: {
      control: 'inline-radio',
      options: ['left', 'center', 'right'],
    },
    decorative: {
      control: 'boolean',
    },
    inset: {
      control: 'text',
    },
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
    },
    variant: {
      control: 'select',
      options: ['soft', 'default', 'strong', 'dashed', 'section', 'edge'],
    },
  },
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

const cardClassName =
  'grid gap-3 rounded-lg border border-ui-border bg-ui-background p-4';

const toneRows = [
  ['soft', '弱分隔，适合卡片内部轻量段落'],
  ['default', '默认分隔，适合列表、Popover、菜单分组'],
  ['strong', '强调分隔，适合高密区域的主次切分'],
  ['dashed', '虚线分隔，适合可配置字段或非固定区域'],
  ['section', '区块分隔，适合表单或详情模块之间'],
  ['edge', '边缘分隔，适合固定栏、表格边界或吸附区域'],
] as const;

function MockContent() {
  return (
    <div className="grid gap-2">
      <div className="h-2.5 w-11/12 rounded-full bg-slate-200" />
      <div className="h-2.5 w-2/3 rounded-full bg-slate-200" />
    </div>
  );
}

export const Variants: Story = {
  render: () => (
    <div className="grid gap-4">
      <div className={cardClassName}>
        <span className="text-xs font-semibold text-ui-muted-foreground">
          horizontal variants
        </span>
        <div className="grid gap-4">
          {toneRows.map(([variant, label]) => (
            <div className="grid gap-2" key={variant}>
              <div className="flex items-center justify-between gap-4 text-xs">
                <span className="font-semibold text-ui-foreground">
                  {variant}
                </span>
                <span className="text-ui-muted-foreground">{label}</span>
              </div>
              <Divider variant={variant} />
            </div>
          ))}
        </div>
      </div>

      <div className={cardClassName}>
        <span className="text-xs font-semibold text-ui-muted-foreground">
          vertical toolbar
        </span>
        <div className="flex min-h-11 items-center gap-1 rounded-md border border-ui-border px-2">
          <IconButton aria-label="刷新">
            <RefreshCw className="size-4" />
          </IconButton>
          <IconButton aria-label="筛选" variant="ghost">
            <Filter className="size-4" />
          </IconButton>
          <Divider orientation="vertical" variant="default" />
          <Button>自动刷新 从不</Button>
          <Divider orientation="vertical" variant="dashed" />
          <Button icon={<Save className="size-4" />} variant="primary">
            保存视图
          </Button>
        </div>
      </div>
    </div>
  ),
};

export const WithText: Story = {
  render: () => (
    <div className="grid w-[360px] gap-4 rounded-lg border border-ui-border bg-ui-background p-4 md:w-[520px]">
      <MockContent />
      <Divider>基础信息</Divider>
      <MockContent />
      <Divider align="left">开票信息</Divider>
      <MockContent />
      <Divider align="right" variant="dashed">
        更多字段
      </Divider>
      <MockContent />
    </div>
  ),
};

export const Semantic: Story = {
  render: () => (
    <div className="grid gap-4">
      <section
        aria-label="客户摘要"
        className="grid gap-3 rounded-lg border border-ui-border bg-ui-background p-4"
      >
        <strong className="text-sm text-ui-foreground">上海霖宜软件科技</strong>
        <Divider
          aria-label="客户摘要与跟进记录分隔"
          decorative={false}
          variant="default"
        />
        <MockContent />
      </section>

      <div className="flex min-h-11 items-center rounded-lg border border-ui-border bg-ui-background px-3">
        <span className="text-sm text-ui-foreground">个人 4</span>
        <Divider
          aria-label="视图统计分隔"
          decorative={false}
          orientation="vertical"
          variant="dashed"
        />
        <span className="text-sm text-ui-muted-foreground">公共 4</span>
      </div>
    </div>
  ),
};

export const CrmScenes: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  render: () => (
    <div className="grid gap-4 bg-(--color-bg-layout) p-6">
      <div className="grid gap-3 rounded-lg border border-ui-border bg-ui-background p-4">
        <div className="text-sm font-semibold text-ui-foreground">
          列表 Topbar
        </div>
        <div className="flex min-h-11 items-center gap-1">
          <IconButton aria-label="刷新">
            <RefreshCw className="size-4" />
          </IconButton>
          <IconButton aria-label="筛选" variant="ghost">
            <Filter className="size-4" />
          </IconButton>
          <Divider orientation="vertical" />
          <Button>批量操作</Button>
          <Button variant="primary">录入新客户</Button>
        </div>
      </div>

      <div className="grid gap-3 rounded-lg border border-ui-border bg-ui-background p-4">
        <div className="text-sm font-semibold text-ui-foreground">
          Popover 分隔
        </div>
        <div className="w-80 overflow-hidden rounded-lg border border-ui-border shadow-ui-popover">
          <div className="flex min-h-10 items-center justify-between px-3 text-sm">
            <strong>已生效筛选 7</strong>
            <Button size="small" variant="text">
              清空全部
            </Button>
          </div>
          <Divider variant="default" />
          <div className="grid gap-2 px-3 py-2 text-sm text-ui-muted-foreground">
            <span>负责人 等于 周启明</span>
            <span>客户等级 包含 A/B</span>
          </div>
          <Divider variant="default" />
          <div className="flex justify-end px-3 py-2">
            <Button size="small" variant="primary">
              应用
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-3 rounded-lg border border-ui-border bg-ui-background p-4">
        <div className="text-sm font-semibold text-ui-foreground">
          列表 Inset 与固定边缘
        </div>
        <div className="grid overflow-hidden rounded-lg border border-ui-border">
          <div className="grid grid-cols-[120px_1fr_120px] text-sm">
            <div className="bg-ui-muted px-3 py-2">客户名称</div>
            <div className="bg-ui-muted px-3 py-2">商机金额</div>
            <div className="bg-ui-muted px-3 py-2">操作</div>
            <div className="px-3 py-2">上海霖宜</div>
            <div className="px-3 py-2">¥128,000</div>
            <div className="px-3 py-2">查看</div>
          </div>
          <Divider inset variant="soft" />
          <div className="grid grid-cols-[120px_1fr_120px] text-sm">
            <div className="px-3 py-2">杭州云仓</div>
            <div className="px-3 py-2">¥64,000</div>
            <div className="px-3 py-2">查看</div>
          </div>
          <Divider variant="edge" />
        </div>
      </div>
    </div>
  ),
};
