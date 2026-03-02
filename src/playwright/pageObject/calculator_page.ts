import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { URLS } from '../../data/urls';

export class CalculatorPage extends BasePage {
  private readonly dropdownOptionSelector = 'li[role="option"]';

  constructor(page: Page) {
    super(page, URLS.CALCULATOR);
  }

  // Locators using getByRole
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

  // Methods for adding estimates
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

  // Methods for filling fields
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

  // Methods for getting and verifying cost
  async getTotalCost(): Promise<string> {
    await this.totalCostElement.waitFor({ state: 'visible' });
    await this.page.waitForTimeout(1000);
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

  // Verification methods
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
}
