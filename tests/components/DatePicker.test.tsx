import '@testing-library/jest-dom/vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DatePicker, DateRangePicker } from '../../src/components/data-input';

describe('DatePicker', () => {
  it('selects a single date and closes the panel', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(<DatePicker onValueChange={onValueChange} value="2026-06-05" />);

    await user.click(screen.getByRole('button', { name: /2026-06-05/ }));
    await user.click(screen.getByRole('button', { name: /2026-06-08/ }));

    expect(onValueChange).toHaveBeenCalledWith('2026-06-08');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('selects a date range and keeps the panel until confirmed', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <DateRangePicker
        defaultValue={['2026-06-01', '2026-06-04']}
        onValueChange={onValueChange}
      />,
    );

    await user.click(
      screen.getByRole('button', { name: /2026-06-01.*2026-06-04/ }),
    );
    await user.click(
      within(screen.getByRole('dialog')).getByRole('button', {
        name: /^2026-06-01/,
      }),
    );
    await user.click(
      within(screen.getByRole('dialog')).getByRole('button', {
        name: /^2026-06-04/,
      }),
    );

    expect(onValueChange).toHaveBeenCalled();
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '确定' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('selects a date range across adjacent months', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <DateRangePicker
        defaultValue={['2026-06-30', '2026-07-04']}
        onValueChange={onValueChange}
      />,
    );

    await user.click(
      screen.getByRole('button', { name: /2026-06-30.*2026-07-04/ }),
    );
    await user.click(
      within(screen.getByRole('dialog')).getByRole('button', {
        name: /^2026-06-30/,
      }),
    );
    await user.click(
      within(screen.getByRole('dialog')).getByRole('button', {
        name: /^2026-07-04/,
      }),
    );

    expect(onValueChange).toHaveBeenLastCalledWith([
      '2026-06-30',
      '2026-07-04',
    ]);
  });

  it('keeps the two-month panel anchored after selecting a cross-month end date', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <DateRangePicker
        defaultValue={['2026-06-10', '2026-07-10']}
        onValueChange={onValueChange}
      />,
    );

    await user.click(
      screen.getByRole('button', { name: /2026-06-10.*2026-07-10/ }),
    );
    await user.click(
      within(screen.getByRole('dialog')).getByRole('button', {
        name: /^2026-06-10/,
      }),
    );
    await user.click(
      within(screen.getByRole('dialog')).getByRole('button', {
        name: /^2026-07-10/,
      }),
    );

    expect(onValueChange).toHaveBeenLastCalledWith([
      '2026-06-10',
      '2026-07-10',
    ]);

    const dialog = screen.getByRole('dialog');

    expect(within(dialog).getByText('2026 年 06 月')).toBeInTheDocument();
    expect(within(dialog).getByText('2026 年 07 月')).toBeInTheDocument();
    expect(within(dialog).queryByText('2026 年 08 月')).not.toBeInTheDocument();
  });

  it('applies range presets as real date values', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <DateRangePicker
        onValueChange={onValueChange}
        presets={[
          {
            label: '本周',
            value: ['2026-06-01', '2026-06-07'],
          },
        ]}
      />,
    );

    await user.click(screen.getByRole('button', { name: /开始日期/ }));
    await user.click(screen.getByRole('button', { name: '本周' }));

    expect(onValueChange).toHaveBeenCalledWith(['2026-06-01', '2026-06-07']);
    expect(screen.getByText('2026-06-01 → 2026-06-07')).toBeInTheDocument();
  });

  it('uses a shared two-month header for date ranges', async () => {
    const user = userEvent.setup();

    render(<DateRangePicker defaultValue={['2026-06-01', '2026-06-07']} />);

    await user.click(screen.getByRole('button', { name: /2026-06-01/ }));

    const dialog = screen.getByRole('dialog');

    expect(
      within(dialog).getByRole('button', { name: '上一年' }),
    ).toBeInTheDocument();
    expect(
      within(dialog).getByRole('button', { name: '上一个月' }),
    ).toBeInTheDocument();
    expect(
      within(dialog).getByRole('button', { name: '下一个月' }),
    ).toBeInTheDocument();
    expect(
      within(dialog).getByRole('button', { name: '下一年' }),
    ).toBeInTheDocument();
    expect(within(dialog).queryByText('开始')).not.toBeInTheDocument();
    expect(within(dialog).queryByText('结束')).not.toBeInTheDocument();

    await user.click(within(dialog).getByRole('button', { name: '上一个月' }));

    expect(within(dialog).getByText('2026 年 05 月')).toBeInTheDocument();
    expect(within(dialog).getByText('2026 年 06 月')).toBeInTheDocument();
  });

  it('supports month and year modes', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <DatePicker
        defaultValue="2026-06"
        mode="month"
        onValueChange={onValueChange}
      />,
    );

    await user.click(screen.getByRole('button', { name: /2026 年 06 月/ }));
    await user.click(screen.getByRole('button', { name: '2026 年 07 月' }));

    expect(onValueChange).toHaveBeenCalledWith('2026-07');
  });

  it('clears values when allowClear is enabled', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <DatePicker
        allowClear
        defaultValue="2026-06-05"
        onValueChange={onValueChange}
      />,
    );

    await user.click(screen.getByRole('button', { name: '清空日期' }));

    expect(onValueChange).toHaveBeenCalledWith(undefined);
    expect(
      document.body
        .querySelector('[data-slot="date-picker-trigger"]')
        ?.contains(document.querySelector('[data-slot="date-picker-clear"]')),
    ).toBe(false);
  });

  it('uses year and month panels as navigation before selecting a date', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <DatePicker defaultValue="2026-06-05" onValueChange={onValueChange} />,
    );

    await user.click(screen.getByRole('button', { name: /2026-06-05/ }));
    await user.click(screen.getByRole('button', { name: '2026 年' }));
    await user.click(screen.getByRole('button', { name: '2027' }));

    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: '2027 年' })).toBeInTheDocument();
  });

  it('syncs panel month when controlled value changes', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<DatePicker value="2026-06-05" />);

    rerender(<DatePicker value="2026-08-12" />);

    await user.click(screen.getByRole('button', { name: /2026-08-12/ }));

    expect(screen.getByRole('button', { name: '08 月' })).toBeInTheDocument();
  });

  it('resets navigated panel month to the selected value when reopened', async () => {
    const user = userEvent.setup();

    render(<DatePicker defaultValue="2026-06-06" />);

    await user.click(screen.getByRole('button', { name: /2026-06-06/ }));
    await user.click(screen.getByRole('button', { name: '2026 年' }));
    await user.click(screen.getByRole('button', { name: '2025' }));

    expect(screen.getByRole('button', { name: '2025 年' })).toBeInTheDocument();

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /2026-06-06/ }));

    expect(screen.getByRole('button', { name: '2026 年' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '06 月' })).toBeInTheDocument();
  });

  it('keeps disabled time visible but not selectable', async () => {
    const user = userEvent.setup();

    render(
      <DatePicker
        defaultValue="2026-06-05 10:24:00"
        disabledTime={(_, part, value) => part === 'hour' && value === 12}
        mode="dateTime"
      />,
    );

    await user.click(
      screen.getByRole('button', { name: /2026-06-05 10:24:00/ }),
    );

    expect(screen.getByRole('button', { name: '选择小时 12' })).toBeDisabled();
    expect(document.querySelectorAll('[data-slot="scroll-area"]')).toHaveLength(
      3,
    );
    expect(
      document.querySelector('[data-slot="scroll-area-viewport"]'),
    ).toHaveClass('snap-y', 'snap-mandatory', '[scrollbar-width:none]');
    expect(document.querySelector('[data-slot="time-option"]')).toHaveClass(
      'snap-start',
      '[scroll-snap-stop:always]',
      'last:border-b-0',
    );
    expect(
      document.querySelectorAll('[data-time-selected="true"]'),
    ).toHaveLength(3);
    expect(document.querySelector('[data-time-selected="true"]')).toHaveClass(
      'bg-(--ui-button-ghost-background)',
    );
    expect(
      document.querySelector('[data-time-selected="true"] span'),
    ).not.toHaveClass('bg-(--ui-button-ghost-background)');
  });

  it('shows loading and load error panel states', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    const { rerender } = render(<DatePicker loading />);

    await user.click(screen.getByRole('button', { name: '请选择日期' }));

    expect(screen.getByRole('status')).toHaveTextContent('正在加载可选日期');
    expect(screen.queryByRole('button', { name: /2026-06-05/ })).toBeNull();

    rerender(<DatePicker loadError="可选日期加载失败" onRetry={onRetry} />);

    expect(screen.getByRole('status')).toHaveTextContent('可选日期加载失败');

    await user.click(screen.getByRole('button', { name: '重试' }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('supports arrow key focus movement inside calendar cells', async () => {
    const user = userEvent.setup();

    render(<DatePicker defaultValue="2026-06-05" />);

    await user.click(screen.getByRole('button', { name: /2026-06-05/ }));

    const selectedDay = screen.getByRole('button', {
      name: '2026-06-05，已选择',
    });

    selectedDay.focus();
    await user.keyboard('{ArrowRight}');

    expect(screen.getByRole('button', { name: '2026-06-06' })).toHaveFocus();
  });
});
