import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Tag } from '../../src/components/data-view';

describe('Tag', () => {
  it('maps semantic color and truncates long content by maxWidth', () => {
    render(
      <Tag color="success" maxWidth={120}>
        已启用客户标签
      </Tag>,
    );

    expect(screen.getByText('已启用客户标签').parentElement).toHaveClass(
      'text-ui-success',
    );
    expect(screen.getByText('已启用客户标签').parentElement).toHaveStyle({
      maxWidth: '120px',
    });
  });

  it('supports compact, middle and large sizes', () => {
    render(
      <>
        <Tag size="compact">紧凑</Tag>
        <Tag>默认</Tag>
        <Tag size="large">宽松</Tag>
      </>,
    );

    expect(screen.getByText('紧凑').parentElement).toHaveClass('h-[22px]');
    expect(screen.getByText('默认').parentElement).toHaveClass('h-6');
    expect(screen.getByText('宽松').parentElement).toHaveClass('h-7');
  });

  it('calls close without triggering parent click', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const onClose = vi.fn();

    render(
      <Tag closable onClick={onClick} onClose={onClose}>
        负责人 = 张明
      </Tag>,
    );

    await user.click(screen.getByRole('button', { name: '移除标签' }));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('uses controlled button semantics for checkable tags', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();

    render(
      <Tag checkable checked={false} onCheckedChange={onCheckedChange}>
        A 级客户
      </Tag>,
    );

    const tag = screen.getByRole('button', { name: 'A 级客户' });

    expect(tag).toHaveAttribute('aria-pressed', 'false');

    await user.click(tag);

    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('supports uncontrolled checkable tags', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();

    render(
      <Tag checkable defaultChecked onCheckedChange={onCheckedChange}>
        行业
      </Tag>,
    );

    const tag = screen.getByRole('button', { name: '行业' });

    expect(tag).toHaveAttribute('aria-pressed', 'true');

    await user.click(tag);

    expect(tag).toHaveAttribute('aria-pressed', 'false');
    expect(onCheckedChange).toHaveBeenCalledWith(false);
  });

  it('renders filter tag parts and removes with accessible label', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <Tag.Filter
        label="金额"
        onClose={onClose}
        operator="≥"
        value="¥30,000"
      />,
    );

    expect(screen.getByText('金额')).toHaveAttribute(
      'data-slot',
      'tag-filter-label',
    );
    expect(screen.getByText('≥')).toHaveAttribute(
      'data-slot',
      'tag-filter-operator',
    );
    expect(screen.getByText('¥30,000').parentElement).toHaveAttribute(
      'data-slot',
      'tag-filter-value',
    );

    await user.click(screen.getByRole('button', { name: '移除金额筛选' }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('supports disabled tags', () => {
    render(
      <>
        <Tag disabled>历史状态</Tag>
        <Tag.Filter disabled label="区域" value="华东" />
      </>,
    );

    expect(screen.getByText('历史状态').parentElement).toHaveAttribute(
      'aria-disabled',
      'true',
    );
    expect(screen.getByText('区域').parentElement).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });
});
