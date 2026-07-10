import type { Meta, StoryObj } from '@storybook/react-vite';
import type * as React from 'react';
import { Input, Textarea } from '../../../data-input/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../data-input/select';
import { Button } from '../../../general/button';
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerCloseButton,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../index';

const meta = {
  title: 'Primitives/Feedback/Drawer',
  component: DrawerContent,
  tags: ['autodocs'],
} satisfies Meta<typeof DrawerContent>;

export default meta;
type Story = StoryObj<typeof meta>;

function DrawerShell({
  children,
  description,
  size = 'detail',
  title,
  trigger,
}: {
  children: React.ReactNode;
  description?: string;
  size?: React.ComponentProps<typeof DrawerContent>['size'];
  title: string;
  trigger: React.ReactNode;
}) {
  return (
    <Drawer>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent size={size}>
        <DrawerHeader>
          <div className="grid gap-1">
            <DrawerTitle>{title}</DrawerTitle>
            {description != null && (
              <DrawerDescription>{description}</DrawerDescription>
            )}
          </div>
          <DrawerCloseButton />
        </DrawerHeader>
        {children}
      </DrawerContent>
    </Drawer>
  );
}

export const Detail: Story = {
  render: () => (
    <DrawerShell
      description="查看客户身份、状态和近期跟进。"
      title="上海林翼科技有限公司"
      trigger={<Button>打开详情</Button>}
    >
      <DrawerBody>
        <div className="grid gap-4 text-sm">
          <div className="grid grid-cols-3 gap-3">
            <span>客户等级：A</span>
            <span>负责人：周敏</span>
            <span>状态：活跃</span>
          </div>
          <Textarea
            aria-label="最近跟进"
            readOnly
            rows={6}
            value="客户本周关注续费折扣和合同审批进度，需在周五前确认报价。"
          />
        </div>
      </DrawerBody>
      <DrawerFooter>
        <Button variant="ghost">更多</Button>
        <Button variant="primary">编辑</Button>
      </DrawerFooter>
    </DrawerShell>
  ),
};

export const Form: Story = {
  render: () => (
    <DrawerShell
      description="固定底部操作区承载提交和取消动作。"
      size="form"
      title="编辑客户资料"
      trigger={<Button>编辑客户</Button>}
    >
      <DrawerBody>
        <div className="grid gap-4">
          <Input aria-label="客户名称" defaultValue="上海林翼科技有限公司" />
          <Input aria-label="联系人" defaultValue="陈经理" />
          <Textarea aria-label="跟进备注" rows={5} />
        </div>
      </DrawerBody>
      <DrawerFooter>
        <DrawerClose asChild>
          <Button variant="ghost">取消</Button>
        </DrawerClose>
        <Button variant="primary">保存</Button>
      </DrawerFooter>
    </DrawerShell>
  ),
};

export const Create: Story = {
  render: () => (
    <DrawerShell
      description="新建流程保持表单密度和清晰分组。"
      size="form"
      title="新建客户"
      trigger={<Button variant="primary">新建客户</Button>}
    >
      <DrawerBody>
        <div className="grid gap-4">
          <Input aria-label="客户名称" placeholder="客户名称" />
          <Input aria-label="统一社会信用代码" placeholder="统一社会信用代码" />
          <Select>
            <SelectTrigger aria-label="客户等级">
              <SelectValue placeholder="客户等级" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="a">A 级客户</SelectItem>
              <SelectItem value="b">B 级客户</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </DrawerBody>
      <DrawerFooter>
        <Button variant="ghost">保存草稿</Button>
        <Button variant="primary">创建</Button>
      </DrawerFooter>
    </DrawerShell>
  ),
};

export const Nested: Story = {
  render: () => (
    <DrawerShell
      description="一级 Drawer 内可以继续打开二级 Drawer，用于承载更完整的辅助流程。"
      size="form"
      title="分配客户"
      trigger={<Button>打开嵌套抽屉</Button>}
    >
      <DrawerBody>
        <div className="grid gap-4">
          <Select>
            <SelectTrigger aria-label="负责人">
              <SelectValue placeholder="选择负责人" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="zhou">周敏</SelectItem>
              <SelectItem value="chen">陈晨</SelectItem>
            </SelectContent>
          </Select>
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="default">查看分配依据</Button>
            </DrawerTrigger>
            <DrawerContent size="assist">
              <DrawerHeader>
                <div className="grid gap-1">
                  <DrawerTitle>分配依据</DrawerTitle>
                  <DrawerDescription>
                    查看系统推荐负责人时使用的近期跟进、行业经验和负载信息。
                  </DrawerDescription>
                </div>
                <DrawerCloseButton />
              </DrawerHeader>
              <DrawerBody>
                <div className="grid gap-4 text-sm">
                  <section className="grid gap-1">
                    <h4 className="font-semibold">推荐给周敏</h4>
                    <p className="text-ui-muted-foreground">
                      近 30 天跟进同类行业客户 12 次，平均响应时效 2.4 小时。
                    </p>
                  </section>
                  <section className="grid gap-2">
                    <h4 className="font-semibold">辅助判断</h4>
                    <div className="grid gap-2 rounded-md border border-ui-border p-3">
                      <span>客户行业：企业服务</span>
                      <span>当前负载：本周待办 6 项</span>
                      <span>历史成交：相似客户 3 单</span>
                    </div>
                  </section>
                </div>
              </DrawerBody>
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button variant="ghost">返回分配</Button>
                </DrawerClose>
                <Button variant="primary">采用推荐</Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </DrawerBody>
      <DrawerFooter>
        <Button variant="primary">确认分配</Button>
      </DrawerFooter>
    </DrawerShell>
  ),
};

export const Mobile: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
  render: () => (
    <DrawerShell
      description="窄屏下保持右侧工作面与内部滚动。"
      size="full"
      title="移动端客户详情"
      trigger={<Button>移动端预览</Button>}
    >
      <DrawerBody>
        <div className="grid gap-3 text-sm">
          {Array.from({ length: 8 }, (_, fieldNumber) => fieldNumber + 1).map(
            fieldNumber => (
              <Input
                aria-label={`字段 ${fieldNumber}`}
                defaultValue={`客户字段值 ${fieldNumber}`}
                key={fieldNumber}
              />
            ),
          )}
        </div>
      </DrawerBody>
      <DrawerFooter>
        <Button variant="primary">保存</Button>
      </DrawerFooter>
    </DrawerShell>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {[
        ['assist', '助手'],
        ['form', '表单'],
        ['detail', '详情'],
        ['full', '全屏'],
      ].map(([size, label]) => (
        <DrawerShell
          key={size}
          size={size as React.ComponentProps<typeof DrawerContent>['size']}
          title={`${label}抽屉`}
          trigger={<Button variant="default">{label}</Button>}
        >
          <DrawerBody>
            <p className="text-sm text-ui-muted-foreground">
              当前尺寸用于匹配不同复杂度的 CRM 工作流。
            </p>
          </DrawerBody>
          <DrawerFooter>
            <Button variant="primary">完成</Button>
          </DrawerFooter>
        </DrawerShell>
      ))}
    </div>
  ),
};
