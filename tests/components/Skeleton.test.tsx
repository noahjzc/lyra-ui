import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Skeleton } from '../../src/components/feedback';

describe('Skeleton', () => {
  it('renders table preset as decorative loading structure', () => {
    render(<Skeleton active={false} preset="table" rows={3} />);

    expect(document.querySelector('[data-slot="skeleton"]')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
    expect(document.querySelector('.animate-none')).toBeInTheDocument();
  });

  it('renders text preset with optional avatar and stable width', () => {
    render(<Skeleton avatar preset="text" rows={2} width="60%" />);

    expect(
      document.querySelectorAll('[data-slot="skeleton-block"]'),
    ).toHaveLength(4);
    expect(document.querySelector('[data-slot="skeleton-block"]')).toHaveClass(
      'motion-reduce:animate-none',
    );
  });

  it('does not allow callers to expose decorative content', () => {
    render(<Skeleton aria-hidden="false" />);

    expect(document.querySelector('[data-slot="skeleton"]')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });

  it('renders list, card, table, and detail presets', () => {
    const { rerender } = render(<Skeleton preset="list" rows={3} />);

    expect(
      document.querySelectorAll('[data-slot="skeleton-block"]'),
    ).toHaveLength(6);

    rerender(<Skeleton preset="card" />);

    expect(
      document.querySelectorAll('[data-slot="skeleton-block"]'),
    ).toHaveLength(4);

    rerender(<Skeleton preset="table" rows={2} />);

    expect(
      document.querySelectorAll('[data-slot="skeleton-block"]'),
    ).toHaveLength(8);

    rerender(<Skeleton preset="detail" rows={2} />);

    expect(
      document.querySelectorAll('[data-slot="skeleton-block"]'),
    ).toHaveLength(4);
  });
});
