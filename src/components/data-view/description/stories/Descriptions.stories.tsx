import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Tag } from '../../tag';
import { Descriptions } from '../index';

const meta = {
  title: 'Primitives/Data View/Description',
  component: Descriptions,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    items: [],
    onCopy: fn(),
  },
} satisfies Meta<typeof Descriptions>;

export default meta;
type Story = StoryObj<typeof meta>;

const canvasClassName =
  'grid min-h-[420px] content-start justify-items-start gap-4 bg-(--color-bg-layout) p-8 text-ui-foreground';
const panelClassName =
  'grid w-full max-w-[1180px] content-start gap-4 rounded-lg border border-ui-border bg-ui-background p-4 shadow-sm';

export const Overview: Story = {
  args: {},
  render: args => (
    <div className={canvasClassName}>
      <section className={panelClassName}>
        <div className="grid gap-1">
          <strong className="text-base">客户详情</strong>
          <span className="text-ui-muted-foreground text-xs">
            Description 用于只读键值信息，不使用 disabled Input 伪装。
          </span>
        </div>
        <Descriptions
          {...args}
          columns={2}
          items={[
            {
              copyable: true,
              label: '客户编号',
              value: 'CU-2026-0187',
            },
            {
              label: '归属部门',
              value: '华东大区 / 企业客户组',
            },
            {
              label: '主联系人',
              value: '周琳 138****2871',
              valueClassName: 'font-semibold',
            },
            {
              label: '最近跟进',
              value: '今天 10:24 电话沟通',
            },
            {
              label: '注册地址',
              span: 'full',
              value: '上海市浦东新区张江高科技园区博云路 2 号 6 幢 1201 室',
              wrap: true,
            },
          ]}
        />
      </section>
    </div>
  ),
};

export const FieldStates: Story = {
  args: {},
  render: args => (
    <div className={canvasClassName}>
      <section className={panelClassName}>
        <div className="grid gap-1">
          <strong className="text-base">字段状态</strong>
          <span className="text-ui-muted-foreground text-xs">
            覆盖空值、脱敏、链接、Tag 和权限提示。
          </span>
        </div>
        <Descriptions
          {...args}
          columns={2}
          emptyText="暂无"
          items={[
            {
              label: '统一社会信用代码',
              value: '9133**********42',
            },
            {
              label: '外部系统 ID',
              value: null,
            },
            {
              label: '关联商机',
              value: (
                <a className="font-medium text-[#0f5f78]" href="#opportunity">
                  OP-240618-0032
                </a>
              ),
            },
            {
              label: '状态',
              value: <Tag color="success">已启用</Tag>,
            },
            {
              label: '税号读取权限',
              value: '无财务权限',
              valueClassName: 'text-ui-muted-foreground',
            },
          ]}
        />
      </section>
    </div>
  ),
};

export const InlineSummary: Story = {
  args: {},
  render: args => (
    <div className={canvasClassName}>
      <section className={panelClassName}>
        <Descriptions
          {...args}
          compact
          layout="inline"
          items={[
            { label: '客户等级', value: 'A 类' },
            { label: '生命周期', value: '成交客户' },
            { label: '负责人', value: '李明' },
            { label: '账期', value: '30 天' },
          ]}
        />
      </section>
    </div>
  ),
};

export const BorderedDetail: Story = {
  args: {},
  render: args => (
    <div className={canvasClassName}>
      <section className={panelClassName}>
        <Descriptions
          {...args}
          bordered
          columns={3}
          items={[
            { label: '客户类型', value: '企业客户' },
            { label: '结算币种', value: 'CNY' },
            { label: '负责人', value: '李明' },
            { label: '省份', value: '上海' },
            { label: '行业', value: '制造' },
            { label: '规模', value: '500+' },
            {
              label: '备注',
              span: 'full',
              value:
                '客户要求每月 25 日前完成账单确认，异常差异需同步销售、财务和交付负责人。',
              wrap: true,
            },
          ]}
        />
      </section>
    </div>
  ),
};

export const CompactGrid: Story = {
  args: {},
  render: args => (
    <div className={canvasClassName}>
      <section className={panelClassName}>
        <Descriptions
          {...args}
          columns={4}
          compact
          items={[
            { label: '省份', value: '上海' },
            { label: '行业', value: '制造' },
            { label: '规模', value: '500+' },
            { label: '账期', value: '30 天' },
          ]}
        />
      </section>
    </div>
  ),
};
