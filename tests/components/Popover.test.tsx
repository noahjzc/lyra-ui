import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { describe, expect, it } from 'vitest';
import {
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
} from '../../src/components/data-view';
import { Z_BASE } from '../../src/overlay/z-stack';

describe('Popover', () => {
  it('opens content from trigger', async () => {
    const user = userEvent.setup();

    render(
      <Popover>
        <PopoverTrigger>打开筛选</PopoverTrigger>
        <PopoverContent>筛选字段</PopoverContent>
      </Popover>,
    );

    await user.click(screen.getByRole('button', { name: '打开筛选' }));

    expect(screen.getByText('筛选字段')).toBeInTheDocument();
    const content = screen.getByText('筛选字段');

    expect(content).toHaveClass(
      'data-[state=open]:animate-ui-layer-in',
      'data-[state=closed]:animate-ui-layer-out',
    );
    expect(content).not.toHaveClass('shadow-ui-elevation-4');
    expect(content.style.filter).toContain('drop-shadow(');
    const arrow = document.querySelector('[data-slot="popover-arrow"]');
    const arrowFill = arrow?.querySelector('[data-slot="popover-arrow-fill"]');
    const arrowStroke = arrow?.querySelector(
      '[data-slot="popover-arrow-stroke"]',
    );

    expect(arrow).toBeInTheDocument();
    expect(arrow).toHaveAttribute('width', '16');
    expect(arrow).toHaveAttribute('height', '8');
    expect(arrowFill).toHaveAttribute('d', 'M0 -1 H16 V0 L8 8 L0 0 Z');
    expect(arrowFill).toHaveClass('fill-(--ui-background)');
    expect(arrowStroke).toHaveAttribute('d', 'M0 0 L8 8 L16 0');
    expect(arrowStroke).toHaveAttribute('fill', 'none');
    expect(arrowStroke).toHaveClass('stroke-(--ui-border)');
  });

  it('supports fixed header, scrollable body and footer regions', async () => {
    const user = userEvent.setup();

    render(
      <Popover>
        <PopoverTrigger>打开通知</PopoverTrigger>
        <PopoverContent>
          <PopoverHeader>通知</PopoverHeader>
          <PopoverBody>暂无新通知</PopoverBody>
          <PopoverFooter>全部已读</PopoverFooter>
        </PopoverContent>
      </Popover>,
    );

    await user.click(screen.getByRole('button', { name: '打开通知' }));

    expect(screen.getByText('通知')).toHaveAttribute(
      'data-slot',
      'popover-header',
    );
    expect(screen.getByText('暂无新通知')).toHaveClass(
      'overflow-y-auto',
      'p-4',
    );
    expect(screen.getByText('全部已读')).toHaveAttribute(
      'data-slot',
      'popover-footer',
    );
  });

  it('supports large content width', async () => {
    const user = userEvent.setup();

    render(
      <Popover>
        <PopoverTrigger>打开字段设置</PopoverTrigger>
        <PopoverContent size="large">字段设置</PopoverContent>
      </Popover>,
    );

    await user.click(screen.getByRole('button', { name: '打开字段设置' }));

    expect(screen.getByText('字段设置')).toHaveClass('w-[420px]');
  });

  it('maps AntD-style placement and arrow config to Radix positioning', async () => {
    const user = userEvent.setup();

    render(
      <Popover>
        <PopoverTrigger>打开左上浮层</PopoverTrigger>
        <PopoverContent arrow={{ pointAtCenter: true }} placement="topLeft">
          左上内容
        </PopoverContent>
      </Popover>,
    );

    await user.click(screen.getByRole('button', { name: '打开左上浮层' }));

    const content = screen.getByText('左上内容');
    const arrow = document.querySelector('[data-slot="popover-arrow"]');

    expect(content).toHaveAttribute('data-side', 'top');
    expect(content).toHaveAttribute('data-align', 'start');
    expect(arrow).toBeInTheDocument();
    expect(arrow).toHaveAttribute('data-point-at-center', 'true');
  });

  it('hides the arrow through AntD-style arrow prop', async () => {
    const user = userEvent.setup();

    render(
      <Popover>
        <PopoverTrigger>打开无箭头浮层</PopoverTrigger>
        <PopoverContent arrow={false}>无箭头内容</PopoverContent>
      </Popover>,
    );

    await user.click(screen.getByRole('button', { name: '打开无箭头浮层' }));

    expect(screen.getByText('无箭头内容')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="popover-arrow"]')).toBeNull();
  });

  it('raises z-index by actual open order when force mounted', async () => {
    const user = userEvent.setup();

    function ForcedPopoverStackHarness() {
      const [firstOpen, setFirstOpen] = React.useState(false);
      const [secondOpen, setSecondOpen] = React.useState(false);

      return (
        <>
          <button onClick={() => setSecondOpen(true)} type="button">
            打开后渲染浮层
          </button>
          <button onClick={() => setFirstOpen(true)} type="button">
            打开先渲染浮层
          </button>
          <Popover open={firstOpen}>
            <PopoverTrigger>先渲染触发器</PopoverTrigger>
            <PopoverContent forceMount>先渲染内容</PopoverContent>
          </Popover>
          <Popover open={secondOpen}>
            <PopoverTrigger>后渲染触发器</PopoverTrigger>
            <PopoverContent forceMount>后渲染内容</PopoverContent>
          </Popover>
        </>
      );
    }

    function getLayer(text: string) {
      return screen
        .getByText(text)
        .closest<HTMLElement>('[data-slot="popover-content"]');
    }

    render(<ForcedPopoverStackHarness />);

    await user.click(screen.getByRole('button', { name: '打开后渲染浮层' }));

    await waitFor(() => {
      const secondLayer = getLayer('后渲染内容');

      expect(secondLayer).not.toBeNull();
      expect(Number(secondLayer?.style.zIndex)).toBeGreaterThan(Z_BASE.popover);
    });

    await user.click(screen.getByRole('button', { name: '打开先渲染浮层' }));

    await waitFor(() => {
      const firstLayer = getLayer('先渲染内容');
      const secondLayer = getLayer('后渲染内容');

      expect(firstLayer).not.toBeNull();
      expect(secondLayer).not.toBeNull();

      const firstZIndex = Number(firstLayer?.style.zIndex);
      const secondZIndex = Number(secondLayer?.style.zIndex);

      expect(Number.isFinite(firstZIndex)).toBe(true);
      expect(Number.isFinite(secondZIndex)).toBe(true);
      expect(firstZIndex).toBeGreaterThan(secondZIndex);
    });
  });
});
