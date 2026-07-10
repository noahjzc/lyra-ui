import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { fn } from 'storybook/test';
import { Button } from '../../../general';
import {
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
} from '../index';
import type { PopoverPlacement } from '../types';

const meta = {
  title: 'Primitives/Data View/Popover',
  component: PopoverContent,
  decorators: [
    Story => (
      <div className="min-h-[360px] max-w-[820px] bg-ui-background p-10">
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof PopoverContent>;

export default meta;
type Story = StoryObj<typeof meta>;

const placementRows: (PopoverPlacement | null)[][] = [
  ['topLeft', 'top', 'topRight'],
  ['leftTop', null, 'rightTop'],
  ['left', null, 'right'],
  ['leftBottom', null, 'rightBottom'],
  ['bottomLeft', 'bottom', 'bottomRight'],
];

const arrowOptionItems = [
  {
    arrow: true,
    label: '默认箭头',
    placement: 'top' as const,
  },
  {
    arrow: { pointAtCenter: true },
    label: '指向中心',
    placement: 'top' as const,
  },
  {
    arrow: false,
    label: '隐藏箭头',
    placement: 'top' as const,
  },
] satisfies Array<{
  arrow: boolean | { pointAtCenter: boolean };
  label: string;
  placement: PopoverPlacement;
}>;

function FilterChip({ children }: { children: string }) {
  return (
    <span className="inline-flex min-w-0 items-center gap-1 rounded-[5px] border border-ui-border bg-ui-muted px-2 py-1 text-xs text-ui-foreground">
      <span className="min-w-0 truncate">{children}</span>
      <button
        aria-label={`移除${children}筛选`}
        className="rounded-[4px] px-1 text-ui-muted-foreground outline-none hover:bg-ui-background focus-visible:ring-2 focus-visible:ring-(--ui-button-focus-ring)"
        type="button"
      >
        x
      </button>
    </span>
  );
}

export const FilterOverflow: Story = {
  render: () => (
    <Popover defaultOpen>
      <PopoverTrigger asChild>
        <Button>+4 筛选</Button>
      </PopoverTrigger>
      <PopoverContent aria-label="已生效筛选" role="dialog" size="large">
        <PopoverHeader>
          <span>已生效筛选 7</span>
          <Button size="small" variant="ghost">
            清空全部
          </Button>
        </PopoverHeader>
        <PopoverBody className="flex flex-wrap gap-2">
          <FilterChip>处理人 = 张明</FilterChip>
          <FilterChip>记录等级 包含 A/B</FilterChip>
          <FilterChip>{'金额 >= ¥30,000'}</FilterChip>
          <FilterChip>地区 = 华东</FilterChip>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  ),
};

export const ColumnSettings: Story = {
  render: () => (
    <Popover defaultOpen>
      <PopoverTrigger asChild>
        <Button aria-label="打开列设置" variant="ghost">
          列设置
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        aria-label="列设置"
        role="dialog"
        side="right"
        size="medium"
      >
        <PopoverHeader>
          <span>列设置</span>
          <span className="text-xs text-ui-muted-foreground">已选 6/12</span>
        </PopoverHeader>
        <PopoverBody className="grid max-h-[220px] gap-2">
          {[
            '客户名称',
            '负责人',
            '客户等级',
            '授信额度',
            '最近跟进',
            '风险状态',
          ].map((label, index) => (
            <label
              className="flex min-h-8 items-center justify-between rounded-[5px] px-2 text-sm hover:bg-ui-muted"
              key={label}
            >
              {label}
              <input defaultChecked={index < 3} type="checkbox" />
            </label>
          ))}
        </PopoverBody>
        <PopoverFooter>
          <Button onClick={fn()} size="small" variant="ghost">
            重置
          </Button>
          <Button onClick={fn()} size="small">
            应用
          </Button>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  ),
};

export const NotificationPanel: Story = {
  render: () => (
    <Popover defaultOpen>
      <PopoverTrigger asChild>
        <Button aria-label="查看通知" variant="ghost">
          通知
        </Button>
      </PopoverTrigger>
      <PopoverContent aria-label="通知" role="dialog" size="large">
        <PopoverHeader>
          <span>通知</span>
          <span className="text-xs text-ui-muted-foreground">3 条未读</span>
        </PopoverHeader>
        <PopoverBody className="grid max-h-[240px] gap-3">
          {[
            [
              '授信审批已通过',
              '客户「华东供应链」额度更新为 ¥300,000',
              '09:30',
            ],
            ['合同即将到期', '3 条合同需要在 7 天内完成续签确认', '08:10'],
            ['导入任务已完成', '2 条记录需要人工确认后入库', '昨天'],
          ].map(([title, desc, time]) => (
            <div
              className="grid grid-cols-[8px_minmax(0,1fr)] gap-2"
              key={title}
            >
              <span className="mt-1.5 size-2 rounded-full bg-(--ui-button-primary-background)" />
              <div className="grid min-w-0 gap-0.5">
                <strong className="truncate text-sm font-semibold">
                  {title}
                </strong>
                <span className="line-clamp-2 text-xs leading-5 text-ui-muted-foreground">
                  {desc}
                </span>
                <time className="text-xs text-ui-muted-foreground/80">
                  {time}
                </time>
              </div>
            </div>
          ))}
        </PopoverBody>
        <PopoverFooter>
          <Button size="small" variant="ghost">
            全部已读
          </Button>
          <Button size="small">查看中心</Button>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  ),
};

export const Boundary: Story = {
  render: () => (
    <Popover defaultOpen>
      <PopoverTrigger asChild>
        <Button variant="ghost">Noah Ji</Button>
      </PopoverTrigger>
      <PopoverContent
        aria-label="用户信息"
        role="dialog"
        side="left"
        size="small"
      >
        <PopoverBody className="grid gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-full border border-[#b9eef6] bg-(--ui-button-ghost-background) text-sm font-semibold text-(--ui-button-primary-background)">
              N
            </span>
            <div className="grid min-w-0 gap-0.5">
              <strong className="truncate text-sm font-semibold">
                Noah Ji
              </strong>
              <span className="truncate text-xs text-ui-muted-foreground">
                crm-admin@linyi.com
              </span>
            </div>
          </div>
          <div className="grid gap-2 text-xs text-ui-muted-foreground">
            <span>可放少量操作和状态信息。</span>
            <span>完整编辑流程进入 Drawer。</span>
          </div>
          <input
            aria-label="快速搜索"
            className="h-8 rounded-[5px] border border-ui-border bg-ui-background px-2 text-sm"
            placeholder="快速搜索菜单"
          />
        </PopoverBody>
      </PopoverContent>
    </Popover>
  ),
};

export const PlacementMatrix: Story = {
  render: () => {
    const [placement, setPlacement] = React.useState<PopoverPlacement>('top');

    return (
      <div className="grid min-h-[520px] place-items-center bg-ui-background p-8">
        <div className="grid grid-cols-[120px_120px_120px] gap-3">
          {placementRows.flatMap((row, rowIndex) =>
            row.map((item, columnIndex) => {
              const key = `${rowIndex}-${columnIndex}`;

              if (item == null) {
                return <span aria-hidden="true" key={key} />;
              }

              return (
                <Button
                  key={item}
                  onClick={() => setPlacement(item)}
                  size="small"
                  variant={placement === item ? 'primary' : 'default'}
                >
                  {item}
                </Button>
              );
            }),
          )}
        </div>
        <Popover open>
          <PopoverTrigger asChild>
            <Button className="mt-8">当前 {placement}</Button>
          </PopoverTrigger>
          <PopoverContent
            arrow={{ pointAtCenter: true }}
            placement={placement}
            role="dialog"
            size="small"
          >
            <PopoverBody className="text-sm font-semibold">
              {placement}
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </div>
    );
  },
};

export const ArrowOptions: Story = {
  render: () => (
    <div className="grid min-h-[360px] grid-cols-3 items-center gap-8 bg-ui-background p-12">
      {arrowOptionItems.map(item => (
        <Popover defaultOpen key={item.label}>
          <PopoverTrigger asChild>
            <Button variant="default">{item.label}</Button>
          </PopoverTrigger>
          <PopoverContent
            arrow={item.arrow}
            placement={item.placement}
            role="dialog"
            size="small"
          >
            <PopoverBody className="text-sm font-semibold">
              {item.label}
            </PopoverBody>
          </PopoverContent>
        </Popover>
      ))}
    </div>
  ),
};
