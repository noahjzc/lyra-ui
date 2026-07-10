import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { TopMenu } from '..';

const meta = {
  title: 'Primitives/Navigation/TopMenu',
  component: TopMenu,
  tags: ['autodocs'],
  args: {
    onSelect: fn(),
  },
} satisfies Meta<typeof TopMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 顶部模块导航。 */
export const Top: Story = {
  args: {
    activeKey: 'crm',
    items: [
      { href: '/crm', key: 'crm', label: 'CRM' },
      { href: '/pms', key: 'pms', label: 'PMS' },
      { href: '/wms', key: 'wms', label: 'WMS' },
      { href: '/org', key: 'org', label: '组织管理' },
      { href: '/ai', key: 'ai', label: 'AI 平台' },
    ],
  },
};
