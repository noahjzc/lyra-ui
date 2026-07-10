import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import {
  MultiSelect,
  RemoteSelect,
  Select,
  SelectContent,
  SelectField,
  SelectGroup,
  SelectItem,
  SelectLabel,
  type SelectOption,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '../index';

const meta = {
  title: 'Primitives/Data Input/Select',
  component: SelectField,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof SelectField>;

export default meta;
type Story = StoryObj<typeof meta>;

const canvasClassName =
  'grid min-h-[360px] gap-3 bg-(--color-bg-layout) p-6 text-ui-foreground';
const compactCanvasClassName =
  'grid min-h-[260px] gap-3 bg-(--color-bg-layout) p-6 text-ui-foreground';
const cardClassName =
  'grid min-h-28 content-start gap-2 rounded-lg border border-ui-border bg-ui-background p-3';
const labelClassName = 'text-xs font-extrabold text-ui-muted-foreground';
const noteClassName = 'm-0 text-xs leading-5 text-ui-muted-foreground';

const statusOptions: SelectOption[] = [
  { label: '已启用', value: 'enabled' },
  { label: '处理中', value: 'processing' },
  { label: '已停用', value: 'disabled' },
  {
    disabled: true,
    disabledReason: '无权限',
    label: '已归档',
    value: 'archived',
  },
];

const customerOptions: SelectOption[] = [
  {
    description: 'wangming@example.com',
    label: '王明',
    value: 'wangming',
  },
  {
    description: 'lina@example.com',
    label: '李娜',
    value: 'lina',
  },
  {
    description: 'zhou@example.com',
    label: '周启明',
    value: 'zhou',
  },
];

const groupedOptions = [
  {
    label: '状态',
    options: statusOptions.slice(0, 3),
  },
  {
    label: '优先级',
    options: [
      { label: '高', value: 'high' },
      { label: '中', value: 'middle' },
      { label: '低', value: 'low' },
    ],
  },
];

const levelOptions: SelectOption[] = [
  { label: 'A 级客户', value: 'level-a' },
  { label: 'B 级客户', value: 'level-b' },
  { label: 'C 级客户', value: 'level-c' },
  { label: 'D 级客户', value: 'level-d' },
  {
    disabled: true,
    disabledReason: '无权限',
    label: '黑名单客户',
    value: 'blocked',
  },
];

function RemoteSelectDemo({
  mode = 'success',
}: {
  mode?: 'empty' | 'error' | 'success';
}) {
  const [value, setValue] = React.useState<string | undefined>('wangming');

  return (
    <RemoteSelect
      clearable
      loadOptions={async keyword => {
        await new Promise(resolve => window.setTimeout(resolve, 450));

        if (mode === 'error') {
          throw new Error('load failed');
        }

        if (mode === 'empty') {
          return [];
        }

        return customerOptions.filter(option =>
          String(option.label).includes(keyword.trim()),
        );
      }}
      onValueChange={setValue}
      placeholder="搜索客户"
      selectedOption={customerOptions[0]}
      value={value}
    />
  );
}

export const Basic: Story = {
  render: () => (
    <div className={canvasClassName}>
      <div className="grid max-w-[760px] grid-cols-2 gap-3">
        <div className={cardClassName}>
          <span className={labelClassName}>SelectField</span>
          <SelectField
            defaultValue="enabled"
            options={statusOptions}
            placeholder="选择状态"
          />
          <p className={noteClassName}>数据驱动 API，适合表单和筛选场景。</p>
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>Radix Parts</span>
          <Select defaultValue="enabled">
            <SelectTrigger aria-label="商机状态">
              <SelectValue placeholder="选择商机状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>状态</SelectLabel>
                <SelectItem value="enabled">已启用</SelectItem>
                <SelectItem value="processing">处理中</SelectItem>
              </SelectGroup>
              <SelectSeparator />
              <SelectGroup>
                <SelectLabel>受限状态</SelectLabel>
                <SelectItem disabled disabledReason="无权限" value="archived">
                  已归档
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <p className={noteClassName}>保留 Radix parts，兼容已有组合用法。</p>
        </div>
      </div>
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className={canvasClassName}>
      <div className="grid max-w-[860px] grid-cols-2 gap-3">
        <div className={cardClassName}>
          <span className={labelClassName}>Outlined</span>
          <SelectField options={statusOptions} placeholder="请选择" />
          <p className={noteClassName}>默认形态，适合大多数选择输入。</p>
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>Filled</span>
          <SelectField
            options={statusOptions}
            placeholder="请选择"
            variant="filled"
          />
          <p className={noteClassName}>低层级查询区或密集编辑可使用。</p>
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>Borderless</span>
          <SelectField
            defaultValue="enabled"
            options={statusOptions}
            variant="borderless"
          />
          <p className={noteClassName}>表格轻编辑或只读信息行使用。</p>
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>Underlined</span>
          <SelectField
            defaultValue="enabled"
            options={statusOptions}
            variant="underlined"
          />
          <p className={noteClassName}>轻量内联编辑，聚焦时强化底线。</p>
        </div>
      </div>
    </div>
  ),
};

export const SearchAndGroup: Story = {
  render: () => (
    <div className={canvasClassName}>
      <div className="grid max-w-[860px] grid-cols-3 gap-3">
        <div className={cardClassName}>
          <span className={labelClassName}>Searchable</span>
          <SelectField
            options={customerOptions}
            placeholder="搜索客户"
            searchable
          />
          <p className={noteClassName}>搜索值独立于选中值。</p>
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>Grouped</span>
          <SelectField groups={groupedOptions} placeholder="选择条件" />
          <p className={noteClassName}>分组标题仅帮助扫描，不参与选择。</p>
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>Clearable</span>
          <SelectField
            clearable
            defaultValue="enabled"
            options={statusOptions}
          />
          <p className={noteClassName}>已选值可清空，空值回到 placeholder。</p>
        </div>
      </div>
    </div>
  ),
};

export const Multiple: Story = {
  render: () => (
    <div className={canvasClassName}>
      <div className="grid max-w-[860px] grid-cols-3 gap-3">
        <div className={cardClassName}>
          <span className={labelClassName}>Multiple</span>
          <MultiSelect
            defaultValue={['level-a', 'level-b', 'level-c', 'level-d']}
            maxTagCount={2}
            options={levelOptions}
            placeholder="选择客户等级"
          />
          <p className={noteClassName}>
            多选用 Tag 承载已选值，溢出折叠为 +N。
          </p>
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>Searchable Multiple</span>
          <MultiSelect
            clearable
            defaultValue={['wangming', 'lina']}
            options={customerOptions}
            placeholder="选择客户"
            searchable
          />
          <p className={noteClassName}>搜索值独立，选择后面板保持打开。</p>
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>Grouped Multiple</span>
          <MultiSelect
            defaultValue={['enabled', 'high']}
            groups={groupedOptions}
            maxTagCount={3}
            placeholder="选择筛选条件"
          />
          <p className={noteClassName}>分组多选用于复杂筛选场景。</p>
        </div>
      </div>
    </div>
  ),
};

export const Remote: Story = {
  render: () => (
    <div className={canvasClassName}>
      <div className="grid max-w-[860px] grid-cols-3 gap-3">
        <div className={cardClassName}>
          <span className={labelClassName}>Remote Search</span>
          <RemoteSelectDemo />
          <p className={noteClassName}>打开后按关键字远程加载，保留已选项。</p>
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>Empty</span>
          <RemoteSelectDemo mode="empty" />
          <p className={noteClassName}>无匹配数据时展示空态。</p>
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>Error</span>
          <RemoteSelectDemo mode="error" />
          <p className={noteClassName}>加载失败时展示错误与重试入口。</p>
        </div>
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className={compactCanvasClassName}>
      <div className="grid max-w-[640px] grid-cols-3 gap-3">
        <div className={cardClassName}>
          <span className={labelClassName}>Small 28px</span>
          <SelectField
            defaultValue="enabled"
            options={statusOptions}
            size="small"
          />
          <p className={noteClassName}>紧凑查询和表格内编辑。</p>
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>Middle 32px</span>
          <SelectField defaultValue="enabled" options={statusOptions} />
          <p className={noteClassName}>平台默认选择器高度。</p>
        </div>
        <div className={cardClassName}>
          <span className={labelClassName}>Large 36px</span>
          <SelectField
            defaultValue="enabled"
            options={statusOptions}
            size="large"
          />
          <p className={noteClassName}>用于表单首屏关键字段。</p>
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
          Select
        </div>
        <div className="border-ui-border border-r p-2">
          <SelectField options={statusOptions} placeholder="请选择" />
        </div>
        <div className="border-ui-border border-r p-2">
          <SelectField
            className="[&_[data-slot=select-field-trigger]]:border-(--ui-input-hover-border)"
            options={statusOptions}
            placeholder="请选择"
          />
        </div>
        <div className="border-ui-border border-r p-2">
          <SelectField defaultValue="enabled" options={statusOptions} />
        </div>
        <div className="border-ui-border border-r p-2">
          <SelectField defaultValue="enabled" options={statusOptions} />
        </div>
        <div className="border-ui-border border-r p-2">
          <SelectField invalid options={statusOptions} placeholder="必须选择" />
        </div>
        <div className="p-2">
          <SelectField
            disabled
            options={statusOptions}
            placeholder="不可选择"
          />
        </div>
      </div>
    </div>
  ),
};
