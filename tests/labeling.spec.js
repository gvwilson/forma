import { test, expect } from '@playwright/test';

const URL = '/tests/fixtures/labeling.html';

test.describe('LabelingWidget', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URL);
  });

  test('renders the question text', async ({ page }) => {
    await expect(page.locator('.forma-question')).toHaveText('Label each line of code:');
  });

  test('renders the correct number of labels', async ({ page }) => {
    await expect(page.locator('.forma-label-item')).toHaveCount(3);
  });

  test('label items show numbered badges', async ({ page }) => {
    const badges = page.locator('.forma-label-num');
    await expect(badges.nth(0)).toHaveText('1');
    await expect(badges.nth(1)).toHaveText('2');
    await expect(badges.nth(2)).toHaveText('3');
  });

  test('renders the correct number of text lines', async ({ page }) => {
    await expect(page.locator('.forma-text-line')).toHaveCount(3);
  });

  test('Check Labels button is present', async ({ page }) => {
    await expect(page.locator('button:has-text("Check Labels")')).toBeVisible();
  });

  test('dragging a label onto a text line adds a badge to that line', async ({ page }) => {
    await page.locator('.forma-label-num').nth(0).dragTo(page.locator('.forma-label-drop-zone').nth(0));
    await expect(page.locator('.forma-label-drop-zone').nth(0).locator('.forma-label-badge')).toHaveCount(1);
  });

  test('correctly placed label gets forma-correct class after checking', async ({ page }) => {
    // Label 0 (Variable) on line 0 (x = 5) — matches correct_labels {"0": [0]}
    await page.locator('.forma-label-num').nth(0).dragTo(page.locator('.forma-label-drop-zone').nth(0));
    await page.locator('button:has-text("Check Labels")').click();
    await expect(page.locator('.forma-label-badge').nth(0)).toHaveClass(/forma-correct/);
  });

  test('incorrectly placed label gets forma-incorrect class after checking', async ({ page }) => {
    // Label 1 (Function) on line 0 (x = 5) — wrong, correct is label 0
    await page.locator('.forma-label-num').nth(1).dragTo(page.locator('.forma-label-drop-zone').nth(0));
    await page.locator('button:has-text("Check Labels")').click();
    await expect(page.locator('.forma-label-badge').nth(0)).toHaveClass(/forma-incorrect/);
  });

  test('score text appears after checking', async ({ page }) => {
    await page.locator('.forma-label-num').nth(0).dragTo(page.locator('.forma-label-drop-zone').nth(0));
    await page.locator('button:has-text("Check Labels")').click();
    await expect(page.locator('.forma-feedback')).toBeVisible();
    await expect(page.locator('.forma-feedback')).toContainText('/3 correct');
  });

  test('model.set is called with placed_labels on checking', async ({ page }) => {
    await page.locator('.forma-label-num').nth(0).dragTo(page.locator('.forma-label-drop-zone').nth(0));
    await page.locator('button:has-text("Check Labels")').click();
    const setCalls = await page.evaluate(() => window._setCalls);
    const valueCall = setCalls.filter(([k]) => k === 'value').at(-1);
    expect(valueCall).toBeTruthy();
    expect(valueCall[1]).toHaveProperty('placed_labels');
  });
});
