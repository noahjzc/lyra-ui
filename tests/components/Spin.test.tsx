import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Spin } from '../../src/components/feedback';

describe('Spin', () => {
  it('renders active status with polite live region and reduced motion class', () => {
    render(<Spin label="客户资料加载中" size="md" />);

    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
    expect(screen.getByText('客户资料加载中')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="spin-indicator"]')).toHaveClass(
      'motion-reduce:animate-none',
    );
  });

  it('applies size classes to the indicator', () => {
    const { rerender } = render(<Spin label="小尺寸" size="sm" />);

    expect(document.querySelector('[data-slot="spin-indicator"]')).toHaveClass(
      'size-4',
    );

    rerender(<Spin label="大尺寸" size="lg" />);

    expect(document.querySelector('[data-slot="spin-indicator"]')).toHaveClass(
      'size-8',
    );
  });

  it('marks wrapped content busy and renders local overlay mask', () => {
    render(
      <Spin overlay label="客户列表刷新中">
        <div>客户列表</div>
      </Spin>,
    );

    expect(screen.getByText('客户列表')).toBeInTheDocument();
    expect(
      document.querySelector('[data-slot="spin-content"]'),
    ).toHaveAttribute('aria-busy', 'true');
    expect(
      document.querySelector('[data-slot="spin-container"]'),
    ).not.toHaveAttribute('aria-busy');
    expect(
      document.querySelector('[data-slot="spin-mask"]'),
    ).toBeInTheDocument();
  });

  it('keeps live status outside the busy content subtree', () => {
    render(
      <Spin label="客户列表刷新中">
        <div>客户列表</div>
      </Spin>,
    );

    const busyElements = document.querySelectorAll('[aria-busy="true"]');
    const status = screen.getByRole('status');
    const busyContent = busyElements[0];

    expect(status).not.toHaveAttribute('aria-busy');
    expect(busyElements).toHaveLength(1);
    expect(busyContent).toHaveAttribute('data-slot', 'spin-content');
    expect(busyContent).not.toContainElement(status);
  });

  it('supports inline mode next to content', () => {
    render(
      <Spin label="字段校验中" overlay={false}>
        <div>客户名称</div>
      </Spin>,
    );

    expect(screen.getByText('客户名称')).toBeInTheDocument();
    expect(
      document.querySelector('[data-slot="spin-mask"]'),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveAttribute('data-slot', 'spin');
  });

  it('hides active status when spinning is false', () => {
    render(<Spin label="加载中" spinning={false} />);

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
