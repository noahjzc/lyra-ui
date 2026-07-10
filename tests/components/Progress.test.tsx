import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Progress } from '../../src/components/feedback';

describe('Progress', () => {
  it('renders line progress with aria values and accessible label', () => {
    render(<Progress label="导入进度 78%" status="active" value={78} />);

    const progress = screen.getByRole('progressbar', {
      name: '导入进度 78%',
    });

    expect(progress).toHaveAttribute('aria-valuenow', '78');
    expect(progress).toHaveAttribute('aria-valuemin', '0');
    expect(progress).toHaveAttribute('aria-valuemax', '100');
    expect(screen.getByText('导入进度 78%')).toHaveAttribute(
      'data-slot',
      'progress-label',
    );
    expect(
      document.querySelector('[data-slot="progress-indicator"]'),
    ).toHaveStyle({
      transform: 'translateX(-22%)',
    });
  });

  it('clamps value into the declared range', () => {
    const { rerender } = render(
      <Progress aria-label="超出范围进度" max={80} value={120} />,
    );

    expect(
      screen.getByRole('progressbar', { name: '超出范围进度' }),
    ).toHaveAttribute('aria-valuenow', '80');
    expect(
      document.querySelector('[data-slot="progress-indicator"]'),
    ).toHaveStyle({
      transform: 'translateX(0%)',
    });

    rerender(<Progress aria-label="负数进度" max={80} value={-10} />);

    expect(
      screen.getByRole('progressbar', { name: '负数进度' }),
    ).toHaveAttribute('aria-valuenow', '0');
    expect(
      document.querySelector('[data-slot="progress-indicator"]'),
    ).toHaveStyle({
      transform: 'translateX(-100%)',
    });
  });

  it('keeps a truthful zero range when max is zero', () => {
    render(<Progress aria-label="零范围进度" max={0} value={50} />);

    expect(
      screen.getByRole('progressbar', { name: '零范围进度' }),
    ).toHaveAttribute('aria-valuemax', '0');
    expect(
      screen.getByRole('progressbar', { name: '零范围进度' }),
    ).toHaveAttribute('aria-valuenow', '0');
    expect(
      document.querySelector('[data-slot="progress-label"]'),
    ).toHaveTextContent('0%');
    expect(
      document.querySelector('[data-slot="progress-indicator"]'),
    ).toHaveStyle({
      transform: 'translateX(-100%)',
    });
  });

  it('renders status text and steps variant', () => {
    const { rerender } = render(
      <Progress label="合同同步完成" status="success" value={100} />,
    );

    expect(screen.getByText('完成')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="progress-status"]')).toHaveClass(
      'text-ui-success',
    );

    rerender(
      <Progress label="导入步骤" steps={4} value={50} variant="steps" />,
    );

    expect(document.querySelector('[data-slot="progress-track"]')).toBeTruthy();
    expect(
      document.querySelectorAll('[data-slot="progress-indicator"]'),
    ).toHaveLength(2);
    expect(
      document.querySelectorAll('[data-slot="progress-step"]'),
    ).toHaveLength(4);
    expect(
      document.querySelectorAll(
        '[data-slot="progress-step"][data-active="true"]',
      ),
    ).toHaveLength(2);
  });

  it('normalizes fractional steps before rendering active steps', () => {
    render(<Progress steps={3.8} value={50} variant="steps" />);

    expect(
      document.querySelectorAll('[data-slot="progress-step"]'),
    ).toHaveLength(3);
    expect(
      document.querySelectorAll(
        '[data-slot="progress-step"][data-active="true"]',
      ),
    ).toHaveLength(2);
  });

  it('normalizes invalid steps to the minimum renderable count', () => {
    render(<Progress steps={Number.NaN} value={100} variant="steps" />);

    expect(
      document.querySelectorAll('[data-slot="progress-step"]'),
    ).toHaveLength(1);
    expect(
      document.querySelectorAll(
        '[data-slot="progress-step"][data-active="true"]',
      ),
    ).toHaveLength(1);
  });

  it('renders circle variant without an extra dependency', () => {
    render(<Progress label="线索清洗" value={72} variant="circle" />);

    expect(
      screen.getByRole('progressbar', { name: '线索清洗' }),
    ).toHaveTextContent('72%');
    expect(
      document.querySelector('[data-slot="progress-indicator"]'),
    ).toHaveAttribute('stroke', 'var(--ui-button-primary-background)');
    expect(document.querySelector('[data-slot="progress-track"]')).toBeTruthy();
    expect(screen.getByText('72%')).toHaveAttribute(
      'data-slot',
      'progress-status',
    );
  });

  it('uses aria-label when the visible label is hidden', () => {
    render(<Progress aria-label="后台同步进度" showLabel={false} value={42} />);

    expect(
      screen.getByRole('progressbar', { name: '后台同步进度' }),
    ).toHaveAttribute('aria-valuenow', '42');
    expect(document.querySelector('[data-slot="progress-label"]')).toBeNull();
  });
});
