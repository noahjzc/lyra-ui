import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChevronDown, MapPin, Phone, Search } from 'lucide-react';
import { Input } from '../index';

const meta = {
  title: 'Primitives/Data Input/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

const cardClassName =
  'grid min-h-32 content-start gap-2 rounded-lg border border-ui-border bg-ui-background p-3';
const labelClassName = 'text-xs font-extrabold text-ui-muted-foreground';
const noteClassName = 'm-0 text-xs leading-5 text-ui-muted-foreground';

export const Variants: Story = {
  render: () => (
    <div className="grid w-[760px] grid-cols-2 gap-3">
      <div className={cardClassName}>
        <span className={labelClassName}>Outlined</span>
        <Input aria-label="默认输入" placeholder="请输入客户名称" />
        <p className={noteClassName}>默认形态，适合表单和弹窗。</p>
      </div>
      <div className={cardClassName}>
        <span className={labelClassName}>Filled</span>
        <Input
          aria-label="填充输入"
          placeholder="请输入查询关键词"
          variant="filled"
        />
        <p className={noteClassName}>低层级查询区或密集表单。</p>
      </div>
      <div className={cardClassName}>
        <span className={labelClassName}>Borderless</span>
        <Input
          aria-label="无边框输入"
          defaultValue="表格内轻编辑"
          variant="borderless"
        />
        <p className={noteClassName}>表格轻编辑和紧凑内联场景。</p>
      </div>
      <div className={cardClassName}>
        <span className={labelClassName}>Underlined</span>
        <Input
          aria-label="底线输入"
          defaultValue="轻量内联编辑"
          variant="underlined"
        />
        <p className={noteClassName}>轻量内联编辑，不建议大面积使用。</p>
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="grid w-[640px] grid-cols-3 gap-3">
      <div className={cardClassName}>
        <span className={labelClassName}>Small 28px</span>
        <Input aria-label="小号输入" defaultValue="表格内编辑" size="small" />
      </div>
      <div className={cardClassName}>
        <span className={labelClassName}>Middle 32px</span>
        <Input aria-label="默认输入" defaultValue="默认表单" size="middle" />
      </div>
      <div className={cardClassName}>
        <span className={labelClassName}>Large 36px</span>
        <Input aria-label="大号输入" defaultValue="弹窗主输入" size="large" />
      </div>
    </div>
  ),
};

export const PrefixSuffix: Story = {
  render: () => (
    <div className="grid w-[860px] grid-cols-2 gap-3">
      <div className={cardClassName}>
        <span className={labelClassName}>Prefix Icon</span>
        <Input
          aria-label="搜索记录"
          placeholder="搜索记录名称"
          prefix={<Search className="size-4" />}
        />
      </div>
      <div className={cardClassName}>
        <span className={labelClassName}>Prefix Text</span>
        <Input
          aria-label="统一社会信用代码"
          defaultValue="91310115MA1K3..."
          prefixAddon="编码类型"
        />
      </div>
      <div className={cardClassName}>
        <span className={labelClassName}>Prefix Button</span>
        <Input
          aria-label="地址"
          defaultValue="上海市浦东新区"
          prefix={
            <button
              className="inline-flex h-6 items-center gap-1 rounded border border-ui-border bg-(--ui-surface-soft-background) px-2 text-xs font-bold"
              type="button"
            >
              <MapPin className="size-3" />
              定位
            </button>
          }
        />
      </div>
      <div className={cardClassName}>
        <span className={labelClassName}>Prefix Dropdown</span>
        <Input
          aria-label="记录"
          defaultValue="示例记录"
          prefixAddon={
            <span className="inline-flex items-center gap-1">
              记录 <ChevronDown className="size-3" />
            </span>
          }
        />
      </div>
      <div className={cardClassName}>
        <span className={labelClassName}>Suffix Icon</span>
        <Input
          aria-label="手机号"
          defaultValue="138****2871"
          suffix={<Phone className="size-4" />}
        />
      </div>
      <div className={cardClassName}>
        <span className={labelClassName}>Suffix Text</span>
        <Input aria-label="账期" defaultValue="30" suffixAddon="天" />
      </div>
      <div className={cardClassName}>
        <span className={labelClassName}>Suffix Button</span>
        <Input aria-label="客户编码" copyable defaultValue="CU-2026-0187" />
      </div>
      <div className={cardClassName}>
        <span className={labelClassName}>Prefix + Suffix</span>
        <Input
          allowClear
          aria-label="组合输入"
          defaultValue="示例记录 A"
          prefixAddon="记录"
        />
      </div>
    </div>
  ),
};

export const ClearCountCopy: Story = {
  render: () => (
    <div className="grid w-[760px] grid-cols-3 gap-3">
      <div className={cardClassName}>
        <span className={labelClassName}>Allow Clear - Empty</span>
        <Input allowClear aria-label="空值清空" placeholder="请输入人员" />
      </div>
      <div className={cardClassName}>
        <span className={labelClassName}>Allow Clear - Filled</span>
        <Input allowClear aria-label="有值清空" defaultValue="张明" />
      </div>
      <div className={cardClassName}>
        <span className={labelClassName}>Show Count</span>
        <Input
          aria-label="字符计数"
          defaultValue="重点记录"
          maxLength={20}
          showCount
        />
      </div>
      <div className={cardClassName}>
        <span className={labelClassName}>Copyable</span>
        <Input
          aria-label="可复制编号"
          copyable={{ label: '复制' }}
          readOnly
          defaultValue="CU-2026-0187"
        />
      </div>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="grid w-[860px] grid-cols-[96px_repeat(6,minmax(0,1fr))] overflow-hidden rounded-lg border border-ui-border text-xs">
      {[
        '状态',
        'Default',
        'Focus',
        'Filled',
        'Error',
        'Readonly',
        'Disabled',
      ].map(item => (
        <div
          className="border-ui-border border-r border-b bg-ui-muted px-3 py-2 font-extrabold text-ui-muted-foreground last:border-r-0"
          key={item}
        >
          {item}
        </div>
      ))}
      <div className="border-ui-border border-r px-3 py-2 font-extrabold">
        Input
      </div>
      <div className="border-ui-border border-r p-2">
        <Input aria-label="默认态" placeholder="请输入" />
      </div>
      <div className="border-ui-border border-r p-2">
        <Input aria-label="聚焦态" defaultValue="正在输入" autoFocus />
      </div>
      <div className="border-ui-border border-r p-2">
        <Input aria-label="已填写态" defaultValue="张明" />
      </div>
      <div className="border-ui-border border-r p-2">
        <Input aria-label="错误态" defaultValue="手机号格式错误" invalid />
      </div>
      <div className="border-ui-border border-r p-2">
        <Input aria-label="只读态" readOnly defaultValue="系统自动生成" />
      </div>
      <div className="p-2">
        <Input aria-label="禁用态" disabled defaultValue="不可编辑" />
      </div>
    </div>
  ),
};
