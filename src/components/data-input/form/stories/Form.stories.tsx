import type { Meta, StoryObj } from '@storybook/react-vite';
import { Plus, X } from 'lucide-react';
import { Button } from '../../../general/button';
import { Input } from '../../input';
import { SelectField } from '../../select';
import { Upload } from '../../upload';
import { Form } from '../index';

const meta = {
  title: 'Primitives/Data Input/Form',
  component: Form,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

const canvasClassName =
  'grid min-h-[420px] justify-items-start gap-3 bg-(--color-bg-layout) p-8 text-ui-foreground';
const panelClassName =
  'grid w-full max-w-[1180px] gap-4 rounded-lg border border-ui-border bg-ui-background p-4 shadow-sm';
const drawerPanelClassName =
  'grid w-full max-w-[880px] gap-4 rounded-lg border border-ui-border bg-ui-background p-4 shadow-sm';

const levelOptions = [
  { label: 'A 级客户', value: 'a' },
  { label: 'B 级客户', value: 'b' },
  { label: 'C 级客户', value: 'c' },
];

const customerTypeOptions = [
  { label: '企业客户', value: 'enterprise' },
  { label: '个人客户', value: 'individual' },
  { label: '渠道客户', value: 'channel' },
];

const ownerOptions = [
  { label: '宋佳', value: 'songjia' },
  { label: '周明', value: 'zhouming' },
  { label: '林一', value: 'linyi' },
];

const statusOptions = [
  { label: '正常', value: 'active' },
  { label: '停用', value: 'inactive' },
];

export const Overview: Story = {
  args: {},
  render: () => (
    <div className={canvasClassName}>
      <Form
        className={panelClassName}
        labelCol={{ width: 104 }}
        labelWrap
        layout="horizontal"
        onSubmit={event => event.preventDefault()}
        requiredMark="optional"
      >
        <div className="flex min-w-0 items-start justify-between gap-3 border-ui-border border-b pb-3">
          <div className="grid min-w-0 gap-1">
            <strong className="text-base">编辑客户</strong>
            <span className="text-ui-muted-foreground text-xs">
              layout="horizontal" · labelCol 104px · wrapperCol 自适应
            </span>
          </div>
          <Button aria-label="关闭" iconOnly type="button" variant="ghost">
            <X className="size-4" />
          </Button>
        </div>

        <Form.Section
          description="help / error / extra 都跟随控件左边界。"
          title="基础字段"
        >
          <Form.Grid columns={2}>
            <Form.Item
              help="2 到 80 个字符，保存后用于重复客户检查。"
              label="客户名称"
              name="name"
              required
              validateStatus="success"
            >
              <Form.Control asChild>
                <Input defaultValue="杭州启明贸易有限公司" />
              </Form.Control>
            </Form.Item>
            <Form.Item
              extra="extra 可与错误同时存在。"
              label="客户简称"
              name="shortName"
              optional
            >
              <Form.Control asChild>
                <Input defaultValue="启明贸易" />
              </Form.Control>
            </Form.Item>
            <Form.Item label="客户级别" name="level">
              <Form.Control asChild>
                <SelectField
                  defaultValue="a"
                  options={levelOptions}
                  placeholder="请选择客户级别"
                />
              </Form.Control>
            </Form.Item>
            <Form.Item
              error="请输入 11 位手机号。"
              label="联系电话"
              name="mobile"
              required
            >
              <Form.Control asChild>
                <Input defaultValue="1380000" invalid />
              </Form.Control>
            </Form.Item>
            <Form.Item label="负责人" name="owner">
              <Form.Control asChild>
                <SelectField
                  defaultValue="songjia"
                  options={ownerOptions}
                  placeholder="请选择负责人"
                />
              </Form.Control>
            </Form.Item>
          </Form.Grid>
        </Form.Section>

        <Form.Section
          actions={
            <Button size="small" type="button" variant="ghost">
              <Plus className="size-4" />
              添加联系人
            </Button>
          }
          description="对应 Form.List / useFieldArray。"
          title="动态联系人"
        >
          <div className="grid gap-2">
            <div className="grid min-w-[700px] grid-cols-[44px_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_40px] items-center gap-2 rounded-md border border-ui-border bg-(--ui-surface-soft-background) p-2">
              <span className="grid size-6 justify-self-center place-items-center rounded border border-ui-border text-ui-muted-foreground text-xs">
                1
              </span>
              <Input defaultValue="林一" />
              <Input defaultValue="采购负责人" />
              <Input defaultValue="138 0000 0000" />
              <Button aria-label="删除联系人" iconOnly variant="ghost">
                <X className="size-4" />
              </Button>
            </div>
            <div className="grid min-w-[700px] grid-cols-[44px_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_40px] items-center gap-2 rounded-md border border-ui-border bg-(--ui-surface-soft-background) p-2">
              <span className="grid size-6 justify-self-center place-items-center rounded border border-ui-border text-ui-muted-foreground text-xs">
                2
              </span>
              <Input defaultValue="周明" />
              <Input defaultValue="财务联系人" />
              <Input defaultValue="待补手机号" invalid />
              <Button aria-label="删除联系人" iconOnly variant="ghost">
                <X className="size-4" />
              </Button>
            </div>
          </div>
        </Form.Section>

        <Form.Footer justify="end">
          <Button type="reset" variant="ghost">
            重置
          </Button>
          <Button type="button" variant="ghost">
            取消
          </Button>
          <Button type="submit" variant="primary">
            提交
          </Button>
        </Form.Footer>
      </Form>
    </div>
  ),
};

export const VerticalDrawer: Story = {
  args: {},
  render: () => (
    <div className={canvasClassName}>
      <Form className={drawerPanelClassName} layout="vertical">
        <Form.Section
          description="Drawer 表单默认推荐纵向布局。"
          title="客户信息"
        >
          <Form.Grid columns={2}>
            <Form.Item
              help="2 到 80 个字符，保存后用于重复客户检查。"
              label="客户名称"
              name="drawer-name"
              required
            >
              <Form.Control asChild>
                <Input placeholder="请输入客户名称" />
              </Form.Control>
            </Form.Item>
            <Form.Item
              error="请选择企业客户、个人客户或渠道客户。"
              label="客户类型"
              name="customer-type"
              required
            >
              <Form.Control asChild>
                <SelectField
                  options={customerTypeOptions}
                  placeholder="请选择"
                />
              </Form.Control>
            </Form.Item>
            <Form.Item
              extra="区域会影响默认负责人分配。"
              label="所属区域"
              name="region"
            >
              <Form.Control asChild>
                <Input defaultValue="浙江 / 杭州 / 西湖" />
              </Form.Control>
            </Form.Item>
            <Form.Item help="系统分配，只读但允许复制。" label="负责人">
              <Form.ReadonlyValue value="宋佳" />
            </Form.Item>
            <Form.Item label="经营地址" name="address" span="full">
              <Form.Control asChild>
                <Input defaultValue="浙江省杭州市西湖区文三路 188 号" />
              </Form.Control>
            </Form.Item>
            <Form.Item
              error="备注不能包含外部系统无法识别的特殊字符。"
              label="备注"
              name="remark"
              span="full"
            >
              <Form.Control asChild>
                <Input.Textarea placeholder="请输入备注" />
              </Form.Control>
            </Form.Item>
          </Form.Grid>
        </Form.Section>
        <Form.Footer justify="end">
          <Button type="button" variant="ghost">
            取消
          </Button>
          <Button type="submit" variant="primary">
            保存
          </Button>
        </Form.Footer>
      </Form>
    </div>
  ),
};

export const InlineSearch: Story = {
  args: {},
  render: () => (
    <div className={canvasClassName}>
      <Form className={panelClassName} layout="inline">
        <Form.Item label="关键词" name="keyword">
          <Form.Control asChild>
            <Input placeholder="客户名称 / 手机号" />
          </Form.Control>
        </Form.Item>
        <Form.Item label="状态" name="status">
          <Form.Control asChild>
            <SelectField options={statusOptions} placeholder="全部状态" />
          </Form.Control>
        </Form.Item>
        <Form.Item label="负责人" name="filter-owner">
          <Form.Control asChild>
            <SelectField options={ownerOptions} placeholder="全部负责人" />
          </Form.Control>
        </Form.Item>
        <Form.Footer alignWithControls={false}>
          <Button type="submit" variant="primary">
            查询
          </Button>
          <Button type="reset" variant="ghost">
            重置
          </Button>
        </Form.Footer>
      </Form>
    </div>
  ),
};

export const StateMatrix: Story = {
  args: {},
  render: () => (
    <div className={canvasClassName}>
      <Form className={panelClassName} layout="vertical">
        <Form.Section
          description="覆盖默认、必填、错误、校验中、只读和禁用。"
          title="字段状态"
        >
          <Form.Grid columns={3}>
            <Form.Item help="常规输入状态。" label="默认" name="default">
              <Form.Control asChild>
                <Input defaultValue="字段值" />
              </Form.Control>
            </Form.Item>
            <Form.Item
              help="必填标识不改变控件高度。"
              label="必填"
              name="required"
              required
            >
              <Form.Control asChild>
                <Input defaultValue="字段值" />
              </Form.Control>
            </Form.Item>
            <Form.Item error="请修正格式。" label="错误" name="error">
              <Form.Control asChild>
                <Input defaultValue="错误值" invalid />
              </Form.Control>
            </Form.Item>
            <Form.Item
              help="异步校验不阻塞输入。"
              label="校验中"
              name="validating"
              validateStatus="validating"
            >
              <Form.Control asChild>
                <Input defaultValue="正在检查重复" />
              </Form.Control>
            </Form.Item>
            <Form.Item help="可选择、可复制。" label="只读">
              <Form.ReadonlyValue value="CU-2026-0187" />
            </Form.Item>
            <Form.Item
              help="流程锁定，需要说明原因。"
              label="禁用"
              name="disabled"
            >
              <Form.Control asChild>
                <Input disabled value="审批中不可修改" />
              </Form.Control>
            </Form.Item>
          </Form.Grid>
        </Form.Section>
      </Form>
    </div>
  ),
};

export const UploadInForm: Story = {
  args: {},
  render: () => (
    <div className={canvasClassName}>
      <Form className={drawerPanelClassName} layout="vertical">
        <Form.Item
          extra="图片缩略图默认 96px，支持预览、删除、上传中和失败重试。"
          label="客户附件"
          name="files"
          span="full"
        >
          <Upload
            accept="image/*"
            hint="支持 PNG / JPG，单个文件不超过 10 MB。"
            variant="picture"
          />
        </Form.Item>
      </Form>
    </div>
  ),
};
