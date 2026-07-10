import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../../general';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../index';

const meta = {
  title: 'Primitives/Data View/Tooltip',
  component: TooltipContent,
  decorators: [
    Story => (
      <div className="min-h-[320px] max-w-[760px] bg-ui-background p-10">
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof TooltipContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const IconLabels: Story = {
  render: () => (
    <TooltipProvider delayDuration={0}>
      <div className="flex flex-wrap items-center gap-8">
        <Tooltip open>
          <TooltipTrigger asChild>
            <Button aria-label="刷新当前列表" variant="ghost">
              刷新
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            刷新当前列表，不重置筛选条件
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button aria-label="复制当前页面链接" variant="ghost">
              复制
            </Button>
          </TooltipTrigger>
          <TooltipContent showArrow={false} side="right">
            复制当前页面链接
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  ),
};

export const EllipsisText: Story = {
  render: () => (
    <TooltipProvider delayDuration={0}>
      <div className="w-[260px]">
        <Tooltip open>
          <TooltipTrigger asChild>
            <button
              className="block max-w-full truncate rounded-[5px] text-left text-sm outline-none focus-visible:ring-2 focus-visible:ring-(--ui-button-focus-ring)"
              type="button"
            >
              上海林易供应链科技股份有限公司华东分公司
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" size="default">
            上海林易供应链科技股份有限公司华东分公司
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  ),
};

export const DisabledReason: Story = {
  render: () => (
    <TooltipProvider delayDuration={0}>
      <Tooltip open>
        <TooltipTrigger asChild>
          <Button aria-disabled="true" className="opacity-55">
            审批中不可编辑
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" size="default">
          当前记录正在审批中，完成或退回后才可编辑。
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};

export const Boundary: Story = {
  render: () => (
    <TooltipProvider delayDuration={0}>
      <div className="grid gap-6">
        <Tooltip open>
          <TooltipTrigger asChild>
            <Button aria-label="列设置" variant="ghost">
              列设置
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">列设置</TooltipContent>
        </Tooltip>
        <div className="grid gap-1 text-xs text-ui-muted-foreground">
          <span>Tooltip 内不放表单、菜单或按钮。</span>
          <span>需要操作时升级为 Popover。</span>
        </div>
      </div>
    </TooltipProvider>
  ),
};
