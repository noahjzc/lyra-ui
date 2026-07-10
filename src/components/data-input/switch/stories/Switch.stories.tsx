import type { Meta, StoryObj } from '@storybook/react-vite';
import { Check, X } from 'lucide-react';
import { Switch, SwitchField } from '../index';

const meta = {
  title: 'Primitives/Data Input/Switch',
  component: SwitchField,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    label: '示例开关',
  },
} satisfies Meta<typeof SwitchField>;

export default meta;
type Story = StoryObj<typeof meta>;

const canvasClassName =
  'grid min-h-[340px] gap-3 bg-(--color-bg-layout) p-6 text-ui-foreground';
const compactCanvasClassName =
  'grid min-h-[260px] gap-3 bg-(--color-bg-layout) p-6 text-ui-foreground';
const cardClassName =
  'grid min-h-32 content-start gap-2 rounded-lg border border-ui-border bg-ui-background p-3';
const labelClassName = 'text-xs font-extrabold text-ui-muted-foreground';
const noteClassName = 'm-0 text-xs leading-5 text-ui-muted-foreground';

export const Basic: Story = {
  render: () => (
    <div className={compactCanvasClassName}>
      <div className="grid max-w-xl gap-3 rounded-lg border border-ui-border bg-ui-background p-4">
        <SwitchField label="开启提醒" />
        <SwitchField
          defaultChecked
          description="状态变化时发送站内通知。"
          label="自动通知客户负责人"
        />
        <SwitchField
          defaultChecked
          label="设置列表左侧文案"
          labelPlacement="left"
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
          <span className={labelClassName}>Off</span>
          <SwitchField label="关闭" />
          <p className={noteClassName}>关闭状态使用中性轨道。</p>
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>On</span>
          <SwitchField defaultChecked label="开启" />
          <p className={noteClassName}>开启状态使用主题色轨道。</p>
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>Loading</span>
          <SwitchField defaultChecked label="保存中..." loading />
          <p className={noteClassName}>thumb 内部显示 loading 并锁定。</p>
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>Disabled</span>
          <SwitchField disabled label="不可操作" />
          <SwitchField defaultChecked disabled label="已启用但不可操作" />
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>Hover</span>
          <SwitchField
            className="[&_[data-slot=switch-control]]:shadow-(--ui-switch-track-hover-shadow)"
            label="悬停轨道"
          />
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>Focus</span>
          <SwitchField
            className="[&_[data-slot=switch-control]]:ring-2 [&_[data-slot=switch-control]]:ring-(--ui-input-focus-ring)"
            label="键盘焦点"
          />
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>No Label</span>
          <Switch aria-label="仅图形开关" defaultChecked />
          <p className={noteClassName}>仅在表格列或已有明确列标题时使用。</p>
        </div>
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className={compactCanvasClassName}>
      <div className="grid max-w-4xl grid-cols-3 gap-3">
        <div className={cardClassName}>
          <span className={labelClassName}>Small 44x28</span>
          <SwitchField
            defaultChecked
            description="与 small 表单控件对齐。"
            label="紧凑设置"
            size="small"
          />
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>Middle 52x32</span>
          <SwitchField
            defaultChecked
            description="与 middle 表单控件对齐。"
            label="默认设置"
            size="middle"
          />
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>Large 60x36</span>
          <SwitchField
            defaultChecked
            description="与 large 表单控件对齐。"
            label="重点设置"
            size="large"
          />
        </div>
      </div>
    </div>
  ),
};

export const OptionalContent: Story = {
  render: () => (
    <div className={compactCanvasClassName}>
      <div className="grid max-w-4xl grid-cols-3 gap-3">
        <div className={cardClassName}>
          <span className={labelClassName}>Icon</span>
          <Switch
            aria-label="权限开关"
            checkedIcon={<Check aria-hidden="true" className="size-3" />}
            defaultChecked
            uncheckedIcon={<X aria-hidden="true" className="size-3" />}
          />
          <p className={noteClassName}>默认不启用，适合表格列或权限项。</p>
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>Text</span>
          <Switch
            aria-label="短文案开关"
            checkedText="开"
            defaultChecked
            uncheckedText="关"
          />
          <p className={noteClassName}>中文文案建议限制为 1-2 个字。</p>
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>Large Text</span>
          <Switch
            aria-label="双字文案开关"
            checkedText="启用"
            size="large"
            uncheckedText="停用"
          />
          <p className={noteClassName}>双字文本建议用于 large 或宽松场景。</p>
        </div>
      </div>
    </div>
  ),
};

export const RichSetting: Story = {
  render: () => (
    <div className={canvasClassName}>
      <div className="grid max-w-4xl grid-cols-3 gap-3">
        <div className={cardClassName}>
          <SwitchField
            defaultChecked
            description="状态变化时发送站内通知。"
            label="开启提醒"
          />
          <p className={noteClassName}>描述文本使用 12px 弱文本。</p>
        </div>
        <div className={cardClassName}>
          <SwitchField
            card
            defaultChecked
            description="开启后按设定频率刷新数据。"
            label="自动刷新"
          />
          <p className={noteClassName}>卡片型设置整块都应可点击。</p>
        </div>
        <div className={cardClassName}>
          <SwitchField
            card
            description="开启前需要二次确认。"
            label="高风险开关"
          />
          <p className={noteClassName}>高风险开关必须配合确认反馈。</p>
        </div>
      </div>
    </div>
  ),
};
