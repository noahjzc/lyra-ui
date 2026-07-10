import { readFileSync } from 'node:fs';
import { dirname, relative, resolve, sep } from 'node:path';
import ts from 'typescript';
import { describe, expect, expectTypeOf, it } from 'vitest';
import * as publicApi from '../../src';
import type {
  PaginationProps,
  TabsContentProps,
  TabsListProps,
  TabsProps,
  TabsTriggerProps,
} from '../../src/index';

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

const rootEntryPath = resolve('src/index.ts');

function normalizePath(path: string) {
  return relative(process.cwd(), resolve(path)).split(sep).join('/');
}

const privateModuleTargets = [
  'src/overlay',
  'src/internal',
  'src/components/data-input/time-columns',
  'src/components/data-view/popover/variants',
].map(normalizePath);

function rootExportTargets() {
  const source = readFileSync(rootEntryPath, 'utf8');
  const sourceFile = ts.createSourceFile(
    rootEntryPath,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );

  return sourceFile.statements.flatMap(statement => {
    if (!ts.isExportDeclaration(statement)) return [];
    if (
      !statement.moduleSpecifier ||
      !ts.isStringLiteral(statement.moduleSpecifier)
    ) {
      return [];
    }

    return [
      normalizePath(
        resolve(dirname(rootEntryPath), statement.moduleSpecifier.text),
      ),
    ];
  });
}

function targetsPrivateModule(moduleTarget: string, privateTarget: string) {
  return (
    moduleTarget === privateTarget ||
    moduleTarget.startsWith(`${privateTarget}/`)
  );
}

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

  it('exports required navigation prop types from the root API', () => {
    expectTypeOf<PaginationProps['total']>().toEqualTypeOf<number>();
    expectTypeOf<TabsContentProps['value']>().toEqualTypeOf<string>();
    expectTypeOf<TabsListProps['variant']>().toEqualTypeOf<
      'line' | 'segment' | 'card' | 'cache' | undefined
    >();
    expectTypeOf<TabsProps['size']>().toEqualTypeOf<
      'small' | 'middle' | 'large' | undefined
    >();
    expectTypeOf<TabsTriggerProps['size']>().toEqualTypeOf<
      'small' | 'middle' | 'large' | undefined
    >();
  });

  it('does not export prohibited implementation modules from the root barrel', () => {
    for (const moduleTarget of rootExportTargets()) {
      for (const privateTarget of privateModuleTargets) {
        expect(
          targetsPrivateModule(moduleTarget, privateTarget),
          `src/index.ts exports ${moduleTarget} through ${privateTarget}`,
        ).toBe(false);
      }
    }
  });
});
