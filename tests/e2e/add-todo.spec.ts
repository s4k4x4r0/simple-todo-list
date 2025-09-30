import { expect, test } from '@playwright/test';

test('追加: 入力→追加→末尾に未完了で表示、無効入力はボタン無効', async ({ page }) => {
  await page.goto('/');

  const input = page.getByLabel('タイトル入力');
  const addButton = page.getByRole('button', { name: '追加' });

  await expect(addButton).toBeDisabled();

  await input.fill('買い物');
  await expect(addButton).toBeEnabled();
  await addButton.click();

  const items = page.locator('[data-testid="todo-item"]');
  const count = await items.count();
  expect(count).toBeGreaterThan(0);

  const last = items.nth(count - 1);
  await expect(last).toContainText('買い物');
  await expect(last).toContainText('未完了');
});
