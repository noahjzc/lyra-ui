import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from '../../src/components/feedback';

describe('Modal', () => {
  it('opens a confirm dialog with overlay, animation, and fixed regions', async () => {
    const user = userEvent.setup();

    render(
      <Modal>
        <ModalTrigger>打开确认</ModalTrigger>
        <ModalContent size="small">
          <ModalHeader>
            <ModalTitle>删除客户</ModalTitle>
            <ModalDescription>删除后不可恢复。</ModalDescription>
            <ModalCloseButton />
          </ModalHeader>
          <ModalBody>正文内容</ModalBody>
          <ModalFooter>操作区</ModalFooter>
        </ModalContent>
      </Modal>,
    );

    await user.click(screen.getByRole('button', { name: '打开确认' }));

    expect(document.querySelector('[data-slot="modal-overlay"]')).toHaveClass(
      'bg-(--ui-overlay-background)',
      'data-[state=open]:animate-ui-fade-in',
      'data-[state=closed]:animate-ui-fade-out',
    );
    expect(
      document.querySelector('[data-slot="modal-overlay"]'),
    ).not.toHaveClass('bg-black/50', 'dark:bg-black/70');
    const modal = screen.getByRole('dialog', { name: '删除客户' });

    expect(modal).toHaveAttribute('role', 'dialog');
    expect(modal).toHaveAttribute('aria-modal', 'true');
    expect(modal).toHaveClass(
      'shadow-ui-elevation-6',
      'rounded-lg',
      'max-h-[calc(100vh-32px)]',
      'w-[min(400px,calc(100vw-32px))]',
      'grid-rows-[auto_minmax(0,1fr)_auto]',
      'data-[state=open]:animate-ui-dialog-in',
      'data-[state=closed]:animate-ui-dialog-out',
    );
    expect(Number.isFinite(Number(modal.style.zIndex))).toBe(true);
    expect(screen.getByText('正文内容')).toHaveAttribute(
      'data-slot',
      'modal-body',
    );
    expect(screen.getByText('正文内容')).toHaveClass(
      'overflow-auto',
      'overscroll-contain',
    );
    expect(screen.getByText('操作区')).toHaveAttribute(
      'data-slot',
      'modal-footer',
    );
    expect(
      screen.getByRole('button', { name: '关闭弹窗' }),
    ).toBeInTheDocument();
  });

  it('renders loading state inside the footer action area', async () => {
    const user = userEvent.setup();

    render(
      <Modal>
        <ModalTrigger>打开加载</ModalTrigger>
        <ModalContent loading>
          <ModalHeader>
            <ModalTitle>同步客户数据</ModalTitle>
          </ModalHeader>
          <ModalBody>正在同步客户资料。</ModalBody>
          <ModalFooter>保存中</ModalFooter>
        </ModalContent>
      </Modal>,
    );

    await user.click(screen.getByRole('button', { name: '打开加载' }));

    expect(
      screen.getByRole('dialog', { name: '同步客户数据' }),
    ).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByText('保存中')).toHaveAttribute(
      'data-slot',
      'modal-footer',
    );
  });

  it('keeps the modal open after outside click by default', async () => {
    const user = userEvent.setup();

    render(
      <Modal>
        <ModalTrigger>打开编辑</ModalTrigger>
        <ModalContent>
          <ModalTitle>编辑客户</ModalTitle>
          <ModalBody>客户表单</ModalBody>
        </ModalContent>
      </Modal>,
    );

    await user.click(screen.getByRole('button', { name: '打开编辑' }));
    await user.click(
      document.querySelector('[data-slot="modal-overlay"]') as HTMLElement,
    );

    expect(
      screen.getByRole('dialog', { name: '编辑客户' }),
    ).toBeInTheDocument();
  });

  it('allows outside click to close when opted in', async () => {
    const user = userEvent.setup();

    render(
      <Modal>
        <ModalTrigger>打开轻提示</ModalTrigger>
        <ModalContent closeOnInteractOutside>
          <ModalTitle>快速确认</ModalTitle>
          <ModalBody>可点击外部关闭。</ModalBody>
        </ModalContent>
      </Modal>,
    );

    await user.click(screen.getByRole('button', { name: '打开轻提示' }));
    await user.click(
      document.querySelector('[data-slot="modal-overlay"]') as HTMLElement,
    );

    await waitFor(() => {
      expect(
        screen.queryByRole('dialog', { name: '快速确认' }),
      ).not.toBeInTheDocument();
    });
  });
});
