import { readFileSync } from 'node:fs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const themeCss = readFileSync('src/styles/theme.css', 'utf8');
const Z_STACK_STATE_KEY = Symbol.for(
  '@noah-ji/lyra-ui/overlay/z-stack/state/v1',
);
const sharedGlobal = globalThis as typeof globalThis & {
  [key: symbol]: { currentZIndex: number } | undefined;
};

function resetSharedZStackState() {
  delete sharedGlobal[Z_STACK_STATE_KEY];
  vi.resetModules();
}

async function loadZStack() {
  return import('../../src/overlay/z-stack');
}

describe('overlay z-stack', () => {
  beforeEach(() => {
    resetSharedZStackState();
  });

  afterEach(() => {
    resetSharedZStackState();
  });

  it('按调用顺序跨语义层全局递增 z-index', async () => {
    const { acquireZIndex, Z_BASE } = await loadZStack();
    const drawer = acquireZIndex(Z_BASE.drawer);
    const popover = acquireZIndex(Z_BASE.popover);
    const dialog = acquireZIndex(Z_BASE.dialog);
    const tooltip = acquireZIndex(Z_BASE.tooltip);

    expect(popover).toBeGreaterThan(drawer);
    expect(dialog).toBeGreaterThan(popover);
    expect(tooltip).toBeGreaterThan(dialog);
  });

  it('不会分配低于请求语义基准层的 z-index', async () => {
    const { acquireZIndex, Z_BASE } = await loadZStack();
    const imagePreview = acquireZIndex(Z_BASE.imagePreview);
    const notification = acquireZIndex(Z_BASE.notification);

    expect(imagePreview).toBeGreaterThan(Z_BASE.imagePreview);
    expect(notification).toBeGreaterThan(Z_BASE.notification);
  });

  it('notification 语义基准层与 CSS token 保持一致', async () => {
    const { Z_BASE } = await loadZStack();

    expect(Z_BASE.notification).toBe(2000);
    expect(themeCss).toContain('--z-ui-notification: 2000;');
  });

  it('重复加载模块时仍共享同一个递增状态', async () => {
    vi.resetModules();
    const firstModule = await import('../../src/overlay/z-stack');
    const first = firstModule.acquireZIndex();

    vi.resetModules();
    const secondModule = await import('../../src/overlay/z-stack');
    const second = secondModule.acquireZIndex();
    const third = firstModule.acquireZIndex();

    expect([first, second, third]).toEqual([1601, 1602, 1603]);
  });
});
