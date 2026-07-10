import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Switch, SwitchField } from '../../src/components/data-input';

describe('Switch', () => {
  it('handles checked changes', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();

    render(<Switch aria-label="开启提醒" onCheckedChange={onCheckedChange} />);

    await user.click(screen.getByRole('switch', { name: '开启提醒' }));

    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole('switch', { name: '开启提醒' })).toBeChecked();
  });

  it('toggles when the field label is clicked', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();

    render(<SwitchField label="自动刷新" onCheckedChange={onCheckedChange} />);

    await user.click(screen.getByText('自动刷新'));

    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(onCheckedChange).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('switch', { name: '自动刷新' })).toBeChecked();
  });

  it('marks uncontrolled checked card fields as selected', () => {
    render(<SwitchField card defaultChecked label="默认启用" />);

    expect(
      screen
        .getByRole('switch', { name: '默认启用' })
        .closest('[data-slot="switch-field"]'),
    ).toHaveAttribute('data-checked', 'true');
  });

  it('does not update while loading', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();

    render(
      <Switch
        aria-label="保存中"
        defaultChecked
        loading
        onCheckedChange={onCheckedChange}
      />,
    );

    await user.click(screen.getByRole('switch', { name: '保存中' }));

    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(screen.getByRole('switch', { name: '保存中' })).toBeDisabled();
    expect(screen.getByRole('switch', { name: '保存中' })).toHaveAttribute(
      'aria-busy',
      'true',
    );
  });

  it('renders optional text content only when provided', () => {
    render(
      <>
        <Switch aria-label="默认开关" />
        <Switch
          aria-label="文本开关"
          checkedText="开"
          defaultChecked
          uncheckedText="关"
        />
      </>,
    );

    expect(screen.queryByText('关')).not.toBeInTheDocument();
    expect(screen.getByText('开')).toBeInTheDocument();
  });

  it('renders loading spinner inside the thumb', () => {
    render(<Switch aria-label="保存中" loading />);

    expect(
      screen
        .getByRole('switch', { name: '保存中' })
        .querySelector(
          '[data-slot="switch-thumb"] [data-slot="switch-spinner"]',
        ),
    ).toBeInTheDocument();
  });
});
