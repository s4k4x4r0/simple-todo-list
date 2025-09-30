import { expect, test } from '@playwright/test';

test('リロード後に一覧が空である(非永続)', async ({ page }) => {
  await page.goto('/');
  const input = page.getByLabel('タイトル入力');
  const addButton = page.getByRole('button', { name: '追加' });
  await input.fill('一時的');
  await addButton.click();
  await page.reload();
  await expect(page.locator('[data-testid="todo-item"]')).toHaveCount(0);
});
