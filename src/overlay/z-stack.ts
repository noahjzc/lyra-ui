import type { Ref, RefCallback } from 'react';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';

/**
 * 浮层 z-index 语义基准层。
 *
 * 基准值记录默认语义层级；运行时分配使用一个全局单调计数器，
 * 确保最近打开的交互浮层显示在之前打开的界面之上，
 * 包括 Drawer 内部打开的面板。
 */
const Z_BASE = {
  tooltip: 1100,
  popover: 1200,
  drawer: 1400,
  dialog: 1500,
  imagePreview: 1600,
  notification: 2000,
} as const;

let currentZIndex: number = Z_BASE.imagePreview;
const OPEN_STATES = new Set(['open', 'delayed-open', 'instant-open']);

function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (typeof ref === 'function') {
    ref(value);
    return;
  }

  if (ref) {
    ref.current = value;
  }
}

function isOpenOverlay(element: HTMLElement) {
  const state = element.dataset.state;
  return state == null || OPEN_STATES.has(state);
}

/**
 * 获取下一个运行时 z-index。
 *
 * `base` 保证浮层不低于自身语义层；全局递增保证后打开浮层在上。
 */
export function acquireZIndex(base: number = Z_BASE.popover): number {
  currentZIndex = Math.max(currentZIndex + 1, base + 1);
  return currentZIndex;
}

/**
 * Hook: 组件 mount 时获取递增 z-index。
 *
 * 仅适用于 mount 与 open 生命周期完全一致的浮层。
 * Radix Content 支持 forceMount 时应使用 `useOverlayZIndex`。
 */
export function useZIndex(base: number = Z_BASE.popover): number {
  const [zIndex] = useState(() => acquireZIndex(base));
  return zIndex;
}

/**
 * Hook: 在浮层实际打开时获取递增 z-index。
 *
 * Radix Content 常通过 `data-state` 表示打开状态；forceMount 场景下
 * Content 会提前 mount，因此需要监听 open 状态，而不是只看组件 mount。
 */
export function useOverlayZIndex<T extends HTMLElement = HTMLElement>(
  base: number = Z_BASE.popover,
  forwardedRef?: Ref<T>,
  open?: boolean,
): [number, RefCallback<T>] {
  const [zIndex, setZIndex] = useState(base);
  const elementRef = useRef<T | null>(null);
  const pendingRaiseRef = useRef(false);
  const wasOpenRef = useRef(false);
  const observerRef = useRef<MutationObserver | null>(null);

  const raiseZIndex = useCallback(() => {
    if (pendingRaiseRef.current) return;

    pendingRaiseRef.current = true;
    queueMicrotask(() => {
      pendingRaiseRef.current = false;

      if (elementRef.current == null || !isOpenOverlay(elementRef.current)) {
        return;
      }

      setZIndex(acquireZIndex(base));
    });
  }, [base]);

  const syncOpenState = useCallback(
    (element: T) => {
      const isOpen = isOpenOverlay(element);

      if (isOpen && !wasOpenRef.current) {
        raiseZIndex();
      }

      wasOpenRef.current = isOpen;
    },
    [raiseZIndex],
  );

  useLayoutEffect(() => {
    if (open == null) return;

    if (open && !wasOpenRef.current) {
      raiseZIndex();
    }

    wasOpenRef.current = open;
  }, [open, raiseZIndex]);

  const layerRef = useCallback(
    (element: T | null) => {
      if (elementRef.current === element) {
        assignRef(forwardedRef, element);
        return;
      }

      observerRef.current?.disconnect();
      observerRef.current = null;
      elementRef.current = element;
      assignRef(forwardedRef, element);

      if (element == null) {
        if (open == null || !open) {
          wasOpenRef.current = false;
        }

        return;
      }

      if (open != null) {
        if (open && !wasOpenRef.current) {
          raiseZIndex();
        }

        if (!open) {
          wasOpenRef.current = false;
        }

        return;
      }

      wasOpenRef.current = false;
      syncOpenState(element);

      observerRef.current = new MutationObserver(() => {
        syncOpenState(element);
      });
      observerRef.current.observe(element, {
        attributeFilter: ['data-state'],
        attributes: true,
      });
    },
    [forwardedRef, open, raiseZIndex, syncOpenState],
  );

  return [zIndex, layerRef];
}

export { Z_BASE };
