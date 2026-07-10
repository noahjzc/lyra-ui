import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import * as publicApi from '../../src';

const requiredExports = [
  'Button',
  'Input',
  'Avatar',
  'DataTable',
  'Alert',
  'DropdownMenu',
  'DropdownMenuCheckboxItem',
  'DropdownMenuContent',
  'DropdownMenuGroup',
  'DropdownMenuItem',
  'DropdownMenuLabel',
  'DropdownMenuPortal',
  'DropdownMenuRadioGroup',
  'DropdownMenuRadioItem',
  'DropdownMenuSeparator',
  'DropdownMenuShortcut',
  'DropdownMenuSub',
  'DropdownMenuSubContent',
  'DropdownMenuSubTrigger',
  'DropdownMenuTrigger',
  'Pagination',
  'Tabs',
  'TabsContent',
  'TabsList',
  'TabsTrigger',
];

const privateRuntimeExports = [
  'acquireZIndex',
  'useOverlayZIndex',
  'useZIndex',
  'Z_BASE',
  'cn',
  'disclosurePanelMotionClassName',
  'disclosurePanelContentMotionClassName',
  'usePrefersReducedMotion',
  'useDisclosureMotion',
  'TimeColumns',
  'popoverLayerShadowStyle',
  'popoverContentVariants',
  'popoverHeaderClassName',
  'popoverBodyClassName',
  'popoverFooterClassName',
  'popoverArrowClassName',
  'popoverArrowFillPathClassName',
  'popoverArrowStrokePathClassName',
  'popoverArrowFillPath',
  'popoverArrowStrokePath',
  'popoverArrowSize',
  'popoverPlacementVariants',
  'getPopoverPlacementProps',
  'shouldRenderPopoverArrow',
  'shouldPointPopoverArrowAtCenter',
];

describe('root public API contract', () => {
  it('exposes representative component families and required navigation exports', () => {
    for (const exportName of requiredExports) {
      expect(
        publicApi,
        `${exportName} is missing from the root API`,
      ).toHaveProperty(exportName);
    }
  });

  it('does not leak overlay, internal, or private component runtime exports', () => {
    for (const exportName of privateRuntimeExports) {
      expect(
        publicApi,
        `${exportName} leaked through the root API`,
      ).not.toHaveProperty(exportName);
    }
  });

  it('does not reference prohibited implementation modules from the root barrel', () => {
    const source = readFileSync('src/index.ts', 'utf8');

    for (const path of [
      './overlay',
      './internal',
      'time-columns',
      'popover/variants',
    ]) {
      expect(source, `src/index.ts references ${path}`).not.toContain(path);
    }
  });
});
