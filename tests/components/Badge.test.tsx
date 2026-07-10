import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Badge } from '../../src/components/data-view';

describe('Badge', () => {
  it('renders standalone text badge with muted neutral style', () => {
    render(
      <>
        <Badge>默认</Badge>
        <Badge variant="neutral">中性</Badge>
      </>,
    );

    expect(screen.getByText('默认')).toHaveClass(
      'bg-ui-muted',
      'text-ui-foreground',
    );
    expect(screen.getByText('中性')).toHaveClass(
      'bg-ui-muted',
      'text-ui-foreground',
    );
  });

  it('maps semantic standalone variants to token classes', () => {
    render(
      <>
        <Badge variant="success">成功</Badge>
        <Badge variant="warning">警告</Badge>
        <Badge variant="destructive">危险</Badge>
      </>,
    );

    expect(screen.getByText('成功')).toHaveClass(
      'bg-ui-success/10',
      'text-ui-success',
    );
    expect(screen.getByText('警告')).toHaveClass(
      'bg-ui-warning/10',
      'text-ui-warning',
    );
    expect(screen.getByText('危险')).toHaveClass(
      'bg-ui-destructive/10',
      'text-ui-destructive',
    );
  });

  it('formats count with overflow and hides zero by default', () => {
    const { rerender } = render(<Badge count={120} overflowCount={99} />);

    expect(screen.getByText('99+')).toHaveAttribute('data-slot', 'badge-count');
    expect(screen.getByText('99+')).toHaveClass('min-h-[18px]');

    rerender(<Badge count={0} />);

    expect(screen.queryByText('0')).not.toBeInTheDocument();

    rerender(<Badge count={0} showZero variant="muted" />);

    expect(screen.getByText('0')).toHaveClass('bg-ui-muted-foreground');
  });

  it('attaches suffix count to text anchor without covering content', () => {
    render(
      <Badge count={6} placement="suffix">
        <button aria-label="消息，6 条未读" type="button">
          消息
        </button>
      </Badge>,
    );

    expect(
      screen.getByRole('button', { name: '消息，6 条未读' }),
    ).toBeInTheDocument();
    expect(screen.getByText('6')).toHaveClass(
      'static',
      'translate-x-0',
      'translate-y-0',
    );
    expect(screen.getByText('6')).toHaveAttribute('aria-hidden', 'true');
  });

  it('attaches corner dot to fixed-size anchor as decorative content', () => {
    render(
      <Badge dot offset={[2, -1]} variant="info">
        <button aria-label="通知中心，有新消息" type="button">
          铃
        </button>
      </Badge>,
    );

    const dot = screen.getByRole('button', {
      name: '通知中心，有新消息',
    }).nextElementSibling;

    expect(dot).toHaveAttribute('data-slot', 'badge-dot');
    expect(dot).toHaveAttribute('aria-hidden', 'true');
    expect(dot).toHaveClass(
      'absolute',
      'right-1',
      'top-1',
      'bg-(--ui-button-primary-background)',
    );
    expect(dot).toHaveStyle({
      transform: 'translate(2px, -1px)',
    });
  });

  it('renders status dot with text', () => {
    render(<Badge status="success">在线</Badge>);

    const status = screen.getByText('在线');
    const dot = status.querySelector('[data-slot="badge-dot"]');

    expect(status).toHaveAttribute('data-slot', 'badge-status');
    expect(status).toHaveClass('gap-1.5');
    expect(dot).toHaveAttribute('data-slot', 'badge-dot');
    expect(dot).toHaveClass('bg-ui-success');
  });

  it('exposes Count and Dot subcomponents', () => {
    render(
      <>
        <Badge.Count count={120} overflowCount={99} size="md" />
        <Badge.Dot aria-label="有新提醒" size="sm" variant="warning" />
      </>,
    );

    expect(screen.getByText('99+')).toHaveClass(
      'min-h-5',
      'min-w-6',
      'bg-ui-destructive',
    );
    expect(screen.getByLabelText('有新提醒')).toHaveClass(
      'size-2.5',
      'bg-ui-warning',
    );
  });
});
