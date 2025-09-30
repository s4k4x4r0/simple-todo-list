import { test, expect } from '@playwright/test';

test('追加: 入力→追加→末尾に未完了で表示、無効入力はボタン無効', async ({ page }) => {
  await page.goto('/');
  // まだ実装前のためRED想定。セレクタは後で実装に合わせて調整
  await expect(page.getByRole('button', { name: '追加' })).toBeDisabled();
});

