import '@testing-library/jest-dom/vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { StepItem } from '../../src/components/navigation';
import { Steps } from '../../src/components/navigation';

const importItems: StepItem[] = [
  { description: 'license.xlsx', title: '上传文件' },
  { description: '12 个字段已匹配', title: '字段映射' },
  {
    description: '3 行缺少手机号',
    status: 'error',
    title: '数据校验',
  },
  { description: '修正后可继续', disabled: true, title: '确认导入' },
  { description: '未开始', title: '导入结果' },
];

describe('Steps', () => {
  it('renders ordered steps with orientation and variant metadata', () => {
    render(
      <Steps
        aria-label="客户导入流程"
        current={2}
        items={importItems}
        variant="default"
      />,
    );

    const list = screen.getByRole('list', { name: '客户导入流程' });
    expect(list).toHaveAttribute('data-slot', 'steps');
    expect(list).toHaveAttribute('data-orientation', 'horizontal');
    expect(list).toHaveAttribute('data-variant', 'default');
    expect(within(list).getAllByRole('listitem')).toHaveLength(5);
  });

  it('resolves finish, current, wait, explicit error, and disabled states', () => {
    render(<Steps current={1} items={importItems} />);

    expect(screen.getByText('上传文件').closest('li')).toHaveAttribute(
      'data-status',
      'finish',
    );
    expect(screen.getByText('字段映射').closest('li')).toHaveAttribute(
      'data-status',
      'process',
    );
    expect(screen.getByText('数据校验').closest('li')).toHaveAttribute(
      'data-status',
      'error',
    );
    expect(screen.getByText('确认导入').closest('li')).toHaveAttribute(
      'data-status',
      'wait',
    );
    expect(screen.getByText('确认导入').closest('li')).toHaveAttribute(
      'data-disabled',
      'true',
    );
  });

  it('marks the clamped current step with aria-current', () => {
    render(<Steps current={99} items={importItems} />);

    expect(screen.getByText('导入结果').closest('li')).toHaveAttribute(
      'aria-current',
      'step',
    );
  });

  it('provides readable status text for assistive technology', () => {
    render(<Steps current={2} items={importItems} />);

    const uploadStep = screen.getByText('上传文件').closest('li');

    expect(uploadStep).not.toBeNull();
    expect(within(uploadStep as HTMLElement).getByText('已完成')).toHaveClass(
      'sr-only',
    );
    expect(screen.getByText('错误')).toHaveClass('sr-only');
    expect(screen.getByText(/已禁用/)).toHaveClass('sr-only');
  });

  it('allows clicking finished and current steps only when clickable', async () => {
    const user = userEvent.setup();
    const onCurrentChange = vi.fn();

    render(
      <Steps
        clickable
        current={2}
        items={importItems}
        onCurrentChange={onCurrentChange}
      />,
    );

    await user.click(screen.getByRole('button', { name: /字段映射/ }));
    await user.click(screen.getByRole('button', { name: /数据校验/ }));

    expect(onCurrentChange).toHaveBeenNthCalledWith(1, 1);
    expect(onCurrentChange).toHaveBeenNthCalledWith(2, 2);
    expect(
      screen.queryByRole('button', { name: /确认导入/ }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /导入结果/ }),
    ).not.toBeInTheDocument();
  });

  it('does not render descriptions in compact or progress variants', () => {
    const { rerender } = render(
      <Steps current={2} items={importItems} variant="compact" />,
    );

    expect(screen.queryByText('license.xlsx')).not.toBeInTheDocument();

    rerender(<Steps current={2} items={importItems} variant="progress" />);

    expect(screen.queryByText('12 个字段已匹配')).not.toBeInTheDocument();
  });

  it('supports vertical layout and empty items', () => {
    const { rerender } = render(
      <Steps current={1} items={importItems} orientation="vertical" />,
    );

    expect(screen.getByRole('list')).toHaveAttribute(
      'data-orientation',
      'vertical',
    );

    rerender(<Steps aria-label="空流程" items={[]} />);

    expect(screen.getByRole('list', { name: '空流程' })).toBeEmptyDOMElement();
  });

  it('spans item content across the parent layout grid', () => {
    const { rerender } = render(
      <Steps current={1} items={importItems} orientation="vertical" />,
    );

    expect(screen.getByText('字段映射').closest('div')).toHaveClass(
      'col-span-full',
    );

    rerender(
      <Steps
        clickable
        current={2}
        items={importItems}
        orientation="vertical"
      />,
    );

    expect(screen.getByRole('button', { name: /字段映射/ })).toHaveClass(
      'col-span-full',
    );
  });
});
