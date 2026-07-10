import type { Meta, StoryObj } from '@storybook/react-vite';
import dayjs from 'dayjs';
import { DatePicker, type DatePickerPreset, DateRangePicker } from '../index';

const meta = {
  title: 'Primitives/Data Input/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof DatePicker>;

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

const rangePresets: DatePickerPreset[] = [
  {
    label: 'Last 7 Days',
    value: () => [
      dayjs().subtract(6, 'day').format('YYYY-MM-DD'),
      dayjs().format('YYYY-MM-DD'),
    ],
  },
  {
    label: 'Last 14 Days',
    value: () => [
      dayjs().subtract(13, 'day').format('YYYY-MM-DD'),
      dayjs().format('YYYY-MM-DD'),
    ],
  },
  {
    label: 'Last 30 Days',
    value: () => [
      dayjs().subtract(29, 'day').format('YYYY-MM-DD'),
      dayjs().format('YYYY-MM-DD'),
    ],
  },
];

export const Basic: Story = {
  render: () => (
    <div className={canvasClassName}>
      <div className="grid max-w-[1120px] grid-cols-4 gap-4">
        <div className={cardClassName}>
          <span className={labelClassName}>Single Date</span>
          <DatePicker defaultValue="2026-06-05" />
          <p className={noteClassName}>
            用于单个日期字段，右侧图标仅提示可展开。
          </p>
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>Date Range</span>
          <DateRangePicker defaultValue={['2026-05-04', '2026-06-03']} />
          <p className={noteClassName}>
            范围值是一组输入，不拆成两个无关联控件。
          </p>
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>Month</span>
          <DatePicker defaultValue="2026-06" mode="month" />
          <p className={noteClassName}>
            月份选择保留同样触发器，仅更换面板粒度。
          </p>
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>Date Time</span>
          <DatePicker defaultValue="2026-06-05 10:24:00" mode="dateTime" />
          <p className={noteClassName}>dateTime 是 DatePicker 的 mode。</p>
        </div>
      </div>
    </div>
  ),
};

export const Modes: Story = {
  render: () => (
    <div className={canvasClassName}>
      <div className="grid max-w-[960px] grid-cols-3 gap-4">
        <div className={cardClassName}>
          <span className={labelClassName}>mode=date</span>
          <DatePicker defaultValue="2026-06-05" />
          <p className={noteClassName}>选择后直接关闭面板。</p>
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>mode=month</span>
          <DatePicker defaultValue="2026-06" mode="month" />
          <p className={noteClassName}>按月份粒度选择。</p>
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>mode=year</span>
          <DatePicker defaultValue="2026" mode="year" />
          <p className={noteClassName}>按年份粒度选择。</p>
        </div>
      </div>
    </div>
  ),
};

export const RangeAndPresets: Story = {
  render: () => (
    <div className={canvasClassName}>
      <div className="grid max-w-[860px] grid-cols-2 gap-4">
        <div className={cardClassName}>
          <span className={labelClassName}>Date Range</span>
          <DateRangePicker defaultValue={['2026-05-30', '2026-06-04']} />
          <p className={noteClassName}>dateRange 使用双日历面板。</p>
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>Date Range + Presets</span>
          <DateRangePicker
            defaultValue={['2026-05-30', '2026-06-04']}
            presets={rangePresets}
          />
          <p className={noteClassName}>快捷范围在面板内，不替代真实起止值。</p>
        </div>
      </div>
    </div>
  ),
};

export const DateTime: Story = {
  render: () => (
    <div className={canvasClassName}>
      <div className="grid max-w-[900px] grid-cols-2 gap-4">
        <div className={cardClassName}>
          <span className={labelClassName}>mode=dateTime</span>
          <DatePicker defaultValue="2026-06-05 10:24:00" mode="dateTime" />
          <p className={noteClassName}>时间选择作为同层能力出现。</p>
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>mode=dateTimeRange</span>
          <DateRangePicker
            defaultValue={['2026-06-05 09:00:00', '2026-06-10 18:00:00']}
            mode="dateTimeRange"
          />
          <p className={noteClassName}>顶部切换开始/结束，底部保留完整摘要。</p>
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
          <DatePicker defaultValue="2026-06-05" size="small" />
          <p className={noteClassName}>紧凑空间内使用。</p>
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>Middle 32px</span>
          <DatePicker defaultValue="2026-06-05" />
          <p className={noteClassName}>默认日期选择高度。</p>
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>Large 36px</span>
          <DatePicker defaultValue="2026-06-05" size="large" />
          <p className={noteClassName}>需要更高可见性的输入位置。</p>
        </div>
      </div>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className={compactCanvasClassName}>
      <div className="grid max-w-[860px] grid-cols-[96px_repeat(6,minmax(0,1fr))] overflow-hidden rounded-lg border border-ui-border bg-ui-background text-xs">
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
          Date
        </div>
        <div className="border-ui-border border-r p-2">
          <DatePicker placeholder="请选择日期" />
        </div>
        <div className="border-ui-border border-r p-2">
          <DatePicker
            className="[&_[data-slot=date-picker-trigger]]:border-(--ui-input-hover-border)"
            placeholder="请选择日期"
          />
        </div>
        <div className="border-ui-border border-r p-2">
          <DatePicker defaultValue="2026-06-05" />
        </div>
        <div className="border-ui-border border-r p-2">
          <DatePicker defaultValue="2026-06-05" />
        </div>
        <div className="border-ui-border border-r p-2">
          <DatePicker invalid placeholder="必选日期" />
        </div>
        <div className="p-2">
          <DatePicker disabled placeholder="不可选择" />
        </div>
      </div>
    </div>
  ),
};
