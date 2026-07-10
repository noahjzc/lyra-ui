import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import {
  Dialog,
  DialogCloseButton,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../src/components/feedback';

describe('Dialog', () => {
  it('opens dialog content with title and description', async () => {
    const user = userEvent.setup();

    render(
      <Dialog>
        <DialogTrigger>打开删除确认</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>删除客户</DialogTitle>
            <DialogDescription>删除后不可恢复</DialogDescription>
          </DialogHeader>
          <DialogCloseButton />
        </DialogContent>
      </Dialog>,
    );

    await user.click(screen.getByRole('button', { name: '打开删除确认' }));

    expect(document.querySelector('[data-slot="dialog-overlay"]')).toHaveClass(
      'bg-(--ui-overlay-subtle-background)',
      'data-[state=open]:animate-ui-fade-in',
      'data-[state=closed]:animate-ui-fade-out',
    );
    expect(
      document.querySelector('[data-slot="dialog-overlay"]'),
    ).not.toHaveClass('bg-black/20');
    expect(screen.getByRole('dialog', { name: '删除客户' })).toHaveClass(
      'w-[min(520px,calc(100vw-32px))]',
      'shadow-ui-elevation-6',
      'data-[state=open]:animate-ui-dialog-in',
      'data-[state=closed]:animate-ui-dialog-out',
    );
    expect(screen.getByText('删除后不可恢复')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '关闭' })).toBeInTheDocument();
  });
});
