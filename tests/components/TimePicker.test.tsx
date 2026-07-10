import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TimePicker, TimeRangePicker } from '../../src/components/data-input';

describe('TimePicker', () => {
  it('selects hour and minute values before confirm', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <TimePicker
        defaultValue="10:24"
        minuteStep={15}
        onValueChange={onValueChange}
      />,
    );

    await user.click(screen.getByRole('button', { name: /10:24/ }));
    await user.click(screen.getByRole('button', { name: '选择小时 11' }));
    await user.click(screen.getByRole('button', { name: '选择分钟 30' }));

    expect(onValueChange).toHaveBeenLastCalledWith('11:30');
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '确定' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('supports second precision', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <TimePicker
        defaultValue="10:24:36"
        format="HH:mm:ss"
        onValueChange={onValueChange}
      />,
    );

    await user.click(screen.getByRole('button', { name: /10:24:36/ }));
    await user.click(screen.getByRole('button', { name: '选择秒 45' }));

    expect(onValueChange).toHaveBeenCalledWith('10:24:45');
    expect(
      document.querySelectorAll('[data-time-selected="true"]'),
    ).toHaveLength(3);
  });

  it('clears values when allowClear is enabled', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <TimePicker
        allowClear
        defaultValue="10:24"
        onValueChange={onValueChange}
      />,
    );

    await user.click(screen.getByRole('button', { name: '清空时间' }));

    expect(onValueChange).toHaveBeenCalledWith(undefined);
  });

  it('selects range start and end values in one trigger', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <TimeRangePicker
        defaultValue={['09:00', '18:00']}
        onValueChange={onValueChange}
      />,
    );

    await user.click(screen.getByRole('button', { name: /09:00/ }));
    await user.click(screen.getByRole('button', { name: '选择小时 10' }));

    expect(onValueChange).toHaveBeenLastCalledWith(['10:00', '18:00']);

    await user.click(screen.getByRole('button', { name: /结束/ }));
    await user.click(screen.getByRole('button', { name: '选择分钟 30' }));

    expect(onValueChange).toHaveBeenLastCalledWith(['10:00', '18:30']);
  });

  it('keeps disabled time options visible but not selectable', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <TimePicker
        defaultValue="10:24"
        disabledTime={(unit, value) => unit === 'hour' && value === 12}
        onValueChange={onValueChange}
      />,
    );

    await user.click(screen.getByRole('button', { name: /10:24/ }));

    expect(screen.getByRole('button', { name: '选择小时 12' })).toBeDisabled();
    expect(document.querySelectorAll('[data-slot="scroll-area"]')).toHaveLength(
      2,
    );
    expect(
      document.querySelectorAll('[data-time-selected="true"]'),
    ).toHaveLength(2);
  });

  it('shows loading and load error panel states', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    const { rerender } = render(<TimePicker loading />);

    await user.click(screen.getByRole('button', { name: '请选择时间' }));

    expect(screen.getByRole('status')).toHaveTextContent('正在加载可选时间');
    expect(screen.queryByRole('button', { name: '选择小时 00' })).toBeNull();

    rerender(<TimePicker loadError="可选时间加载失败" onRetry={onRetry} />);

    expect(screen.getByRole('status')).toHaveTextContent('可选时间加载失败');

    await user.click(screen.getByRole('button', { name: '重试' }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
