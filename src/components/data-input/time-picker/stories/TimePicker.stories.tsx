import type { Meta, StoryObj } from '@storybook/react-vite';
import { TimePicker, TimeRangePicker } from '../index';

const meta = {
  title: 'Primitives/Data Input/TimePicker',
  component: TimePicker,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof TimePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

const canvasClassName =
  'grid min-h-[640px] content-start gap-4 bg-(--color-bg-layout) p-8 text-ui-foreground';
const compactCanvasClassName =
  'grid min-h-[520px] content-start gap-4 bg-(--color-bg-layout) p-8 text-ui-foreground';
const cardClassName =
  'grid min-h-44 content-start gap-2.5 rounded-lg border border-ui-border bg-ui-background p-3';
const labelClassName = 'text-xs font-extrabold text-ui-muted-foreground';
const noteClassName = 'm-0 text-xs leading-5 text-ui-muted-foreground';

export const Basic: Story = {
  render: () => (
    <div className={canvasClassName}>
      <div className="grid max-w-[1120px] grid-cols-4 gap-4">
        <div className={cardClassName}>
          <span className={labelClassName}>Hour / Minute</span>
          <TimePicker defaultValue="10:24" />
          <p className={noteClassName}>默认时间选择，适合大多数后台表单。</p>
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>With Seconds</span>
          <TimePicker defaultValue="10:24:36" format="HH:mm:ss" />
          <p className={noteClassName}>秒级精度用于审计、调度或同步时间。</p>
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>Time Range</span>
          <TimeRangePicker allowClear defaultValue={['09:00', '18:00']} />
          <p className={noteClassName}>
            范围值在一个触发器内呈现，保持同一焦点环。
          </p>
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>Step</span>
          <TimePicker defaultValue="10:30" minuteStep={15} />
          <p className={noteClassName}>固定步长降低长列表选择成本。</p>
        </div>
      </div>
    </div>
  ),
};

export const PanelAndDisabledTime: Story = {
  render: () => (
    <div className={canvasClassName}>
      <div className="grid max-w-[860px] grid-cols-2 gap-4">
        <div className={cardClassName}>
          <span className={labelClassName}>Disabled Slot</span>
          <TimePicker
            defaultValue="10:24:36"
            disabledTime={(unit, value) =>
              (unit === 'hour' && value === 12) ||
              (unit === 'minute' && value === 30)
            }
            format="HH:mm:ss"
          />
          <p className={noteClassName}>
            禁用时间可见但不可选，使用弱背景和删除线。
          </p>
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>Range With Seconds</span>
          <TimeRangePicker
            defaultValue={['09:00:00', '18:30:00']}
            format="HH:mm:ss"
            minuteStep={15}
            secondStep={15}
          />
          <p className={noteClassName}>
            范围面板切换开始/结束，底部保留完整摘要。
          </p>
        </div>
      </div>
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className={compactCanvasClassName}>
      <div className="grid max-w-[1120px] grid-cols-4 gap-4">
        <div className={cardClassName}>
          <span className={labelClassName}>Outlined</span>
          <TimePicker defaultValue="10:24" />
          <p className={noteClassName}>默认形态，适合多数表单。</p>
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>Filled</span>
          <TimePicker defaultValue="10:24" variant="filled" />
          <p className={noteClassName}>低层级查询区或密集编辑可使用。</p>
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>Borderless</span>
          <TimePicker defaultValue="10:24" variant="borderless" />
          <p className={noteClassName}>表格内轻编辑或只读信息行使用。</p>
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>Underlined</span>
          <TimePicker defaultValue="10:24" variant="underlined" />
          <p className={noteClassName}>轻量内联编辑，聚焦时强化底线。</p>
        </div>
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className={compactCanvasClassName}>
      <div className="grid max-w-[760px] grid-cols-3 gap-4">
        <div className={cardClassName}>
          <span className={labelClassName}>Small 28px</span>
          <TimePicker defaultValue="09:00" size="small" />
          <p className={noteClassName}>紧凑工具区或表格内编辑。</p>
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>Middle 32px</span>
          <TimePicker defaultValue="10:24" />
          <p className={noteClassName}>平台默认时间选择高度。</p>
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>Large 36px</span>
          <TimePicker defaultValue="18:00" size="large" />
          <p className={noteClassName}>首屏表单或重点字段。</p>
        </div>
      </div>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className={compactCanvasClassName}>
      <div className="grid max-w-[900px] grid-cols-[96px_repeat(6,minmax(0,1fr))] overflow-hidden rounded-lg border border-ui-border bg-ui-background text-xs">
        {[
          '状态',
          'Default',
          'Hover',
          'Focus',
          'Filled',
          'Error',
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
          Time
        </div>
        <div className="border-ui-border border-r p-2">
          <TimePicker placeholder="请选择时间" />
        </div>
        <div className="border-ui-border border-r p-2">
          <TimePicker
            className="[&_[data-slot=time-picker-trigger]]:border-(--ui-input-hover-border)"
            placeholder="请选择时间"
          />
        </div>
        <div className="border-ui-border border-r p-2">
          <TimePicker defaultValue="10:24" />
        </div>
        <div className="border-ui-border border-r p-2">
          <TimePicker defaultValue="10:24" />
        </div>
        <div className="border-ui-border border-r p-2">
          <TimePicker invalid placeholder="必选时间" />
        </div>
        <div className="p-2">
          <TimePicker disabled placeholder="不可选择" />
        </div>
      </div>
    </div>
  ),
};
