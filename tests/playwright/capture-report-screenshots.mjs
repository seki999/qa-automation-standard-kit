import { chromium } from 'playwright';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../..');
const screenshotsDir = path.join(rootDir, 'docs/screenshots');

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

const playwrightReport = path.join(rootDir, 'tests/playwright/playwright-report/index.html');
await page.goto(pathToFileURL(playwrightReport).toString(), { waitUntil: 'networkidle' });
await page.screenshot({ path: path.join(screenshotsDir, 'playwright-report.png'), fullPage: true });

const karatePreview = path.join(rootDir, 'docs/report-previews/karate-report-preview.html');
await page.goto(pathToFileURL(karatePreview).toString(), { waitUntil: 'networkidle' });
await page.screenshot({ path: path.join(screenshotsDir, 'karate-report.png'), fullPage: true });

await browser.close();
