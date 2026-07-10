import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Flex } from '../../src/components/general';

describe('Flex', () => {
  it('renders default flex layout with gap variables', () => {
    render(<Flex data-testid="flex">内容</Flex>);

    expect(screen.getByTestId('flex')).toHaveClass(
      'flex',
      'flex-row',
      'min-w-0',
    );
    expect(screen.getByTestId('flex')).toHaveStyle({
      '--ui-flex-column-gap': '8px',
      '--ui-flex-row-gap': '8px',
    });
  });

  it('supports alignment, justification and wrapping', () => {
    render(
      <Flex align="center" data-testid="flex" justify="between" wrap>
        内容
      </Flex>,
    );

    expect(screen.getByTestId('flex')).toHaveClass(
      'items-center',
      'justify-between',
      'flex-wrap',
    );
  });

  it('supports tuple gap, grow and inline full width options', () => {
    render(
      <Flex data-testid="flex" fullWidth gap={[12, 16]} grow inline>
        内容
      </Flex>,
    );

    expect(screen.getByTestId('flex')).toHaveClass(
      'inline-flex',
      'w-full',
      'flex-1',
    );
    expect(screen.getByTestId('flex')).toHaveStyle({
      '--ui-flex-column-gap': '16px',
      '--ui-flex-row-gap': '12px',
    });
  });

  it('forwards ref to the root element', () => {
    const ref = createRef<HTMLDivElement>();

    render(<Flex ref={ref}>内容</Flex>);

    expect(ref.current).toHaveAttribute('data-slot', 'flex');
  });
});
