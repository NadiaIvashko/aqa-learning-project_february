import { test } from '@playwright/test';
import { CalculatorPage } from '../../pageObject/calculator_page';
import { TEST_DATA } from '../../../data/testData';

test.describe('Cloud Calculator', () => {
  let calculatorPage: CalculatorPage;

  test.beforeEach(async ({ page }) => {
    calculatorPage = new CalculatorPage(page);
    await calculatorPage.open();
    await calculatorPage.addEstimateButton.waitFor({ state: 'visible' });
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
    await calculatorPage.incrementInstances(TEST_DATA.INSTANCES_TO_ADD);
    await calculatorPage.verifyTotalCost(TEST_DATA.EXPECTED_TOTAL_COST);
  });
});
