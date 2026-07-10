import type { Meta, StoryObj } from '@storybook/react-vite';
import { Code, Kbd, Paragraph, Text, Title } from '../index';

const meta = {
  title: 'Primitives/General/Typography',
  component: Text,
  tags: ['autodocs'],
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

const cardClassName =
  'grid gap-3 rounded-lg border border-ui-border bg-ui-background p-4';

export const TypeScale: Story = {
  render: () => (
    <div className="grid w-[760px] gap-3">
      <div className={cardClassName}>
        <Title level={1}>客户关系管理系统</Title>
        <Text tone="secondary">28px / 36px，用于页面级展示标题。</Text>
      </div>
      <div className={cardClassName}>
        <Title level={2}>上海卓研科技有限公司</Title>
        <Text tone="secondary">24px / 32px，用于对象标题。</Text>
      </div>
      <div className={cardClassName}>
        <Title level={4}>开票信息</Title>
        <Text>采购节奏稳定，最近关注控制柜交期。</Text>
      </div>
      <div className={cardClassName}>
        <Text variant="caption">最近更新于 2026-06-04 10:24</Text>
        <Text variant="mini">A 级 · 活跃客户</Text>
      </div>
    </div>
  ),
};

export const SemanticRoles: Story = {
  render: () => (
    <div className="grid w-[620px] gap-3">
      <Text>主要内容、对象名称、关键业务值。</Text>
      <Text tone="secondary">普通字段值、说明正文。</Text>
      <Text tone="link">查看详情 / 更多操作</Text>
      <Text numeric variant="label">
        ¥128,000 · 32.6%
      </Text>
      <Text>
        客户编号 <Code>CU-2026-0187</Code>
      </Text>
      <Text>
        快捷键 <Kbd>⌘</Kbd> <Kbd>B</Kbd>
      </Text>
    </div>
  ),
};

export const Truncation: Story = {
  render: () => (
    <div className="grid w-[420px] gap-3">
      <Text className="rounded border border-ui-border p-2" truncate>
        上海卓研科技有限公司华东一区重点客户采购计划协同记录
      </Text>
      <Paragraph className="rounded border border-ui-border p-2" rows={2}>
        客户近期对控制柜交期较敏感，需要在下次跟进中确认 Q3
        采购计划与预算窗口，并同步采购负责人。
      </Paragraph>
    </div>
  ),
};
