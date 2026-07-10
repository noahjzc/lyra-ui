import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterAll, describe, expect, it, vi } from 'vitest';
import { Pagination } from '../../src/components/navigation';

const elementPrototype = HTMLElement.prototype as {
  hasPointerCapture?: (pointerId: number) => boolean;
};
const hasPointerCaptureWasOwn = Object.hasOwn(
  elementPrototype,
  'hasPointerCapture',
);
const hasPointerCaptureDescriptor = Object.getOwnPropertyDescriptor(
  elementPrototype,
  'hasPointerCapture',
);
const installedHasPointerCapture =
  typeof elementPrototype.hasPointerCapture !== 'function';

if (installedHasPointerCapture) {
  Object.defineProperty(elementPrototype, 'hasPointerCapture', {
    configurable: true,
    value: () => false,
  });
}

afterAll(() => {
  if (!installedHasPointerCapture) return;

  if (hasPointerCaptureWasOwn && hasPointerCaptureDescriptor != null) {
    Object.defineProperty(
      elementPrototype,
      'hasPointerCapture',
      hasPointerCaptureDescriptor,
    );
    return;
  }

  delete elementPrototype.hasPointerCapture;
});

describe('Pagination', () => {
  it('disables previous on first page and calls next page change', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(
      <Pagination
        onPageChange={onPageChange}
        page={1}
        pageSize={10}
        total={35}
      />,
    );

    expect(
      screen.getByRole('navigation', { name: '分页' }),
    ).toBeInTheDocument();
    expect(screen.getByText('共 35 条')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '第 1 页' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByRole('button', { name: '上一页' })).toBeDisabled();

    await user.click(screen.getByRole('button', { name: '下一页' }));

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('disables next on last page', () => {
    render(
      <Pagination onPageChange={vi.fn()} page={4} pageSize={10} total={35} />,
    );

    expect(screen.getByRole('button', { name: '下一页' })).toBeDisabled();
  });

  it('calls page size change from page size selector', async () => {
    const user = userEvent.setup();
    const onPageSizeChange = vi.fn();

    render(
      <Pagination
        onPageChange={vi.fn()}
        onPageSizeChange={onPageSizeChange}
        page={1}
        pageSize={10}
        pageSizeOptions={[10, 20]}
        total={35}
      />,
    );

    await user.click(screen.getByRole('combobox', { name: '每页条数' }));
    await user.click(screen.getByRole('option', { name: '20 条/页' }));

    expect(onPageSizeChange).toHaveBeenCalledWith(20);
  });

  it('keeps the page size label on a single horizontal line', () => {
    render(
      <Pagination onChange={vi.fn()} page={1} pageSize={10} total={128} />,
    );

    const pageSizeLabel = screen.getByText('每页');

    expect(pageSizeLabel).toHaveClass('whitespace-nowrap', 'shrink-0');
    expect(pageSizeLabel.parentElement).toHaveClass(
      'whitespace-nowrap',
      'shrink-0',
    );
  });

  it('supports current/onChange and compact mode', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <Pagination
        compact
        current={2}
        onChange={onChange}
        pageSize={10}
        total={35}
      />,
    );

    expect(screen.getByText('第 2 / 4 页')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '第 2 页' })).toHaveAttribute(
      'aria-current',
      'page',
    );

    await user.click(screen.getByRole('button', { name: '下一页' }));

    expect(onChange).toHaveBeenCalledWith(3, 10);
  });

  it('hides total and page size controls in compact mode', () => {
    render(
      <Pagination
        compact
        current={2}
        onChange={vi.fn()}
        pageSize={10}
        total={35}
      />,
    );

    expect(screen.queryByText('共 35 条')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('combobox', { name: '每页条数' }),
    ).not.toBeInTheDocument();
    expect(screen.getByText('第 2 / 4 页')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '第 2 页' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it('uses pagination item styles instead of primary button styles', () => {
    render(
      <Pagination current={2} onChange={vi.fn()} pageSize={10} total={35} />,
    );

    const currentPage = screen.getByRole('button', { name: '第 2 页' });
    const defaultPage = screen.getByRole('button', { name: '第 1 页' });

    expect(currentPage).toHaveAttribute('data-slot', 'pagination-page-item');
    expect(currentPage).toHaveClass('bg-(--ui-button-ghost-background)');
    expect(currentPage).not.toHaveClass('bg-(--ui-button-primary-background)');
    expect(defaultPage).toHaveClass('bg-(--ui-button-default-background)');
  });

  it('supports simple mode for compact log lists', () => {
    render(
      <Pagination
        current={1}
        onChange={vi.fn()}
        pageSize={10}
        total={25}
        variant="simple"
      />,
    );

    expect(screen.getByText('1 / 3')).toHaveAttribute('aria-current', 'page');
    expect(
      screen.queryByRole('button', { name: '第 1 页' }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText('共 25 条')).not.toBeInTheDocument();
  });

  it('jumps to a clamped target page with the jumper', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <Pagination
        current={3}
        onChange={onChange}
        pageSize={10}
        showJumper
        total={120}
      />,
    );

    await user.clear(screen.getByRole('spinbutton', { name: '跳转页码' }));
    await user.type(screen.getByRole('spinbutton', { name: '跳转页码' }), '99');
    await user.keyboard('{Enter}');

    expect(onChange).toHaveBeenCalledWith(12, 10);
  });

  it('keeps page size selector and jumper as separate layout blocks', () => {
    render(
      <Pagination
        current={13}
        onChange={vi.fn()}
        pageSize={20}
        showJumper
        total={1248}
      />,
    );

    const pageSizeTrigger = screen.getByRole('combobox', {
      name: '每页条数',
    });
    const jumperInput = screen.getByRole('spinbutton', { name: '跳转页码' });

    expect(pageSizeTrigger).toHaveClass(
      'w-[104px]',
      'min-w-[104px]',
      'shrink-0',
    );
    expect(jumperInput.parentElement).toHaveClass(
      'shrink-0',
      'whitespace-nowrap',
    );
  });

  it('supports optional quick jump buttons for large datasets', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <Pagination
        current={13}
        onChange={onChange}
        pageSize={20}
        showQuickJump
        total={1248}
      />,
    );

    await user.click(screen.getByRole('button', { name: '向前 5 页' }));
    await user.click(screen.getByRole('button', { name: '向后 5 页' }));

    expect(onChange).toHaveBeenNthCalledWith(1, 8, 20);
    expect(onChange).toHaveBeenNthCalledWith(2, 18, 20);
  });

  it('keeps structure and disables interactions while loading', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <Pagination
        current={4}
        loading
        onChange={onChange}
        pageSize={10}
        showJumper
        total={85}
      />,
    );

    expect(screen.getByRole('navigation', { name: '分页' })).toHaveAttribute(
      'aria-busy',
      'true',
    );
    expect(screen.getByText('共 85 条')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '第 4 页' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByRole('button', { name: '下一页' })).toBeDisabled();
    expect(screen.getByRole('spinbutton', { name: '跳转页码' })).toBeDisabled();

    await user.click(screen.getByRole('button', { name: '第 5 页' }));

    expect(onChange).not.toHaveBeenCalled();
  });
});
