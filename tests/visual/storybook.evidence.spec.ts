import { expect, test } from '@playwright/test';

const viewport = { height: 900, width: 1440 } as const;

// PNG IHDR 的宽高是从文件头第 16/20 字节开始的 32 位大端整数。
function readPngIhdrDimensions(image: Buffer) {
  const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  if (
    image.length < 24 ||
    !image.subarray(0, 8).equals(pngSignature) ||
    image.subarray(12, 16).toString('ascii') !== 'IHDR'
  ) {
    throw new Error('Screenshot is not a valid PNG with an IHDR header.');
  }

  return {
    height: image.readUInt32BE(20),
    width: image.readUInt32BE(16),
  };
}

const stories = [
  'primitives-general-button--variants',
  'primitives-data-input-form--overview',
  'primitives-data-input-select--states',
  'primitives-data-view-datatable--basic',
  'primitives-navigation-tabs--states',
  'primitives-feedback-dialog--basic',
  'primitives-feedback-drawer--nested',
  'primitives-data-view-popover--column-settings',
  'primitives-data-view-tooltip--icon-labels',
] as const;

const label = process.env.EVIDENCE_LABEL ?? 'target';

for (const story of stories) {
  for (const theme of ['light', 'dark'] as const) {
    test(`${story} ${theme}`, async ({ page }) => {
      await page.goto(`/iframe.html?id=${story}&globals=theme:${theme}`);
      const root = page.locator('#storybook-root');
      await expect(root).toBeVisible();
      await page.evaluate(selectedTheme => {
        document.documentElement.dataset.theme = selectedTheme;
      }, theme);
      await page.evaluate(() => document.fonts.ready);
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await expect
        .poll(async () => (await root.boundingBox())?.width ?? 0)
        .toBeGreaterThan(100);
      await expect
        .poll(async () => (await root.boundingBox())?.height ?? 0)
        .toBeGreaterThan(20);

      // 不比较会受滚动条影响的 clientWidth，而对 body/html 的真实滚动范围取最大值。
      const documentScrollSize = await page.evaluate(() => ({
        height: Math.max(
          document.documentElement.scrollHeight,
          document.body?.scrollHeight ?? 0,
        ),
        width: Math.max(
          document.documentElement.scrollWidth,
          document.body?.scrollWidth ?? 0,
        ),
      }));
      expect(documentScrollSize.width).toBeLessThanOrEqual(viewport.width);
      expect(documentScrollSize.height).toBeLessThanOrEqual(viewport.height);

      const box = await root.boundingBox();
      expect(box).not.toBeNull();
      if (box == null) {
        throw new Error('Storybook root has no bounding box.');
      }
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.y).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(viewport.width);
      expect(box.y + box.height).toBeLessThanOrEqual(viewport.height);

      const image = await page.screenshot({
        animations: 'disabled',
        fullPage: false,
        path: `.tmp/evidence/${label}/${story}-${theme}.png`,
      });
      expect(readPngIhdrDimensions(image)).toEqual(viewport);
    });
  }
}
