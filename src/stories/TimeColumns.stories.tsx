import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import {
  TimeColumns,
  type TimeColumnValue,
  type TimeUnit,
} from '../components/data-input/time-columns';

const meta = {
  title: 'Primitives/Data Input/TimeColumns',
  component: TimeColumns,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof TimeColumns>;

export default meta;
type Story = StoryObj<typeof meta>;

const canvasClassName =
  'grid min-h-[760px] content-start gap-5 bg-(--color-bg-layout) p-8 text-ui-foreground';
const sectionClassName = 'grid max-w-[1120px] gap-3';
const rowClassName = 'grid grid-cols-3 gap-4';
const cardClassName =
  'grid min-h-72 content-start gap-3 rounded-lg border border-ui-border bg-ui-background p-3';
const labelClassName = 'text-xs font-extrabold text-ui-muted-foreground';
const noteClassName = 'm-0 text-xs leading-5 text-ui-muted-foreground';
const noop = () => undefined;

function InteractiveTimeColumns({
  disabledTime,
  minuteStep,
  secondStep,
  showSecond,
  value: initialValue,
  variant,
}: {
  disabledTime?: (unit: TimeUnit, value: number) => boolean;
  minuteStep?: number;
  secondStep?: number;
  showSecond?: boolean;
  value: TimeColumnValue;
  variant?: 'date-picker' | 'time-picker';
}) {
  const [value, setValue] = useState(initialValue);

  return (
    <div className="grid gap-2">
      <TimeColumns
        disabledTime={disabledTime}
        minuteStep={minuteStep}
        onSelect={(unit, next) =>
          setValue(current => ({
            ...current,
            [unit]: next,
          }))
        }
        secondStep={secondStep}
        showSecond={showSecond}
        value={value}
        variant={variant}
      />
      <span className="text-xs font-semibold text-ui-muted-foreground">
        {String(value.hour).padStart(2, '0')}:
        {String(value.minute).padStart(2, '0')}:
        {String(value.second).padStart(2, '0')}
      </span>
    </div>
  );
}

export const Variants: Story = {
  args: {
    onSelect: noop,
    value: { hour: 0, minute: 0, second: 0 },
  },
  render: () => (
    <div className={canvasClassName}>
      <div className={sectionClassName}>
        <div className={rowClassName}>
          <div className={cardClassName}>
            <span className={labelClassName}>DatePicker Variant</span>
            <InteractiveTimeColumns
              value={{ hour: 1, minute: 0, second: 1 }}
              variant="date-picker"
            />
            <p className={noteClassName}>
              DatePicker 面板内使用，当前值应被滚动到可见区域。
            </p>
          </div>
          <div className={cardClassName}>
            <span className={labelClassName}>TimePicker Variant</span>
            <InteractiveTimeColumns
              value={{ hour: 10, minute: 24, second: 36 }}
              variant="time-picker"
            />
            <p className={noteClassName}>
              独立 TimePicker 使用，行高和字号略大。
            </p>
          </div>
          <div className={cardClassName}>
            <span className={labelClassName}>Hour / Minute</span>
            <InteractiveTimeColumns
              showSecond={false}
              value={{ hour: 23, minute: 59, second: 0 }}
              variant="time-picker"
            />
            <p className={noteClassName}>隐藏秒列时仍保持选中项定位。</p>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const EdgeValues: Story = {
  args: {
    onSelect: noop,
    value: { hour: 0, minute: 0, second: 0 },
  },
  render: () => (
    <div className={canvasClassName}>
      <div className={sectionClassName}>
        <div className={rowClassName}>
          <div className={cardClassName}>
            <span className={labelClassName}>Top Edge 00:00:00</span>
            <InteractiveTimeColumns
              value={{ hour: 0, minute: 0, second: 0 }}
              variant="date-picker"
            />
            <p className={noteClassName}>顶部边界不能出现负向空白。</p>
          </div>
          <div className={cardClassName}>
            <span className={labelClassName}>Middle Offset 01:00:01</span>
            <InteractiveTimeColumns
              value={{ hour: 1, minute: 0, second: 1 }}
              variant="date-picker"
            />
            <p className={noteClassName}>
              复现问题值，小时和秒不应停留在 17-23 / 53-59。
            </p>
          </div>
          <div className={cardClassName}>
            <span className={labelClassName}>Bottom Edge 23:59:59</span>
            <InteractiveTimeColumns
              value={{ hour: 23, minute: 59, second: 59 }}
              variant="date-picker"
            />
            <p className={noteClassName}>底部边界不能被 footer 或阴影遮挡。</p>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const StepsAndDisabled: Story = {
  args: {
    onSelect: noop,
    value: { hour: 0, minute: 0, second: 0 },
  },
  render: () => (
    <div className={canvasClassName}>
      <div className={sectionClassName}>
        <div className={rowClassName}>
          <div className={cardClassName}>
            <span className={labelClassName}>15 Minute / 10 Second Step</span>
            <InteractiveTimeColumns
              minuteStep={15}
              secondStep={10}
              value={{ hour: 18, minute: 30, second: 40 }}
              variant="time-picker"
            />
            <p className={noteClassName}>步长列表需要保持选中项可见。</p>
          </div>
          <div className={cardClassName}>
            <span className={labelClassName}>Disabled Options</span>
            <InteractiveTimeColumns
              disabledTime={(unit, value) =>
                (unit === 'hour' && value === 12) ||
                (unit === 'minute' && value === 30) ||
                (unit === 'second' && value === 45)
              }
              value={{ hour: 10, minute: 24, second: 36 }}
              variant="time-picker"
            />
            <p className={noteClassName}>禁用项可见但不可选。</p>
          </div>
          <div className={cardClassName}>
            <span className={labelClassName}>Narrow Container</span>
            <div className="w-[156px]">
              <InteractiveTimeColumns
                value={{ hour: 1, minute: 0, second: 1 }}
                variant="date-picker"
              />
            </div>
            <p className={noteClassName}>
              DatePicker 内嵌宽度下检查滚动条干扰。
            </p>
          </div>
        </div>
      </div>
    </div>
  ),
};
