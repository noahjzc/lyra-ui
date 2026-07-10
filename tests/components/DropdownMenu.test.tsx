import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import * as DropdownMenuCompat from '../../src/components/navigation';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '../../src/components/navigation';

describe('DropdownMenu', () => {
  it('opens menu and handles item selection', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>更多操作</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={onSelect}>编辑客户</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    await user.click(screen.getByRole('button', { name: '更多操作' }));
    expect(screen.getByRole('menu')).toHaveClass('shadow-ui-elevation-2');
    expect(screen.getByRole('menu')).not.toHaveClass('shadow-ui-popover');

    await user.click(screen.getByRole('menuitem', { name: '编辑客户' }));

    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('supports Radix-compatible namespace part names', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <DropdownMenuCompat.Root>
        <DropdownMenuCompat.Trigger>兼容操作</DropdownMenuCompat.Trigger>
        <DropdownMenuCompat.Content>
          <DropdownMenuCompat.Item onSelect={onSelect}>
            兼容编辑
          </DropdownMenuCompat.Item>
        </DropdownMenuCompat.Content>
      </DropdownMenuCompat.Root>,
    );

    await user.click(screen.getByRole('button', { name: '兼容操作' }));
    await user.click(screen.getByRole('menuitem', { name: '兼容编辑' }));

    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('aligns content width with trigger and inherits default item text size', async () => {
    const user = userEvent.setup();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>自动刷新 从不</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>从不</DropdownMenuItem>
          <DropdownMenuCheckboxItem checked>每 5 分钟</DropdownMenuCheckboxItem>
          <DropdownMenuRadioItem value="minute-15">
            每 15 分钟
          </DropdownMenuRadioItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    await user.click(screen.getByRole('button', { name: '自动刷新 从不' }));

    expect(screen.getByRole('menu')).toHaveClass(
      'min-w-(--radix-dropdown-menu-trigger-width)',
      'grid',
      'gap-1',
    );
    for (const item of screen.getAllByRole('menuitem')) {
      expect(item).toHaveClass('min-h-8', 'py-2');
      expect(item).not.toHaveClass('text-sm');
      expect(item).not.toHaveClass('text-[13px]');
    }
  });
});
