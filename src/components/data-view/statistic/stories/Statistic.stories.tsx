import type { Meta, StoryObj } from '@storybook/react-vite';
import { Statistic } from '../index';

const meta = {
  title: 'Primitives/Data View/Statistic',
  component: Statistic,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    title: '记录总数',
    value: 12876,
  },
} satisfies Meta<typeof Statistic>;

export default meta;
type Story = StoryObj<typeof meta>;

const canvasClassName =
  'grid min-h-[420px] content-start justify-items-start gap-4 bg-(--color-bg-layout) p-8 text-ui-foreground';
const panelClassName =
  'grid w-full max-w-[1180px] content-start gap-4 rounded-lg border border-ui-border bg-ui-background p-4 shadow-sm';
const rowClassName = 'flex min-w-0 flex-wrap items-start gap-3';
const stripClassName =
  'flex w-full min-w-0 flex-col gap-2 rounded-lg border border-ui-border bg-ui-background p-3 sm:flex-row';
const formatListClassName =
  'grid w-full max-w-[520px] overflow-hidden rounded-lg border border-ui-border bg-ui-background shadow-sm';
const formatRowClassName =
  'h-9 w-full justify-between border-ui-border border-b px-3 last:border-b-0';

export const Overview: Story = {
  render: () => (
    <div className={canvasClassName}>
      <section className={panelClassName}>
        <div className="grid gap-1">
          <strong className="text-base">指标结构</strong>
          <span className="text-ui-muted-foreground text-xs">
            Label、Value、Unit、Trend 和数据时效保持清晰层级。
          </span>
        </div>
        <div className={rowClassName}>
          <Statistic
            description="环比增长"
            prefix="¥"
            title="本月成交额"
            trend={{ direction: 'up', value: '12.8%' }}
            value={1248600}
            variant="card"
          />
          <Statistic
            status="stale"
            statusText="7 个超时待处理"
            title="待跟进客户"
            trend="warning"
            unit="个"
            value={36}
            variant="card"
          />
          <Statistic
            description="近 7 天下降"
            precision={1}
            title="转化率"
            trend={{ direction: 'down', value: '2.1%' }}
            unit="%"
            value={18.4}
            variant="card"
          />
        </div>
      </section>
    </div>
  ),
};

export const DataStates: Story = {
  render: () => (
    <div className={canvasClassName}>
      <section className={panelClassName}>
        <strong className="text-base">数据状态</strong>
        <div className={rowClassName}>
          <Statistic loading title="加载中" value={12876} variant="card" />
          <Statistic
            description="不把空值误作 0"
            status="empty"
            statusText="暂无统计"
            title="成交额"
            value={null}
            variant="card"
          />
          <Statistic
            meta="10 分钟前"
            status="stale"
            statusText="数据可能延迟"
            title="库存同步"
            value="v36"
            variant="card"
          />
          <Statistic
            status="error"
            statusText="统计失败，可重试"
            title="回款率"
            value={null}
            variant="card"
          />
          <Statistic
            status="permission"
            statusText="无财务权限"
            title="毛利率"
            value={null}
            variant="card"
          />
          <Statistic
            status="not-configured"
            statusText="未配置目标"
            title="目标达成率"
            value={null}
            variant="card"
          />
        </div>
      </section>
    </div>
  ),
};

export const Density: Story = {
  render: () => (
    <div className={canvasClassName}>
      <section className={panelClassName}>
        <strong className="text-base">密度</strong>
        <div className="grid w-full max-w-[720px] gap-3">
          <Statistic
            title="Inline 用于工具栏摘要"
            trend={{ direction: 'up', value: '+24' }}
            value="总数 1,248"
            variant="inline"
          />
          <Statistic
            compact
            description="今日新增"
            title="Card 用于工作台指标"
            value={68}
            variant="card"
          />
          <div className={stripClassName}>
            <Statistic
              size="inline"
              title="成交额"
              value="¥32.8万"
              variant="plain"
            />
            <Statistic
              size="inline"
              title="转化率"
              value="18.4%"
              variant="plain"
            />
            <Statistic size="inline" title="风险数" value={3} variant="plain" />
          </div>
        </div>
      </section>
    </div>
  ),
};

export const Formatting: Story = {
  render: () => (
    <div className={canvasClassName}>
      <section className={panelClassName}>
        <strong className="text-base">数值格式</strong>
        <div className={formatListClassName}>
          <Statistic
            className={formatRowClassName}
            title="整数分组"
            unit="条"
            value={1248}
            variant="inline"
          />
          <Statistic
            className={formatRowClassName}
            formatter={value => `¥${Number(value).toFixed(2)}万`}
            title="金额压缩"
            value={86.42}
            variant="inline"
          />
          <Statistic
            className={formatRowClassName}
            precision={2}
            title="固定精度"
            unit="%"
            value={18.4}
            variant="inline"
          />
          <Statistic
            className={formatRowClassName}
            formatter={value => `-¥${Math.abs(Number(value)).toFixed(2)}万`}
            title="负数展示"
            value={-3.2}
            variant="inline"
          />
          <Statistic
            className={formatRowClassName}
            title="真实零值"
            value={0}
            variant="inline"
          />
          <Statistic
            className={formatRowClassName}
            emptyText="--"
            title="未知值"
            value={null}
            variant="inline"
          />
        </div>
      </section>
    </div>
  ),
};
