import { expect, test } from '@playwright/test';

test('一覧がタイトルと状態のみを表示する(否定確認)', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-testid="created-at"]')).toHaveCount(0);
});
