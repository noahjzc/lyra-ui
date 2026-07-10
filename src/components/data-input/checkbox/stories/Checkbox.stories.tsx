import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { Checkbox, CheckboxField, CheckboxGroup } from '../index';

const meta = {
  title: 'Primitives/Data Input/Checkbox',
  component: CheckboxField,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    label: '示例选项',
  },
} satisfies Meta<typeof CheckboxField>;

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

const channelOptions = [
  {
    description: '客户关键状态变更时发送站内提醒。',
    label: '站内通知',
    value: 'inbox',
  },
  {
    description: '每日上午汇总待跟进客户与异常工单。',
    label: '邮件摘要',
    value: 'email',
  },
  {
    description: '高优先级商机或逾期任务触发短信。',
    label: '短信提醒',
    value: 'sms',
  },
  {
    description: '同步到外部协作工具，当前租户暂未开通。',
    disabled: true,
    label: '协作工具',
    value: 'webhook',
  },
];

const customerRows = [
  ['001', '上海星河科技', '重点客户', '已跟进'],
  ['002', '杭州青屿供应链', '普通客户', '待分配'],
  ['003', '南京云桥贸易', '重点客户', '报价中'],
];

function TableSelectionDemo() {
  const [selectedRows, setSelectedRows] = React.useState(['001', '003']);
  const allSelected = selectedRows.length === customerRows.length;
  const partiallySelected = selectedRows.length > 0 && !allSelected;

  function toggleAll(nextChecked: boolean | 'indeterminate') {
    setSelectedRows(
      nextChecked === true ? customerRows.map(row => row[0]) : [],
    );
  }

  function toggleRow(rowId: string, nextChecked: boolean | 'indeterminate') {
    setSelectedRows(current =>
      nextChecked === true
        ? [...new Set([...current, rowId])]
        : current.filter(id => id !== rowId),
    );
  }

  return (
    <div className={canvasClassName}>
      <div className="max-w-4xl overflow-hidden rounded-lg border border-ui-border bg-ui-background">
        <div className="grid grid-cols-[44px_1.4fr_1fr_1fr] border-ui-border border-b bg-(--ui-surface-soft-background) text-xs font-extrabold text-ui-muted-foreground">
          <div className="grid min-h-9 place-items-center border-ui-border border-r">
            <Checkbox
              aria-label="选择全部客户"
              checked={partiallySelected ? 'indeterminate' : allSelected}
              onCheckedChange={toggleAll}
              size="small"
            />
          </div>
          <div className="flex min-h-9 items-center px-3">客户</div>
          <div className="flex min-h-9 items-center px-3">类型</div>
          <div className="flex min-h-9 items-center px-3">状态</div>
        </div>
        {customerRows.map(row => (
          <div
            className="grid grid-cols-[44px_1.4fr_1fr_1fr] border-ui-border border-b last:border-b-0"
            key={row[0]}
          >
            <div className="grid min-h-10 place-items-center border-ui-border border-r">
              <Checkbox
                aria-label={`选择 ${row[1]}`}
                checked={selectedRows.includes(row[0])}
                onCheckedChange={nextChecked => toggleRow(row[0], nextChecked)}
                size="small"
              />
            </div>
            <div className="flex min-h-10 items-center px-3 text-sm">
              {row[1]}
            </div>
            <div className="flex min-h-10 items-center px-3 text-sm text-ui-muted-foreground">
              {row[2]}
            </div>
            <div className="flex min-h-10 items-center px-3 text-sm text-ui-muted-foreground">
              {row[3]}
            </div>
          </div>
        ))}
      </div>
      <p className={noteClassName}>已选择 {selectedRows.length} 个客户</p>
    </div>
  );
}

export const Basic: Story = {
  render: () => (
    <div className={compactCanvasClassName}>
      <div className="grid max-w-xl gap-3 rounded-lg border border-ui-border bg-ui-background p-4">
        <CheckboxField label="接收客户跟进提醒" />
        <CheckboxField
          defaultChecked
          description="包含高优先级商机、逾期任务和客户状态变更。"
          label="启用运营通知"
        />
        <CheckboxField
          checked="indeterminate"
          description="部分子项已启用，用于父级汇总选择。"
          label="批量权限"
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
          <CheckboxField label="未选中" />
          <p className={noteClassName}>白底与默认边框。</p>
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>Checked</span>
          <CheckboxField checked label="已选中" />
          <p className={noteClassName}>主题色背景与白色勾选。</p>
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>Indeterminate</span>
          <CheckboxField checked="indeterminate" label="部分选中" />
          <p className={noteClassName}>用于父级或表头半选。</p>
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>Disabled</span>
          <CheckboxField disabled label="禁用未选" />
          <CheckboxField checked disabled label="禁用已选" />
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>Error</span>
          <CheckboxField
            helperText="至少选择一项通知渠道。"
            invalid
            label="错误状态"
          />
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>Hover</span>
          <CheckboxField
            className="[&_[data-slot=checkbox-control]]:border-(--ui-input-hover-border)"
            label="悬停边框"
          />
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>Focus</span>
          <CheckboxField
            className="[&_[data-slot=checkbox-control]]:border-(--ui-input-focus-border) [&_[data-slot=checkbox-control]]:ring-2 [&_[data-slot=checkbox-control]]:ring-(--ui-input-focus-ring)"
            label="键盘焦点"
          />
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>Description</span>
          <CheckboxField
            description="较长说明会换行，控件保持顶部对齐。"
            label="带说明选项"
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
          <CheckboxGroup
            defaultValue={['inbox']}
            direction="horizontal"
            legend="Inline"
            options={channelOptions.slice(0, 3)}
          />
        </div>
        <div className={cardClassName}>
          <CheckboxGroup
            defaultValue={['email']}
            direction="vertical"
            legend="Vertical"
            options={channelOptions.slice(0, 3)}
          />
        </div>
        <div className={cardClassName}>
          <CheckboxGroup
            columns={2}
            defaultValue={['inbox', 'email']}
            disabledOptions={['webhook']}
            legend="Grid"
            options={channelOptions}
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
        <CheckboxGroup
          card
          columns={2}
          defaultValue={['inbox', 'email']}
          helperText="卡片选项用于权限、通知偏好等需要补充说明的集合。"
          legend="通知渠道"
          options={channelOptions}
        />
        <CheckboxGroup
          card
          columns={2}
          helperText="请选择至少一个渠道。"
          invalid
          legend="错误示例"
          options={channelOptions.slice(0, 2)}
        />
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
          <CheckboxField size="small" label="表格密集选择" />
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>Middle 16px</span>
          <CheckboxField size="middle" label="默认表单选择" />
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>Large 18px</span>
          <CheckboxField
            description="宽松表单或卡片选项。"
            size="large"
            label="重点设置"
          />
        </div>
      </div>
    </div>
  ),
};

export const TableSelection: Story = {
  render: () => <TableSelectionDemo />,
};
