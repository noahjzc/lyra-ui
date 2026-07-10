import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Empty } from '../../src/components/data-view';

describe('Empty', () => {
  it('renders default no-data copy', () => {
    render(<Empty />);

    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
    expect(screen.getByText('暂无数据')).toBeInTheDocument();
    expect(
      screen.getByText('当前区域还没有可展示的数据。'),
    ).toBeInTheDocument();
  });

  it('renders type-specific copy and compact style', () => {
    render(<Empty compact type="no-result" />);

    expect(screen.getByText('暂无匹配结果')).toBeInTheDocument();
    expect(screen.getByText('调整筛选条件后再试一次。')).toBeInTheDocument();
    expect(
      screen.getByText('暂无匹配结果').closest('[data-slot="empty"]'),
    ).toHaveClass('py-6');
  });

  it('supports custom title, hidden description and action', () => {
    render(
      <Empty
        action={<button type="button">重新加载</button>}
        description={null}
        title="加载失败"
        type="error-empty"
      />,
    );

    expect(screen.getByRole('alert')).toHaveAttribute('aria-live', 'assertive');
    expect(screen.getByText('加载失败')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '重新加载' }),
    ).toBeInTheDocument();
    expect(screen.queryByText('请稍后重试')).not.toBeInTheDocument();
  });
});
