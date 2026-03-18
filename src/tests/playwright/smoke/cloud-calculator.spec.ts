import { test, expect } from '@playwright/test';
import { CalculatorPage } from '../../../pageObject/playwright/calculator_page';

test.describe('Cloud Calculator', () => {
  const INSTANCES_TO_ADD = 2;
  const EXPECTED_TOTAL_COST = '$201.03';

  let calculatorPage: CalculatorPage;

  test.beforeEach(async ({ page }) => {
    calculatorPage = new CalculatorPage(page);
    await calculatorPage.open();
    await page.waitForTimeout(2000);
  });

  test('Should be able to add new entities into the calculator', async () => {
    await calculatorPage.verifyCurrentUrl();
    await calculatorPage.verifyAddEstimateButtonIsDisplayed();
    await calculatorPage.addComputeEngineEstimate();
  });

  test('Should be able to add two new instances', async () => {
    await calculatorPage.verifyCurrentUrl();
    await calculatorPage.verifyAddEstimateButtonIsDisplayed();
    await calculatorPage.addComputeEngineEstimate();
    await calculatorPage.page.waitForTimeout(1000);
    await calculatorPage.incrementInstances(INSTANCES_TO_ADD);
    await calculatorPage.verifyTotalCost(EXPECTED_TOTAL_COST);
  });
});
