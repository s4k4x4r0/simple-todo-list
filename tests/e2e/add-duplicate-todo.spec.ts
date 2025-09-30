import { expect, test } from '@playwright/test';

test('重複タイトルを2回追加すると2件存在する', async ({ page }) => {
  await page.goto('/');
  const input = page.getByLabel('タイトル入力');
  const addButton = page.getByRole('button', { name: '追加' });

  await input.fill('同じ');
  await addButton.click();
  await input.fill('同じ');
  await addButton.click();

  await expect(page.locator('[data-testid="todo-item"]')).toHaveCount(2);
});
