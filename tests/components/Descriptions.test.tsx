import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
  Description,
  type DescriptionItem,
  Descriptions,
} from '../../src/components/data-view';

describe('Descriptions', () => {
  it('renders labels, values and empty text', () => {
    render(
      <Descriptions
        items={[
          { label: '负责人', value: '张明' },
          { label: '备注', value: null },
        ]}
      />,
    );

    expect(screen.getByText('负责人')).toBeInTheDocument();
    expect(screen.getByText('张明')).toBeInTheDocument();
    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('supports Description alias', () => {
    render(
      <Description items={[{ label: '客户编号', value: 'CU-2026-0187' }]} />,
    );

    expect(screen.getByText('客户编号')).toBeInTheDocument();
    expect(screen.getByText('CU-2026-0187')).toBeInTheDocument();
  });

  it('copies copyable values', async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    const onCopy = vi.fn();

    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });

    render(
      <Descriptions
        items={[{ copyable: true, label: '记录 ID', value: 'CRM-1' }]}
        onCopy={onCopy}
      />,
    );

    await user.click(screen.getByRole('button', { name: '复制记录 ID' }));

    expect(writeText).toHaveBeenCalledWith('CRM-1');
    expect(onCopy).toHaveBeenCalledWith(
      'CRM-1',
      expect.objectContaining({ label: '记录 ID' }),
    );
  });

  it('supports custom copy text and label', async () => {
    const user = userEvent.setup();
    const onCopy = vi.fn();
    const item: DescriptionItem = {
      copyable: { label: '复制完整税号', text: '913300001234567890' },
      label: '税号',
      value: '9133**********90',
    };

    render(<Descriptions items={[item]} onCopy={onCopy} />);

    await user.click(screen.getByRole('button', { name: '复制完整税号' }));

    expect(onCopy).toHaveBeenCalledWith('913300001234567890', item);
  });

  it('supports bordered layout, columns and span', () => {
    const { container } = render(
      <Descriptions
        bordered
        columns={4}
        items={[{ label: '地址', span: 'full', value: '上海' }]}
      />,
    );

    expect(container.querySelector('[data-slot="descriptions"]')).toHaveClass(
      'border',
      'content-start',
      'min-[1180px]:grid-cols-4',
    );
    expect(
      container.querySelector('[data-slot="description-item"]'),
    ).toHaveClass('col-span-full', 'content-start');
  });

  it('supports inline compact layout and wrapping values', () => {
    const { container } = render(
      <Descriptions
        compact
        items={[
          {
            label: '备注',
            value: '客户要求每月 25 日前完成账单确认。',
            wrap: true,
          },
        ]}
        layout="inline"
      />,
    );

    expect(container.querySelector('[data-layout="inline"]')).toHaveClass(
      'flex',
    );
    expect(screen.getByText('客户要求每月 25 日前完成账单确认。')).toHaveClass(
      'whitespace-normal',
    );
  });

  it('supports item-level empty text', () => {
    render(
      <Descriptions
        emptyText="暂无"
        items={[{ emptyText: '无权限', label: '税号', value: null }]}
      />,
    );

    expect(screen.getByText('无权限')).toBeInTheDocument();
    expect(screen.queryByText('暂无')).not.toBeInTheDocument();
  });
});
