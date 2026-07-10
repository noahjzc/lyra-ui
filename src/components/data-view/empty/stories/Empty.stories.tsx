import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../../general';
import { Tag } from '../../tag';
import { Empty } from '../index';

const storyContainerClassName = 'flex w-full max-w-[960px] flex-col gap-4';
const surfaceClassName =
  'min-w-0 rounded-md border border-ui-border bg-ui-background';

const meta = {
  title: 'Primitives/Data View/Empty',
  component: Empty,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof Empty>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TableEmpty: Story = {
  render: () => (
    <div className={storyContainerClassName}>
      <div className={surfaceClassName}>
        <table className="w-full min-w-[620px] border-collapse">
          <thead className="bg-(--ui-input-filled-background) text-xs font-bold text-ui-muted-foreground">
            <tr>
              <th className="w-11 px-2 py-2 text-left" scope="col">
                □
              </th>
              <th className="px-2 py-2 text-left" scope="col">
                客户名称
              </th>
              <th className="px-2 py-2 text-left" scope="col">
                客户等级
              </th>
              <th className="px-2 py-2 text-left" scope="col">
                负责人
              </th>
              <th className="w-28 px-2 py-2 text-left" scope="col">
                操作
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border-ui-border border-t" colSpan={5}>
                <Empty
                  action={
                    <>
                      <Button size="small" variant="primary">
                        新建客户
                      </Button>
                      <Button size="small" variant="default">
                        导入数据
                      </Button>
                    </>
                  }
                  description="新建客户后会显示在这里，也可以先导入已有客户资料。"
                  title="暂无客户记录"
                />
              </td>
            </tr>
          </tbody>
        </table>
        <div className="flex min-h-9 items-center justify-between border-ui-border border-t bg-(--ui-input-filled-background) px-3 text-xs text-ui-muted-foreground">
          <span>已选 0 项</span>
          <span>共 0 条</span>
        </div>
      </div>
    </div>
  ),
};

export const NoResult: Story = {
  render: () => (
    <div className={storyContainerClassName}>
      <div className={`${surfaceClassName} p-3`}>
        <div className="mb-2 flex min-w-0 flex-wrap gap-1.5">
          <Tag.Filter label="负责人" value="张明" />
          <Tag.Filter label="等级" value="A" />
          <Tag.Filter label="地区" value="华东" />
        </div>
        <Empty
          action={
            <Button size="small" variant="primary">
              清空筛选
            </Button>
          }
          compact
          description="调整关键词或清空筛选条件后再试。"
          title="没有匹配的客户"
          type="no-result"
        />
      </div>
    </div>
  ),
};

export const NotConfigured: Story = {
  render: () => (
    <div className={storyContainerClassName}>
      <div
        className={`${surfaceClassName} flex items-center justify-between gap-4 p-4`}
      >
        <Empty
          className="items-start py-0 text-left"
          description="配置等级规则后，系统会自动为客户打标并显示在列表中。"
          title="暂未配置客户等级规则"
          type="not-configured"
        />
        <Button className="shrink-0" size="small" variant="primary">
          去配置
        </Button>
      </div>
    </div>
  ),
};

export const NoPermission: Story = {
  render: () => (
    <div className={storyContainerClassName}>
      <div
        className={`${surfaceClassName} flex items-center justify-between gap-4 p-4`}
      >
        <Empty
          className="items-start py-0 text-left"
          compact
          description="回收站记录仅管理员和数据负责人可见。"
          title="暂无查看权限"
          type="no-permission"
        />
        <Button className="shrink-0" size="small" variant="default">
          申请权限
        </Button>
      </div>
    </div>
  ),
};

export const CompactAndError: Story = {
  render: () => (
    <div className={storyContainerClassName}>
      <div className={`${surfaceClassName} flex min-h-14 items-center px-3`}>
        <Empty
          className="flex-row justify-start gap-2 py-0 text-left"
          compact
          description={null}
          title="当前通知为空"
        />
      </div>
      <div
        className={`${surfaceClassName} flex min-h-14 items-center justify-between gap-3 px-3`}
      >
        <Empty
          className="flex-row justify-start gap-2 py-0 text-left"
          compact
          description={null}
          title="加载客户画像失败"
          type="error-empty"
        />
        <Button size="small" variant="link">
          重试
        </Button>
      </div>
    </div>
  ),
};
