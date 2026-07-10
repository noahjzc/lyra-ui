import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { acquireZIndex, Z_BASE } from '../../src/overlay/z-stack';

const themeCss = readFileSync('src/styles/theme.css', 'utf8');

describe('overlay z-stack', () => {
  it('按调用顺序跨语义层全局递增 z-index', () => {
    const drawer = acquireZIndex(Z_BASE.drawer);
    const popover = acquireZIndex(Z_BASE.popover);
    const dialog = acquireZIndex(Z_BASE.dialog);
    const tooltip = acquireZIndex(Z_BASE.tooltip);

    expect(popover).toBeGreaterThan(drawer);
    expect(dialog).toBeGreaterThan(popover);
    expect(tooltip).toBeGreaterThan(dialog);
  });

  it('不会分配低于请求语义基准层的 z-index', () => {
    const imagePreview = acquireZIndex(Z_BASE.imagePreview);
    const notification = acquireZIndex(Z_BASE.notification);

    expect(imagePreview).toBeGreaterThan(Z_BASE.imagePreview);
    expect(notification).toBeGreaterThan(Z_BASE.notification);
  });

  it('notification 语义基准层与 CSS token 保持一致', () => {
    expect(Z_BASE.notification).toBe(2000);
    expect(themeCss).toContain('--z-ui-notification: 2000;');
  });
});
