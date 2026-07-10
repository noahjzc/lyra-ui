import type { Meta, StoryObj } from '@storybook/react-vite';
import { Bell, Inbox, Settings, UserRound } from 'lucide-react';
import { Badge } from '../index';

const meta = {
  title: 'Primitives/Data View/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

const canvasClassName =
  'grid min-h-[420px] content-start justify-items-start gap-4 bg-(--color-bg-layout) p-8 text-ui-foreground';
const panelClassName =
  'grid w-full max-w-[1180px] content-start gap-4 rounded-lg border border-ui-border bg-ui-background p-4 shadow-sm';
const rowClassName = 'flex min-w-0 flex-wrap items-center gap-4';
const sectionTitleClassName = 'text-sm font-semibold text-ui-foreground';
const anchorButtonClassName =
  'inline-flex h-8 min-w-0 items-center justify-center rounded-md border border-ui-border bg-ui-background px-3 text-sm font-semibold text-ui-foreground outline-none transition-colors hover:border-(--ui-button-default-hover-border) hover:bg-(--ui-button-default-hover-background) focus-visible:border-(--ui-button-focus-border) focus-visible:ring-2 focus-visible:ring-(--ui-button-focus-ring) disabled:cursor-not-allowed disabled:bg-ui-muted disabled:text-ui-muted-foreground';
const iconButtonClassName =
  'inline-flex size-8 items-center justify-center rounded-md border border-ui-border bg-ui-background text-ui-muted-foreground outline-none transition-colors hover:border-(--ui-button-default-hover-border) hover:bg-(--ui-button-default-hover-background) focus-visible:border-(--ui-button-focus-border) focus-visible:ring-2 focus-visible:ring-(--ui-button-focus-ring)';
const tabClassName =
  'inline-flex h-[30px] min-w-0 items-center justify-center rounded-md border border-transparent bg-ui-muted px-3 text-sm font-semibold text-ui-foreground outline-none transition-colors hover:bg-(--ui-button-ghost-hover-background) focus-visible:border-(--ui-button-focus-border) focus-visible:ring-2 focus-visible:ring-(--ui-button-focus-ring)';
const menuClassName =
  'grid w-[220px] gap-1 rounded-lg border border-ui-border bg-ui-background p-2 shadow-sm';
const menuItemClassName =
  'flex h-8 w-full min-w-0 items-center justify-between gap-2 rounded-md px-2.5 text-left text-sm font-semibold text-ui-foreground outline-none transition-colors hover:bg-ui-muted focus-visible:ring-2 focus-visible:ring-(--ui-button-focus-ring)';

export const Overview: Story = {
  render: () => (
    <div className={canvasClassName}>
      <section className={panelClassName}>
        <div className="grid gap-1">
          <strong className="text-base">组件主样张</strong>
          <span className="text-ui-muted-foreground text-xs">
            Badge 附着在按钮、图标按钮、头像和 Tab 上，提示数量或新内容。
          </span>
        </div>
        <div className={rowClassName}>
          <Badge count={18} placement="suffix">
            <button
              aria-label="通知，18 条未读"
              className={anchorButtonClassName}
              type="button"
            >
              通知
            </button>
          </Badge>
          <Badge dot>
            <button
              aria-label="通知中心，有新消息"
              className={iconButtonClassName}
              type="button"
            >
              <Bell aria-hidden="true" className="size-4" />
            </button>
          </Badge>
          <Badge dot variant="info">
            <a
              aria-label="张明，有待处理提醒"
              className="inline-flex size-9 items-center justify-center rounded-full border border-cyan-200 bg-cyan-50 text-sm font-bold text-cyan-800 outline-none focus-visible:ring-2 focus-visible:ring-(--ui-button-focus-ring)"
              href="#states"
            >
              张
            </a>
          </Badge>
          <Badge count={7} placement="suffix">
            <button
              aria-label="跟进任务，7 条待处理"
              className={tabClassName}
              type="button"
            >
              跟进任务
            </button>
          </Badge>
        </div>
      </section>
    </div>
  ),
};

export const CountAndDot: Story = {
  render: () => (
    <div className={canvasClassName}>
      <section className={panelClassName}>
        <strong className={sectionTitleClassName}>尺寸与数字压缩</strong>
        <div className={rowClassName}>
          <Badge dot size="sm" variant="info">
            <button
              aria-label="通知中心，有新消息"
              className={iconButtonClassName}
              type="button"
            >
              <Bell aria-hidden="true" className="size-4" />
            </button>
          </Badge>
          <Badge dot>
            <button
              aria-label="站内信，有新消息"
              className={iconButtonClassName}
              type="button"
            >
              <Inbox aria-hidden="true" className="size-4" />
            </button>
          </Badge>
          <Badge count={8} placement="suffix">
            <span className="inline-flex h-7 items-center rounded-md border border-ui-border bg-ui-muted px-2.5 text-sm font-semibold">
              任务
            </span>
          </Badge>
          <Badge count={18} placement="suffix">
            <span className="inline-flex h-7 items-center rounded-md border border-ui-border bg-ui-muted px-2.5 text-sm font-semibold">
              通知
            </span>
          </Badge>
          <Badge count={120} overflowCount={99} placement="suffix" size="md">
            <span className="inline-flex h-7 items-center rounded-md border border-ui-border bg-ui-muted px-2.5 text-sm font-semibold">
              待办
            </span>
          </Badge>
          <Badge count={1200} overflowCount={999} placement="suffix" size="md">
            <span className="inline-flex h-7 items-center rounded-md border border-ui-border bg-ui-muted px-2.5 text-sm font-semibold">
              消息
            </span>
          </Badge>
        </div>
      </section>
    </div>
  ),
};

export const AnchorPatterns: Story = {
  render: () => (
    <div className={canvasClassName}>
      <section className={panelClassName}>
        <div className="grid gap-1">
          <strong className={sectionTitleClassName}>锚点模式</strong>
          <span className="text-ui-muted-foreground text-xs">
            文字型锚点使用 suffix；图标、头像等固定尺寸锚点可以使用右上角。
          </span>
        </div>
        <div className="flex min-w-0 flex-wrap items-start gap-6">
          <div className={menuClassName}>
            <Badge count={12} placement="suffix">
              <button
                aria-label="我的待办，12 条待处理"
                className={`${menuItemClassName} bg-cyan-50 text-cyan-800`}
                type="button"
              >
                我的待办
              </button>
            </Badge>
            <Badge dot placement="suffix">
              <button
                aria-label="客户跟进，有新提醒"
                className={menuItemClassName}
                type="button"
              >
                客户跟进
              </button>
            </Badge>
            <Badge count={3} placement="suffix" variant="muted">
              <button
                aria-label="字段设置，3 项隐藏字段"
                className={menuItemClassName}
                type="button"
              >
                字段设置
              </button>
            </Badge>
          </div>
          <div className="grid content-start gap-3">
            <div className={rowClassName}>
              <Badge count={3} placement="suffix" variant="muted">
                <button
                  aria-label="字段设置，3 项隐藏字段"
                  className={anchorButtonClassName}
                  type="button"
                >
                  字段设置
                </button>
              </Badge>
              <Badge count={24} placement="suffix">
                <button
                  aria-label="批量任务，24 条执行中"
                  className={`${anchorButtonClassName} border-(--ui-button-focus-border) ring-2 ring-(--ui-button-focus-ring)`}
                  type="button"
                >
                  批量任务
                </button>
              </Badge>
              <Badge dot>
                <button
                  aria-label="通知，有新消息"
                  className={tabClassName}
                  type="button"
                >
                  通知
                </button>
              </Badge>
            </div>
            <div className={rowClassName}>
              <Badge count={0} placement="suffix" showZero variant="muted">
                <button
                  aria-label="草稿箱，显示 0 条"
                  className={anchorButtonClassName}
                  type="button"
                >
                  草稿箱
                </button>
              </Badge>
              <button className={anchorButtonClassName} disabled type="button">
                归档
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  ),
};

export const StatusAndSubcomponents: Story = {
  render: () => (
    <div className={canvasClassName}>
      <section className={panelClassName}>
        <strong className={sectionTitleClassName}>状态点与子组件</strong>
        <div className={rowClassName}>
          <Badge status="success">在线</Badge>
          <Badge status="warning">待确认</Badge>
          <Badge status="processing">同步中</Badge>
          <Badge.Count count={99} />
          <Badge.Count count={120} overflowCount={99} size="md" />
          <Badge.Dot aria-label="存在提醒" variant="info" />
          <Badge dot offset={[2, -1]}>
            <button
              aria-label="设置，有新配置提醒"
              className={iconButtonClassName}
              type="button"
            >
              <Settings aria-hidden="true" className="size-4" />
            </button>
          </Badge>
          <Badge count={5} offset={[2, 0]}>
            <button
              aria-label="用户消息，5 条未读"
              className={iconButtonClassName}
              type="button"
            >
              <UserRound aria-hidden="true" className="size-4" />
            </button>
          </Badge>
        </div>
      </section>
    </div>
  ),
};
