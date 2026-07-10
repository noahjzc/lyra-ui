import { expect, test } from '@playwright/test';

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
      await page.screenshot({
        animations: 'disabled',
        fullPage: true,
        path: `.tmp/evidence/${label}/${story}-${theme}.png`,
      });
    });
  }
}
