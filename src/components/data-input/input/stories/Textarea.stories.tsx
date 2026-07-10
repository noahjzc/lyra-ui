import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input, Textarea } from '../index';

const meta = {
  title: 'Primitives/Data Input/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

const cardClassName =
  'grid min-h-32 content-start gap-2 rounded-lg border border-ui-border bg-ui-background p-3';
const labelClassName = 'text-xs font-extrabold text-ui-muted-foreground';
const noteClassName = 'm-0 text-xs leading-5 text-ui-muted-foreground';

export const Variants: Story = {
  render: () => (
    <div className="grid w-[860px] grid-cols-2 gap-3">
      <div className={cardClassName}>
        <span className={labelClassName}>Outlined</span>
        <Input.Textarea
          aria-label="默认备注"
          defaultValue="这是一段多行说明文本，用于展示默认边框形态。"
        />
        <p className={noteClassName}>默认形态，适合表单、弹窗和抽屉。</p>
      </div>
      <div className={cardClassName}>
        <span className={labelClassName}>Filled</span>
        <Textarea
          aria-label="填充备注"
          defaultValue="浅色背景承载输入区域，适合低层级编辑。"
          variant="filled"
        />
        <p className={noteClassName}>和 Input filled 形态保持一致。</p>
      </div>
      <div className={cardClassName}>
        <span className={labelClassName}>Borderless</span>
        <Textarea
          aria-label="无边框备注"
          defaultValue="适合轻量内联编辑或只读详情区域。"
          variant="borderless"
        />
        <p className={noteClassName}>不建议在复杂表单中作为默认形态。</p>
      </div>
      <div className={cardClassName}>
        <span className={labelClassName}>Underlined</span>
        <Textarea
          aria-label="底线备注"
          defaultValue="保留多行输入区域，只在底部强化焦点线。"
          variant="underlined"
        />
        <p className={noteClassName}>
          Textarea 不使用纯单线形态，避免失去可点击区域感。
        </p>
      </div>
    </div>
  ),
};

export const RowsAndResize: Story = {
  render: () => (
    <div className="grid w-[860px] grid-cols-4 gap-3">
      <div className={cardClassName}>
        <span className={labelClassName}>Rows 2</span>
        <Textarea aria-label="两行备注" defaultValue="短说明文本。" rows={2} />
        <p className={noteClassName}>适合紧凑表单和短说明。</p>
      </div>
      <div className={cardClassName}>
        <span className={labelClassName}>Rows 4</span>
        <Textarea
          aria-label="四行备注"
          defaultValue="默认推荐行数。多行文本需要稳定高度，避免页面频繁跳动。"
          rows={4}
        />
        <p className={noteClassName}>通用表单默认推荐。</p>
      </div>
      <div className={cardClassName}>
        <span className={labelClassName}>Auto Size</span>
        <Textarea
          aria-label="自动高度备注"
          autoSize={{ maxRows: 6, minRows: 2 }}
          defaultValue="内容增长时自动扩展；达到最大行数后，内部滚动而不是继续撑开布局。"
        />
        <p className={noteClassName}>必须设置 minRows 和 maxRows。</p>
      </div>
      <div className={cardClassName}>
        <span className={labelClassName}>Resizable</span>
        <Textarea
          aria-label="可调整备注"
          defaultValue="允许调整大小时，只开放纵向 resize。"
          resize="vertical"
        />
        <p className={noteClassName}>默认不开放 resize。</p>
      </div>
    </div>
  ),
};

export const ClearAndCount: Story = {
  render: () => (
    <div className="grid w-[860px] grid-cols-4 gap-3">
      <div className={cardClassName}>
        <span className={labelClassName}>Allow Clear - Empty</span>
        <Textarea allowClear aria-label="空备注" placeholder="请输入说明内容" />
        <p className={noteClassName}>空值或 placeholder 场景不显示清空。</p>
      </div>
      <div className={cardClassName}>
        <span className={labelClassName}>Allow Clear - Filled</span>
        <Textarea
          allowClear
          aria-label="可清空备注"
          defaultValue="这是一段已填写内容。"
        />
        <p className={noteClassName}>清空按钮放右上角。</p>
      </div>
      <div className={cardClassName}>
        <span className={labelClassName}>Show Count</span>
        <Textarea
          aria-label="计数备注"
          defaultValue="短文本限制适合展示字符数。"
          maxLength={200}
          showCount
        />
        <p className={noteClassName}>计数固定右下角。</p>
      </div>
      <div className={cardClassName}>
        <span className={labelClassName}>Clear + Count</span>
        <Textarea
          allowClear
          aria-label="清空计数备注"
          defaultValue="Textarea 有足够垂直空间，可同时展示清空与计数。"
          maxLength={200}
          showCount
        />
        <p className={noteClassName}>清空在右上，计数在右下。</p>
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
        Textarea
      </div>
      <div className="border-ui-border border-r p-2">
        <Textarea aria-label="备注默认态" placeholder="请输入" rows={2} />
      </div>
      <div className="border-ui-border border-r p-2">
        <Textarea
          aria-label="备注聚焦态"
          autoFocus
          defaultValue="正在输入"
          rows={2}
        />
      </div>
      <div className="border-ui-border border-r p-2">
        <Textarea aria-label="备注已填写态" defaultValue="已有内容" rows={2} />
      </div>
      <div className="border-ui-border border-r p-2">
        <Textarea
          aria-label="备注错误态"
          defaultValue="内容不能为空"
          invalid
          rows={2}
        />
      </div>
      <div className="border-ui-border border-r p-2">
        <Textarea
          aria-label="备注只读态"
          readOnly
          defaultValue="系统生成内容"
          rows={2}
        />
      </div>
      <div className="p-2">
        <Textarea
          aria-label="备注禁用态"
          disabled
          defaultValue="不可编辑"
          rows={2}
        />
      </div>
    </div>
  ),
};
