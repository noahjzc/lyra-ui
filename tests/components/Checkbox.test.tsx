import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
  Checkbox,
  CheckboxField,
  CheckboxGroup,
} from '../../src/components/data-input';

describe('Checkbox', () => {
  it('handles checked changes', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();

    render(
      <Checkbox aria-label="接收通知" onCheckedChange={onCheckedChange} />,
    );

    await user.click(screen.getByRole('checkbox', { name: '接收通知' }));

    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('renders indeterminate state as mixed aria state', () => {
    render(<Checkbox aria-label="选择部分客户" checked="indeterminate" />);

    expect(
      screen.getByRole('checkbox', { name: '选择部分客户' }),
    ).toHaveAttribute('aria-checked', 'mixed');
  });

  it('renders minus icon for default indeterminate state', () => {
    render(<Checkbox aria-label="默认半选" defaultChecked="indeterminate" />);

    expect(screen.getByTestId('checkbox-minus')).toBeInTheDocument();
    expect(screen.queryByTestId('checkbox-check')).not.toBeInTheDocument();
  });

  it('toggles when the field label is clicked', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();

    render(
      <CheckboxField label="同步客户资料" onCheckedChange={onCheckedChange} />,
    );

    await user.click(screen.getByText('同步客户资料'));

    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(onCheckedChange).toHaveBeenCalledTimes(1);
    expect(
      screen.getByRole('checkbox', { name: '同步客户资料' }),
    ).toBeChecked();
  });

  it('marks uncontrolled checked card fields as selected', () => {
    render(<CheckboxField card defaultChecked label="默认启用" />);

    expect(
      screen
        .getByRole('checkbox', { name: '默认启用' })
        .closest('[data-slot="checkbox-field"]'),
    ).toHaveAttribute('data-checked', 'true');
  });

  it('updates checkbox group values', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <CheckboxGroup
        legend="通知渠道"
        onValueChange={onValueChange}
        options={[
          { label: '站内通知', value: 'inbox' },
          { label: '邮件摘要', value: 'email' },
        ]}
      />,
    );

    await user.click(screen.getByRole('checkbox', { name: '邮件摘要' }));

    expect(onValueChange).toHaveBeenCalledWith(['email']);
    expect(screen.getByRole('group', { name: '通知渠道' })).toBeInTheDocument();
  });

  it('uses responsive auto-fit grid for grid groups', () => {
    const { container } = render(
      <CheckboxGroup
        columns={2}
        options={[
          { label: '站内通知', value: 'inbox' },
          { label: '邮件摘要', value: 'email' },
        ]}
      />,
    );

    expect(
      container.querySelector('[data-slot="checkbox-group-options"]'),
    ).toHaveClass(
      'grid-cols-[repeat(auto-fit,minmax(min(100%,max(var(--ui-checkbox-group-option-min-width),calc((100%-(var(--ui-checkbox-group-columns)-1)*0.75rem)/var(--ui-checkbox-group-columns)))),1fr))]',
    );
  });

  it('does not update disabled checkbox group options', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <CheckboxGroup
        disabledOptions={['email']}
        onValueChange={onValueChange}
        options={[
          { label: '站内通知', value: 'inbox' },
          { label: '邮件摘要', value: 'email' },
        ]}
      />,
    );

    await user.click(screen.getByRole('checkbox', { name: '邮件摘要' }));

    expect(onValueChange).not.toHaveBeenCalled();
  });
});
