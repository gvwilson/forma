import { test, expect } from '@playwright/test';

const URL = '/tests/fixtures/predict-then-check.html';

test.describe('PredictThenCheckWidget', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URL);
  });

  test('renders the question text', async ({ page }) => {
    await expect(page.locator('.faw-question')).toHaveText('What does this code print?');
  });

  test('renders the code block', async ({ page }) => {
    await expect(page.locator('.faw-code')).toBeVisible();
    await expect(page.locator('.faw-code')).toContainText('x = 2 + 2');
  });

  test('renders all answer options', async ({ page }) => {
    const options = page.locator('.faw-option');
    await expect(options).toHaveCount(3);
    await expect(options.nth(0)).toContainText('2');
    await expect(options.nth(1)).toContainText('4');
    await expect(options.nth(2)).toContainText('22');
  });

  test('clicking the correct option shows ✓ Correct! feedback', async ({ page }) => {
    await page.locator('.faw-option').nth(1).click();
    await expect(page.locator('.faw-feedback')).toHaveText('✓ Correct!');
  });

  test('clicking an incorrect option shows ✗ Incorrect feedback', async ({ page }) => {
    await page.locator('.faw-option').nth(0).click();
    await expect(page.locator('.faw-feedback')).toHaveText('✗ Incorrect');
  });

  test('per-option explanation for correct answer is shown', async ({ page }) => {
    await page.locator('.faw-option').nth(1).click();
    await expect(page.locator('.faw-explanation')).toBeVisible();
    await expect(page.locator('.faw-explanation')).toContainText('Correct: 2 + 2 = 4.');
  });

  test('per-option explanation for incorrect answer is shown', async ({ page }) => {
    await page.locator('.faw-option').nth(0).click();
    await expect(page.locator('.faw-explanation')).toBeVisible();
    await expect(page.locator('.faw-explanation')).toContainText('Wrong: + here is addition');
  });

  test('Reveal Output button is visible before answering', async ({ page }) => {
    await expect(page.locator('.faw-reveal-btn')).toBeVisible();
  });

  test('output is hidden before Reveal is clicked', async ({ page }) => {
    await expect(page.locator('.faw-output')).toBeHidden();
  });

  test('clicking Reveal Output shows the actual output', async ({ page }) => {
    await page.locator('.faw-reveal-btn').click();
    await expect(page.locator('.faw-output')).toBeVisible();
    await expect(page.locator('.faw-output')).toHaveText('4');
  });

  test('Reveal Output button is disabled after clicking', async ({ page }) => {
    await page.locator('.faw-reveal-btn').click();
    await expect(page.locator('.faw-reveal-btn')).toBeDisabled();
  });

  test('model.set is called with selected index, correct flag, and answered flag', async ({ page }) => {
    await page.locator('.faw-option').nth(1).click();
    const setCalls = await page.evaluate(() => window._setCalls);
    const valueCall = setCalls.find(([k]) => k === 'value');
    expect(valueCall).toBeTruthy();
    expect(valueCall[1]).toMatchObject({ selected: 1, correct: true, answered: true });
  });

  test('answer is locked after first selection', async ({ page }) => {
    await page.locator('.faw-option').nth(0).click();
    const before = await page.locator('.faw-feedback').textContent();
    await page.locator('.faw-option').nth(1).click();
    await expect(page.locator('.faw-feedback')).toHaveText(before);
  });
});
