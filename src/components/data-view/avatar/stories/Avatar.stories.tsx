import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar, AvatarGroup } from '../index';

const avatarSrc =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"%3E%3Crect width="80" height="80" rx="40" fill="%230e7490"/%3E%3Ccircle cx="40" cy="32" r="14" fill="%23dff7fb"/%3E%3Cpath d="M18 70c4-16 16-24 22-24s18 8 22 24" fill="%23b9eef6"/%3E%3C/svg%3E';
const storyContainerClassName = 'flex w-full max-w-[960px] flex-col gap-4';
const sectionClassName =
  'flex min-w-0 flex-col gap-3 rounded-md border border-ui-border bg-ui-background p-4';
const avatarRowClassName = 'flex min-w-0 flex-wrap items-center gap-4';

const meta = {
  title: 'Primitives/Data View/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Identity: Story = {
  render: () => (
    <div className={storyContainerClassName}>
      <div className={sectionClassName}>
        <div className={avatarRowClassName}>
          <div className="flex min-w-0 items-center gap-2">
            <Avatar
              alt="周明"
              name="周明"
              size="large"
              src={avatarSrc}
              status="online"
            />
            <span className="grid min-w-0 gap-0.5 text-xs text-ui-muted-foreground">
              <strong className="text-sm text-ui-foreground">周明</strong>
              <span>销售负责人</span>
            </span>
          </div>
          <div className="flex min-w-0 items-center gap-2">
            <Avatar
              alt="李佳"
              name="李佳"
              size="large"
              src="/missing-avatar.png"
              status="offline"
            />
            <span className="grid min-w-0 gap-0.5 text-xs text-ui-muted-foreground">
              <strong className="text-sm text-ui-foreground">李佳</strong>
              <span>图片失败 fallback</span>
            </span>
          </div>
          <div className="flex min-w-0 items-center gap-2">
            <Avatar
              alt="华东供应链组织"
              name="华东供应链"
              size="large"
              variant="org"
            />
            <span className="grid min-w-0 gap-0.5 text-xs text-ui-muted-foreground">
              <strong className="text-sm text-ui-foreground">华东供应链</strong>
              <span>组织头像</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const ShapeAndFallback: Story = {
  render: () => (
    <div className={storyContainerClassName}>
      <div className={sectionClassName}>
        <div className="flex min-w-0 flex-col gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Avatar name="周明" size="large" />
            <Avatar name="华东供应链" size="large" variant="org" />
            <span className="text-xs leading-5 text-ui-muted-foreground">
              用户默认圆形；组织和应用默认圆角方形。
            </span>
          </div>
          <div className="flex min-w-0 items-center gap-3">
            <Avatar name="李佳" size="large" variant="neutral" />
            <Avatar fallback="CRM" size="large" variant="app" />
            <span className="text-xs leading-5 text-ui-muted-foreground">
              图片失败时优先姓名首字，其次业务图标，最后系统默认。
            </span>
          </div>
          <div className="flex min-w-0 items-center gap-3">
            <Avatar disabled name="离职用户" size="large" />
            <Avatar name="王洋" size="large" status="busy" />
            <span className="text-xs leading-5 text-ui-muted-foreground">
              状态点只表达在线、忙碌、离线等 presence，不承载未读数量。
            </span>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className={storyContainerClassName}>
      <div className={sectionClassName}>
        <div className={avatarRowClassName}>
          <div className="grid place-items-center gap-2">
            <Avatar name="王洋" size="small" />
            <span className="text-xs font-bold text-ui-muted-foreground">
              24px
            </span>
          </div>
          <div className="grid place-items-center gap-2">
            <Avatar name="王洋" />
            <span className="text-xs font-bold text-ui-muted-foreground">
              32px
            </span>
          </div>
          <div className="grid place-items-center gap-2">
            <Avatar name="王洋" size="large" />
            <span className="text-xs font-bold text-ui-muted-foreground">
              40px
            </span>
          </div>
          <div className="grid place-items-center gap-2">
            <Avatar name="王洋" size="xlarge" />
            <span className="text-xs font-bold text-ui-muted-foreground">
              48px
            </span>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const Group: Story = {
  render: () => (
    <div className={storyContainerClassName}>
      <div className={sectionClassName}>
        <AvatarGroup
          aria-label="协作成员：周明、李佳、王洋、赵宁等 7 人"
          max={4}
        >
          <Avatar name="周明" />
          <Avatar name="李佳" variant="app" />
          <Avatar name="王洋" variant="neutral" />
          <Avatar name="赵宁" variant="org" />
          <Avatar name="陈晨" />
          <Avatar name="林一" />
          <Avatar name="宋佳" />
        </AvatarGroup>
        <span className="text-xs leading-5 text-ui-muted-foreground">
          头像组只表达成员概览，完整名单进入 Popover。
        </span>
      </div>
    </div>
  ),
};

export const InTable: Story = {
  render: () => (
    <div className={storyContainerClassName}>
      <div className="min-w-0 overflow-auto rounded-md border border-ui-border bg-ui-background">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead className="bg-(--ui-input-filled-background) text-xs text-ui-muted-foreground">
            <tr>
              <th className="px-3 py-2 text-left" scope="col">
                操作人
              </th>
              <th className="px-3 py-2 text-left" scope="col">
                动作
              </th>
              <th className="px-3 py-2 text-left" scope="col">
                时间
              </th>
              <th className="px-3 py-2 text-left" scope="col">
                入口
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-ui-border border-t">
              <td className="px-3 py-2">
                <span className="inline-flex min-w-0 items-center gap-2">
                  <Avatar name="周明" size="small" />
                  周明
                </span>
              </td>
              <td className="px-3 py-2">更新客户等级</td>
              <td className="px-3 py-2">09:30</td>
              <td className="px-3 py-2">
                <a
                  className="font-semibold text-(--ui-button-ghost-foreground)"
                  href="#top"
                >
                  查看
                </a>
              </td>
            </tr>
            <tr className="border-ui-border border-t">
              <td className="px-3 py-2">
                <span className="inline-flex min-w-0 items-center gap-2">
                  <Avatar
                    disabled
                    fallback="离"
                    name="离职用户"
                    size="small"
                    variant="neutral"
                  />
                  离职用户
                </span>
              </td>
              <td className="px-3 py-2">转移负责人</td>
              <td className="px-3 py-2">昨天</td>
              <td className="px-3 py-2">
                <a
                  className="font-semibold text-(--ui-button-ghost-foreground)"
                  href="#top"
                >
                  查看
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  ),
};
