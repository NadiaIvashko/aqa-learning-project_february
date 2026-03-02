import { test } from '@playwright/test';
import { CalculatorPage } from '../../pageObject/calculator_page';
import { TEST_DATA } from '../../../data/testData';

test.describe('Compute Engine', () => {
  let calculatorPage: CalculatorPage;

  test.beforeEach(async ({ page }) => {
    calculatorPage = new CalculatorPage(page);
    await calculatorPage.open();
    await calculatorPage.addEstimateButton.waitFor({ state: 'visible' });
  });

  test.afterEach(async ({ page }) => {
    await page.reload();
  });

  test('Should estimate monthly cost for Compute Engine instance with specific configuration @positive', async () => {
    await calculatorPage.verifyCurrentUrl();
    await calculatorPage.addComputeEngineEstimate();

    await calculatorPage.setNumberOfInstances(TEST_DATA.INSTANCES_COUNT);
    await calculatorPage.selectOperatingSystem(TEST_DATA.OS_UBUNTU_PRO);
    await calculatorPage.selectMachineType(TEST_DATA.MACHINE_TYPE_N4_STANDARD_4);
    await calculatorPage.setBootDiskSize(TEST_DATA.BOOT_DISK_SIZE);
    await calculatorPage.selectRegion(TEST_DATA.REGION_FRANKFURT);

    await calculatorPage.verifyTotalCost(TEST_DATA.EXPECTED_COST_N1_STANDARD_1);
  });

  test('Should display different cost when changing Compute Engine machine type @positive', async () => {
    await calculatorPage.verifyCurrentUrl();
    await calculatorPage.addComputeEngineEstimate();

    await calculatorPage.selectMachineType(TEST_DATA.MACHINE_TYPE_N4_STANDARD_4);
    await calculatorPage.setNumberOfInstances(TEST_DATA.INSTANCES_COUNT);
    await calculatorPage.setBootDiskSize(TEST_DATA.BOOT_DISK_SIZE);
    await calculatorPage.selectOperatingSystem(TEST_DATA.OS_UBUNTU_PRO);
    await calculatorPage.selectRegion(TEST_DATA.REGION_FRANKFURT);

    const costN1Standard1 = await calculatorPage.getCostSummary();
    await calculatorPage.selectMachineType(TEST_DATA.MACHINE_TYPE_N4_STANDARD_16);
    await calculatorPage.setBootDiskSize(TEST_DATA.BOOT_DISK_SIZE2);
    const costN1Standard2 = await calculatorPage.getCostSummary();
    await calculatorPage.verifyCostIncreased(costN1Standard1, costN1Standard2);
  });
});
