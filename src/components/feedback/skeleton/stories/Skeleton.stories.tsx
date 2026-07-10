import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton } from '../index';

const meta = {
  title: 'Primitives/Feedback/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Text: Story = {
  args: {
    avatar: true,
    preset: 'text',
    rows: 3,
  },
};

export const List: Story = {
  args: {
    preset: 'list',
    rows: 4,
  },
};

export const Card: Story = {
  args: {
    preset: 'card',
  },
};

export const Table: Story = {
  args: {
    preset: 'table',
    rows: 4,
  },
};

export const Detail: Story = {
  args: {
    preset: 'detail',
    rows: 4,
  },
};

export const Inactive: Story = {
  args: {
    active: false,
    preset: 'table',
    rows: 3,
  },
};
