import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { afterAll, describe, expect, it } from 'vitest';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../src/components/data-input';
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../../src/components/feedback';

const elementPrototype = HTMLElement.prototype as {
  hasPointerCapture?: (pointerId: number) => boolean;
};
const hasPointerCaptureWasOwn = Object.hasOwn(
  elementPrototype,
  'hasPointerCapture',
);
const hasPointerCaptureDescriptor = Object.getOwnPropertyDescriptor(
  elementPrototype,
  'hasPointerCapture',
);
const installedHasPointerCapture =
  typeof elementPrototype.hasPointerCapture !== 'function';

if (installedHasPointerCapture) {
  Object.defineProperty(elementPrototype, 'hasPointerCapture', {
    configurable: true,
    value: () => false,
  });
}

afterAll(() => {
  if (!installedHasPointerCapture) return;

  if (hasPointerCaptureWasOwn && hasPointerCaptureDescriptor != null) {
    Object.defineProperty(
      elementPrototype,
      'hasPointerCapture',
      hasPointerCaptureDescriptor,
    );
    return;
  }

  delete elementPrototype.hasPointerCapture;
});

describe('Drawer', () => {
  it('opens drawer content with accessible title and body', async () => {
    const user = userEvent.setup();

    render(
      <Drawer>
        <DrawerTrigger>打开</DrawerTrigger>
        <DrawerContent size="form">
          <DrawerHeader>
            <DrawerTitle>新建客户</DrawerTitle>
            <DrawerCloseButton />
          </DrawerHeader>
          <DrawerBody>表单内容</DrawerBody>
          <DrawerFooter>保存</DrawerFooter>
        </DrawerContent>
      </Drawer>,
    );

    await user.click(screen.getByRole('button', { name: '打开' }));

    expect(document.querySelector('[data-slot="drawer-overlay"]')).toHaveClass(
      'bg-(--ui-overlay-subtle-background)',
      'animate-ui-fade-in',
    );
    expect(
      document.querySelector('[data-slot="drawer-overlay"]'),
    ).not.toHaveClass('bg-black/20', 'dark:bg-black/50');
    const drawer = screen.getByRole('dialog', { name: '新建客户' });

    expect(drawer).toHaveAttribute('role', 'dialog');
    expect(drawer).toHaveAttribute('aria-modal', 'true');
    expect(drawer).toHaveAttribute('data-slot', 'drawer-content');
    expect(drawer).toHaveClass(
      'w-[min(840px,100vw)]',
      'shadow-ui-elevation-5',
      'animate-ui-drawer-right-in',
    );
    expect(Number.isFinite(Number(drawer.style.zIndex))).toBe(true);
    expect(screen.getByText('表单内容')).toHaveAttribute(
      'data-slot',
      'drawer-body',
    );
    expect(screen.getByText('表单内容')).toHaveClass(
      'min-h-0',
      'overflow-auto',
      'overscroll-contain',
    );
    expect(screen.getByText('保存')).toHaveAttribute(
      'data-slot',
      'drawer-footer',
    );
    expect(
      screen.getByRole('button', { name: '关闭抽屉' }),
    ).toBeInTheDocument();
  });

  it('supports detail drawer width', async () => {
    const user = userEvent.setup();

    render(
      <Drawer>
        <DrawerTrigger>打开详情</DrawerTrigger>
        <DrawerContent size="detail">
          <DrawerTitle>客户详情</DrawerTitle>
        </DrawerContent>
      </Drawer>,
    );

    await user.click(screen.getByRole('button', { name: '打开详情' }));

    expect(screen.getByRole('dialog', { name: '客户详情' })).toHaveClass(
      'w-[70vw]',
      'min-w-[600px]',
      'shadow-ui-elevation-5',
    );
  });

  it('supports assist drawer width', async () => {
    const user = userEvent.setup();

    render(
      <Drawer>
        <DrawerTrigger>打开助手</DrawerTrigger>
        <DrawerContent size="assist">
          <DrawerTitle>AI 助手</DrawerTitle>
        </DrawerContent>
      </Drawer>,
    );

    await user.click(screen.getByRole('button', { name: '打开助手' }));

    expect(screen.getByRole('dialog', { name: 'AI 助手' })).toHaveClass(
      'w-[min(640px,100vw)]',
      'shadow-ui-elevation-5',
    );
  });

  it('supports full drawer width', async () => {
    const user = userEvent.setup();

    render(
      <Drawer>
        <DrawerTrigger>打开全屏</DrawerTrigger>
        <DrawerContent size="full">
          <DrawerTitle>全屏工作区</DrawerTitle>
        </DrawerContent>
      </Drawer>,
    );

    await user.click(screen.getByRole('button', { name: '打开全屏' }));

    expect(screen.getByRole('dialog', { name: '全屏工作区' })).toHaveClass(
      'w-screen',
      'shadow-ui-elevation-5',
    );
  });

  it('stacks a Drawer-contained SelectContent above the Drawer surface', async () => {
    const user = userEvent.setup();

    render(
      <Drawer>
        <DrawerTrigger>打开客户表单</DrawerTrigger>
        <DrawerContent size="form">
          <DrawerHeader>
            <DrawerTitle>新建客户</DrawerTitle>
          </DrawerHeader>
          <DrawerBody>
            <Select>
              <SelectTrigger aria-label="客户等级">
                <SelectValue placeholder="选择等级" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="a">A级客户</SelectItem>
              </SelectContent>
            </Select>
          </DrawerBody>
        </DrawerContent>
      </Drawer>,
    );

    await user.click(screen.getByRole('button', { name: '打开客户表单' }));
    const drawer = screen.getByRole('dialog', { name: '新建客户' });
    await user.click(screen.getByRole('combobox', { name: '客户等级' }));

    const selectContent = await screen.findByRole('listbox');
    const selectPortalLayer = document.querySelector(
      '[data-slot="select-portal-layer"]',
    );

    const drawerZIndex = Number(drawer.style.zIndex);
    const selectZIndex = Number(selectContent.style.zIndex);
    const selectPortalLayerZIndex = Number(
      (selectPortalLayer as HTMLElement | null)?.style.zIndex,
    );

    expect(selectContent).toHaveAttribute('data-slot', 'select-content');
    expect(selectPortalLayer).toBeInTheDocument();
    expect(Number.isFinite(drawerZIndex)).toBe(true);
    expect(Number.isFinite(selectZIndex)).toBe(true);
    expect(Number.isFinite(selectPortalLayerZIndex)).toBe(true);
    expect(selectZIndex).toBeGreaterThan(drawerZIndex);
    expect(selectPortalLayerZIndex).toBeGreaterThan(drawerZIndex);
  });

  it('keeps the drawer open after outside click by default', async () => {
    const user = userEvent.setup();

    render(
      <Drawer>
        <DrawerTrigger>打开编辑抽屉</DrawerTrigger>
        <DrawerContent>
          <DrawerTitle>编辑客户</DrawerTitle>
          <DrawerBody>客户表单</DrawerBody>
        </DrawerContent>
      </Drawer>,
    );

    await user.click(screen.getByRole('button', { name: '打开编辑抽屉' }));
    await user.click(
      document.querySelector('[data-slot="drawer-overlay"]') as HTMLElement,
    );

    expect(
      screen.getByRole('dialog', { name: '编辑客户' }),
    ).toBeInTheDocument();
  });

  it('allows outside click to close when opted in', async () => {
    const user = userEvent.setup();

    render(
      <Drawer>
        <DrawerTrigger>打开可关闭抽屉</DrawerTrigger>
        <DrawerContent closeOnInteractOutside>
          <DrawerTitle>快捷预览</DrawerTitle>
          <DrawerBody>可点击外部关闭。</DrawerBody>
        </DrawerContent>
      </Drawer>,
    );

    await user.click(screen.getByRole('button', { name: '打开可关闭抽屉' }));
    await user.click(
      document.querySelector('[data-slot="drawer-overlay"]') as HTMLElement,
    );

    await waitFor(() => {
      expect(
        screen.queryByRole('dialog', { name: '快捷预览' }),
      ).not.toBeInTheDocument();
    });
  });

  it('forwards DrawerContent ref to the content element', async () => {
    const user = userEvent.setup();
    let contentElement: HTMLDivElement | null = null;

    render(
      <Drawer>
        <DrawerTrigger>打开 ref 抽屉</DrawerTrigger>
        <DrawerContent
          ref={element => {
            contentElement = element;
          }}
        >
          <DrawerTitle>Ref 抽屉</DrawerTitle>
        </DrawerContent>
      </Drawer>,
    );

    await user.click(screen.getByRole('button', { name: '打开 ref 抽屉' }));

    expect(contentElement).toBe(
      screen.getByRole('dialog', { name: 'Ref 抽屉' }),
    );
  });

  it('keeps force-mounted content available for close animation', async () => {
    const user = userEvent.setup();

    function ControlledDrawer() {
      const [open, setOpen] = useState(true);

      return (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent forceMount>
            <DrawerHeader>
              <DrawerTitle>受控抽屉</DrawerTitle>
              <DrawerCloseButton />
            </DrawerHeader>
          </DrawerContent>
        </Drawer>
      );
    }

    render(<ControlledDrawer />);

    await user.click(screen.getByRole('button', { name: '关闭抽屉' }));

    expect(screen.getByRole('dialog', { name: '受控抽屉' })).toHaveClass(
      'animate-ui-drawer-right-out',
    );
    expect(screen.getByRole('dialog', { name: '受控抽屉' })).toHaveStyle({
      animationFillMode: 'both',
    });

    const overlay = document.querySelector('[data-slot="drawer-overlay"]');

    expect(overlay).toHaveClass('animate-ui-fade-out');
    expect(overlay).toHaveStyle({ animationFillMode: 'both' });
  });
});
