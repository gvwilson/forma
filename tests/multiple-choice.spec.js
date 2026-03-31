import { test, expect } from '@playwright/test';

const URL = '/tests/fixtures/multiple-choice.html';

test.describe('MultipleChoiceWidget', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URL);
  });

  test('renders the question text', async ({ page }) => {
    await expect(page.locator('.forma-question')).toHaveText('What is 2 + 2?');
  });

  test('renders all answer options', async ({ page }) => {
    const options = page.locator('.forma-option');
    await expect(options).toHaveCount(3);
    await expect(options.nth(0)).toContainText('Three');
    await expect(options.nth(1)).toContainText('Four');
    await expect(options.nth(2)).toContainText('Five');
  });

  test('clicking the correct option shows ✓ Correct! feedback', async ({ page }) => {
    await page.locator('.forma-option').nth(1).click();
    await expect(page.locator('.forma-feedback')).toHaveText('✓ Correct!');
  });

  test('correct feedback has forma-correct CSS class', async ({ page }) => {
    await page.locator('.forma-option').nth(1).click();
    await expect(page.locator('.forma-feedback')).toHaveClass(/forma-correct/);
  });

  test('clicking an incorrect option shows ✗ Incorrect feedback', async ({ page }) => {
    await page.locator('.forma-option').nth(0).click();
    await expect(page.locator('.forma-feedback')).toHaveText('✗ Incorrect');
  });

  test('incorrect feedback has forma-incorrect CSS class', async ({ page }) => {
    await page.locator('.forma-option').nth(0).click();
    await expect(page.locator('.forma-feedback')).toHaveClass(/forma-incorrect/);
  });

  test('answer is locked after first selection', async ({ page }) => {
    await page.locator('.forma-option').nth(0).click();
    const before = await page.locator('.forma-feedback').textContent();
    // Clicking a different option should have no effect
    await page.locator('.forma-option').nth(1).click();
    await expect(page.locator('.forma-feedback')).toHaveText(before);
  });

  test('per-option explanation appears after answering', async ({ page }) => {
    await page.locator('.forma-option').nth(1).click();
    await expect(page.locator('.forma-explanation')).toBeVisible();
    await expect(page.locator('.forma-explanation')).toContainText('Correct: two plus two is four.');
  });

  test('per-option explanation for incorrect answer is shown', async ({ page }) => {
    await page.locator('.forma-option').nth(0).click();
    await expect(page.locator('.forma-explanation')).toBeVisible();
    await expect(page.locator('.forma-explanation')).toContainText('Wrong: three is one less than four.');
  });

  test('model.set is called with selected index, correct flag, and answered flag', async ({ page }) => {
    await page.locator('.forma-option').nth(1).click();
    const setCalls = await page.evaluate(() => window._setCalls);
    const valueCall = setCalls.find(([k]) => k === 'value');
    expect(valueCall).toBeTruthy();
    expect(valueCall[1]).toMatchObject({ selected: 1, correct: true, answered: true });
  });

  test('unselected non-correct options get forma-faded class', async ({ page }) => {
    // Select option 0 (incorrect); option 2 should be faded since it is neither selected nor correct
    await page.locator('.forma-option').nth(0).click();
    await expect(page.locator('.forma-option').nth(2)).toHaveClass(/forma-faded/);
  });
});
