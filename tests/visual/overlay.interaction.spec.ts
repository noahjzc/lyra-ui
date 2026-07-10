import { expect, test } from '@playwright/test';

test('later nested overlays rise above the parent drawer', async ({ page }) => {
  await page.goto(
    '/iframe.html?id=primitives-feedback-drawer--nested&globals=theme:light',
  );
  await page.getByRole('button', { name: '打开嵌套抽屉' }).click();

  const parent = page.locator('[data-slot="drawer-content"]').last();
  const parentZ = Number(
    await parent.evaluate(node => getComputedStyle(node).zIndex),
  );
  expect(parentZ).toBe(1601);

  const selectTrigger = page.getByRole('combobox', { name: '负责人' });
  await selectTrigger.click();
  const select = page.locator('[data-slot="select-content"]');
  const selectZ = Number(
    await select.evaluate(node => getComputedStyle(node).zIndex),
  );
  expect(selectZ).toBe(1602);
  expect(selectZ).toBeGreaterThan(parentZ);

  await page.keyboard.press('Escape');
  await expect(select).toBeHidden();
  await expect(selectTrigger).toBeFocused();

  const nestedTrigger = page.getByRole('button', {
    name: '查看分配依据',
  });
  await nestedTrigger.click();

  const drawers = page.locator('[data-slot="drawer-content"]');
  await expect(drawers).toHaveCount(2);
  const nestedZ = Number(
    await drawers.nth(1).evaluate(node => getComputedStyle(node).zIndex),
  );
  expect(nestedZ).toBe(1603);
  expect(nestedZ).toBeGreaterThan(parentZ);
  expect(nestedZ).toBeGreaterThan(selectZ);

  await page.keyboard.press('Escape');
  await expect(drawers).toHaveCount(1);
  await expect(nestedTrigger).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(drawers).toHaveCount(0);
  await expect(
    page.getByRole('button', { name: '打开嵌套抽屉' }),
  ).toBeFocused();
});
