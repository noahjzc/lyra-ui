import '@testing-library/jest-dom/vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { cn } from '../../src/internal/cn';
import {
  disclosurePanelContentMotionClassName,
  disclosurePanelMotionClassName,
  useDisclosureMotion,
} from '../../src/internal/disclosure-motion';

function mockReducedMotion(matches: boolean) {
  const originalMatchMedia = window.matchMedia;

  window.matchMedia = vi.fn().mockImplementation(query => ({
    addEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
    matches,
    media: query,
    onchange: null,
    removeEventListener: vi.fn(),
  }));

  return () => {
    window.matchMedia = originalMatchMedia;
  };
}

function mockAnimationFrame() {
  const originalRequestAnimationFrame = window.requestAnimationFrame;
  const originalCancelAnimationFrame = window.cancelAnimationFrame;
  const callbacks = new Map<number, FrameRequestCallback>();
  let nextId = 1;

  window.requestAnimationFrame = vi.fn(callback => {
    const id = nextId;

    nextId += 1;
    callbacks.set(id, callback);

    return id;
  });
  window.cancelAnimationFrame = vi.fn(id => {
    callbacks.delete(id);
  });

  return {
    flushNextFrame() {
      const nextCallback = callbacks.entries().next();

      if (nextCallback.done) return;

      const [id, callback] = nextCallback.value;

      callbacks.delete(id);

      act(() => {
        callback(performance.now());
      });
    },
    restore() {
      window.requestAnimationFrame = originalRequestAnimationFrame;
      window.cancelAnimationFrame = originalCancelAnimationFrame;
    },
  };
}

function DisclosureHarness({ openKeys }: { openKeys: readonly string[] }) {
  const motion = useDisclosureMotion(openKeys);
  const state = motion.getDisclosureState('customer');

  return (
    <div>
      <div data-testid="state">
        {state.open ? 'open' : 'closed'} /{' '}
        {state.present ? 'present' : 'absent'} /{' '}
        {state.visible ? 'visible' : 'hidden'}
      </div>
      {state.present && (
        <div
          className={cn(
            disclosurePanelMotionClassName,
            state.visible ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
          )}
          data-testid="motion"
          onTransitionEnd={event =>
            motion.handleDisclosureTransitionEnd(event, 'customer')
          }
        >
          <section
            aria-hidden={state.open ? undefined : true}
            className="min-h-0 overflow-hidden"
            inert={state.open ? undefined : true}
          >
            <div
              className={
                state.visible
                  ? disclosurePanelContentMotionClassName.open
                  : disclosurePanelContentMotionClassName.closed
              }
              data-testid="content"
            >
              客户列表
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

describe('useDisclosureMotion', () => {
  it('mounts opening content collapsed then expands it on the next frame', async () => {
    const animationFrame = mockAnimationFrame();
    const { rerender } = render(<DisclosureHarness openKeys={[]} />);

    try {
      expect(screen.getByTestId('state')).toHaveTextContent(
        'closed / absent / hidden',
      );
      expect(screen.queryByTestId('motion')).not.toBeInTheDocument();

      rerender(<DisclosureHarness openKeys={['customer']} />);

      const openingMotion = await screen.findByTestId('motion');

      expect(openingMotion).toHaveClass('grid-rows-[0fr]');

      animationFrame.flushNextFrame();

      expect(openingMotion).toHaveClass('grid-rows-[0fr]');

      animationFrame.flushNextFrame();

      await waitFor(() => {
        expect(openingMotion).toHaveClass('grid-rows-[1fr]');
      });
      expect(screen.getByTestId('content')).toHaveClass(
        'animate-ui-disclosure-in',
      );
    } finally {
      animationFrame.restore();
    }
  });

  it('does not run a canceled opening frame after closing before flush', async () => {
    const animationFrame = mockAnimationFrame();
    const { rerender } = render(<DisclosureHarness openKeys={[]} />);

    try {
      rerender(<DisclosureHarness openKeys={['customer']} />);

      const openingMotion = await screen.findByTestId('motion');

      expect(openingMotion).toHaveClass('grid-rows-[0fr]');

      rerender(<DisclosureHarness openKeys={[]} />);
      animationFrame.flushNextFrame();

      const closingMotion = screen.getByTestId('motion');

      expect(closingMotion).toHaveClass('grid-rows-[0fr]');
      expect(closingMotion).not.toHaveClass('grid-rows-[1fr]');
      expect(screen.getByTestId('state')).toHaveTextContent(
        'closed / present / hidden',
      );
    } finally {
      animationFrame.restore();
    }
  });

  it('keeps closing content present and removes it after transition end', async () => {
    const { rerender } = render(<DisclosureHarness openKeys={['customer']} />);
    const openMotion = screen.getByTestId('motion');

    await waitFor(() => {
      expect(openMotion).toHaveClass('grid-rows-[1fr]');
    });
    expect(screen.getByText('客户列表')).toBeInTheDocument();

    rerender(<DisclosureHarness openKeys={[]} />);

    const closingMotion = screen.getByTestId('motion');
    const panel = screen.getByText('客户列表').parentElement;

    expect(closingMotion).toHaveClass('grid-rows-[0fr]');
    expect(screen.getByText('客户列表')).toBeInTheDocument();
    expect(screen.getByTestId('content')).toHaveClass(
      'animate-ui-disclosure-out',
    );
    expect(panel).toHaveAttribute('aria-hidden', 'true');
    expect(panel).toHaveAttribute('inert');

    fireEvent.transitionEnd(closingMotion);

    expect(screen.queryByText('客户列表')).not.toBeInTheDocument();
  });

  it('removes closed content immediately for reduced motion users', async () => {
    const restoreMatchMedia = mockReducedMotion(true);

    try {
      const { rerender } = render(
        <DisclosureHarness openKeys={['customer']} />,
      );

      expect(screen.getByText('客户列表')).toBeInTheDocument();

      rerender(<DisclosureHarness openKeys={[]} />);

      await waitFor(() => {
        expect(screen.queryByText('客户列表')).not.toBeInTheDocument();
      });
    } finally {
      restoreMatchMedia();
    }
  });
});
