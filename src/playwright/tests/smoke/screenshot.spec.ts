import { test, expect } from '@playwright/test';
import { CalculatorPage } from '../../pageObject/calculator_page';
import { CloudStoragePage } from '../../pageObject/cloud_storage_page';
import { TEST_DATA } from '../../../data/testData';
import { SCREENSHOT_NAMES } from '../../../data/screenshotNames';

test.describe('Screenshot Tests - Google Cloud Calculator', () => {
  let calculatorPage: CalculatorPage;
  let cloudStoragePage: CloudStoragePage;
  test.beforeEach(async ({ page }) => {
    calculatorPage = new CalculatorPage(page);
    cloudStoragePage = new CloudStoragePage(page);
    await calculatorPage.open();
    await calculatorPage.addEstimateButton.waitFor({ state: 'visible' });
  });

  test('Should match full page screenshot of Calculator landing page @screenshot', async ({
    page,
  }) => {
    await calculatorPage.verifyCurrentUrl();

    await expect(page).toHaveScreenshot(SCREENSHOT_NAMES.CALCULATOR_LANDING_PAGE, {
      fullPage: true,
    });
  });

  test('Should match screenshot of total cost element after Cloud Storage configuration @screenshot', async () => {
    await calculatorPage.verifyCurrentUrl();
    await calculatorPage.addCloudStorageEstimate();

    await cloudStoragePage.selectLocationType(TEST_DATA.LOCATION_TYPE_MULTI_REGION);
    await cloudStoragePage.selectStorageClass(TEST_DATA.STORAGE_CLASS_STANDARD);
    await cloudStoragePage.setTotalStorage(TEST_DATA.STORAGE_AMOUNT_SMALL);

    await calculatorPage.totalCostElement.waitFor({ state: 'visible', timeout: 15000 });

    await expect(calculatorPage.totalCostElement).toHaveScreenshot(
      SCREENSHOT_NAMES.TOTAL_COST_ELEMENT
    );
  });

  test('Should match full page screenshot after Compute Engine configuration with verified total cost @screenshot', async ({
    page,
  }) => {
    await calculatorPage.verifyCurrentUrl();
    await calculatorPage.addComputeEngineEstimate();

    await calculatorPage.setNumberOfInstances(TEST_DATA.INSTANCES_COUNT);
    await calculatorPage.selectOperatingSystem(TEST_DATA.OS_UBUNTU_PRO);
    await calculatorPage.selectMachineType(TEST_DATA.MACHINE_TYPE_N4_STANDARD_4);
    await calculatorPage.setBootDiskSize(TEST_DATA.BOOT_DISK_SIZE);
    await calculatorPage.selectRegion(TEST_DATA.REGION_FRANKFURT);

    await calculatorPage.verifyTotalCost(TEST_DATA.EXPECTED_COST_N1_STANDARD_1);

    await expect(page).toHaveScreenshot(SCREENSHOT_NAMES.COMPUTE_ENGINE_CONFIGURED_PAGE, {
      fullPage: true,
    });
  });
});
