import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Timeline } from '../index';
import type { TimelineItem } from '../types';

const meta = {
  title: 'Primitives/Data View/Timeline',
  component: Timeline,
  decorators: [
    Story => (
      <div className="max-w-[720px] bg-ui-background p-6">
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof Timeline>;

export default meta;
type Story = StoryObj<typeof meta>;

const activityItems = [
  {
    content: '宋佳修改了联系方式和所属区域。',
    dateTime: '2026-06-08T10:24',
    meta: '操作人：宋佳',
    status: 'current',
    time: '今天 10:24',
    title: '客户资料已更新',
  },
  {
    content: '缺少合同附件，需要重新提交。',
    dateTime: '2026-06-03T16:18',
    meta: '来源：审批流',
    status: 'warning',
    time: '06-03 16:18',
    title: '审批退回',
  },
  {
    content: '来源：批量导入。',
    dateTime: '2026-06-01T09:12',
    status: 'done',
    time: '06-01 09:12',
    title: '创建客户',
  },
] satisfies TimelineItem[];

export const Overview: Story = {
  args: {
    'aria-label': '客户动态时间线',
    items: activityItems,
  },
};

export const StatusMatrix: Story = {
  args: {
    items: [],
  },
  render: () => (
    <Timeline
      aria-label="不同节点语义的时间线"
      items={[
        {
          content: '当前节点使用主题色，表示流程正在进行。',
          dateTime: '2026-06-08T11:20',
          status: 'current',
          time: '11:20',
          title: '正在同步客户等级',
        },
        {
          content: '完成节点表示事件已经落库，不再等待处理。',
          dateTime: '2026-06-08T11:05',
          status: 'done',
          time: '11:05',
          title: '客户等级已写入',
        },
        {
          content: '警告节点需要给出可修复原因。',
          dateTime: '2026-06-08T10:40',
          status: 'warning',
          time: '10:40',
          title: '合同附件缺失',
        },
        {
          content: '失败节点不能只靠颜色，必须写清下一步。',
          dateTime: '2026-06-08T10:12',
          status: 'error',
          time: '10:12',
          title: '授信校验失败',
        },
        {
          content: '待处理节点使用空心点，不能误作已完成。',
          dateTime: '2026-06-08T09:30',
          status: 'pending',
          time: '09:30',
          title: '等待财务确认',
        },
      ]}
    />
  ),
};

export const CompactGroups: Story = {
  args: {
    items: [],
  },
  render: () => (
    <div className="grid gap-4">
      <section className="grid gap-2">
        <span className="w-max rounded-[5px] border border-ui-border bg-ui-muted px-2 py-1 text-xs font-semibold text-ui-muted-foreground">
          今天
        </span>
        <Timeline
          aria-label="今天动态"
          density="compact"
          items={[
            {
              dateTime: '2026-06-08T10:24',
              status: 'current',
              time: '10:24',
              title: '客户资料已更新',
            },
            {
              dateTime: '2026-06-08T09:40',
              status: 'done',
              time: '09:40',
              title: '新增联系人',
            },
          ]}
        />
      </section>
      <section className="grid gap-2">
        <span className="w-max rounded-[5px] border border-ui-border bg-ui-muted px-2 py-1 text-xs font-semibold text-ui-muted-foreground">
          2026-06-03
        </span>
        <Timeline
          aria-label="2026-06-03 动态"
          density="compact"
          items={[
            {
              dateTime: '2026-06-03T16:18',
              status: 'warning',
              time: '16:18',
              title: '审批退回',
            },
          ]}
        />
      </section>
    </div>
  ),
};

export const DrawerActivity: Story = {
  args: {
    items: [],
  },
  render: () => (
    <div className="grid gap-3 rounded-lg border border-ui-border bg-ui-background p-3">
      <div className="flex items-center justify-between gap-3 text-sm font-semibold">
        <span>最近动态</span>
        <span className="text-xs text-ui-muted-foreground">
          Drawer Activity
        </span>
      </div>
      <Timeline
        aria-label="客户最近动态"
        items={[
          {
            ariaLabel: '查看更新客户资料动态详情',
            content: '宋佳修改了联系方式和所属区域。',
            dateTime: '2026-06-08T10:24',
            href: '#',
            status: 'current',
            time: '今天 10:24',
            title: '更新客户资料',
          },
          {
            content: '系统检测到缺少合同附件。',
            dateTime: '2026-06-03T16:18',
            status: 'warning',
            time: '06-03 16:18',
            title: '审批退回',
          },
        ]}
      />
      <button
        className="h-[26px] w-max rounded-[5px] border border-[#b9eef6] bg-ui-background px-2 text-xs font-semibold text-(--ui-button-primary-background) outline-none focus-visible:ring-2 focus-visible:ring-(--ui-button-focus-ring)"
        onClick={fn()}
        type="button"
      >
        加载更多
      </button>
    </div>
  ),
};

export const BoundaryStates: Story = {
  args: {
    items: [],
  },
  render: () => (
    <div className="grid gap-6">
      <Timeline
        aria-label="加载中的时间线"
        items={[
          {
            content:
              '这是一段很长的事件摘要，用于确认内容最多两行展示，避免在详情抽屉和窄容器中撑开布局。',
            dateTime: '2026-06-08T10:24',
            status: 'current',
            time: '今天 10:24',
            title: '长文本动态标题需要保持单行省略',
          },
        ]}
        loading
      />
      <Timeline items={[]} />
    </div>
  ),
};
