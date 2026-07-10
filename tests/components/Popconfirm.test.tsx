import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Popconfirm } from '../../src/components/feedback';

describe('Popconfirm', () => {
  it('confirms a light destructive action from a popover layer', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();

    render(
      <Popconfirm
        description="该客户仍保留操作记录，可稍后恢复。"
        onConfirm={onConfirm}
        title="确认移入回收站？"
        trigger={<button type="button">删除</button>}
        variant="danger"
      />,
    );

    await user.click(screen.getByRole('button', { name: '删除' }));

    const dialog = screen.getByRole('dialog', { name: '确认移入回收站？' });

    expect(dialog).toHaveAttribute('data-slot', 'popconfirm-content');
    expect(dialog).toHaveAttribute('role', 'dialog');
    expect(dialog).not.toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveClass(
      'data-[state=open]:animate-ui-layer-in',
      'data-[state=closed]:animate-ui-layer-out',
    );
    expect(dialog).not.toHaveClass('shadow-ui-elevation-4');
    expect(dialog.style.filter).toContain('drop-shadow(');
    expect(Number.isFinite(Number(dialog.style.zIndex))).toBe(true);
    expect(
      screen.getByText('该客户仍保留操作记录，可稍后恢复。'),
    ).toHaveAttribute('data-slot', 'popconfirm-description');
    expect(screen.getByText('确认移入回收站？')).toHaveAttribute(
      'data-slot',
      'popconfirm-title',
    );
    expect(
      document.querySelector('[data-slot="popconfirm-footer"]'),
    ).toBeInTheDocument();
    const arrow = document.querySelector('[data-slot="popconfirm-arrow"]');
    const arrowFill = arrow?.querySelector(
      '[data-slot="popconfirm-arrow-fill"]',
    );
    const arrowStroke = arrow?.querySelector(
      '[data-slot="popconfirm-arrow-stroke"]',
    );

    expect(arrow).toHaveAttribute('width', '16');
    expect(arrow).toHaveAttribute('height', '8');
    expect(arrowFill).toHaveAttribute('d', 'M0 -1 H16 V0 L8 8 L0 0 Z');
    expect(arrowFill).toHaveClass('fill-(--ui-background)');
    expect(arrowStroke).toHaveAttribute('d', 'M0 0 L8 8 L16 0');
    expect(arrowStroke).toHaveAttribute('fill', 'none');
    expect(arrowStroke).toHaveClass('stroke-(--ui-border)');
    expect(screen.getByRole('button', { name: '确认' })).toHaveClass(
      'border-(--ui-button-danger-border)',
    );

    await user.click(screen.getByRole('button', { name: '确认' }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('cancels and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();

    render(
      <Popconfirm
        description="本次操作不会保存未提交更改。"
        onCancel={onCancel}
        title="放弃编辑？"
        trigger={<button type="button">放弃</button>}
      />,
    );

    const trigger = screen.getByRole('button', { name: '放弃' });
    await user.click(trigger);

    expect(
      screen.getByRole('dialog', { name: '放弃编辑？' }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '取消' }));

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(
      screen.queryByRole('dialog', { name: '放弃编辑？' }),
    ).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('can hide the arrow for compact destructive controls', async () => {
    const user = userEvent.setup();

    render(
      <Popconfirm
        showArrow={false}
        title="确认归档？"
        trigger={<button type="button">归档</button>}
      />,
    );

    await user.click(screen.getByRole('button', { name: '归档' }));

    expect(
      screen.getByRole('dialog', { name: '确认归档？' }),
    ).toBeInTheDocument();
    expect(document.querySelector('[data-slot="popconfirm-arrow"]')).toBeNull();
  });

  it('maps AntD-style placement and arrow config to Radix positioning', async () => {
    const user = userEvent.setup();

    render(
      <Popconfirm
        arrow={{ pointAtCenter: true }}
        placement="bottomRight"
        title="确认提交？"
        trigger={<button type="button">提交</button>}
      />,
    );

    await user.click(screen.getByRole('button', { name: '提交' }));

    const dialog = screen.getByRole('dialog', { name: '确认提交？' });
    const arrow = document.querySelector('[data-slot="popconfirm-arrow"]');

    expect(dialog).toHaveAttribute('data-side', 'bottom');
    expect(dialog).toHaveAttribute('data-align', 'end');
    expect(arrow).toBeInTheDocument();
    expect(arrow).toHaveAttribute('data-point-at-center', 'true');
  });
});
