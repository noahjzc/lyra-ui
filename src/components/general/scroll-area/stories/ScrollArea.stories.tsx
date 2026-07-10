import type { Meta, StoryObj } from '@storybook/react-vite';
import { ScrollArea } from '../index';

const meta = {
  title: 'Primitives/General/ScrollArea',
  component: ScrollArea,
  tags: ['autodocs'],
  argTypes: {
    maxHeight: {
      control: 'text',
    },
    orientation: {
      control: 'inline-radio',
      options: ['vertical', 'horizontal', 'both'],
    },
    preventScrollChain: {
      control: 'boolean',
    },
    shadow: {
      control: 'select',
      options: [false, true, 'top', 'bottom', 'both'],
    },
  },
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

const cardClassName =
  'grid gap-3 rounded-lg border border-ui-border bg-ui-background p-4';

function Lines({ count = 10 }: { count?: number }) {
  return (
    <div className="grid gap-2">
      {Array.from({ length: count }, (_, index) => index + 1).map(item => (
        <div
          className="flex min-h-8 items-center rounded-md border border-ui-border bg-ui-background px-3 text-sm text-ui-foreground"
          key={item}
        >
          跟进记录 {item}
        </div>
      ))}
    </div>
  );
}

export const Variants: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <div className={cardClassName}>
        <span className="text-xs font-semibold text-ui-muted-foreground">
          vertical
        </span>
        <ScrollArea
          className="h-32 rounded-lg border border-ui-border bg-[#fbfdff]"
          shadow="bottom"
          viewportClassName="p-3"
          viewportProps={{ 'aria-label': '跟进记录列表' }}
        >
          <Lines count={12} />
        </ScrollArea>
      </div>

      <div className={cardClassName}>
        <span className="text-xs font-semibold text-ui-muted-foreground">
          horizontal
        </span>
        <ScrollArea
          className="rounded-lg border border-ui-border bg-[#fbfdff]"
          maxHeight={128}
          orientation="horizontal"
          viewportClassName="p-3"
          viewportProps={{ 'aria-label': '字段配置横向滚动区域' }}
        >
          <div className="grid w-[720px] grid-cols-6 gap-2">
            {['字段 A', '字段 B', '字段 C', '字段 D', '字段 E', '操作'].map(
              item => (
                <div
                  className="flex min-h-16 items-center justify-center rounded-md border border-ui-border bg-ui-background text-sm"
                  key={item}
                >
                  {item}
                </div>
              ),
            )}
          </div>
        </ScrollArea>
      </div>

      <div className={cardClassName}>
        <span className="text-xs font-semibold text-ui-muted-foreground">
          both
        </span>
        <ScrollArea
          className="h-36 rounded-lg border border-ui-border bg-[#fbfdff]"
          orientation="both"
          viewportClassName="p-3"
          viewportProps={{ 'aria-label': '宽表双向滚动区域' }}
        >
          <div className="grid w-[620px] grid-cols-[44px_160px_110px_110px_110px_86px]">
            {Array.from({ length: 18 }, (_, index) => index + 1).map(item => (
              <div
                className="min-h-9 border-ui-border border-r border-b bg-ui-background p-2 text-sm"
                key={item}
              >
                单元 {item}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className={cardClassName}>
        <span className="text-xs font-semibold text-ui-muted-foreground">
          compact
        </span>
        <ScrollArea
          className="h-28 rounded-lg border border-ui-border bg-[#fbfdff]"
          shadow="bottom"
          viewportClassName="p-2"
          viewportProps={{ 'aria-label': '短列表滚动区域' }}
        >
          <Lines count={8} />
        </ScrollArea>
      </div>
    </div>
  ),
};

export const ShadowAndSticky: Story = {
  render: () => (
    <div className="grid gap-4">
      <div className={cardClassName}>
        <span className="text-xs font-semibold text-ui-muted-foreground">
          top / bottom shadow
        </span>
        <ScrollArea
          className="h-36 rounded-lg border border-ui-border bg-[#fbfdff]"
          shadow="both"
          viewportClassName="p-3"
          viewportProps={{ 'aria-label': '上下阴影滚动区域' }}
        >
          <Lines count={12} />
        </ScrollArea>
      </div>

      <div className={cardClassName}>
        <span className="text-xs font-semibold text-ui-muted-foreground">
          sticky header / footer
        </span>
        <ScrollArea
          className="h-48 rounded-lg border border-ui-border bg-[#fbfdff]"
          shadow="both"
          stickyFooter={
            <>
              <span>个人 4 · 公共 4</span>
              <span>管理</span>
            </>
          }
          stickyHeader={
            <>
              <span>客户视图</span>
              <span>固定</span>
            </>
          }
          viewportClassName="px-3 pt-11 pb-11"
          viewportProps={{ 'aria-label': '客户视图列表' }}
        >
          <Lines count={12} />
        </ScrollArea>
      </div>
    </div>
  ),
};

export const CrmScenes: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  render: () => (
    <div className="grid gap-4 bg-(--color-bg-layout) p-6">
      <div className={cardClassName}>
        <strong className="text-sm text-ui-foreground">Filter Panel</strong>
        <ScrollArea
          className="rounded-lg border border-ui-border bg-[#fbfdff]"
          maxHeight={126}
          shadow="bottom"
          viewportClassName="p-3"
          viewportProps={{ 'aria-label': '筛选条件列表' }}
        >
          <div className="grid grid-cols-2 gap-2">
            {[
              '关键词 包含 客户名称',
              '负责人 等于 周启明',
              '状态 包含任一 活跃、需跟进',
              '最近跟进 介于 近 30 天',
              '商机金额 大于 ¥30,000',
              '客户来源 不包含 无效线索',
              '客户等级 包含 A/B 级',
            ].map(item => (
              <div
                className="min-h-8 truncate rounded-md border border-ui-border bg-ui-background px-3 py-1.5 text-sm"
                key={item}
              >
                {item}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className={cardClassName}>
        <strong className="text-sm text-ui-foreground">
          DataTable Horizontal Scroll
        </strong>
        <ScrollArea
          className="rounded-lg border border-ui-border bg-ui-background"
          maxHeight={112}
          orientation="horizontal"
          viewportProps={{ 'aria-label': '客户表格横向滚动区域' }}
        >
          <div className="grid w-[760px] grid-cols-[44px_180px_120px_140px_140px_120px]">
            {[
              ['header-selection', '□'],
              ['header-name', '客户名称'],
              ['header-status', '状态'],
              ['header-amount', '商机金额'],
              ['header-follow-up', '最近跟进'],
              ['header-actions', '操作'],
              ['row-selection', '□'],
              ['row-name', '上海霖宜'],
              ['row-status', '活跃客户'],
              ['row-amount', '¥128,000'],
              ['row-follow-up', '今天'],
              ['row-actions', '查看'],
            ].map(([id, item]) => (
              <div
                className="min-h-9 border-ui-border border-r border-b bg-ui-background p-2 text-sm"
                key={id}
              >
                {item}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  ),
};
