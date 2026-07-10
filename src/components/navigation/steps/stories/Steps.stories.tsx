import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Steps } from '../index';
import type { StepItem } from '../types';

const approvalItems: StepItem[] = [
  { description: '客户经理已提交', title: '提交申请' },
  { description: '当前主管处理中', title: '主管审核' },
  { description: '额度与账期复核', title: '财务确认' },
  { description: '生成审批记录', disabled: true, title: '归档完成' },
];

const importItems: StepItem[] = [
  { description: 'license.xlsx', title: '上传文件' },
  { description: '12 个字段已匹配', title: '字段映射' },
  {
    description: '3 行缺少手机号',
    status: 'error',
    title: '数据校验',
  },
  { description: '修正后可继续', disabled: true, title: '确认导入' },
  { description: '未开始', disabled: true, title: '导入结果' },
];

const renewalItems: StepItem[] = [
  { description: '客户经理已完成', title: '确认续签信息' },
  { description: '还需上传盖章版', title: '补充合同附件' },
  { description: '自动进入下一阶段', title: '法务复核' },
];

const initializationItems: StepItem[] = [
  { title: '基础信息' },
  { title: '组织结构' },
  { title: '权限策略' },
  { title: '应用开通' },
  { title: '初始化完成' },
];

const editableItems: StepItem[] = [
  { title: '填写信息' },
  { title: '确认报价' },
  { title: '提交审核' },
  { disabled: true, title: '完成扩展' },
];

const overflowItems: StepItem[] = [
  {
    description: '包含跨区域、多法人主体和多业务线的完整客户档案',
    title: '补充超长客户基础信息',
  },
  {
    description: '系统自动匹配字段后仍需人工确认异常映射关系',
    title: '确认导入字段映射关系',
  },
  {
    description: '发现 3 行手机号缺失，需要下载错误行并修正后重新校验',
    status: 'error',
    title: '校验导入数据质量',
  },
];

const meta = {
  title: 'Primitives/Navigation/Steps',
  component: Steps,
  tags: ['autodocs'],
  args: {
    onCurrentChange: fn(),
  },
  decorators: [
    Story => (
      <div className="grid max-w-[980px] gap-5 bg-ui-background p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Steps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HorizontalApproval: Story = {
  args: {
    'aria-label': '授信审批流程',
    current: 1,
    items: approvalItems,
  },
};

export const WizardWithError: Story = {
  args: {
    'aria-label': '客户导入流程',
    current: 2,
    items: importItems,
  },
};

export const VerticalDrawerFlow: Story = {
  args: {
    'aria-label': '合同续签流程',
    current: 1,
    items: renewalItems,
    orientation: 'vertical',
  },
  decorators: [
    Story => (
      <div className="grid max-w-[360px] gap-5 bg-ui-background p-6">
        <Story />
      </div>
    ),
  ],
};

export const CompactLongFlow: Story = {
  args: {
    'aria-label': '租户初始化流程',
    current: 2,
    items: initializationItems,
    variant: 'compact',
  },
};

export const ClickableCompleted: Story = {
  args: {
    'aria-label': '可编辑步骤',
    clickable: true,
    current: 2,
    items: editableItems,
    variant: 'compact',
  },
};

export const ProgressVariant: Story = {
  args: {
    'aria-label': '短流程进度',
    current: 1,
    items: approvalItems,
    variant: 'progress',
  },
};

export const ResponsiveAndOverflow: Story = {
  args: {
    'aria-label': '长文本流程',
    current: 2,
    items: overflowItems,
  },
  decorators: [
    Story => (
      <div className="grid max-w-[420px] gap-5 bg-ui-background p-6">
        <Story />
      </div>
    ),
  ],
};
