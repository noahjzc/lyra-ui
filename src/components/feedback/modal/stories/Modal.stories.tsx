import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox, Input } from '../../../data-input';
import { Button } from '../../../general';
import {
  Modal,
  ModalBody,
  ModalClose,
  ModalCloseButton,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from '../index';

const meta = {
  title: 'Primitives/Feedback/Modal',
  component: ModalContent,
  tags: ['autodocs'],
} satisfies Meta<typeof ModalContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Confirm: Story = {
  render: () => (
    <Modal>
      <ModalTrigger asChild>
        <Button>打开确认</Button>
      </ModalTrigger>
      <ModalContent size="small">
        <ModalHeader>
          <div className="grid gap-1">
            <ModalTitle>提交客户变更？</ModalTitle>
            <ModalDescription>变更会同步到销售协作视图。</ModalDescription>
          </div>
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
          <p className="text-sm text-ui-muted-foreground">
            已修改客户等级、负责人和下次跟进时间。
          </p>
        </ModalBody>
        <ModalFooter>
          <ModalClose asChild>
            <Button variant="ghost">取消</Button>
          </ModalClose>
          <Button variant="primary">提交</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
};

export const Danger: Story = {
  render: () => (
    <Modal>
      <ModalTrigger asChild>
        <Button variant="danger">删除客户</Button>
      </ModalTrigger>
      <ModalContent size="small">
        <ModalHeader>
          <div className="grid gap-1">
            <ModalTitle>删除客户</ModalTitle>
            <ModalDescription>删除后客户资料进入回收站。</ModalDescription>
          </div>
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
          <p className="text-sm text-ui-muted-foreground">
            关联商机、报价和跟进记录不会被物理删除。
          </p>
        </ModalBody>
        <ModalFooter>
          <ModalClose asChild>
            <Button variant="ghost">取消</Button>
          </ModalClose>
          <Button variant="danger">删除</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
};

export const FieldPicker: Story = {
  render: () => (
    <Modal>
      <ModalTrigger asChild>
        <Button variant="default">配置字段</Button>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <div className="grid gap-1">
            <ModalTitle>客户列表字段</ModalTitle>
            <ModalDescription>
              选择高频运营视图需要展示的字段。
            </ModalDescription>
          </div>
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
          <div className="grid gap-3">
            {['客户等级', '最近跟进', '负责人', '预计成交额'].map(label => {
              const id = `modal-field-${label}`;

              return (
                <label
                  className="flex items-center gap-2 text-sm"
                  htmlFor={id}
                  key={label}
                >
                  <Checkbox defaultChecked id={id} />
                  <span>{label}</span>
                </label>
              );
            })}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost">重置</Button>
          <Button variant="primary">保存</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
};

export const Scrollable: Story = {
  render: () => (
    <Modal>
      <ModalTrigger asChild>
        <Button>查看变更记录</Button>
      </ModalTrigger>
      <ModalContent size="large">
        <ModalHeader>
          <div className="grid gap-1">
            <ModalTitle>客户合并记录</ModalTitle>
            <ModalDescription>核对合并前后的关键字段差异。</ModalDescription>
          </div>
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody className="max-h-72">
          <div className="grid gap-3">
            {Array.from({ length: 12 }, (_, itemNumber) => itemNumber + 1).map(
              itemNumber => (
                <div
                  className="grid gap-1 border-ui-border border-b pb-3 text-sm"
                  key={itemNumber}
                >
                  <span className="font-semibold">变更项 {itemNumber}</span>
                  <span className="text-ui-muted-foreground">
                    客户资料字段由旧档案同步至主档案，等待负责人确认。
                  </span>
                </div>
              ),
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="primary">确认无误</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
};

export const Loading: Story = {
  render: () => (
    <Modal defaultOpen>
      <ModalContent loading>
        <ModalHeader>
          <div className="grid gap-1">
            <ModalTitle>同步客户数据</ModalTitle>
            <ModalDescription>正在写入客户主档案。</ModalDescription>
          </div>
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
          <Input aria-label="同步批次" readOnly value="CRM-20260610-018" />
        </ModalBody>
        <ModalFooter>
          <Button loading variant="primary">
            保存中
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
};
