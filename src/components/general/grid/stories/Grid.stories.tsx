import type { Meta, StoryObj } from '@storybook/react-vite';
import { Grid, GridItem } from '../index';

const meta = {
  title: 'Primitives/General/Grid',
  component: Grid,
  tags: ['autodocs'],
  argTypes: {
    columns: {
      control: 'select',
      options: [1, 2, 3, 4, 5, 6],
    },
  },
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

const cellClassName =
  'flex min-h-12 items-center justify-center rounded border border-ui-border bg-ui-background px-3 text-sm font-semibold';

export const Columns: Story = {
  render: () => (
    <div className="grid w-[720px] gap-4">
      <Grid columns={2}>
        {['字段 1', '字段 2', '字段 3', '字段 4'].map(field => (
          <div className={cellClassName} key={field}>
            {field}
          </div>
        ))}
      </Grid>

      <Grid columns={3}>
        <GridItem className={cellClassName} span={2}>
          备注跨两列
        </GridItem>
        <GridItem className={cellClassName}>状态</GridItem>
        <GridItem className={cellClassName} span="full">
          Footer 全宽
        </GridItem>
      </Grid>
    </div>
  ),
};

export const AutoFit: Story = {
  render: () => (
    <Grid autoFit className="w-[760px]" minColumnWidth={150}>
      {['成员配置', '审核阶段', '字典配置', '品牌管理', '字段方案'].map(
        item => (
          <div
            className="grid gap-1 rounded border border-ui-border bg-ui-background p-3"
            key={item}
          >
            <strong className="text-sm">{item}</strong>
            <span className="text-xs text-ui-muted-foreground">设置入口</span>
          </div>
        ),
      )}
    </Grid>
  ),
};

export const FilterPanel: Story = {
  render: () => (
    <Grid columns={2} gap={[10, 12]} className="w-[820px]">
      {[
        '关键词 包含 客户名称 / 联系人',
        '客户状态 包含任一 活跃客户、需跟进',
        '负责人 等于 周启明',
        '最近跟进 介于 2026-05-04 → 2026-06-03',
      ].map(item => (
        <div
          className="min-w-0 truncate rounded border border-ui-border bg-ui-background px-3 py-2 text-sm"
          key={item}
        >
          {item}
        </div>
      ))}
    </Grid>
  ),
};
