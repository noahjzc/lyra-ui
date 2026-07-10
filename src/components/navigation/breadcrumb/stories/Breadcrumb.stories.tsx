import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Breadcrumb, BreadcrumbHomeIcon } from '../index';

const meta = {
  title: 'Primitives/Navigation/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    homeIcon: <BreadcrumbHomeIcon />,
    items: [
      { href: '#', label: '工作台' },
      { href: '#', label: '记录管理' },
      { href: '#', label: '记录列表' },
      { href: '#', label: '华东区' },
      { label: '示例记录 A' },
    ],
    maxItems: 4,
  },
};

export const Overflow: Story = {
  args: {
    items: [
      { href: '#', label: '基础设置' },
      { href: '#', label: '字典配置' },
      { href: '#', label: '字段规则' },
      { href: '#', label: '客户字段' },
      { href: '#', label: '校验规则' },
      { label: '客户等级映射' },
    ],
    maxItems: 4,
  },
};

export const Compact: Story = {
  args: {
    compact: true,
    items: [
      { href: '#', label: '客户列表' },
      { label: '上海林易供应链科技股份有限公司华东分公司' },
    ],
  },
};

export const WithClick: Story = {
  args: {
    items: [
      { label: '基础设置', onClick: fn() },
      { label: '字典配置', onClick: fn() },
      { label: '记录等级' },
    ],
  },
};
