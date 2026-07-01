import { expect, test } from '@playwright/test';

test('project, test case, result, and dashboard flow', async ({ page }) => {
  await page.goto('/');

  const projectName = `Playwright Project ${Date.now()}`;
  await page.getByLabel('Project Name').fill(projectName);
  await page.getByLabel('Owner').fill('E2E QA');
  await page.getByRole('button', { name: 'Create Project' }).click();
  await expect(page.locator('li').filter({ hasText: projectName }).first()).toBeVisible();

  const testCaseTitle = `Playwright Test Case ${Date.now()}`;
  await page.getByLabel('Project', { exact: true }).selectOption({ label: projectName });
  await page.getByLabel('Test Case Title').fill(testCaseTitle);
  await page.getByLabel('Priority').selectOption('High');
  await page.getByRole('button', { name: 'Create Test Case' }).click();
  await expect(page.locator('li').filter({ hasText: testCaseTitle }).first()).toBeVisible();

  await page.getByLabel('Test Case', { exact: true }).selectOption({ label: testCaseTitle });
  await page.getByLabel('Status').selectOption('PASSED');
  await page.getByRole('button', { name: 'Register Result' }).click();

  await expect(page.getByTestId('total-cases')).not.toHaveText('0');
  await expect(page.getByTestId('pass-rate')).toContainText('%');
});
