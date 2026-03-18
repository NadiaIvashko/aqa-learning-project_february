import { test } from '@playwright/test';
import { CalculatorPage } from '../../pageObject/calculator_page';
import { CloudStoragePage } from '../../pageObject/cloud_storage_page';
import { TEST_DATA } from '../../../data/testData';

test.describe('Cloud Storage', () => {
  let calculatorPage: CalculatorPage;
  let cloudStoragePage: CloudStoragePage;

  test.beforeEach(async ({ page }) => {
    calculatorPage = new CalculatorPage(page);
    cloudStoragePage = new CloudStoragePage(page);
    await calculatorPage.open();
    await calculatorPage.addEstimateButton.waitFor({ state: 'visible' });
  });

  test.afterEach(async ({ page }) => {
    await page.reload();
  });

  test('Should calculate cost for Cloud Storage with dual-region configuration @positive', async () => {
    await calculatorPage.verifyCurrentUrl();
    await calculatorPage.addCloudStorageEstimate();

    await cloudStoragePage.selectLocationType(TEST_DATA.LOCATION_TYPE_DUAL_REGION);
    await cloudStoragePage.selectLocation(TEST_DATA.LOCATION_TOKYO_OSAKA);
    await cloudStoragePage.selectStorageClass(TEST_DATA.STORAGE_CLASS_STANDARD);
    await cloudStoragePage.setTotalStorage(TEST_DATA.STORAGE_AMOUNT);
    await cloudStoragePage.setMonthlyDataWritten(TEST_DATA.MONTHLY_DATA_WRITTEN);
    await cloudStoragePage.setDataTransfer(TEST_DATA.DATA_TRANSFER);

    await cloudStoragePage.verifyCostCalculated();
  });

  test('Should show different costs when changing storage class and amount @positive', async () => {
    await calculatorPage.verifyCurrentUrl();
    await calculatorPage.addCloudStorageEstimate();

    await cloudStoragePage.selectLocationType(TEST_DATA.LOCATION_TYPE_MULTI_REGION);
    // DO NOT WORK i DO NOT WHY
    await cloudStoragePage.selectLocation(TEST_DATA.LOCATION_TOKYO_OSAKA);
    await cloudStoragePage.selectStorageClass(TEST_DATA.STORAGE_CLASS_STANDARD);
    await cloudStoragePage.setTotalStorage(TEST_DATA.STORAGE_AMOUNT_SMALL);

    const costStandard = await cloudStoragePage.getTotalCost();

    await cloudStoragePage.selectStorageClass(TEST_DATA.STORAGE_CLASS_NEARLINE);
    await cloudStoragePage.setTotalStorage(TEST_DATA.STORAGE_AMOUNT);

    const costNearline = await cloudStoragePage.getTotalCost();

    await cloudStoragePage.verifyCostIncreased(costStandard, costNearline);
  });
});
