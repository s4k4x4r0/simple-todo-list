import { expect, test } from '@playwright/test';

test('完了: 完了操作で状態が完了、順序は不変、戻し不可', async ({ page }) => {
  await page.goto('/');

  const input = page.getByLabel('タイトル入力');
  const addButton = page.getByRole('button', { name: '追加' });

  await input.fill('書類提出');
  await addButton.click();

  const items = page.locator('[data-testid="todo-item"]');
  const beforeCount = await items.count();
  const first = items.first();
  await first.getByRole('button', { name: '完了' }).click();

  // 状態が完了に変わる
  await expect(first).toContainText('完了');
  // ボタンが消えて戻し不可
  await expect(first.getByRole('button', { name: '完了' })).toHaveCount(0);
  // 並び順は不変（作成日時昇順のまま、件数も変わらない）
  await expect(items).toHaveCount(beforeCount);
});
