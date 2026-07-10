import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { Cascader, type CascaderOption, type CascaderValue } from '../index';

const meta = {
  title: 'Primitives/Data Input/Cascader',
  component: Cascader,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Cascader>;

export default meta;
type Story = StoryObj<typeof meta>;

const canvasClassName =
  'grid min-h-[380px] gap-3 bg-(--color-bg-layout) p-6 text-ui-foreground';
const cardClassName =
  'grid min-h-28 content-start gap-2 rounded-lg border border-ui-border bg-ui-background p-3';
const labelClassName = 'text-xs font-extrabold text-ui-muted-foreground';
const noteClassName = 'm-0 text-xs leading-5 text-ui-muted-foreground';

const orgOptions: CascaderOption[] = [
  {
    label: '华东大区',
    value: 'east',
    children: [
      {
        label: '上海公司',
        value: 'shanghai',
        children: [
          { label: '销售一部', value: 'sales-1' },
          { label: '销售二部', value: 'sales-2' },
        ],
      },
      {
        label: '杭州公司',
        value: 'hangzhou',
        children: [
          { label: '客户成功', value: 'success' },
          { label: '渠道运营', value: 'channel' },
        ],
      },
    ],
  },
  {
    label: '华南大区',
    value: 'south',
    children: [
      {
        label: '深圳公司',
        value: 'shenzhen',
        children: [
          { label: '直营团队', value: 'direct' },
          { label: '生态团队', value: 'partner' },
        ],
      },
    ],
  },
  {
    disabled: true,
    disabledReason: '无权限',
    label: '归档组织',
    value: 'archived',
  },
];

function LazyCascaderDemo() {
  const [options, setOptions] = React.useState<CascaderOption[]>([
    {
      isLeaf: false,
      label: '销售中心',
      value: 'sales',
    },
    {
      label: '历史部门',
      value: 'history',
      disabled: true,
      disabledReason: '不可选择',
    },
  ]);

  return (
    <Cascader
      loadData={async selectedOptions => {
        await new Promise(resolve => window.setTimeout(resolve, 600));
        const target = selectedOptions.at(-1);

        if (target?.value !== 'sales') return;

        setOptions([
          {
            label: '销售中心',
            value: 'sales',
            children: [
              { label: '线索组', value: 'lead' },
              { label: '商机组', value: 'opportunity' },
            ],
          },
          options[1],
        ]);
      }}
      options={options}
      placeholder="选择组织"
    />
  );
}

function MultipleCascaderDemo() {
  const [value, setValue] = React.useState<CascaderValue>([
    ['east', 'shanghai', 'sales-1'],
    ['south', 'shenzhen', 'direct'],
  ]);

  return (
    <Cascader
      allowClear
      multiple
      onValueChange={setValue}
      options={orgOptions}
      placeholder="选择多个组织"
      showSearch
      value={value}
    />
  );
}

export const Basic: Story = {
  args: {
    options: orgOptions,
  },
  render: () => (
    <div className={canvasClassName}>
      <div className="grid max-w-[860px] grid-cols-2 gap-3">
        <div className={cardClassName}>
          <span className={labelClassName}>Single</span>
          <Cascader
            allowClear
            defaultValue={['east', 'shanghai', 'sales-1']}
            options={orgOptions}
            placeholder="选择组织路径"
          />
          <p className={noteClassName}>单选叶子节点后关闭面板。</p>
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>Searchable</span>
          <Cascader
            allowClear
            options={orgOptions}
            placeholder="搜索组织路径"
            showSearch
          />
          <p className={noteClassName}>搜索结果展示完整路径。</p>
        </div>
      </div>
    </div>
  ),
};

export const Multiple: Story = {
  args: {
    options: orgOptions,
  },
  render: () => (
    <div className={canvasClassName}>
      <div className="max-w-[420px]">
        <MultipleCascaderDemo />
      </div>
    </div>
  ),
};

export const AsyncAndDisabled: Story = {
  args: {
    options: orgOptions,
  },
  render: () => (
    <div className={canvasClassName}>
      <div className="max-w-[420px]">
        <LazyCascaderDemo />
      </div>
    </div>
  ),
};

export const Status: Story = {
  args: {
    options: orgOptions,
  },
  render: () => (
    <div className={canvasClassName}>
      <div className="grid max-w-[860px] grid-cols-2 gap-3">
        <div className={cardClassName}>
          <span className={labelClassName}>Error</span>
          <Cascader invalid options={orgOptions} placeholder="请选择完整路径" />
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>Disabled</span>
          <Cascader disabled options={orgOptions} placeholder="不可选择" />
        </div>
      </div>
    </div>
  ),
};
