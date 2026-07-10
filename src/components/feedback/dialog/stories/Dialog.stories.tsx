import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../../general';
import {
  Dialog,
  DialogClose,
  DialogCloseButton,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../index';

const meta = {
  title: 'Primitives/Feedback/Dialog',
  component: DialogContent,
  tags: ['autodocs'],
} satisfies Meta<typeof DialogContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="danger">删除客户</Button>
      </DialogTrigger>
      <DialogContent>
        <div className="flex items-start justify-between gap-4">
          <DialogHeader>
            <DialogTitle>删除客户</DialogTitle>
            <DialogDescription>
              删除后不可恢复，请确认是否继续。
            </DialogDescription>
          </DialogHeader>
          <DialogCloseButton />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">取消</Button>
          </DialogClose>
          <Button variant="danger">确认删除</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
