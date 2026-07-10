import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../index';

const meta = {
  title: 'Primitives/Navigation/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  args: {
    defaultValue: 'overview',
    variant: 'line',
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Line: Story = {
  render: args => (
    <div className="max-w-[720px] rounded-lg border border-ui-border bg-ui-background">
      <Tabs {...args}>
        <TabsList aria-label="客户详情分区" className="px-4">
          <TabsTrigger value="overview">总览</TabsTrigger>
          <TabsTrigger value="contacts">
            联系人
            <span className="rounded-full bg-ui-muted px-1.5 text-xs text-ui-muted-foreground">
              4
            </span>
          </TabsTrigger>
          <TabsTrigger value="contracts">
            合同
            <span className="rounded-full bg-ui-muted px-1.5 text-xs text-ui-muted-foreground">
              12
            </span>
          </TabsTrigger>
          <TabsTrigger value="logs">操作日志</TabsTrigger>
          <TabsTrigger disabled value="credit">
            授信
          </TabsTrigger>
        </TabsList>
        <TabsContent className="px-4 pb-4" value="overview">
          <div className="grid gap-2 text-sm text-ui-foreground">
            <div className="grid grid-cols-[80px_minmax(0,1fr)] gap-3">
              <span className="text-ui-muted-foreground">客户名称</span>
              <strong className="truncate font-semibold">
                上海林易供应链科技股份有限公司
              </strong>
            </div>
            <div className="grid grid-cols-[80px_minmax(0,1fr)] gap-3">
              <span className="text-ui-muted-foreground">负责人</span>
              <span>张明 / 华东一区</span>
            </div>
            <div className="grid grid-cols-[80px_minmax(0,1fr)] gap-3">
              <span className="text-ui-muted-foreground">状态</span>
              <span>已签约，待补充授信资料</span>
            </div>
          </div>
        </TabsContent>
        <TabsContent className="px-4 pb-4" value="contacts">
          联系人内容
        </TabsContent>
        <TabsContent className="px-4 pb-4" value="contracts">
          合同内容
        </TabsContent>
        <TabsContent className="px-4 pb-4" value="logs">
          操作日志内容
        </TabsContent>
        <TabsContent className="px-4 pb-4" value="credit">
          授信内容
        </TabsContent>
      </Tabs>
    </div>
  ),
};

export const Segment: Story = {
  render: () => (
    <Tabs defaultValue="shown" variant="segment">
      <TabsList aria-label="字段配置视图">
        <TabsTrigger value="shown">显示字段</TabsTrigger>
        <TabsTrigger value="hidden">隐藏字段</TabsTrigger>
        <TabsTrigger value="system">系统字段</TabsTrigger>
      </TabsList>
      <TabsContent className="text-sm text-ui-muted-foreground" value="shown">
        当前表格展示客户名称、负责人、状态、最近跟进时间。
      </TabsContent>
      <TabsContent className="text-sm text-ui-muted-foreground" value="hidden">
        隐藏字段包含来源渠道、注册地址、纳税人识别号。
      </TabsContent>
      <TabsContent className="text-sm text-ui-muted-foreground" value="system">
        系统字段包含创建时间、更新时间、数据版本。
      </TabsContent>
    </Tabs>
  ),
};

export const Card: Story = {
  render: () => (
    <div className="max-w-[560px] rounded-lg border border-ui-border bg-ui-background p-4">
      <Tabs defaultValue="rules" variant="card">
        <TabsList aria-label="价格策略配置">
          <TabsTrigger value="rules">价格规则</TabsTrigger>
          <TabsTrigger value="history">变更记录</TabsTrigger>
          <TabsTrigger value="approval">审批流</TabsTrigger>
        </TabsList>
        <TabsContent value="rules">价格规则内容</TabsContent>
        <TabsContent value="history">变更记录内容</TabsContent>
        <TabsContent value="approval">审批流内容</TabsContent>
      </Tabs>
    </div>
  ),
};

export const CacheVisual: Story = {
  render: () => (
    <div className="max-w-[760px] overflow-hidden rounded-lg border border-ui-border bg-ui-background">
      <Tabs defaultValue="customers" variant="cache">
        <div className="flex h-[42px] min-w-0 items-center gap-1.5 border-ui-border border-b bg-(--ui-tabs-cache-background) px-2 py-[5px]">
          <button
            aria-label="向左滚动页签"
            className="inline-grid size-[30px] shrink-0 place-items-center rounded-md border border-ui-border bg-(--ui-tabs-cache-disabled-background) text-ui-muted-foreground"
            disabled
            type="button"
          >
            <ChevronLeft aria-hidden="true" className="size-4" />
          </button>
          <TabsList
            aria-label="已打开工作区"
            className="h-auto flex-1 border-b-0 bg-transparent p-0"
          >
            <TabsTrigger
              className="min-w-[86px] grid-cols-[minmax(0,1fr)] pr-2.5"
              value="home"
            >
              工作台
            </TabsTrigger>
            <TabsTrigger value="customers">
              <span className="truncate">客户列表</span>
              <span
                aria-hidden="true"
                className="inline-grid size-[22px] shrink-0 place-items-center rounded-md text-ui-muted-foreground"
              >
                <X className="size-3" />
              </span>
            </TabsTrigger>
            <TabsTrigger
              className="grid-cols-[8px_minmax(0,1fr)_22px]"
              value="draft"
            >
              <span
                aria-hidden="true"
                className="size-1.5 shrink-0 rounded-full bg-ui-warning"
              />
              <span className="truncate">新建客户</span>
              <span
                aria-hidden="true"
                className="inline-grid size-[22px] shrink-0 place-items-center rounded-md text-ui-muted-foreground"
              >
                <X className="size-3" />
              </span>
            </TabsTrigger>
            <TabsTrigger value="contract">
              <span className="truncate">
                华东供应链合同审批详情页签超长标题
              </span>
              <span
                aria-hidden="true"
                className="inline-grid size-[22px] shrink-0 place-items-center rounded-md text-ui-muted-foreground"
              >
                <X className="size-3" />
              </span>
            </TabsTrigger>
          </TabsList>
          <button
            aria-label="向右滚动页签"
            className="inline-grid size-[30px] shrink-0 place-items-center rounded-md border border-ui-border bg-ui-background text-ui-muted-foreground"
            type="button"
          >
            <ChevronRight aria-hidden="true" className="size-4" />
          </button>
          <button
            aria-label="还有 6 个页签"
            className="inline-flex h-[30px] shrink-0 items-center rounded-md border border-ui-border bg-ui-background px-2 text-xs font-bold text-ui-muted-foreground"
            type="button"
          >
            +6
          </button>
        </div>
        <TabsContent className="grid gap-2.5 p-3" value="home">
          工作台内容
        </TabsContent>
        <TabsContent className="grid gap-2.5 p-3" value="customers">
          <div className="flex items-center gap-2 text-sm">
            <strong className="font-semibold text-ui-foreground">
              客户列表
            </strong>
            <span className="text-ui-muted-foreground">
              当前视图：我负责的客户
            </span>
          </div>
          <div aria-hidden="true" className="grid gap-1.5">
            <div className="h-2.5 w-4/5 rounded-full bg-ui-muted" />
            <div className="h-2.5 w-3/5 rounded-full bg-ui-muted" />
            <div className="h-2.5 w-2/5 rounded-full bg-ui-muted" />
          </div>
        </TabsContent>
        <TabsContent className="grid gap-2.5 p-3" value="draft">
          新建客户内容
        </TabsContent>
        <TabsContent className="grid gap-2.5 p-3" value="contract">
          合同审批内容
        </TabsContent>
      </Tabs>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="max-w-[960px] rounded-lg border border-ui-border bg-ui-background p-4">
      <div className="mb-3 flex items-center justify-between gap-4">
        <div className="text-sm font-semibold text-ui-foreground">关键状态</div>
        <div className="text-xs font-semibold text-ui-muted-foreground">
          Active / Dirty / Focus / Disabled
        </div>
      </div>
      <Tabs defaultValue="contract" variant="cache">
        <TabsList
          aria-label="缓存页签关键状态"
          className="border-b-0 bg-(--ui-tabs-cache-background)"
        >
          <TabsTrigger value="contract">
            <span className="truncate">合同详情</span>
            <span
              aria-hidden="true"
              className="inline-grid size-[22px] shrink-0 place-items-center rounded-md text-ui-muted-foreground"
            >
              <X className="size-3" />
            </span>
          </TabsTrigger>
          <TabsTrigger
            className="grid-cols-[8px_minmax(0,1fr)_22px]"
            value="draft"
          >
            <span
              aria-hidden="true"
              className="size-1.5 shrink-0 rounded-full bg-ui-warning"
            />
            <span className="truncate">新建客户</span>
            <span
              aria-hidden="true"
              className="inline-grid size-[22px] shrink-0 place-items-center rounded-md text-ui-muted-foreground"
            >
              <X className="size-3" />
            </span>
          </TabsTrigger>
          <TabsTrigger
            className="border-(--ui-button-primary-border) shadow-[0_0_0_2px_rgba(14,116,144,0.14)]"
            value="logs"
          >
            <span className="truncate">操作日志</span>
            <span
              aria-hidden="true"
              className="inline-grid size-[22px] shrink-0 place-items-center rounded-md text-ui-muted-foreground"
            >
              <X className="size-3" />
            </span>
          </TabsTrigger>
          <TabsTrigger disabled value="credit">
            <span className="truncate">授信资料</span>
            <span
              aria-hidden="true"
              className="inline-grid size-[22px] shrink-0 place-items-center rounded-md"
            >
              <X className="size-3" />
            </span>
          </TabsTrigger>
        </TabsList>
        <TabsContent className="sr-only" value="contract">
          合同详情内容
        </TabsContent>
        <TabsContent className="sr-only" value="draft">
          新建客户内容
        </TabsContent>
        <TabsContent className="sr-only" value="logs">
          操作日志内容
        </TabsContent>
        <TabsContent className="sr-only" value="credit">
          授信资料内容
        </TabsContent>
      </Tabs>
      <Tabs defaultValue="overview" variant="line">
        <TabsList aria-label="内容页签状态示例" className="mt-2">
          <TabsTrigger value="overview">总览</TabsTrigger>
          <TabsTrigger value="contacts">联系人</TabsTrigger>
          <TabsTrigger value="contracts">合同</TabsTrigger>
          <TabsTrigger disabled value="credit">
            授信
          </TabsTrigger>
        </TabsList>
        <TabsContent className="sr-only" value="overview">
          总览内容
        </TabsContent>
        <TabsContent className="sr-only" value="contacts">
          联系人内容
        </TabsContent>
        <TabsContent className="sr-only" value="contracts">
          合同内容
        </TabsContent>
        <TabsContent className="sr-only" value="credit">
          授信内容
        </TabsContent>
      </Tabs>
      <div className="mt-2 text-xs font-semibold text-ui-muted-foreground">
        状态必须出现在 Tab Item 自身，而不是脱离 tablist 变成列表。
      </div>
    </div>
  ),
};
