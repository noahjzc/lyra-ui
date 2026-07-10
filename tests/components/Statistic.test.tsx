import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Statistic } from '../../src/components/data-view';

describe('Statistic', () => {
  it('formats number with unit and trend text', () => {
    render(
      <Statistic
        description="较昨日"
        title="记录总数"
        trend={{ direction: 'up', value: '12.5%' }}
        unit="条"
        value={12876}
      />,
    );

    expect(screen.getByText('记录总数')).toBeInTheDocument();
    expect(screen.getByText('12,876')).toBeInTheDocument();
    expect(screen.getByText('条')).toBeInTheDocument();
    expect(
      screen.getByText('12.5%').closest('[data-slot="statistic-trend"]'),
    ).toHaveClass('text-ui-success');
  });

  it('supports formatter, precision, zero and empty text', () => {
    const { rerender } = render(
      <Statistic
        formatter={value => `¥${value}`}
        title="成交金额"
        value={326.48}
      />,
    );

    expect(screen.getByText('¥326.48')).toBeInTheDocument();

    rerender(<Statistic precision={2} title="转化率" value={18.4} />);

    expect(screen.getByText('18.40')).toBeInTheDocument();

    rerender(<Statistic title="真实零值" value={0} />);

    expect(screen.getByText('0')).toBeInTheDocument();

    rerender(
      <Statistic emptyText="暂无" precision={2} title="转化率" value={null} />,
    );

    expect(screen.getByText('暂无')).toBeInTheDocument();
  });

  it('renders loading skeleton with aria busy', () => {
    render(<Statistic loading title="待处理" value={12} />);

    expect(
      screen.getByText('待处理').closest('[data-slot="statistic"]'),
    ).toHaveAttribute('aria-busy', 'true');
    expect(
      document.querySelector('[data-slot="statistic-loading"]'),
    ).toBeInTheDocument();
  });

  it('renders card, compact and inline density variants', () => {
    const { rerender } = render(
      <Statistic title="本月成交额" value={12876} variant="card" />,
    );

    expect(
      screen.getByText('本月成交额').closest('[data-slot="statistic"]'),
    ).toHaveClass('rounded-lg', 'border', 'p-3');
    expect(
      screen.getByText('12,876').closest('[data-slot="statistic-value"]'),
    ).toHaveClass('text-2xl');

    rerender(
      <Statistic compact title="本月成交额" value={12876} variant="card" />,
    );

    expect(
      screen.getByText('12,876').closest('[data-slot="statistic-value"]'),
    ).toHaveClass('text-lg');

    rerender(
      <Statistic
        title="Inline 用于工具栏摘要"
        value="总数 1,248"
        variant="inline"
      />,
    );

    expect(
      screen
        .getByText('Inline 用于工具栏摘要')
        .closest('[data-slot="statistic"]'),
    ).toHaveClass('flex', 'items-center');
    expect(
      screen.getByText('总数 1,248').closest('[data-slot="statistic-value"]'),
    ).toHaveClass('text-base');
  });

  it('renders status text with semantic color and fallback empty value', () => {
    const { rerender } = render(
      <Statistic
        status="error"
        statusText="统计失败，可重试"
        title="回款率"
        value={null}
      />,
    );

    expect(
      screen.getByText('--').closest('[data-slot="statistic-value"]'),
    ).toHaveClass('text-ui-muted-foreground');
    expect(screen.getByText('统计失败，可重试')).toHaveClass(
      'text-ui-destructive',
    );

    rerender(
      <Statistic
        status="permission"
        statusText="无财务权限"
        title="毛利率"
        value={null}
      />,
    );

    expect(screen.getByText('--')).toBeInTheDocument();
    expect(screen.getByText('无财务权限')).toHaveClass(
      'text-ui-muted-foreground',
    );
  });

  it('supports warning trend, meta and extra content', () => {
    render(
      <Statistic
        extra={<button type="button">刷新</button>}
        meta="10 分钟前"
        status="stale"
        title="库存同步"
        trend={{ direction: 'warning', value: '延迟' }}
        value="v36"
      />,
    );

    expect(
      screen.getByText('延迟').closest('[data-slot="statistic-trend"]'),
    ).toHaveClass('text-ui-warning');
    expect(screen.getByText('10 分钟前')).toHaveAttribute(
      'data-slot',
      'statistic-meta',
    );
    expect(screen.getByRole('button', { name: '刷新' })).toBeInTheDocument();
  });
});
