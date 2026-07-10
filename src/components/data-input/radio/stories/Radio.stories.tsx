import type { Meta, StoryObj } from '@storybook/react-vite';
import { RadioField, RadioGroup } from '../index';

const meta = {
  title: 'Primitives/Data Input/Radio',
  component: RadioGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    options: [{ label: '示例选项', value: 'sample' }],
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const canvasClassName =
  'grid min-h-[340px] gap-3 bg-(--color-bg-layout) p-6 text-ui-foreground';
const compactCanvasClassName =
  'grid min-h-[240px] gap-3 bg-(--color-bg-layout) p-6 text-ui-foreground';
const cardClassName =
  'grid min-h-28 content-start gap-2 rounded-lg border border-ui-border bg-ui-background p-3';
const labelClassName = 'text-xs font-extrabold text-ui-muted-foreground';
const noteClassName = 'm-0 text-xs leading-5 text-ui-muted-foreground';

const strategyOptions = [
  {
    description: '系统自动推荐负责人，适合标准客户池。',
    label: '自动分配',
    value: 'auto',
  },
  {
    description: '由销售主管手动确认后再进入跟进流程。',
    label: '人工审核',
    value: 'manual',
  },
  {
    description: '保留当前负责人，仅记录推荐结果。',
    label: '仅记录',
    value: 'record',
  },
  {
    description: '当前租户未启用外部规则引擎。',
    disabled: true,
    label: '外部规则',
    value: 'external',
  },
];

export const Basic: Story = {
  render: () => (
    <div className={compactCanvasClassName}>
      <div className="grid max-w-xl gap-3 rounded-lg border border-ui-border bg-ui-background p-4">
        <RadioGroup
          defaultValue="auto"
          direction="vertical"
          legend="客户分配策略"
          options={strategyOptions.slice(0, 3)}
        />
      </div>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className={canvasClassName}>
      <div className="grid max-w-5xl grid-cols-4 gap-3">
        <div className={cardClassName}>
          <span className={labelClassName}>Default</span>
          <RadioField label="未选中" name="state-default" value="default" />
          <p className={noteClassName}>白底与默认边框。</p>
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>Checked</span>
          <RadioField
            checked
            label="已选中"
            name="state-checked"
            value="checked"
          />
          <p className={noteClassName}>主题色边框与中心圆点。</p>
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>Disabled</span>
          <RadioField disabled label="禁用未选" name="state-disabled" />
          <RadioField checked disabled label="禁用已选" name="state-disabled" />
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>Error</span>
          <RadioField
            helperText="请选择一种分配策略。"
            invalid
            label="错误状态"
            name="state-error"
          />
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>Hover</span>
          <RadioField
            className="[&_[data-slot=radio-control]]:border-(--ui-input-hover-border)"
            label="悬停边框"
            name="state-hover"
          />
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>Focus</span>
          <RadioField
            className="[&_[data-slot=radio-control]]:border-(--ui-input-focus-border) [&_[data-slot=radio-control]]:ring-2 [&_[data-slot=radio-control]]:ring-(--ui-input-focus-ring)"
            label="键盘焦点"
            name="state-focus"
          />
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>Description</span>
          <RadioField
            description="较长说明会换行，控件保持顶部对齐。"
            label="带说明选项"
            name="state-desc"
          />
        </div>
      </div>
    </div>
  ),
};

export const GroupLayout: Story = {
  render: () => (
    <div className={canvasClassName}>
      <div className="grid max-w-5xl grid-cols-3 gap-3">
        <div className={cardClassName}>
          <RadioGroup
            defaultValue="auto"
            direction="horizontal"
            legend="Inline"
            options={strategyOptions.slice(0, 3)}
          />
        </div>
        <div className={cardClassName}>
          <RadioGroup
            defaultValue="manual"
            direction="vertical"
            legend="Vertical"
            options={strategyOptions.slice(0, 3)}
          />
        </div>
        <div className={cardClassName}>
          <RadioGroup
            columns={2}
            defaultValue="auto"
            disabledOptions={['external']}
            legend="Grid"
            options={strategyOptions}
          />
        </div>
      </div>
    </div>
  ),
};

export const RichOptions: Story = {
  render: () => (
    <div className={canvasClassName}>
      <div className="grid max-w-4xl gap-3 rounded-lg border border-ui-border bg-ui-background p-4">
        <RadioGroup
          defaultValue="auto"
          helperText="卡片选项用于策略、处理方式等需要说明的稳定枚举。"
          legend="分配策略"
          options={strategyOptions}
          variant="card"
        />
        <RadioGroup
          helperText="请选择一种处理方式。"
          invalid
          legend="错误示例"
          options={strategyOptions.slice(0, 2)}
          variant="card"
        />
      </div>
    </div>
  ),
};

export const ButtonRadio: Story = {
  render: () => (
    <div className={compactCanvasClassName}>
      <div className="grid max-w-4xl grid-cols-3 gap-3">
        {(['small', 'middle', 'large'] as const).map(size => (
          <div className={cardClassName} key={size}>
            <span className={labelClassName}>{size}</span>
            <RadioGroup
              defaultValue="compact"
              direction="horizontal"
              legend="列表密度"
              options={[
                { label: '紧凑', value: 'compact' },
                { label: '默认', value: 'middle' },
                { label: '宽松', value: 'loose' },
              ]}
              size={size}
              variant="button"
            />
            <p className={noteClassName}>与 Button/Input 高度体系对齐。</p>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className={compactCanvasClassName}>
      <div className="grid max-w-3xl grid-cols-3 gap-3">
        <div className={cardClassName}>
          <span className={labelClassName}>Small 14px</span>
          <RadioField size="small" label="表格密集选择" name="size-small" />
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>Middle 16px</span>
          <RadioField
            checked
            size="middle"
            label="默认表单选择"
            name="size-middle"
          />
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>Large 18px</span>
          <RadioField
            checked
            description="宽松表单或卡片选项。"
            size="large"
            label="重点设置"
            name="size-large"
          />
        </div>
      </div>
    </div>
  ),
};
