import { test, expect } from '@playwright/test';

test('リロード後に一覧が空である(非永続)', async ({ page }) => {
  await page.goto('/');
  // RED想定
  await page.reload();
  await expect(page.locator('[data-testid="todo-item"]')).toHaveCount(0);
});

