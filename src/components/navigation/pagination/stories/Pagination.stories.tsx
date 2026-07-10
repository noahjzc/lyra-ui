import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Pagination } from '../index';

const meta = {
  title: 'Primitives/Navigation/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  args: {
    pageSize: 20,
    pageSizeOptions: [10, 20, 50, 100],
    onChange: fn(),
    onPageChange: fn(),
    onPageSizeChange: fn(),
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FirstPage: Story = {
  args: {
    current: 1,
    total: 128,
  },
};

export const MiddlePage: Story = {
  args: {
    current: 13,
    total: 1248,
  },
};

export const LastPage: Story = {
  args: {
    current: 7,
    total: 128,
  },
};

export const NoData: Story = {
  args: {
    current: 1,
    total: 0,
  },
};

export const Compact: Story = {
  args: {
    compact: true,
    current: 3,
    total: 48,
  },
};

export const Simple: Story = {
  args: {
    current: 1,
    total: 25,
    variant: 'simple',
  },
};

export const Jumper: Story = {
  args: {
    current: 13,
    showJumper: true,
    total: 1248,
  },
};

export const QuickJump: Story = {
  args: {
    current: 13,
    showQuickJump: true,
    total: 1248,
  },
};

export const Loading: Story = {
  args: {
    current: 4,
    loading: true,
    showJumper: true,
    total: 8624,
  },
};
