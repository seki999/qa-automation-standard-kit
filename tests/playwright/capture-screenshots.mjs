import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.resolve(__dirname, '../../docs/screenshots');
const frontendUrl = process.env.FRONTEND_URL || 'http://127.0.0.1:5173';

async function screenshot(page, name) {
  await page.screenshot({
    path: path.join(outputDir, name),
    fullPage: true
  });
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });

await page.goto(frontendUrl, { waitUntil: 'networkidle' });
await screenshot(page, '01-dashboard-overview.png');

const projectName = `Screenshot Project ${Date.now()}`;
await page.getByLabel('Project Name').fill(projectName);
await page.getByLabel('Owner').fill('QA Portfolio Team');
await page.getByRole('button', { name: 'Create Project' }).click();
await page.locator('li').filter({ hasText: projectName }).first().waitFor();
await screenshot(page, '02-project-created.png');

const testCaseTitle = `Screenshot Test Case ${Date.now()}`;
await page.getByLabel('Project', { exact: true }).selectOption({ label: projectName });
await page.getByLabel('Test Case Title').fill(testCaseTitle);
await page.getByLabel('Priority').selectOption('High');
await page.getByRole('button', { name: 'Create Test Case' }).click();
await page.locator('li').filter({ hasText: testCaseTitle }).first().waitFor();
await screenshot(page, '03-test-case-created.png');

await page.getByLabel('Test Case', { exact: true }).selectOption({ label: testCaseTitle });
await page.getByLabel('Status').selectOption('PASSED');
await page.getByRole('button', { name: 'Register Result' }).click();
await page.getByText(`${projectName} / PASSED`).waitFor();
await screenshot(page, '04-result-registered.png');

await page.setViewportSize({ width: 390, height: 1200 });
await page.goto(frontendUrl, { waitUntil: 'networkidle' });
await screenshot(page, '05-mobile-responsive.png');

await browser.close();
