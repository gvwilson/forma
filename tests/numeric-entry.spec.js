import { test, expect } from '@playwright/test';

const URL = '/tests/fixtures/numeric-entry.html';

test.describe('NumericEntryWidget', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URL);
  });

  test('renders the question text', async ({ page }) => {
    await expect(page.locator('.forma-question')).toHaveText('What is 2 + 2?');
  });

  test('renders a number input and Submit button', async ({ page }) => {
    await expect(page.locator('.forma-numeric-input')).toBeVisible();
    await expect(page.locator('button:has-text("Submit")')).toBeVisible();
  });

  test('correct answer shows ✓ Correct! feedback', async ({ page }) => {
    await page.locator('.forma-numeric-input').fill('4');
    await page.locator('button:has-text("Submit")').click();
    await expect(page.locator('.forma-feedback')).toHaveText('✓ Correct!');
  });

  test('correct feedback has forma-correct CSS class', async ({ page }) => {
    await page.locator('.forma-numeric-input').fill('4');
    await page.locator('button:has-text("Submit")').click();
    await expect(page.locator('.forma-feedback')).toHaveClass(/forma-correct/);
  });

  test('incorrect answer shows ✗ Incorrect feedback', async ({ page }) => {
    await page.locator('.forma-numeric-input').fill('3');
    await page.locator('button:has-text("Submit")').click();
    await expect(page.locator('.forma-feedback')).toHaveText('✗ Incorrect');
  });

  test('incorrect feedback has forma-incorrect CSS class', async ({ page }) => {
    await page.locator('.forma-numeric-input').fill('3');
    await page.locator('button:has-text("Submit")').click();
    await expect(page.locator('.forma-feedback')).toHaveClass(/forma-incorrect/);
  });

  test('answer within tolerance is accepted as correct', async ({ page }) => {
    // tolerance is 0.01; 4.005 should pass
    await page.locator('.forma-numeric-input').fill('4.005');
    await page.locator('button:has-text("Submit")').click();
    await expect(page.locator('.forma-feedback')).toHaveText('✓ Correct!');
  });

  test('answer outside tolerance is marked incorrect', async ({ page }) => {
    // tolerance is 0.01; 4.02 should fail
    await page.locator('.forma-numeric-input').fill('4.02');
    await page.locator('button:has-text("Submit")').click();
    await expect(page.locator('.forma-feedback')).toHaveText('✗ Incorrect');
  });

  test('input is locked after submission', async ({ page }) => {
    await page.locator('.forma-numeric-input').fill('4');
    await page.locator('button:has-text("Submit")').click();
    await expect(page.locator('.forma-numeric-input')).toBeDisabled();
    await expect(page.locator('button:has-text("Submit")')).toBeDisabled();
  });

  test('explanation appears after answering', async ({ page }) => {
    await page.locator('.forma-numeric-input').fill('4');
    await page.locator('button:has-text("Submit")').click();
    await expect(page.locator('.forma-explanation')).toBeVisible();
    await expect(page.locator('.forma-explanation')).toContainText('Two plus two equals four.');
  });

  test('pressing Enter submits the answer', async ({ page }) => {
    await page.locator('.forma-numeric-input').fill('4');
    await page.locator('.forma-numeric-input').press('Enter');
    await expect(page.locator('.forma-feedback')).toHaveText('✓ Correct!');
  });

  test('model.set is called with entered value, correct value, and ok flag', async ({ page }) => {
    await page.locator('.forma-numeric-input').fill('4');
    await page.locator('button:has-text("Submit")').click();
    const setCalls = await page.evaluate(() => window._setCalls);
    const valueCall = setCalls.find(([k]) => k === 'value');
    expect(valueCall).toBeTruthy();
    expect(valueCall[1]).toMatchObject({ entered: 4, correct: 4, ok: true, answered: true });
  });
});
