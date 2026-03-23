import { test } from '@playwright/test';
import { CalculatorPage } from '../../pageObject/calculator_page';
import { CloudStoragePage } from '../../pageObject/cloud_storage_page';
import { TEST_DATA } from '../../../data/testData';
import * as fs from 'fs';
import * as path from 'path';

test.describe('CSV Export - Compute Engine Cost Estimate', () => {
  let calculatorPage: CalculatorPage;
  let cloudStoragePage: CloudStoragePage;
  const downloadDir = path.join(__dirname, '..', '..', '..', '..', 'test-downloads');

  test.beforeEach(async ({ page }) => {
    calculatorPage = new CalculatorPage(page);
    cloudStoragePage = new CloudStoragePage(page);
    await calculatorPage.open();
    await calculatorPage.addEstimateButton.waitFor({ state: 'visible' });
  });

  test.afterEach(async () => {
    if (fs.existsSync(downloadDir)) {
      fs.rmSync(downloadDir, { recursive: true, force: true });
    }
  });

  test('Should download cost estimate as CSV file with valid format @csv', async () => {
    await calculatorPage.verifyCurrentUrl();
    await calculatorPage.addComputeEngineEstimate();

    await calculatorPage.setNumberOfInstances(TEST_DATA.INSTANCES_COUNT);
    await calculatorPage.selectOperatingSystem(TEST_DATA.OS_UBUNTU_PRO);
    await calculatorPage.selectMachineType(TEST_DATA.MACHINE_TYPE_N4_STANDARD_4);
    await calculatorPage.setBootDiskSize(TEST_DATA.BOOT_DISK_SIZE);
    await calculatorPage.selectRegion(TEST_DATA.REGION_FRANKFURT);

    await calculatorPage.totalCostElement.waitFor({ state: 'visible', timeout: 15000 });

    const { download, filePath } = await calculatorPage.downloadCsvFile(downloadDir);

    calculatorPage.verifyCsvFileDownloaded(filePath, download.suggestedFilename());
    await calculatorPage.verifyCsvFormat(filePath);
  });

  test('Should have Cloud Storage CSV total cost matching UI estimation @csv', async () => {
    await calculatorPage.verifyCurrentUrl();
    await calculatorPage.addCloudStorageEstimate();

    await cloudStoragePage.selectLocationType(TEST_DATA.LOCATION_TYPE_DUAL_REGION);
    await cloudStoragePage.selectStorageClass(TEST_DATA.STORAGE_CLASS_STANDARD);
    await cloudStoragePage.setTotalStorage(TEST_DATA.STORAGE_AMOUNT);
    await cloudStoragePage.setMonthlyDataWritten(TEST_DATA.MONTHLY_DATA_WRITTEN);
    await cloudStoragePage.setDataTransfer(TEST_DATA.DATA_TRANSFER);

    await calculatorPage.totalCostElement.waitFor({ state: 'visible', timeout: 15000 });
    const uiTotalCost = await calculatorPage.getTotalCost();

    const { filePath } = await calculatorPage.downloadCsvFile(downloadDir);

    await calculatorPage.verifyCsvMatchesUi(filePath, uiTotalCost);
  });
});
