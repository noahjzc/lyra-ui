import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Timeline } from '../../src/components/data-view';

describe('Timeline', () => {
  it('renders timeline items with list semantics', () => {
    render(
      <Timeline
        items={[
          {
            content: '客户资料已创建。',
            status: 'success',
            time: '10:24',
            title: '创建记录',
          },
        ]}
      />,
    );

    expect(screen.getByRole('list')).toHaveAttribute('data-slot', 'timeline');
    expect(screen.getByText('创建记录')).toHaveAttribute(
      'data-slot',
      'timeline-title',
    );
    expect(document.querySelector('[data-slot="timeline-dot"]')).toHaveClass(
      'bg-ui-success',
    );
  });

  it('supports clickable events and loading state', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <Timeline
        items={[{ onClick, time: '11:10', title: '查看详情' }]}
        loading
      />,
    );

    await user.click(screen.getByRole('button', { name: /查看详情/ }));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.getByText('加载更多')).toBeInTheDocument();
  });

  it('renders datetime, meta and link semantics', () => {
    render(
      <Timeline
        items={[
          {
            ariaLabel: '查看更新客户资料动态详情',
            content: '宋佳修改了联系方式。',
            dateTime: '2026-06-08T10:24',
            href: '/activity/1',
            meta: '操作人：宋佳',
            status: 'current',
            time: '今天 10:24',
            title: '客户资料已更新',
          },
        ]}
      />,
    );

    expect(screen.getByText('今天 10:24')).toHaveAttribute(
      'datetime',
      '2026-06-08T10:24',
    );
    expect(screen.getByText('操作人：宋佳')).toHaveAttribute(
      'data-slot',
      'timeline-meta',
    );
    expect(
      screen.getByRole('link', { name: '查看更新客户资料动态详情' }),
    ).toHaveAttribute('href', '/activity/1');
  });

  it('renders empty state when no items exist', () => {
    render(<Timeline items={[]} />);

    expect(screen.getByText('暂无数据')).toBeInTheDocument();
  });
});
