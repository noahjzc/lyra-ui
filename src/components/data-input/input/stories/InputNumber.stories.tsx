import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input, InputNumber } from '../index';

const meta = {
  title: 'Primitives/Data Input/InputNumber',
  component: InputNumber,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof InputNumber>;

export default meta;
type Story = StoryObj<typeof meta>;

const cardClassName =
  'grid min-h-28 content-start gap-2 rounded-lg border border-ui-border bg-ui-background p-3';
const labelClassName = 'text-xs font-extrabold text-ui-muted-foreground';
const noteClassName = 'm-0 text-xs leading-5 text-ui-muted-foreground';
const canvasClassName =
  'grid gap-3 bg-(--color-bg-layout) p-6 text-ui-foreground';

export const Variants: Story = {
  render: () => (
    <div className={canvasClassName}>
      <div className="grid max-w-[860px] grid-cols-2 gap-3">
        <div className={cardClassName}>
          <span className={labelClassName}>Outlined</span>
          <Input.Number aria-label="默认金额" defaultValue={128000} />
          <p className={noteClassName}>默认形态，适合大多数数值表单。</p>
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>Filled</span>
          <InputNumber
            aria-label="填充金额"
            defaultValue={128000}
            variant="filled"
          />
          <p className={noteClassName}>低层级查询区或密集编辑可使用。</p>
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>Borderless</span>
          <InputNumber
            aria-label="无边框金额"
            defaultValue={128000}
            variant="borderless"
          />
          <p className={noteClassName}>表格轻编辑或只读信息行使用。</p>
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>Underlined</span>
          <InputNumber
            aria-label="底线金额"
            defaultValue={128000}
            variant="underlined"
          />
          <p className={noteClassName}>轻量内联编辑，聚焦时强化底线。</p>
        </div>
      </div>
    </div>
  ),
};

export const PlaceholderAndValue: Story = {
  render: () => (
    <div className={canvasClassName}>
      <div className="grid max-w-[860px] grid-cols-4 gap-3">
        <div className={cardClassName}>
          <span className={labelClassName}>Placeholder</span>
          <InputNumber aria-label="空数值" placeholder="请输入数值" />
          <p className={noteClassName}>空值不等于 0。</p>
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>Zero</span>
          <InputNumber aria-label="零值" defaultValue={0} />
          <p className={noteClassName}>0 是真实值，需要和 placeholder 区分。</p>
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>Negative</span>
          <InputNumber aria-label="负数" defaultValue={-1280} min={-9999} />
          <p className={noteClassName}>允许负数时必须明确 min。</p>
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>Readonly</span>
          <InputNumber aria-label="只读金额" readOnly defaultValue={128000} />
          <p className={noteClassName}>只读数值可选择复制，不呈现禁用感。</p>
        </div>
      </div>
    </div>
  ),
};

export const AlignmentAndUnit: Story = {
  render: () => (
    <div className={canvasClassName}>
      <div className="grid max-w-[860px] grid-cols-4 gap-3">
        <div className={cardClassName}>
          <span className={labelClassName}>Default Left</span>
          <InputNumber
            aria-label="默认左对齐"
            defaultValue={128000}
            controls={false}
          />
          <p className={noteClassName}>基础输入默认与 Input 一致左对齐。</p>
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>Amount Right</span>
          <InputNumber
            aria-label="右对齐金额"
            controls={false}
            defaultValue={128000}
            formatter={value =>
              value == null ? '' : value.toLocaleString('zh-CN')
            }
            parser={value => Number(value.replace(/,/g, ''))}
            precision={2}
            textAlign="right"
          />
          <p className={noteClassName}>金额、汇总值可右对齐。</p>
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>Unit Left</span>
          <InputNumber
            aria-label="账期"
            controls={false}
            defaultValue={30}
            suffixAddon="天"
          />
          <p className={noteClassName}>带单位的普通数量仍保持左对齐。</p>
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>Prefix + Suffix</span>
          <InputNumber
            aria-label="含税金额"
            controls={false}
            defaultValue={30000}
            prefixAddon="¥"
            suffixAddon="含税"
            textAlign="right"
          />
          <p className={noteClassName}>中间数值区域自适应。</p>
        </div>
      </div>
    </div>
  ),
};

export const StepperPrecisionRange: Story = {
  render: () => (
    <div className={canvasClassName}>
      <div className="grid max-w-[860px] grid-cols-4 gap-3">
        <div className={cardClassName}>
          <span className={labelClassName}>Stepper</span>
          <InputNumber
            aria-label="步进数量"
            defaultValue={10}
            max={20}
            min={0}
          />
          <p className={noteClassName}>需要微调数值时展示。</p>
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>Precision</span>
          <InputNumber
            aria-label="比例"
            defaultValue={12.5}
            precision={2}
            step={0.25}
            suffixAddon="%"
          />
          <p className={noteClassName}>比例、小数必须明确 precision。</p>
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>Range</span>
          <InputNumber aria-label="超出范围" defaultValue={120} max={100} />
          <p className={noteClassName}>超出 min/max 时进入错误态。</p>
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>Formatter</span>
          <InputNumber
            aria-label="格式化金额"
            controls={false}
            defaultValue={1280000}
            formatter={value =>
              value == null
                ? ''
                : value.toLocaleString('zh-CN', {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                  })
            }
            parser={value => Number(value.replace(/,/g, ''))}
            textAlign="right"
          />
          <p className={noteClassName}>展示千分位，编辑时 parser 还原。</p>
        </div>
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className={canvasClassName}>
      <div className="grid max-w-[640px] grid-cols-3 gap-3">
        <div className={cardClassName}>
          <span className={labelClassName}>Small 28px</span>
          <InputNumber
            aria-label="小号数量"
            defaultValue={10}
            size="small"
            suffix="件"
          />
          <p className={noteClassName}>表格内编辑。</p>
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>Middle 32px</span>
          <InputNumber
            aria-label="默认金额"
            defaultValue={42600}
            prefixAddon="¥"
          />
          <p className={noteClassName}>查询区域与表单默认。</p>
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>Large 36px</span>
          <InputNumber
            aria-label="大号金额"
            defaultValue={216500}
            size="large"
          />
          <p className={noteClassName}>弹窗关键金额。</p>
        </div>
      </div>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className={canvasClassName}>
      <div className="grid max-w-[860px] grid-cols-[96px_repeat(6,minmax(0,1fr))] overflow-hidden rounded-lg border border-ui-border bg-ui-background text-xs">
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
          Number
        </div>
        <div className="border-ui-border border-r p-2">
          <InputNumber aria-label="数值默认态" placeholder="请输入" />
        </div>
        <div className="border-ui-border border-r p-2">
          <InputNumber aria-label="数值聚焦态" autoFocus defaultValue={30000} />
        </div>
        <div className="border-ui-border border-r p-2">
          <InputNumber aria-label="数值已填写态" defaultValue={30000} />
        </div>
        <div className="border-ui-border border-r p-2">
          <InputNumber aria-label="数值错误态" defaultValue={120} max={100} />
        </div>
        <div className="border-ui-border border-r p-2">
          <InputNumber aria-label="数值只读态" readOnly defaultValue={30000} />
        </div>
        <div className="p-2">
          <InputNumber aria-label="数值禁用态" disabled defaultValue={0} />
        </div>
      </div>
    </div>
  ),
};
