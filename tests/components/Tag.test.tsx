import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
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

  it('forwards public attributes, keyboard handlers and refs for both tag elements', () => {
    const onKeyDown = vi.fn();
    const interactiveRef = createRef<HTMLButtonElement | HTMLSpanElement>();
    const staticRef = createRef<HTMLButtonElement | HTMLSpanElement>();

    render(
      <>
        <Tag
          aria-label="客户等级"
          checkable
          data-owner="sales"
          id="customer-tier"
          onKeyDown={onKeyDown}
          ref={interactiveRef}
        >
          A 级客户
        </Tag>
        <Tag aria-label="静态标签" data-owner="crm" ref={staticRef}>
          历史状态
        </Tag>
      </>,
    );

    const interactiveTag = screen.getByRole('button', { name: '客户等级' });
    const staticTag = screen.getByLabelText('静态标签');

    expect(interactiveTag).toHaveAttribute('data-owner', 'sales');
    expect(interactiveTag).toHaveAttribute('id', 'customer-tier');
    fireEvent.keyDown(interactiveTag, { key: 'Enter' });
    expect(onKeyDown).toHaveBeenCalledTimes(1);
    expect(interactiveRef.current).toBe(interactiveTag);
    expect(interactiveRef.current).toBeInstanceOf(HTMLButtonElement);

    expect(staticTag).toHaveAttribute('data-owner', 'crm');
    expect(staticRef.current).toBe(staticTag);
    expect(staticRef.current).toBeInstanceOf(HTMLSpanElement);
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
