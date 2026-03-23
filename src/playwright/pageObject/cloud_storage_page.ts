import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { URLS } from '../../data/urls';

export class CloudStoragePage extends BasePage {
  private readonly dropdownOptionSelector = 'li[role="option"]';

  constructor(page: Page) {
    super(page, URLS.CALCULATOR);
  }

  // Locators using getByRole
  get locationTypeDropdown(): Locator {
    return this.page.getByRole('combobox', { name: /location type/i });
  }

  get locationDropdown(): Locator {
    return this.page.getByRole('combobox', { name: /^location$/i });
  }

  get storageClassDropdown(): Locator {
    return this.page.getByRole('combobox', { name: /storage class/i });
  }

  get sourceRegionDropdown(): Locator {
    return this.page.getByRole('combobox', { name: /source region/i });
  }

  get destinationRegionDropdown(): Locator {
    return this.page.getByRole('combobox', { name: /destination region/i });
  }

  get totalStorageInput(): Locator {
    return this.page.getByRole('spinbutton', { name: /total amount of storage/i });
  }

  get monthlyDataWrittenInput(): Locator {
    return this.page.getByRole('spinbutton', { name: /monthly data written/i });
  }

  get dataTransferInput(): Locator {
    return this.page.getByRole('spinbutton', { name: /data transfer within google cloud/i });
  }

  get totalCostElement(): Locator {
    return this.page.getByText(/^\$[\d,]+\.\d{2}$/).first();
  }

  get addToEstimateButton(): Locator {
    return this.page.getByRole('button', { name: /add to estimate/i });
  }

  // Methods for filling fields
  async selectLocationType(locationType: string): Promise<void> {
    await this.locationTypeDropdown.click();
    const option = this.page.locator(this.dropdownOptionSelector).filter({ hasText: locationType });
    await option.click();
  }

  async selectLocation(location: string): Promise<void> {
    await this.locationDropdown.waitFor({ state: 'visible' });
    await this.locationDropdown.click();
    const option = this.page.locator(this.dropdownOptionSelector).filter({ hasText: location });
    await option.waitFor({ state: 'visible' });
    await option.click();
  }

  async selectStorageClass(storageClass: string): Promise<void> {
    await this.storageClassDropdown.click();
    const option = this.page.locator(this.dropdownOptionSelector).filter({ hasText: storageClass });
    await option.click({ force: true });
  }

  async setTotalStorage(amount: string): Promise<void> {
    await this.totalStorageInput.click({ clickCount: 3 });
    await this.totalStorageInput.pressSequentially(amount);
  }

  async setMonthlyDataWritten(amount: string): Promise<void> {
    await this.monthlyDataWrittenInput.click({ clickCount: 3 });
    await this.monthlyDataWrittenInput.pressSequentially(amount);
  }

  async setDataTransfer(amount: string): Promise<void> {
    await this.dataTransferInput.click({ clickCount: 3 });
    await this.dataTransferInput.pressSequentially(amount);
  }

  async clickAddToEstimate(): Promise<void> {
    await this.addToEstimateButton.waitFor({ state: 'visible' });
    await this.addToEstimateButton.click();
  }

  async getTotalCost(): Promise<string> {
    await this.page.waitForTimeout(1000);
    await this.totalCostElement.waitFor({ state: 'visible', timeout: 10000 });
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

  async verifyCostCalculated(): Promise<void> {
    const totalCost = await this.getTotalCost();
    const numericCost = await this.extractNumericCost(totalCost);

    expect(numericCost).toBeGreaterThan(0);
    expect(totalCost).toMatch(/^\$[\d,]+\.\d{2}$/);
  }
}
