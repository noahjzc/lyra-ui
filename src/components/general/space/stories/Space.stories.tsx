import type { Meta, StoryObj } from '@storybook/react-vite';
import { Filter, MoreHorizontal, RefreshCw, Save } from 'lucide-react';
import { Badge } from '../../../data-view/badge';
import { Button, IconButton } from '../../button';
import { Divider } from '../../divider';
import { Space } from '../index';

const meta = {
  title: 'Primitives/General/Space',
  component: Space,
  tags: ['autodocs'],
  argTypes: {
    align: {
      control: 'inline-radio',
      options: ['start', 'center', 'end', 'baseline', 'stretch'],
    },
    direction: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
    },
    justify: {
      control: 'inline-radio',
      options: ['start', 'center', 'end', 'between'],
    },
    size: {
      control: 'select',
      options: [4, 6, 8, 12, 16, 20, 'small', 'middle', 'large'],
    },
  },
} satisfies Meta<typeof Space>;

export default meta;
type Story = StoryObj<typeof meta>;

const cardClassName =
  'grid gap-3 rounded-lg border border-ui-border bg-ui-background p-4';

export const Basic: Story = {
  render: () => (
    <div className="grid gap-4">
      <div className={cardClassName}>
        <span className="text-xs font-semibold text-ui-muted-foreground">
          horizontal
        </span>
        <Space>
          <Button>取消</Button>
          <Button variant="primary">保存</Button>
          <Button variant="ghost">重置</Button>
        </Space>
      </div>

      <div className={cardClassName}>
        <span className="text-xs font-semibold text-ui-muted-foreground">
          vertical
        </span>
        <Space align="stretch" direction="vertical" size={12}>
          <Button>字段设置</Button>
          <Button>权限范围</Button>
          <Button>通知规则</Button>
        </Space>
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="grid gap-3">
      {([4, 6, 8, 12, 16, 20] as const).map(size => (
        <div className={cardClassName} key={size}>
          <span className="text-xs font-semibold text-ui-muted-foreground">
            gap {size}
          </span>
          <Space size={size}>
            <Badge>负责人</Badge>
            <Badge variant="success">活跃客户</Badge>
            <Badge variant="warning">待补资料</Badge>
          </Space>
        </div>
      ))}
    </div>
  ),
};

export const AlignWrapAndSeparator: Story = {
  render: () => (
    <div className="grid w-[520px] gap-4">
      <div className={cardClassName}>
        <span className="text-xs font-semibold text-ui-muted-foreground">
          wrap with tuple gap
        </span>
        <Space size={[8, 8]} wrap>
          <Badge>负责人 等于 周启明</Badge>
          <Badge>客户等级 包含 A/B</Badge>
          <Badge variant="warning">商机金额 大于 ¥30,000</Badge>
          <Badge variant="processing">下次跟进 本周</Badge>
          <Badge variant="assist">AI 推荐客户</Badge>
        </Space>
      </div>

      <div className={cardClassName}>
        <span className="text-xs font-semibold text-ui-muted-foreground">
          separator
        </span>
        <Space
          separator={
            <span className="size-1 rounded-full bg-ui-muted-foreground" />
          }
          size={6}
        >
          <span>个人 4</span>
          <span>公共 4</span>
          <span>共 1,248 条数据</span>
        </Space>
      </div>

      <div className={cardClassName}>
        <span className="text-xs font-semibold text-ui-muted-foreground">
          baseline
        </span>
        <Space align="baseline" size={8}>
          <strong className="text-xl text-ui-foreground">128</strong>
          <span className="text-sm text-ui-muted-foreground">条待跟进线索</span>
        </Space>
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
      <div className="flex min-h-14 items-center justify-between gap-4 rounded-lg border border-ui-border bg-ui-background px-4">
        <strong className="text-sm text-ui-foreground">我负责的客户</strong>
        <Space size={8}>
          <IconButton aria-label="刷新">
            <RefreshCw className="size-4" />
          </IconButton>
          <IconButton aria-label="筛选" variant="ghost">
            <Filter className="size-4" />
          </IconButton>
          <Divider orientation="vertical" />
          <Button>批量操作</Button>
          <Button icon={<Save className="size-4" />} variant="primary">
            保存视图
          </Button>
          <IconButton aria-label="更多操作" variant="ghost">
            <MoreHorizontal className="size-4" />
          </IconButton>
        </Space>
      </div>

      <div className="grid gap-3 rounded-lg border border-ui-border bg-ui-background p-4">
        <strong className="text-sm text-ui-foreground">筛选条件</strong>
        <Space size={[8, 8]} wrap>
          <Badge>负责人 等于 周启明</Badge>
          <Badge>客户等级 包含 A/B</Badge>
          <Badge variant="warning">商机金额 大于 ¥30,000</Badge>
          <Button size="small" variant="text">
            清空全部
          </Button>
        </Space>
      </div>

      <div className="flex min-h-12 items-center justify-between rounded-lg border border-ui-border bg-ui-background px-4">
        <Space size={8}>
          <IconButton aria-label="收起导航" variant="ghost">
            <MoreHorizontal className="size-4" />
          </IconButton>
          <span className="text-sm text-ui-foreground">收起导航</span>
        </Space>
        <Space
          className="text-sm text-ui-muted-foreground"
          separator={
            <span className="size-1 rounded-full bg-ui-muted-foreground" />
          }
          size={6}
        >
          <span>个人 4</span>
          <span>公共 4</span>
          <span>共 1,248 条数据</span>
        </Space>
      </div>
    </div>
  ),
};
