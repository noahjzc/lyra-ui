import type { Meta, StoryObj } from '@storybook/react-vite';
import type { PopoverPlacement } from '../../../data-view/popover/types';
import { Button } from '../../../general';
import { Popconfirm } from '../index';

const meta = {
  title: 'Primitives/Feedback/Popconfirm',
  component: Popconfirm,
  tags: ['autodocs'],
  args: {
    title: '确认操作？',
    trigger: <Button>打开确认</Button>,
  },
} satisfies Meta<typeof Popconfirm>;

export default meta;
type Story = StoryObj<typeof meta>;

const placementArrowItems = [
  {
    arrow: true,
    button: 'topLeft',
    description: '用于靠近页面顶部的轻确认。',
    placement: 'topLeft' as const,
    title: '顶部左对齐？',
  },
  {
    arrow: { pointAtCenter: true },
    button: 'bottomRight',
    description: '箭头指向触发器中心，适合强调来源。',
    placement: 'bottomRight' as const,
    title: '底部右对齐？',
  },
  {
    arrow: false,
    button: 'right',
    description: '密集工具栏中可隐藏箭头。',
    placement: 'right' as const,
    title: '右侧无箭头？',
  },
] satisfies Array<{
  arrow: boolean | { pointAtCenter: boolean };
  button: string;
  description: string;
  placement: PopoverPlacement;
  title: string;
}>;

export const Basic: Story = {
  render: () => (
    <Popconfirm
      description="该联系人仅从当前客户档案中移除，历史跟进记录保留。"
      title="移除联系人？"
      trigger={<Button variant="default">移除联系人</Button>}
    />
  ),
};

export const Danger: Story = {
  render: () => (
    <Popconfirm
      description="该客户仍保留操作记录，可稍后从回收站恢复。"
      onConfirm={() => undefined}
      title="确认移入回收站？"
      trigger={<Button variant="danger">删除客户</Button>}
      variant="danger"
    />
  ),
};

export const LongDescription: Story = {
  render: () => (
    <Popconfirm
      description="客户名下还有 3 条未完成商机和 2 条待办跟进，确认后这些事项会转入待分配队列。"
      title="转交客户归属？"
      trigger={<Button>转交</Button>}
    />
  ),
};

export const PlacementBoundary: Story = {
  render: () => (
    <div className="flex min-h-48 items-end justify-end overflow-hidden border border-ui-border p-4">
      <Popconfirm
        description="浮层通过 Portal 渲染，不受当前容器裁切影响。"
        title="确认关闭当前页签？"
        trigger={<Button variant="ghost">关闭页签</Button>}
      />
    </div>
  ),
};

export const PlacementAndArrow: Story = {
  render: () => (
    <div className="grid min-h-[360px] grid-cols-3 items-center gap-10 bg-ui-background p-12">
      {placementArrowItems.map(item => (
        <Popconfirm
          arrow={item.arrow}
          defaultOpen
          description={item.description}
          key={item.button}
          placement={item.placement}
          title={item.title}
          trigger={<Button variant="default">{item.button}</Button>}
        />
      ))}
    </div>
  ),
};
