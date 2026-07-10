import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Divider } from '../../src/components/general';

describe('Divider', () => {
  it('renders as decorative horizontal divider by default', () => {
    render(<Divider data-testid="divider" />);

    const divider = screen.getByTestId('divider');

    expect(divider).toHaveAttribute('aria-hidden', 'true');
    expect(divider).not.toHaveAttribute('role');
    expect(divider.firstElementChild).toHaveClass(
      'bg-(--ui-divider-soft)',
      'border-0',
      'h-px',
      'w-full',
    );
  });

  it('supports semantic separator orientation', () => {
    render(
      <Divider
        aria-label="工具组分隔"
        decorative={false}
        data-testid="divider"
        orientation="vertical"
      />,
    );

    const divider = screen.getByRole('separator');

    expect(divider).toBe(screen.getByTestId('divider'));
    expect(divider).toHaveAttribute('aria-label', '工具组分隔');
    expect(divider).toHaveAttribute('aria-orientation', 'vertical');
    expect(divider.tagName).toBe('HR');
    expect(divider).toHaveClass('h-5', 'w-px');
  });

  it('renders text divider as readable text by default', () => {
    render(
      <Divider align="left" data-testid="divider" style={{ opacity: 0.5 }}>
        基础信息
      </Divider>,
    );

    const divider = screen.getByTestId('divider');

    expect(divider).toHaveTextContent('基础信息');
    expect(divider).not.toHaveAttribute('aria-hidden');
    expect(divider).not.toHaveAttribute('role');
    expect(divider).toHaveStyle({ opacity: '0.5' });
    expect(screen.getByText('基础信息').previousElementSibling).toHaveClass(
      'flex-1',
      'max-w-9',
      'min-w-0',
      'shrink',
    );
  });

  it('supports inset and visual variants', () => {
    render(<Divider data-testid="divider" inset={24} variant="edge" />);

    const divider = screen.getByTestId('divider');

    expect(divider).toHaveStyle({ marginInlineStart: '24px' });
    expect(divider.firstElementChild).toHaveClass(
      'bg-(--ui-divider-default)',
      'shadow-(--ui-divider-shadow)',
    );
  });

  it('uses default inset distance when inset is true', () => {
    render(<Divider data-testid="divider" inset />);

    expect(screen.getByTestId('divider')).toHaveStyle({
      marginInlineStart: '36px',
    });
  });

  it('uses orientation-aware dashed line classes', () => {
    render(
      <Divider data-testid="divider" orientation="vertical" variant="dashed" />,
    );

    expect(screen.getByTestId('divider').firstElementChild).toHaveClass(
      'border-l',
      'border-dashed',
      '[border-color:var(--ui-divider-dashed)]',
    );
  });

  it('forwards ref to the rendered root element', () => {
    const ref = createRef<HTMLElement>();

    render(
      <Divider data-testid="divider" ref={ref}>
        分组标题
      </Divider>,
    );

    expect(ref.current).toBe(screen.getByTestId('divider'));
  });
});
