import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Filter,
  MoreHorizontal,
  RefreshCw,
  Save,
  Search,
  Trash2,
} from 'lucide-react';
import type * as React from 'react';
import { useState } from 'react';
import {
  Checkbox,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '../components/data-input';
import {
  Badge,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../components/data-view';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/feedback/dialog';
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../components/feedback/drawer';
import { Button, IconButton, ScrollArea } from '../components/general';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Pagination,
} from '../components/navigation';

const meta = {
  title: 'Primitives/Overview',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const sectionClassName =
  'grid gap-4 border-b border-ui-border bg-ui-background px-6 py-5 last:border-b-0';

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className={sectionClassName}>
      <h2 className="text-base font-semibold text-ui-foreground">{title}</h2>
      {children}
    </section>
  );
}

function CustomerDrawer() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button icon={<Save className="size-4" />} variant="primary">
          新建客户
        </Button>
      </DrawerTrigger>
      <DrawerContent size="form">
        <DrawerHeader className="justify-between">
          <div className="grid gap-1">
            <DrawerTitle>新建客户</DrawerTitle>
            <DrawerDescription>
              补充客户档案、联系人与跟进备注。
            </DrawerDescription>
          </div>
          <DrawerClose asChild>
            <IconButton aria-label="关闭抽屉" variant="ghost">
              <MoreHorizontal className="size-4" />
            </IconButton>
          </DrawerClose>
        </DrawerHeader>
        <DrawerBody>
          <div className="grid gap-4">
            <Input aria-label="客户名称" placeholder="客户名称" />
            <div className="grid grid-cols-2 gap-3">
              <Input aria-label="联系人" placeholder="联系人" />
              <Input aria-label="联系电话" placeholder="联系电话" />
            </div>
            <Textarea aria-label="跟进备注" placeholder="跟进备注" rows={5} />
          </div>
        </DrawerBody>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="ghost">取消</Button>
          </DrawerClose>
          <Button>保存</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function PaginationPreview() {
  const [page, setPage] = useState(2);
  const [pageSize, setPageSize] = useState(20);

  return (
    <Pagination
      page={page}
      pageSize={pageSize}
      total={136}
      onPageChange={setPage}
      onPageSizeChange={setPageSize}
    />
  );
}

export const VisualMatrix: Story = {
  render: () => (
    <div className="min-h-screen bg-(--color-bg-layout) p-6">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-lg border border-ui-border bg-ui-background shadow-ui-popover">
        <Section title="操作按钮">
          <div className="flex flex-wrap items-center gap-3">
            <Button icon={<Save className="size-4" />} variant="primary">
              主要操作
            </Button>
            <Button>次要操作</Button>
            <Button icon={<Filter className="size-4" />} variant="ghost">
              筛选
            </Button>
            <Button variant="text">文本操作</Button>
            <Button icon={<Trash2 className="size-4" />} variant="danger">
              删除
            </Button>
            <IconButton aria-label="刷新">
              <RefreshCw className="size-4" />
            </IconButton>
            <Button disabled>禁用</Button>
          </div>
        </Section>

        <Section title="状态标签">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>默认</Badge>
            <Badge variant="success">已成交</Badge>
            <Badge variant="warning">即将过期</Badge>
            <Badge variant="destructive">高风险</Badge>
            <Badge variant="processing">跟进中</Badge>
            <Badge variant="assist">AI 推荐</Badge>
          </div>
        </Section>

        <Section title="表单状态">
          <div className="grid gap-3 md:grid-cols-2">
            <Input aria-label="客户名称" placeholder="客户名称" />
            <Input aria-label="只读编号" readOnly value="C-20260604" />
            <Input aria-label="禁用字段" disabled value="无权限编辑" />
            <Input aria-label="错误字段" invalid defaultValue="格式错误" />
            <Textarea
              aria-label="跟进备注"
              className="md:col-span-2"
              placeholder="跟进备注"
              rows={4}
            />
          </div>
        </Section>

        <Section title="选择与勾选">
          <div className="grid gap-3 md:grid-cols-[280px_1fr]">
            <Select defaultValue="pending">
              <SelectTrigger aria-label="商机阶段">
                <SelectValue placeholder="选择商机阶段" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">待跟进</SelectItem>
                <SelectItem value="proposal">方案确认</SelectItem>
                <SelectItem value="won">已成交</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2 text-sm text-ui-foreground">
              <Checkbox defaultChecked />
              <span>仅查看我负责的客户</span>
            </div>
          </div>
        </Section>

        <Section title="浮层与动作菜单">
          <TooltipProvider>
            <div className="flex flex-wrap items-center gap-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button icon={<Search className="size-4" />} variant="ghost">
                    快速筛选
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="grid gap-3">
                    <Input aria-label="关键词" placeholder="客户 / 联系人" />
                    <Button size="small" variant="primary">
                      应用筛选
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <IconButton aria-label="更多操作">
                    <MoreHorizontal className="size-4" />
                  </IconButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>分配负责人</DropdownMenuItem>
                  <DropdownMenuItem>加入公海</DropdownMenuItem>
                  <DropdownMenuItem variant="destructive">
                    删除客户
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Tooltip>
                <TooltipTrigger asChild>
                  <IconButton aria-label="刷新列表" variant="ghost">
                    <RefreshCw className="size-4" />
                  </IconButton>
                </TooltipTrigger>
                <TooltipContent>刷新列表</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </Section>

        <Section title="弹窗与抽屉">
          <div className="flex flex-wrap items-center gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="danger">删除确认</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>删除客户</DialogTitle>
                  <DialogDescription>
                    删除后不可恢复，请确认是否继续。
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="ghost">取消</Button>
                  </DialogClose>
                  <Button variant="danger">确认删除</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <CustomerDrawer />
          </div>
        </Section>

        <Section title="分页与滚动">
          <div className="grid gap-4">
            <ScrollArea className="h-32 rounded-md border border-ui-border">
              <div className="grid min-w-[720px] grid-cols-4 text-sm">
                {Array.from(
                  { length: 16 },
                  (_, index) => `客户记录 ${index + 1}`,
                ).map(record => (
                  <div
                    className="border-b border-ui-border px-3 py-2"
                    key={record}
                  >
                    {record}
                  </div>
                ))}
              </div>
            </ScrollArea>
            <PaginationPreview />
          </div>
        </Section>
      </div>
    </div>
  ),
};
