import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { ScrollArea } from '../../src/components/general';

describe('ScrollArea', () => {
  it('renders custom viewport class name', () => {
    render(
      <ScrollArea
        maxHeight={96}
        viewportClassName="max-h-24"
        viewportProps={{ 'aria-label': '跟进记录列表', tabIndex: 0 }}
        data-testid="scroll-area"
      >
        内容
      </ScrollArea>,
    );

    const viewport = screen
      .getByTestId('scroll-area')
      .querySelector('[data-slot="scroll-area-viewport"]');

    expect(viewport).toHaveClass(
      'h-full',
      'w-full',
      'max-h-24',
      'overscroll-contain',
      '[scrollbar-width:thin]',
      '[&::-webkit-scrollbar]:w-1.5',
      '[&::-webkit-scrollbar-thumb]:bg-(--ui-scrollbar-thumb)',
    );
    expect(viewport).toHaveStyle({ maxHeight: '96px' });
    expect(viewport).toHaveAttribute('aria-label', '跟进记录列表');
    expect(viewport).toHaveAttribute('tabindex', '0');
  });

  it('uses overflow-auto for both orientation', () => {
    render(
      <ScrollArea orientation="both" data-testid="scroll-area">
        表格内容
      </ScrollArea>,
    );

    expect(
      screen
        .getByTestId('scroll-area')
        .querySelector('[data-slot="scroll-area-viewport"]'),
    ).toHaveClass('overflow-auto');
  });

  it('shows scroll shadow according to viewport scroll position', () => {
    render(
      <ScrollArea shadow="both" data-testid="scroll-area">
        内容
      </ScrollArea>,
    );

    const root = screen.getByTestId('scroll-area');
    const viewport = root.querySelector(
      '[data-slot="scroll-area-viewport"]',
    ) as HTMLDivElement;

    Object.defineProperties(viewport, {
      clientHeight: { configurable: true, value: 100 },
      scrollHeight: { configurable: true, value: 240 },
    });

    fireEvent.scroll(viewport, { target: { scrollTop: 0 } });

    expect(root).toHaveAttribute('data-slot', 'scroll-area');
    expect(root).toHaveAttribute('data-scroll-shadow', 'bottom');
    expect(root).toHaveClass('after:absolute');
    expect(root).not.toHaveClass('before:absolute');
    expect(viewport).toHaveAttribute('data-slot', 'scroll-area-viewport');

    fireEvent.scroll(viewport, { target: { scrollTop: 80 } });

    expect(root).toHaveAttribute('data-scroll-shadow', 'both');
    expect(root).toHaveClass('after:absolute', 'before:absolute');
  });

  it('keeps edgeShadow as a dynamic bottom shadow alias', () => {
    render(
      <ScrollArea edgeShadow data-testid="scroll-area">
        内容
      </ScrollArea>,
    );

    const root = screen.getByTestId('scroll-area');
    const viewport = root.querySelector(
      '[data-slot="scroll-area-viewport"]',
    ) as HTMLDivElement;

    Object.defineProperties(viewport, {
      clientHeight: { configurable: true, value: 100 },
      scrollHeight: { configurable: true, value: 180 },
    });

    fireEvent.scroll(viewport, { target: { scrollTop: 0 } });

    expect(root).toHaveClass('after:absolute');
    expect(root).not.toHaveClass('before:absolute');
  });

  it('renders sticky header and footer slots', () => {
    render(
      <ScrollArea
        stickyFooter="Footer"
        stickyHeader="Header"
        data-testid="scroll-area"
      >
        内容
      </ScrollArea>,
    );

    expect(screen.getByText('Header')).toHaveAttribute(
      'data-slot',
      'scroll-area-sticky-header',
    );
    expect(screen.getByText('Footer')).toHaveAttribute(
      'data-slot',
      'scroll-area-sticky-footer',
    );
    expect(
      screen
        .getByTestId('scroll-area')
        .querySelector('[data-slot="scroll-area-viewport"]'),
    ).toHaveClass('pt-8', 'pb-8');
  });

  it('forwards ref to the root element', () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <ScrollArea ref={ref} data-testid="scroll-area">
        内容
      </ScrollArea>,
    );

    expect(ref.current).toBe(screen.getByTestId('scroll-area'));
  });
});
