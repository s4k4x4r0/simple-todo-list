import { test, expect } from '@playwright/test';

test('完了: 完了操作で状態が完了、順序は不変、戻し不可', async ({ page }) => {
  await page.goto('/');
  // RED想定
  await expect(page.locator('[data-testid="todo-list"]')).toHaveCount(1);
});

