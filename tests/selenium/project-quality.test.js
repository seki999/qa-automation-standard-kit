const assert = require('assert');
const { afterEach, beforeEach, describe, it } = require('node:test');
const { Builder, By, until } = require('selenium-webdriver');

const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

describe('Selenium project quality smoke', function () {
  let driver;

  beforeEach(async function () {
    driver = await new Builder().forBrowser('chrome').build();
  });

  afterEach(async function () {
    if (driver) {
      await driver.quit();
    }
  });

  it('creates a project from the React UI', { timeout: 30000 }, async function () {
    await driver.get(frontendUrl);
    const projectName = `Selenium Project ${Date.now()}`;
    await driver.findElement(By.css('[aria-label="Project Name"]')).sendKeys(projectName);
    await driver.findElement(By.css('[aria-label="Owner"]')).clear();
    await driver.findElement(By.css('[aria-label="Owner"]')).sendKeys('Selenium QA');
    await driver.findElement(By.xpath('//button[text()="Create Project"]')).click();
    await driver.wait(until.elementLocated(By.xpath(`//*[contains(text(),"${projectName}")]`)), 10000);
    const body = await driver.findElement(By.css('body')).getText();
    assert.ok(body.includes(projectName));
  });
});
