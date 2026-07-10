import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  FileText,
  MoreHorizontal,
  Pencil,
  RefreshCw,
  Save,
  Trash2,
  UserPlus,
} from 'lucide-react';
import { Button } from '../../../general';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../index';

const meta = {
  title: 'Primitives/Navigation/DropdownMenu',
  component: DropdownMenuContent,
  tags: ['autodocs'],
} satisfies Meta<typeof DropdownMenuContent>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 表格行更多操作 — 命令菜单，含 icon、shortcut、danger。 */
export const RowActions: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-label="更多操作" iconOnly variant="ghost">
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          icon={<FileText className="size-4" />}
          shortcut="Enter"
        >
          查看详情
        </DropdownMenuItem>
        <DropdownMenuItem icon={<Pencil className="size-4" />}>
          编辑客户
        </DropdownMenuItem>
        <DropdownMenuItem icon={<UserPlus className="size-4" />}>
          转移负责人
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          icon={<Trash2 className="size-4" />}
          variant="destructive"
        >
          删除客户
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

/** 批量操作菜单 — 含分组标题和禁用项。 */
export const BatchCommands: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>批量操作</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>客户处理</DropdownMenuLabel>
        <DropdownMenuItem icon={<UserPlus className="size-4" />}>
          批量转移负责人
        </DropdownMenuItem>
        <DropdownMenuItem icon={<Pencil className="size-4" />}>
          批量添加标签
        </DropdownMenuItem>
        <DropdownMenuItem disabled icon={<FileText className="size-4" />}>
          提交审批 · 无权限
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          icon={<Trash2 className="size-4" />}
          variant="destructive"
        >
          批量删除
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

/** 单选菜单 — 自动刷新频率选择。 */
export const RadioSelect: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>自动刷新：30 秒</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuRadioGroup value="30s">
          <DropdownMenuRadioItem value="off">关闭</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="30s">30 秒</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="1m">1 分钟</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

/** 拆分按钮式保存菜单。 */
export const SplitSave: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button icon={<Save className="size-4" />} variant="primary">
          保存
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem icon={<Save className="size-4" />}>
          保存并关闭
        </DropdownMenuItem>
        <DropdownMenuItem icon={<FileText className="size-4" />}>
          保存并新建
        </DropdownMenuItem>
        <DropdownMenuItem icon={<RefreshCw className="size-4" />}>
          保存为模板
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

/** 禁用态与危险态对比。 */
export const States: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>更多操作</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem>正常命令</DropdownMenuItem>
        <DropdownMenuItem disabled>禁用命令</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">危险命令</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};
