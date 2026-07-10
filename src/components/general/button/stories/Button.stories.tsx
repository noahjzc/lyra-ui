import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ChevronDown,
  Filter,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Save,
  Trash2,
} from 'lucide-react';
import { Button, IconButton } from '../index';

const meta = {
  title: 'Primitives/General/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    iconPosition: {
      control: 'inline-radio',
      options: ['start', 'end'],
    },
    size: {
      control: 'inline-radio',
      options: ['small', 'middle', 'large'],
    },
    variant: {
      control: 'select',
      options: [
        'primary',
        'default',
        'ghost',
        'text',
        'link',
        'danger',
        'warning',
      ],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

const cellClassName =
  'flex min-h-13 items-center border-ui-border border-r border-b px-3 py-2 last:border-r-0';

function StateButton({
  className,
  disabled,
  loading,
  variant,
}: {
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  variant: 'primary' | 'default' | 'ghost' | 'text' | 'danger';
}) {
  const label =
    variant === 'danger' ? '删除' : variant === 'ghost' ? '查询' : '保存';

  return (
    <Button
      className={className}
      disabled={disabled}
      loading={loading}
      variant={variant}
    >
      {loading ? '处理中' : label}
    </Button>
  );
}

export const Variants: Story = {
  render: () => (
    <div className="grid gap-5">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="grid gap-2 rounded-lg border border-ui-border bg-ui-background p-4">
          <span className="text-xs font-semibold text-ui-muted-foreground">
            primary
          </span>
          <Button icon={<Plus className="size-4" />} variant="primary">
            录入新客户
          </Button>
          <p className="m-0 text-xs leading-5 text-ui-muted-foreground">
            页面或区域内最关键的业务动作，同一操作区最多一个。
          </p>
        </div>
        <div className="grid gap-2 rounded-lg border border-ui-border bg-ui-background p-4">
          <span className="text-xs font-semibold text-ui-muted-foreground">
            default
          </span>
          <div className="flex flex-wrap gap-2">
            <Button icon={<Save className="size-4" />}>保存</Button>
            <Button>重置</Button>
          </div>
          <p className="m-0 text-xs leading-5 text-ui-muted-foreground">
            普通命令，用于保存、重置、批量操作入口等次级动作。
          </p>
        </div>
        <div className="grid gap-2 rounded-lg border border-ui-border bg-ui-background p-4">
          <span className="text-xs font-semibold text-ui-muted-foreground">
            ghost
          </span>
          <div className="flex flex-wrap gap-2">
            <Button icon={<Filter className="size-4" />} variant="ghost">
              查询
            </Button>
            <Button variant="ghost">添加条件</Button>
          </div>
          <p className="m-0 text-xs leading-5 text-ui-muted-foreground">
            轻强调动作，适合筛选、快捷入口和低风险辅助命令。
          </p>
        </div>
        <div className="grid gap-2 rounded-lg border border-ui-border bg-ui-background p-4">
          <span className="text-xs font-semibold text-ui-muted-foreground">
            text / link
          </span>
          <div className="flex flex-wrap gap-2">
            <Button variant="text">更多</Button>
            <Button variant="link">查看详情</Button>
          </div>
          <p className="m-0 text-xs leading-5 text-ui-muted-foreground">
            弱干扰动作，常用于表格行内或小范围辅助操作。
          </p>
        </div>
        <div className="grid gap-2 rounded-lg border border-ui-border bg-ui-background p-4">
          <span className="text-xs font-semibold text-ui-muted-foreground">
            danger
          </span>
          <Button icon={<Trash2 className="size-4" />} variant="danger">
            删除客户
          </Button>
          <p className="m-0 text-xs leading-5 text-ui-muted-foreground">
            破坏性动作，必须有明确上下文或二次确认。
          </p>
        </div>
        <div className="grid gap-2 rounded-lg border border-ui-border bg-ui-background p-4">
          <span className="text-xs font-semibold text-ui-muted-foreground">
            warning
          </span>
          <Button variant="warning">标记风险</Button>
          <p className="m-0 text-xs leading-5 text-ui-muted-foreground">
            非破坏但需要注意的业务动作，避免与 danger 混用。
          </p>
        </div>
        <div className="grid gap-2 rounded-lg border border-ui-border bg-ui-background p-4">
          <span className="text-xs font-semibold text-ui-muted-foreground">
            icon-only
          </span>
          <div className="flex flex-wrap gap-2">
            <IconButton aria-label="刷新">
              <RefreshCw className="size-4" />
            </IconButton>
            <IconButton aria-label="筛选" variant="ghost">
              <Filter className="size-4" />
            </IconButton>
            <IconButton aria-label="更多" variant="text">
              <MoreHorizontal className="size-4" />
            </IconButton>
          </div>
          <p className="m-0 text-xs leading-5 text-ui-muted-foreground">
            工具按钮必须配置 Tooltip 和 aria-label，避免只靠图形理解。
          </p>
        </div>
        <div className="grid gap-2 rounded-lg border border-ui-border bg-ui-background p-4">
          <span className="text-xs font-semibold text-ui-muted-foreground">
            split / dropdown
          </span>
          <div className="inline-flex">
            <Button className="rounded-r-none" variant="primary">
              录入新客户
            </Button>
            <IconButton
              aria-label="展开更多录入方式"
              className="rounded-l-none border-l-white/30"
              variant="primary"
            >
              <ChevronDown className="size-4" />
            </IconButton>
          </div>
          <p className="m-0 text-xs leading-5 text-ui-muted-foreground">
            主区域执行默认动作，箭头区域展开相关操作菜单。
          </p>
        </div>
      </div>
    </div>
  ),
};

export const States: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  render: () => (
    <div className="p-6">
      <div className="grid overflow-hidden rounded-lg border border-ui-border bg-ui-background [grid-template-columns:120px_repeat(6,minmax(116px,1fr))]">
        {[
          'Variant',
          'Default',
          'Hover',
          'Active',
          'Focus',
          'Disabled',
          'Loading',
        ].map(label => (
          <div
            className="flex min-h-9 items-center border-ui-border border-r border-b bg-ui-muted px-3 text-xs font-semibold text-ui-muted-foreground last:border-r-0"
            key={label}
          >
            {label}
          </div>
        ))}
        {(['primary', 'default', 'ghost', 'text', 'danger'] as const).map(
          variant => (
            <>
              <div
                className="flex min-h-13 items-center border-ui-border border-r border-b bg-ui-muted/40 px-3 text-xs font-semibold capitalize"
                key={`${variant}-title`}
              >
                {variant}
              </div>
              <div className={cellClassName}>
                <StateButton variant={variant} />
              </div>
              <div className={cellClassName}>
                <StateButton className="shadow-sm" variant={variant} />
              </div>
              <div className={cellClassName}>
                <StateButton
                  className="translate-y-px shadow-inner"
                  variant={variant}
                />
              </div>
              <div className={cellClassName}>
                <StateButton
                  className="ring-2 ring-[rgba(14,116,144,0.18)]"
                  variant={variant}
                />
              </div>
              <div className={cellClassName}>
                <StateButton disabled variant={variant} />
              </div>
              <div className={cellClassName}>
                <StateButton loading variant={variant} />
              </div>
            </>
          ),
        )}
      </div>
    </div>
  ),
};

export const SizesAndUsage: Story = {
  render: () => (
    <div className="grid gap-5">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="grid gap-2 rounded-lg border border-ui-border bg-ui-background p-4">
          <strong className="text-sm">Small</strong>
          <span className="text-xs leading-5 text-ui-muted-foreground">
            28px 高度，用于表格行内、紧凑工具条和辅助操作。
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <Button size="small">查看</Button>
            <IconButton aria-label="刷新" size="small">
              <RefreshCw className="size-3.5" />
            </IconButton>
            <Button size="small" variant="text">
              更多
            </Button>
          </div>
        </div>
        <div className="grid gap-2 rounded-lg border border-ui-border bg-ui-background p-4">
          <strong className="text-sm">Middle</strong>
          <span className="text-xs leading-5 text-ui-muted-foreground">
            32px 高度，后台系统默认按钮尺寸，覆盖大多数场景。
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <Button>保存</Button>
            <Button variant="primary">查询</Button>
            <IconButton aria-label="刷新">
              <RefreshCw className="size-4" />
            </IconButton>
          </div>
        </div>
        <div className="grid gap-2 rounded-lg border border-ui-border bg-ui-background p-4">
          <strong className="text-sm">Large</strong>
          <span className="text-xs leading-5 text-ui-muted-foreground">
            36px 高度，用于抽屉 Footer、关键提交和低密度区域。
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <Button size="large">取消</Button>
            <Button size="large" variant="primary">
              提交审核
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-3 rounded-lg border border-ui-border bg-ui-background p-4">
        <div className="flex items-center justify-between gap-4 rounded-lg border border-ui-border p-3">
          <div className="flex items-center gap-1">
            <IconButton aria-label="刷新">
              <RefreshCw className="size-4" />
            </IconButton>
            <IconButton aria-label="筛选" variant="ghost">
              <Filter className="size-4" />
            </IconButton>
          </div>
          <div className="flex items-center gap-2">
            <Button>批量操作</Button>
            <Button icon={<Plus className="size-4" />} variant="primary">
              录入新客户
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 rounded-lg border border-ui-border p-3">
          <Button variant="danger">删除</Button>
          <div className="flex items-center gap-2">
            <Button>取消</Button>
            <Button variant="primary">保存</Button>
          </div>
        </div>
        <div className="grid gap-2 rounded-lg border border-ui-border p-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <strong className="text-sm">上海霖宜软件科技有限公司</strong>
              <div className="text-xs text-ui-muted-foreground">
                活跃客户 · A 级
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="small" variant="text">
                查看
              </Button>
              <Button size="small" variant="text">
                更多
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};
