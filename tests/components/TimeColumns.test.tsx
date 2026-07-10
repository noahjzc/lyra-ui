import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TimeColumns } from '../../src/components/data-input/time-columns';

const value = { hour: 10, minute: 24, second: 36 };

describe('TimeColumns', () => {
  it('uses the DatePicker column structure for the TimePicker variant', () => {
    render(
      <TimeColumns onSelect={vi.fn()} value={value} variant="time-picker" />,
    );

    expect(document.querySelector('[data-slot="time-columns"]')).toHaveClass(
      'h-[232px]',
      'rounded-md',
    );
    expect(document.querySelector('[data-slot="time-column"]')).toHaveClass(
      'min-w-0',
      'grid-rows-[28px_minmax(0,1fr)]',
    );
    expect(
      document.querySelector('[data-slot="time-column-header"]'),
    ).toHaveClass('grid', 'min-h-7', 'place-items-center');
    expect(document.querySelector('[data-slot="time-option"]')).toHaveClass(
      'min-h-[30px]',
      'text-xs',
    );
  });

  it('keeps the DatePicker structure when rendering only hour and minute', () => {
    render(
      <TimeColumns
        onSelect={vi.fn()}
        showSecond={false}
        value={value}
        variant="time-picker"
      />,
    );

    expect(document.querySelector('[data-slot="time-columns"]')).toHaveClass(
      'grid-cols-2',
      'h-[232px]',
      'rounded-md',
    );
    expect(document.querySelectorAll('[data-slot="time-column"]')).toHaveLength(
      2,
    );
    expect(document.querySelector('[data-slot="time-option"]')).toHaveClass(
      'min-h-[30px]',
      'text-xs',
    );
  });
});
