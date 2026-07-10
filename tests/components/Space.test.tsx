import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Space } from '../../src/components/general';

describe('Space', () => {
  it('renders horizontal space with default gap', () => {
    render(
      <Space data-testid="space">
        <span>A</span>
        <span>B</span>
      </Space>,
    );

    const space = screen.getByTestId('space');

    expect(space).toHaveClass('inline-flex', 'flex-row', 'items-center');
    expect(space).toHaveStyle({
      '--ui-space-column-gap': '8px',
      '--ui-space-row-gap': '8px',
    });
  });

  it('supports vertical direction, wrapping, align and justify', () => {
    render(
      <Space
        align="stretch"
        data-testid="space"
        direction="vertical"
        justify="between"
        wrap
      >
        <span>A</span>
      </Space>,
    );

    expect(screen.getByTestId('space')).toHaveClass(
      'flex-col',
      'flex-wrap',
      'items-stretch',
      'justify-between',
    );
    expect(screen.getByTestId('space')).toHaveStyle({
      '--ui-space-column-gap': '12px',
      '--ui-space-row-gap': '12px',
    });
  });

  it('maps semantic and tuple sizes to CSS variables', () => {
    render(
      <Space data-testid="space" size={['small', 'large']}>
        <span>A</span>
      </Space>,
    );

    expect(screen.getByTestId('space')).toHaveStyle({
      '--ui-space-column-gap': '12px',
      '--ui-space-row-gap': '4px',
    });
  });

  it('renders separators between valid children only', () => {
    render(
      <Space data-testid="space" separator="·">
        <span>A</span>
        {null}
        {false}
        <span>B</span>
        {undefined}
        <span>C</span>
      </Space>,
    );

    const space = screen.getByTestId('space');
    const separators = space.querySelectorAll('[data-slot="space-separator"]');

    expect(separators).toHaveLength(2);
    separators.forEach(separator => {
      expect(separator).toHaveAttribute('aria-hidden', 'true');
    });
  });

  it('does not render separators when separator is empty', () => {
    render(
      <Space data-testid="space">
        <span>A</span>
        <span>B</span>
      </Space>,
    );

    expect(
      screen
        .getByTestId('space')
        .querySelector('[data-slot="space-separator"]'),
    ).not.toBeInTheDocument();
  });

  it('forwards ref to the root element', () => {
    const ref = createRef<HTMLDivElement>();

    render(<Space ref={ref}>内容</Space>);

    expect(ref.current).toHaveAttribute('data-slot', 'space');
  });
});
