import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button } from '../../../general';
import { Tag } from '../../tag';
import { Collapse } from '../index';

const storyContainerClassName = 'flex w-full max-w-[960px] flex-col gap-4';
const fieldGridClassName =
  'grid min-w-0 grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2';

const meta = {
  title: 'Primitives/Data View/Collapse',
  component: Collapse,
  tags: ['autodocs'],
  args: {
    onValueChange: fn(),
  },
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof Collapse>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FormGroups: Story = {
  args: {
    defaultValue: 'basic',
    items: [
      {
        children: (
          <div className={fieldGridClassName}>
            <div>
              <span className="text-xs text-ui-muted-foreground">客户编号</span>
              <div className="truncate text-sm text-ui-foreground">
                CU-2026-0187
              </div>
            </div>
            <div>
              <span className="text-xs text-ui-muted-foreground">客户名称</span>
              <div className="truncate text-sm text-ui-foreground">
                华东供应链集团
              </div>
            </div>
            <div>
              <span className="text-xs text-ui-muted-foreground">所属部门</span>
              <div className="truncate text-sm text-ui-foreground">
                华东大区 / 销售一组
              </div>
            </div>
            <div>
              <span className="text-xs text-ui-muted-foreground">税号</span>
              <div className="truncate text-sm text-ui-foreground">
                9133**********42
              </div>
            </div>
          </div>
        ),
        extra: <Tag color="neutral">4 项</Tag>,
        key: 'basic',
        summary: '客户身份、所属部门、税号',
        title: '基础信息',
      },
      {
        children: '自动分配、同步策略、字段权限。',
        extra: (
          <Button size="small" variant="ghost">
            配置
          </Button>
        ),
        key: 'advanced',
        summary: '自动分配、同步策略、字段权限',
        title: '高级设置',
      },
    ],
  },
  render: args => (
    <div className={storyContainerClassName}>
      <Collapse {...args} />
    </div>
  ),
};

export const States: Story = {
  args: {
    items: [],
  },
  render: args => (
    <div className={storyContainerClassName}>
      <Collapse
        {...args}
        defaultValue={['errors', 'loading']}
        items={[
          {
            children: (
              <div className="rounded-md border border-ui-destructive/25 bg-ui-destructive/5 px-3 py-2 text-xs leading-5 text-ui-destructive">
                第 12 行：客户名称超过 40 个字符；第 18 行：税号格式无法识别。
              </div>
            ),
            extra: <Tag color="destructive">3 错误</Tag>,
            key: 'errors',
            summary: '3 条记录需要人工确认',
            title: '导入错误详情',
          },
          {
            disabled: true,
            key: 'approval',
            summary: '流程锁定期间不可展开修改',
            title: '审批字段',
          },
          {
            key: 'loading',
            loading: true,
            summary: '正在读取最近 30 天记录',
            title: '同步日志',
          },
        ]}
        type="multiple"
      />
    </div>
  ),
};

export const Accordion: Story = {
  args: {
    items: [],
  },
  render: args => (
    <div className={storyContainerClassName}>
      <Collapse
        {...args}
        defaultValue="base"
        items={[
          {
            children: '单开模式适合较长表单，避免多个大段内容同时展开。',
            key: 'base',
            summary: '当前展开',
            title: '基础资料',
          },
          {
            children: '联系人明细。',
            key: 'contacts',
            summary: '已填写 2 人',
            title: '联系人',
          },
        ]}
      />
    </div>
  ),
};

export const PlainMultiple: Story = {
  args: {
    items: [],
  },
  render: args => (
    <div className={storyContainerClassName}>
      <Collapse
        {...args}
        defaultValue={['terms', 'payment']}
        items={[
          {
            children:
              '面板内容不应再触发展开；内部按钮、输入框保持自己的交互。',
            key: 'terms',
            summary: '长内容可折叠，但必须保留摘要',
            title: '合同条款',
          },
          {
            children: '首款、尾款和质保金。',
            extra: (
              <Button size="small" variant="default">
                新增
              </Button>
            ),
            key: 'payment',
            summary: '3 个节点',
            title: '付款计划',
          },
        ]}
        type="multiple"
        variant="plain"
      />
      <div className="rounded-md border border-ui-border bg-ui-muted/40 px-3 py-2 text-xs leading-5 text-ui-muted-foreground">
        Collapse
        只管理局部内容显隐。需要跨步骤编辑、保存校验、权限确认或提交动作时，应进入
        Drawer / Modal。
      </div>
    </div>
  ),
};
