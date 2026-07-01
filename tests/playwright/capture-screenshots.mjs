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

await page.locator('.workspace').screenshot({ path: path.join(outputDir, '02-project-management.png') });

const projectName = 'Customer Support Portal Upgrade';
await page.getByLabel('Project Name').fill(projectName);
await page.getByLabel('Owner').fill('Customer Experience Team');
await page.getByRole('button', { name: 'Create Project' }).click();
await page.locator('li').filter({ hasText: projectName }).first().waitFor();
await page.locator('.lists').screenshot({ path: path.join(outputDir, '05-projects-list.png') });

const testCaseTitle = 'Confirm that test execution results are reflected in the dashboard';
await page.getByLabel('Project', { exact: true }).selectOption({ label: projectName });
await page.getByLabel('Test Case Title').fill(testCaseTitle);
await page.getByLabel('Priority').selectOption('High');
await page.getByRole('button', { name: 'Create Test Case' }).click();
await page.locator('li').filter({ hasText: testCaseTitle }).first().waitFor();
await page.locator('.workspace').screenshot({ path: path.join(outputDir, '03-test-case-management.png') });
await page.locator('.lists').screenshot({ path: path.join(outputDir, '06-test-cases-list.png') });

await page.getByLabel('Test Case', { exact: true }).selectOption({ label: testCaseTitle });
await page.getByLabel('Status').selectOption('PASSED');
await page.getByRole('button', { name: 'Register Result' }).click();
await page.getByText(`${projectName} / PASSED`).waitFor();
await page.locator('.workspace').screenshot({ path: path.join(outputDir, '04-test-result-registration.png') });

await page.setViewportSize({ width: 390, height: 1200 });
await page.goto(frontendUrl, { waitUntil: 'networkidle' });
await screenshot(page, '07-responsive-view.png');

await browser.close();
