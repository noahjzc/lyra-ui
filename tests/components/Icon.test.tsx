import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { Search } from 'lucide-react';
import { describe, expect, it } from 'vitest';
import { Icon } from '../../src/components/general';

describe('Icon', () => {
  it('renders labeled icon with normalized size and tone', () => {
    render(<Icon icon={Search} label="搜索" size={18} tone="primary" />);

    expect(screen.getByRole('img', { name: '搜索' })).toHaveAttribute(
      'data-slot',
      'icon',
    );
    expect(screen.getByRole('img', { name: '搜索' })).toHaveClass(
      'text-(--ui-button-primary-background)',
    );
    expect(screen.getByRole('img', { name: '搜索' })).toHaveStyle({
      height: '18px',
      width: '18px',
    });
  });

  it('treats unlabeled icons as decorative', () => {
    render(<Icon data-testid="decorative-icon" icon={Search} />);

    expect(screen.getByTestId('decorative-icon')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });
});
