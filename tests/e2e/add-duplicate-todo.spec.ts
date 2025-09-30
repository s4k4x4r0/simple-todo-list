import { test, expect } from '@playwright/test';

test('重複タイトルを2回追加すると2件存在する', async ({ page }) => {
  await page.goto('/');
  // RED想定
  await expect(page.locator('[data-testid="todo-item"]')).toHaveCount(2);
});

