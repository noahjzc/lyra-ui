import '@testing-library/jest-dom/vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
  Breadcrumb,
  BreadcrumbHomeIcon,
} from '../../src/components/navigation';

describe('Breadcrumb', () => {
  it('renders nav semantics and current page', () => {
    render(
      <Breadcrumb
        items={[
          { href: '#', label: '记录管理' },
          { href: '#', label: '记录列表' },
          { label: '示例记录 A' },
        ]}
      />,
    );

    expect(
      screen.getByRole('navigation', { name: '面包屑' }),
    ).toBeInTheDocument();

    // 最后一个节点是当前页
    const current = screen.getByText('示例记录 A');
    expect(current.closest('[aria-current]')).toHaveAttribute(
      'aria-current',
      'page',
    );

    // 分隔符应渲染
    expect(screen.getAllByText('/').length).toBeGreaterThanOrEqual(1);
    // 分隔符 aria-hidden
    screen.getAllByText('/').forEach(sep => {
      expect(sep.closest('[aria-hidden]')).toBeTruthy();
    });
  });

  it('renders home icon when provided', () => {
    render(
      <Breadcrumb
        homeIcon={<BreadcrumbHomeIcon />}
        items={[{ href: '#', label: '工作台' }, { label: '客户详情' }]}
      />,
    );

    // 首页图标「首」字存在
    expect(screen.getByText('首')).toBeInTheDocument();
  });

  it('collapses middle items into overflow menu', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <Breadcrumb
        items={[
          { label: '工作台' },
          { label: '记录管理', onClick },
          { label: '华东区' },
          { label: '客户 A' },
        ]}
        maxItems={3}
      />,
    );

    // 超出 maxItems，中间节点折叠
    const overflowButton = screen.getByRole('button', {
      name: '展开中间路径',
    });
    expect(overflowButton).toBeInTheDocument();

    await user.click(overflowButton);

    // 溢出菜单中显示被折叠的节点
    const menu = screen.getByRole('menu');
    expect(menu).toHaveClass('shadow-ui-elevation-2');
    expect(menu).not.toHaveClass('shadow-ui-popover');
    expect(within(menu).getByText('记录管理')).toBeInTheDocument();
    expect(within(menu).getByText('华东区')).toBeInTheDocument();
  });

  it('renders navigable links for href items', () => {
    render(
      <Breadcrumb
        items={[{ href: '/home', label: '工作台' }, { label: '当前页' }]}
      />,
    );

    const link = screen.getByRole('link', { name: '工作台' });
    expect(link).toHaveAttribute('href', '/home');
  });

  it('fires onClick for clickable items', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <Breadcrumb
        items={[{ label: '基础设置', onClick }, { label: '当前页' }]}
      />,
    );

    await user.click(screen.getByText('基础设置'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders compact variant', () => {
    render(
      <Breadcrumb
        compact
        items={[{ href: '#', label: '列表' }, { label: '详情' }]}
      />,
    );

    const nav = screen.getByRole('navigation', { name: '面包屑' });
    expect(nav).toBeInTheDocument();
  });
});
