import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { RadioField, RadioGroup } from '../../src/components/data-input';

describe('Radio', () => {
  it('handles checked changes', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();

    render(
      <RadioField
        label="自动分配"
        name="strategy"
        onCheckedChange={onCheckedChange}
        value="auto"
      />,
    );

    await user.click(screen.getByRole('radio', { name: '自动分配' }));

    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('toggles when the field label is clicked', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();

    render(
      <RadioField
        label="人工审核"
        name="strategy"
        onCheckedChange={onCheckedChange}
        value="manual"
      />,
    );

    await user.click(screen.getByText('人工审核'));

    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(onCheckedChange).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('radio', { name: '人工审核' })).toBeChecked();
    expect(
      screen
        .getByRole('radio', { name: '人工审核' })
        .parentElement?.querySelector('[data-slot="radio-control"]'),
    ).toHaveAttribute('data-state', 'checked');
  });

  it('marks uncontrolled checked card fields as selected', () => {
    render(
      <RadioField
        card
        defaultChecked
        label="默认策略"
        name="strategy"
        value="default"
      />,
    );

    expect(
      screen
        .getByRole('radio', { name: '默认策略' })
        .closest('[data-slot="radio-field"]'),
    ).toHaveAttribute('data-checked', 'true');
  });

  it('updates radio group values and keeps one selected option', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <RadioGroup
        defaultValue="auto"
        legend="分配策略"
        onValueChange={onValueChange}
        options={[
          { label: '自动分配', value: 'auto' },
          { label: '人工审核', value: 'manual' },
        ]}
      />,
    );

    await user.click(screen.getByRole('radio', { name: '人工审核' }));

    expect(onValueChange).toHaveBeenCalledWith('manual');
    expect(screen.getByRole('radio', { name: '人工审核' })).toBeChecked();
    expect(screen.getByRole('radio', { name: '自动分配' })).not.toBeChecked();
    expect(
      screen.getByRole('radiogroup', { name: '分配策略' }),
    ).toBeInTheDocument();
  });

  it('uses responsive auto-fit grid for grid groups', () => {
    const { container } = render(
      <RadioGroup
        columns={2}
        options={[
          { label: '自动分配', value: 'auto' },
          { label: '人工审核', value: 'manual' },
        ]}
      />,
    );

    expect(
      container.querySelector('[data-slot="radio-group-options"]'),
    ).toHaveClass(
      'grid-cols-[repeat(auto-fit,minmax(min(100%,max(var(--ui-radio-group-option-min-width),calc((100%-(var(--ui-radio-group-columns)-1)*1rem)/var(--ui-radio-group-columns)))),1fr))]',
    );
  });

  it('does not update disabled radio group options', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <RadioGroup
        defaultValue="auto"
        disabledOptions={['manual']}
        onValueChange={onValueChange}
        options={[
          { label: '自动分配', value: 'auto' },
          { label: '人工审核', value: 'manual' },
        ]}
      />,
    );

    await user.click(screen.getByRole('radio', { name: '人工审核' }));

    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('updates button radio values', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <RadioGroup
        defaultValue="compact"
        onValueChange={onValueChange}
        options={[
          { label: '紧凑', value: 'compact' },
          { label: '宽松', value: 'loose' },
        ]}
        variant="button"
      />,
    );

    await user.click(screen.getByRole('radio', { name: '宽松' }));

    expect(onValueChange).toHaveBeenCalledWith('loose');
  });
});
