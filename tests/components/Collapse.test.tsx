import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Collapse } from '../../src/components/data-view';

describe('Collapse', () => {
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

  it('renders default open panel with aria linkage', () => {
    render(
      <Collapse
        defaultValue="advanced"
        items={[
          {
            children: '高级筛选内容',
            key: 'advanced',
            summary: '3 个条件',
            title: '高级筛选',
          },
        ]}
      />,
    );

    const trigger = screen.getByRole('button', { name: /高级筛选/ });

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger.getAttribute('aria-controls')).toContain('panel-0-advanced');
    expect(screen.getByRole('region')).toHaveTextContent('高级筛选内容');
  });

  it('supports controlled multiple values', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <Collapse
        items={[
          { children: 'A 内容', key: 'a', title: 'A' },
          { children: 'B 内容', key: 'b', title: 'B' },
        ]}
        onValueChange={onValueChange}
        type="multiple"
        value={['a']}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'B' }));

    expect(onValueChange).toHaveBeenCalledWith(['a', 'b']);
  });

  it('blurs trigger after pointer click to clear pressed focus styling', async () => {
    const user = userEvent.setup();

    render(
      <Collapse
        items={[
          {
            children: '高级筛选内容',
            key: 'advanced',
            title: '高级筛选',
          },
        ]}
      />,
    );

    const trigger = screen.getByRole('button', { name: '高级筛选' });

    await user.click(trigger);

    expect(trigger).not.toHaveFocus();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('keeps trigger focused after keyboard activation', async () => {
    const user = userEvent.setup();

    render(
      <Collapse
        items={[
          {
            children: '高级筛选内容',
            key: 'advanced',
            title: '高级筛选',
          },
        ]}
      />,
    );

    const trigger = screen.getByRole('button', { name: '高级筛选' });

    trigger.focus();
    await user.keyboard('{Enter}');

    expect(trigger).toHaveFocus();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('renders loading panel state', () => {
    render(
      <Collapse
        defaultValue="errors"
        items={[{ key: 'errors', loading: true, title: '导入错误' }]}
      />,
    );

    expect(
      document.querySelector('[data-slot="collapse-loading"]'),
    ).toBeInTheDocument();
  });

  it('manages disclosure motion presence lifecycle', async () => {
    const user = userEvent.setup();

    render(
      <Collapse
        items={[
          {
            children: '高级筛选内容',
            key: 'advanced',
            title: '高级筛选',
          },
        ]}
      />,
    );

    const trigger = screen.getByRole('button', { name: '高级筛选' });

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('高级筛选内容')).not.toBeInTheDocument();
    expect(
      document.querySelector('[data-slot="collapse-panel-motion"]'),
    ).not.toBeInTheDocument();

    fireEvent.click(trigger);

    const openMotion = document.querySelector(
      '[data-slot="collapse-panel-motion"]',
    );

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(openMotion).toHaveClass('grid-rows-[0fr]');

    await waitFor(() => {
      expect(openMotion).toHaveClass('grid-rows-[1fr]');
    });

    const panelContent = document.querySelector(
      '[data-slot="collapse-panel-content"]',
    );

    expect(openMotion).toHaveClass(
      'grid',
      'transition-[grid-template-rows]',
      'duration-(--ui-motion-duration-disclosure)',
      'motion-reduce:transition-none',
    );
    expect(panelContent).toHaveClass(
      'animate-ui-disclosure-in',
      'motion-reduce:animate-none',
    );

    await user.click(trigger);

    const closingMotion = document.querySelector(
      '[data-slot="collapse-panel-motion"]',
    );
    const closingPanel = document.querySelector('[data-slot="collapse-panel"]');

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(closingMotion).toHaveClass('grid-rows-[0fr]');
    expect(closingPanel).toHaveAttribute('aria-hidden', 'true');
    expect(closingPanel).toHaveAttribute('inert');
    expect(
      document.querySelector('[data-slot="collapse-panel-content"]'),
    ).toHaveClass('animate-ui-disclosure-out');
    expect(screen.getByText('高级筛选内容')).toBeInTheDocument();
    expect(screen.queryByRole('region')).not.toBeInTheDocument();

    fireEvent.transitionEnd(closingMotion as Element);

    expect(screen.queryByText('高级筛选内容')).not.toBeInTheDocument();
    expect(
      document.querySelector('[data-slot="collapse-panel"]'),
    ).not.toBeInTheDocument();
  });

  it('removes collapsed content immediately for reduced motion users', async () => {
    const restoreMatchMedia = mockReducedMotion(true);
    const user = userEvent.setup();

    render(
      <Collapse
        defaultValue="advanced"
        items={[
          {
            children: '高级筛选内容',
            key: 'advanced',
            title: '高级筛选',
          },
        ]}
      />,
    );

    await user.click(screen.getByRole('button', { name: '高级筛选' }));

    await waitFor(() => {
      expect(screen.queryByText('高级筛选内容')).not.toBeInTheDocument();
    });

    restoreMatchMedia();
  });

  it('keeps single mode to one open value when array values are provided', () => {
    render(
      <Collapse
        defaultValue={['a', 'b']}
        items={[
          { children: 'A 内容', key: 'a', title: 'A' },
          { children: 'B 内容', key: 'b', title: 'B' },
        ]}
      />,
    );

    expect(screen.getByText('A 内容')).toBeInTheDocument();
    expect(screen.queryByText('B 内容')).not.toBeInTheDocument();
  });

  it('supports accordion keyboard navigation between enabled triggers', async () => {
    const user = userEvent.setup();

    render(
      <Collapse
        items={[
          { children: 'A 内容', key: 'a', title: 'A' },
          { children: 'B 内容', disabled: true, key: 'b', title: 'B' },
          { children: 'C 内容', key: 'c', title: 'C' },
        ]}
      />,
    );

    const triggerA = screen.getByRole('button', { name: 'A' });
    const triggerC = screen.getByRole('button', { name: 'C' });

    triggerA.focus();
    await user.keyboard('{ArrowDown}');
    expect(triggerC).toHaveFocus();

    await user.keyboard('{Home}');
    expect(triggerA).toHaveFocus();
  });

  it('generates unique panel ids for keys with the same sanitized form', () => {
    render(
      <Collapse
        defaultValue={['a/b', 'a?b']}
        items={[
          { children: '斜杠内容', key: 'a/b', title: '斜杠' },
          { children: '问号内容', key: 'a?b', title: '问号' },
        ]}
        type="multiple"
      />,
    );

    const slashControls = screen
      .getByRole('button', { name: '斜杠' })
      .getAttribute('aria-controls');
    const questionControls = screen
      .getByRole('button', { name: '问号' })
      .getAttribute('aria-controls');

    expect(slashControls).not.toEqual(questionControls);
  });

  it('supports ghost variant and compact size', () => {
    render(
      <Collapse
        defaultValue="basic"
        items={[{ children: '基础内容', key: 'basic', title: '基础资料' }]}
        size="compact"
        variant="ghost"
      />,
    );

    expect(document.querySelector('[data-slot="collapse"]')).toHaveClass(
      'gap-2',
    );
    expect(screen.getByRole('button', { name: '基础资料' })).toHaveClass(
      'py-1.5',
    );
  });

  it('uses a full header hover surface instead of trigger-only hover', () => {
    render(
      <Collapse
        defaultValue="basic"
        items={[
          {
            children: '基础内容',
            extra: <span>4 项</span>,
            key: 'basic',
            title: '基础资料',
          },
        ]}
      />,
    );

    const header = document.querySelector('[data-slot="collapse-header"]');
    const trigger = screen.getByRole('button', { name: '基础资料' });

    expect(header).toHaveClass('hover:bg-(--ui-button-ghost-hover-background)');
    expect(trigger.className).not.toContain(
      'hover:bg-(--ui-button-ghost-hover-background)',
    );
  });

  it('keeps summary visible while expanded to avoid header layout jumps', () => {
    render(
      <Collapse
        defaultValue="basic"
        items={[
          {
            children: '基础内容',
            key: 'basic',
            summary: '客户身份、所属部门、税号',
            title: '基础资料',
          },
        ]}
      />,
    );

    expect(screen.getByText('客户身份、所属部门、税号')).toBeVisible();
    expect(
      document.querySelector('[data-slot="collapse-panel-content"]'),
    ).toHaveClass('py-3', 'pr-4', 'pl-10');
  });
});
