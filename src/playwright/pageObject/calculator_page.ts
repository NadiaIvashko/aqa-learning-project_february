import { Page, Locator, expect, Download } from '@playwright/test';
import { BasePage } from './BasePage';
import { URLS } from '../../data/urls';
import * as fs from 'fs';
import * as path from 'path';
import CSVFileValidator from 'csv-file-validator';

interface CsvRow {
  [key: string]: string;
}

interface CsvValidationResult {
  data: CsvRow[];
  inValidData: { message: string; rowIndex?: number; columnIndex?: number }[];
}

export class CalculatorPage extends BasePage {
  private readonly dropdownOptionSelector = 'li[role="option"]';
  private readonly csvTotalPriceLabel = 'total price:';
  private readonly csvHeadersConfig = [
    { name: 'service_display_name', inputName: 'service_display_name', required: false },
    { name: 'name', inputName: 'name', required: false },
    { name: 'quantity', inputName: 'quantity', required: false },
    { name: 'region', inputName: 'region', required: false },
    { name: 'service_id', inputName: 'service_id', required: false },
    { name: 'sku', inputName: 'sku', required: false },
    { name: 'total_price, USD', inputName: 'total_price', required: false },
    { name: 'notes', inputName: 'notes', optional: true },
  ];

  constructor(page: Page) {
    super(page, URLS.CALCULATOR);
  }

  get addEstimateButton(): Locator {
    return this.page.locator('c-wiz.SSPGKf span.UywwFc-vQzf8d');
  }

  get addEstimationModal(): Locator {
    return this.page.locator('[aria-label="Add to this estimate"]');
  }

  get computeEngineOption(): Locator {
    return this.page.locator('//h2[text()="Compute Engine"]');
  }

  get cloudStorageOption(): Locator {
    return this.page.locator('//h2[text()="Cloud Storage"]');
  }

  get configurationBlock(): Locator {
    return this.page.locator('h2.zv7tnb');
  }

  get totalCostElement(): Locator {
    return this.page.getByText(/^\$[\d,]+\.\d{2}$/).first();
  }

  get machineTypeDropdown(): Locator {
    return this.page.getByRole('combobox', { name: /machine type/i });
  }

  get operatingSystemDropdown(): Locator {
    return this.page.getByRole('combobox', { name: /operating system/i });
  }

  get regionDropdown(): Locator {
    return this.page.getByRole('combobox', { name: /region/i });
  }

  get numberOfInstancesInput(): Locator {
    return this.page.getByRole('spinbutton', { name: /number of instances/i });
  }

  get bootDiskSizeInput(): Locator {
    return this.page.getByRole('spinbutton', { name: 'Boot disk size (GiB) tooltip' });
  }

  get downloadCsvButton(): Locator {
    return this.page
      .locator('span[data-is-tooltip-wrapper="true"]')
      .filter({ has: this.page.locator('div[role="tooltip"]', { hasText: 'Download .csv' }) })
      .locator('button');
  }

  // Methods
  async clickAddEstimate(): Promise<void> {
    await this.addEstimateButton.waitFor({ state: 'visible' });
    await this.addEstimateButton.click();
  }

  async selectComputeEngine(): Promise<void> {
    await this.computeEngineOption.waitFor({ state: 'visible' });
    await this.computeEngineOption.click();
  }

  async selectCloudStorage(): Promise<void> {
    await this.cloudStorageOption.waitFor({ state: 'visible' });
    await this.cloudStorageOption.click();
  }

  async addComputeEngineEstimate(): Promise<void> {
    await this.clickAddEstimate();
    await this.verifyEstimationModalIsDisplayed();
    await this.selectComputeEngine();
    await this.verifyConfigurationBlockIsDisplayed();
  }

  async addCloudStorageEstimate(): Promise<void> {
    await this.clickAddEstimate();
    await this.verifyEstimationModalIsDisplayed();
    await this.selectCloudStorage();
    await this.verifyConfigurationBlockIsDisplayed();
  }

  async selectMachineType(machineType: string): Promise<void> {
    await this.machineTypeDropdown.click();
    await this.page.waitForTimeout(500);
    await this.page
      .locator(this.dropdownOptionSelector)
      .filter({ hasText: machineType })
      .first()
      .click();
  }

  async selectOperatingSystem(os: string): Promise<void> {
    await this.operatingSystemDropdown.click();
    await this.page.waitForTimeout(500);
    await this.page.locator(this.dropdownOptionSelector).filter({ hasText: os }).first().click();
  }

  async selectRegion(region: string): Promise<void> {
    await this.regionDropdown.click();
    await this.page.waitForTimeout(500);
    await this.page
      .locator(this.dropdownOptionSelector)
      .filter({ hasText: region })
      .first()
      .click();
  }

  async setNumberOfInstances(count: string): Promise<void> {
    await this.numberOfInstancesInput.click({ clickCount: 3 });
    await this.numberOfInstancesInput.pressSequentially(count);
  }

  async setBootDiskSize(sizeGb: string): Promise<void> {
    await this.bootDiskSizeInput.click({ clickCount: 3 });
    await this.bootDiskSizeInput.pressSequentially(sizeGb);
  }

  async getTotalCost(): Promise<string> {
    await this.totalCostElement.waitFor({ state: 'visible' });
    // Wait for the cost value to stabilize (re-read until it stops changing)
    let previous = '';
    for (let i = 0; i < 10; i++) {
      await this.page.waitForTimeout(500);
      const current = (await this.totalCostElement.textContent())?.trim() ?? '';
      if (current === previous && current !== '') break;
      previous = current;
    }
    const text = await this.totalCostElement.textContent();
    return text?.trim() || '';
  }

  async getCostSummary(): Promise<string> {
    await this.page.waitForTimeout(2000);
    await this.totalCostElement.waitFor({ state: 'visible', timeout: 15000 });
    await this.page.waitForTimeout(1000);
    const text = await this.totalCostElement.textContent();
    return text?.trim() || '';
  }

  async verifyTotalCost(expectedCost: string): Promise<void> {
    await expect(this.totalCostElement).toHaveText(expectedCost);
  }

  async extractNumericCost(costString: string): Promise<number> {
    const cleaned = costString.replace(/[^0-9.]/g, '');
    const value = parseFloat(cleaned);
    return isNaN(value) ? 0 : value;
  }

  async verifyCostIncreased(before: string, after: string): Promise<void> {
    const beforeValue = await this.extractNumericCost(before);
    const afterValue = await this.extractNumericCost(after);
    expect(afterValue).toBeGreaterThan(beforeValue);
  }

  async verifyCostNotChanged(before: string, after: string): Promise<void> {
    expect(before).toBe(after);
  }

  async verifyEstimationModalIsDisplayed(): Promise<void> {
    await expect(this.addEstimationModal).toBeVisible({ timeout: 5000 });
  }

  async verifyConfigurationBlockIsDisplayed(): Promise<void> {
    await expect(this.configurationBlock).toBeVisible({ timeout: 5000 });
  }

  async verifyCurrentUrl(): Promise<void> {
    const currentUrl = await this.getCurrentUrl();
    expect(currentUrl).toContain(URLS.CALCULATOR);
  }

  // Download CSV and save to disk, returns file path
  async downloadCsvFile(downloadDir: string): Promise<{ download: Download; filePath: string }> {
    await this.downloadCsvButton.waitFor({ state: 'visible', timeout: 10000 });
    const downloadPromise = this.page.waitForEvent('download', { timeout: 30000 });
    await this.downloadCsvButton.click();
    const download = await downloadPromise;

    if (!fs.existsSync(downloadDir)) {
      fs.mkdirSync(downloadDir, { recursive: true });
    }
    const filePath = path.join(downloadDir, download.suggestedFilename());
    await download.saveAs(filePath);
    return { download, filePath };
  }

  // Verifies that the downloaded file exists and has a .csv extension
  verifyCsvFileDownloaded(filePath: string, fileName: string): void {
    expect(fs.existsSync(filePath)).toBe(true);
    expect(fileName.endsWith('.csv')).toBe(true);
  }

  // Validates CSV file format: non-empty, correct headers and row/column structure
  async verifyCsvFormat(filePath: string): Promise<CsvRow[]> {
    const csvContent = fs.readFileSync(filePath, 'utf-8');
    expect(csvContent.length).toBeGreaterThan(0);

    const validationResult: CsvValidationResult = await CSVFileValidator(csvContent, {
      headers: this.csvHeadersConfig,
    });

    if (validationResult.inValidData.length > 0) {
      console.log('CSV Validation errors:', validationResult.inValidData);
    }
    expect(validationResult.inValidData.length).toBe(0);

    // At least one data row with service info must be present
    const dataRows = validationResult.data.filter((row) => row['service_display_name']?.trim());
    expect(dataRows.length).toBeGreaterThan(0);

    return validationResult.data;
  }

  // Validates that the "Total Price:" row in the CSV matches the UI total cost
  async verifyCsvMatchesUi(filePath: string, uiTotalCost: string): Promise<void> {
    const rows = await this.verifyCsvFormat(filePath);
    const uiTotalCostNumeric = parseFloat(uiTotalCost.replace(/[^0-9.]/g, ''));

    const totalPriceRow = rows.find((row) =>
      Object.values(row).some((v) => v?.trim().toLowerCase() === this.csvTotalPriceLabel)
    );
    expect(totalPriceRow).toBeDefined();
    const csvExplicitTotal = parseFloat(totalPriceRow?.['total_price'] ?? '0');
    expect(csvExplicitTotal).toBeCloseTo(uiTotalCostNumeric, 1);
  }
}
