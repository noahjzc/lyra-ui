import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../src/components/data-view';

describe('Tooltip', () => {
  it('shows content on hover', async () => {
    const user = userEvent.setup();

    render(
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger>同步状态</TooltipTrigger>
          <TooltipContent>已完成同步</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );

    await user.hover(screen.getByRole('button', { name: '同步状态' }));

    const tooltip = await screen.findByRole('tooltip');
    const arrow = document.querySelector('[data-slot="tooltip-arrow"]');
    const content = document.querySelector('[data-slot="tooltip-content"]');

    expect(tooltip).toHaveTextContent('已完成同步');
    expect(arrow).toBeInTheDocument();
    expect(content).toHaveClass(
      'bg-(--ui-tooltip-background)',
      'text-(--ui-tooltip-foreground)',
    );
    expect(content).not.toHaveClass('bg-slate-950', 'text-white');
    expect(content).toHaveClass(
      'data-[state=delayed-open]:animate-ui-layer-in',
      'data-[state=instant-open]:animate-ui-layer-in',
      'data-[state=closed]:animate-ui-layer-out',
    );
  });

  it('can hide the arrow for dense surfaces', async () => {
    const user = userEvent.setup();

    const { container } = render(
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger>复制链接</TooltipTrigger>
          <TooltipContent showArrow={false}>复制当前页面链接</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );

    await user.hover(screen.getByRole('button', { name: '复制链接' }));

    expect(await screen.findByRole('tooltip')).toHaveTextContent(
      '复制当前页面链接',
    );
    expect(
      container.ownerDocument.querySelector('[data-slot="tooltip-arrow"]'),
    ).toBeNull();
  });

  it('supports default size for longer descriptions', async () => {
    const user = userEvent.setup();

    render(
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger>禁用原因</TooltipTrigger>
          <TooltipContent size="default">
            当前记录正在审批中，完成或退回后才可编辑。
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );

    await user.hover(screen.getByRole('button', { name: '禁用原因' }));

    await screen.findByRole('tooltip');

    expect(document.querySelector('[data-slot="tooltip-content"]')).toHaveClass(
      'text-sm',
    );
  });
});
