import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Grid, GridItem } from '../../src/components/general';

describe('Grid', () => {
  it('renders fixed column template and default gaps', () => {
    render(<Grid columns={3} data-testid="grid" />);

    expect(screen.getByTestId('grid')).toHaveClass('grid');
    expect(screen.getByTestId('grid')).toHaveStyle({
      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
      '--ui-grid-column-gap': '12px',
      '--ui-grid-row-gap': '10px',
    });
  });

  it('supports auto-fit template', () => {
    render(<Grid autoFit data-testid="grid" minColumnWidth={160} />);

    expect(screen.getByTestId('grid')).toHaveStyle({
      gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    });
  });

  it('supports custom template and dense layout', () => {
    render(<Grid columns="120px minmax(0, 1fr)" data-testid="grid" dense />);

    expect(screen.getByTestId('grid')).toHaveClass('grid-flow-dense');
    expect(screen.getByTestId('grid')).toHaveStyle({
      gridTemplateColumns: '120px minmax(0, 1fr)',
    });
  });

  it('supports responsive column templates from design breakpoints', () => {
    render(
      <Grid
        data-testid="grid"
        responsive={{ base: 1, md: 2, xl: 'repeat(3, minmax(0, 1fr))' }}
      />,
    );

    expect(screen.getByTestId('grid')).toHaveClass(
      'md:[grid-template-columns:var(--ui-grid-columns-md)]',
      'xl:[grid-template-columns:var(--ui-grid-columns-xl)]',
    );
    expect(screen.getByTestId('grid')).toHaveStyle({
      gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
      '--ui-grid-columns-md': 'repeat(2, minmax(0, 1fr))',
      '--ui-grid-columns-xl': 'repeat(3, minmax(0, 1fr))',
    });
  });

  it('renders grid item span classes', () => {
    render(<GridItem data-testid="item" span="full" />);

    expect(screen.getByTestId('item')).toHaveClass('col-span-full', 'min-w-0');
  });

  it('forwards refs to grid and grid item roots', () => {
    const gridRef = createRef<HTMLDivElement>();
    const itemRef = createRef<HTMLDivElement>();

    render(
      <Grid ref={gridRef}>
        <GridItem ref={itemRef}>内容</GridItem>
      </Grid>,
    );

    expect(gridRef.current).toHaveAttribute('data-slot', 'grid');
    expect(itemRef.current).toHaveAttribute('data-slot', 'grid-item');
  });
});
