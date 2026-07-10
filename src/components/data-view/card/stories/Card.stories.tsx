import type { Meta, StoryObj } from '@storybook/react-vite';
import { Upload } from 'lucide-react';
import { fn } from 'storybook/test';
import { Button } from '../../../general';
import {
  Card,
  CardActions,
  CardBody,
  CardDescription,
  CardField,
  CardFooter,
  CardHeader,
  CardMeta,
  CardStatus,
  CardTitle,
} from '../index';

const storyContainerClassName = 'flex w-full max-w-[960px] flex-col gap-4';
const cardRowClassName = 'flex w-full min-w-0 flex-col gap-3';

const meta = {
  title: 'Primitives/Data View/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <div className={storyContainerClassName}>
      <Card interactive onClick={fn()} variant="item">
        <CardHeader>
          <div className="min-w-0">
            <CardTitle>华东供应链集团</CardTitle>
            <CardDescription>CU-2026-0187 · 客户池</CardDescription>
          </div>
          <CardStatus variant="success">已签约</CardStatus>
        </CardHeader>
        <CardBody>
          <CardMeta>
            <CardField label="负责人" value="周明 / 李佳" />
            <CardField label="信用额度" value="¥300,000" />
            <CardField label="最近跟进" value="今天 09:30" />
            <CardField label="风险提示" value="合同 7 天内到期" />
          </CardMeta>
        </CardBody>
        <CardFooter>
          <span>更新于 10 分钟前</span>
          <CardActions>
            <Button size="small" variant="ghost">
              查看
            </Button>
            <Button size="small" variant="primary">
              跟进
            </Button>
          </CardActions>
        </CardFooter>
      </Card>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className={storyContainerClassName}>
      <div className={cardRowClassName}>
        <Card selected>
          <CardHeader>
            <div className="min-w-0">
              <CardTitle>企业微信集成</CardTitle>
              <CardDescription>当前启用入口</CardDescription>
            </div>
            <CardStatus>选中</CardStatus>
          </CardHeader>
          <CardBody className="text-xs leading-5 text-ui-muted-foreground">
            选中态用于入口选择、视图选择等单一行为。
          </CardBody>
        </Card>

        <Card disabled disabledReason="权限不足，不可进入" variant="plain">
          <CardHeader>
            <div className="min-w-0">
              <CardTitle>跨区额度审批</CardTitle>
              <CardDescription>权限不足，不可进入</CardDescription>
            </div>
            <CardStatus variant="neutral">禁用</CardStatus>
          </CardHeader>
          <CardBody className="text-xs leading-5 text-ui-muted-foreground">
            禁用态必须说明原因，不能只降低透明度。
          </CardBody>
        </Card>

        <Card aria-label="客户卡片加载中" loading />

        <Card interactive>
          <CardHeader>
            <div className="min-w-0">
              <CardTitle>待复核客户</CardTitle>
              <CardDescription>悬停时仅增强可点击感</CardDescription>
            </div>
            <CardStatus variant="warning">待复核</CardStatus>
          </CardHeader>
          <CardBody className="text-xs leading-5 text-ui-muted-foreground">
            普通正文保持 400 字重，主标题和按钮负责扫描层级。
          </CardBody>
        </Card>
      </div>
    </div>
  ),
};

export const SummaryAndAction: Story = {
  render: () => (
    <div className={storyContainerClassName}>
      <Card variant="summary">
        <CardHeader>
          <div className="min-w-0">
            <CardTitle>本月新增商机</CardTitle>
            <CardDescription>销售运营 / 华东区</CardDescription>
          </div>
          <CardStatus>实时</CardStatus>
        </CardHeader>
        <CardBody className="grid gap-2">
          <div className="flex items-baseline gap-1 text-2xl font-bold leading-none">
            128
            <span className="text-xs font-normal text-ui-muted-foreground">
              条
            </span>
          </div>
          <div className="text-xs text-ui-success">▲ 12.4% 较上月</div>
          <p className="m-0 text-xs leading-5 text-ui-muted-foreground">
            点击指标进入 DataTable 明细，Card 本身不承载复杂筛选。
          </p>
        </CardBody>
      </Card>

      <Card variant="action">
        <CardBody className="flex min-w-0 gap-3">
          <div
            aria-hidden="true"
            className="grid size-10 shrink-0 place-items-center rounded-lg border border-(--ui-button-ghost-border) bg-(--ui-button-ghost-background) text-sm font-bold text-(--ui-button-ghost-foreground)"
          >
            渠
          </div>
          <div className="grid min-w-0 flex-1 gap-2">
            <CardHeader className="px-0 pt-0">
              <div className="min-w-0">
                <CardTitle>渠道客户导入</CardTitle>
                <CardDescription>CSV / 企业微信 / API</CardDescription>
              </div>
              <CardStatus>平台蓝入口</CardStatus>
            </CardHeader>
            <p className="m-0 text-xs leading-5 text-ui-muted-foreground">
              入口卡可承载一个主操作，复杂配置进入 Drawer。
            </p>
            <CardActions>
              <Button
                icon={<Upload className="size-3.5" />}
                size="small"
                variant="primary"
              >
                开始导入
              </Button>
              <Button size="small" variant="default">
                查看记录
              </Button>
            </CardActions>
          </div>
        </CardBody>
      </Card>
    </div>
  ),
};

export const RepeatedItems: Story = {
  render: () => (
    <div className={storyContainerClassName}>
      <div className={cardRowClassName}>
        <Card>
          <CardHeader>
            <div className="min-w-0">
              <CardTitle>上海分公司续约</CardTitle>
              <CardDescription>OP-2026-0721</CardDescription>
            </div>
            <CardStatus variant="warning">7 天到期</CardStatus>
          </CardHeader>
          <CardBody>
            <CardMeta>
              <CardField label="金额" value="¥86,000" />
              <CardField label="阶段" value="合同确认" />
            </CardMeta>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div className="min-w-0">
              <CardTitle>冷链运输报价</CardTitle>
              <CardDescription>OP-2026-0718</CardDescription>
            </div>
            <CardStatus variant="success">推进中</CardStatus>
          </CardHeader>
          <CardBody>
            <CardMeta>
              <CardField label="金额" value="¥124,500" />
              <CardField label="阶段" value="方案沟通" />
            </CardMeta>
          </CardBody>
        </Card>
      </div>
    </div>
  ),
};

export const Boundary: Story = {
  render: () => (
    <div className={storyContainerClassName}>
      <Card className="border-ui-destructive/30 bg-ui-destructive/5">
        <CardHeader>
          <CardTitle className="text-ui-destructive">
            不要把页面区块都包成 Card
          </CardTitle>
        </CardHeader>
        <CardBody className="text-xs leading-5 text-ui-destructive">
          字段超过 6 个、需要排序筛选、批量操作或跨记录比较时，应使用
          DataTable；需要编辑流程时进入 Drawer。
        </CardBody>
      </Card>
    </div>
  ),
};
