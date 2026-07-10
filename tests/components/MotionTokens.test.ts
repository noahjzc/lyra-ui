import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const themeCss = readFileSync('src/styles/theme.css', 'utf8');

describe('motion tokens', () => {
  it('defines semantic motion variables', () => {
    expect(themeCss).toContain('--ui-motion-duration-instant: 75ms;');
    expect(themeCss).toContain('--ui-motion-duration-fast: 120ms;');
    expect(themeCss).toContain('--ui-motion-duration-base: 150ms;');
    expect(themeCss).toContain('--ui-motion-duration-layer-in: 160ms;');
    expect(themeCss).toContain('--ui-motion-duration-layer-out: 100ms;');
    expect(themeCss).toContain('--ui-motion-duration-surface-in: 220ms;');
    expect(themeCss).toContain('--ui-motion-duration-surface-out: 160ms;');
    expect(themeCss).toContain('--ui-motion-duration-disclosure: 200ms;');
    expect(themeCss).toContain(
      '--ui-motion-ease-standard: cubic-bezier(0.2, 0, 0, 1);',
    );
    expect(themeCss).toContain(
      '--ui-motion-ease-enter: cubic-bezier(0.16, 1, 0.3, 1);',
    );
    expect(themeCss).toContain(
      '--ui-motion-ease-exit: cubic-bezier(0.4, 0, 1, 1);',
    );
    expect(themeCss).toContain('--ui-motion-ease-linear: linear;');
    expect(themeCss).toContain('--ui-motion-translate-xs: 2px;');
    expect(themeCss).toContain('--ui-motion-translate-sm: 4px;');
    expect(themeCss).toContain('--ui-motion-translate-md: 8px;');
    expect(themeCss).toContain('--ui-motion-scale-layer: 0.98;');
    expect(themeCss).toContain('--ui-motion-scale-dialog: 0.96;');
    expect(themeCss).toContain('--ui-motion-active-scale: 0.98;');
  });

  it('defines semantic motion utilities', () => {
    [
      '.transition-ui-state',
      '.transition-ui-transform',
      '.animate-ui-fade-in',
      '.animate-ui-fade-out',
      '.animate-ui-layer-in',
      '.animate-ui-layer-out',
      '.animate-ui-popover-in',
      '.animate-ui-popover-out',
      '.animate-ui-dialog-in',
      '.animate-ui-dialog-out',
      '.animate-ui-drawer-right-in',
      '.animate-ui-drawer-right-out',
      '.animate-ui-drawer-left-in',
      '.animate-ui-drawer-left-out',
      '.animate-ui-drawer-top-in',
      '.animate-ui-drawer-top-out',
      '.animate-ui-drawer-bottom-in',
      '.animate-ui-drawer-bottom-out',
      '.animate-ui-disclosure-in',
      '.animate-ui-disclosure-out',
    ].forEach(className => {
      expect(themeCss).toContain(className);
    });
  });

  it('keeps reduced motion support', () => {
    expect(themeCss).toContain('@media (prefers-reduced-motion: reduce)');
    expect(themeCss).toContain('transition-duration: 1ms !important;');
    expect(themeCss).toContain('animation-duration: 1ms !important;');
  });
});
