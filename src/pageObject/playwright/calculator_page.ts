import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { URLS } from '../../data/urls';

export class CalculatorPage extends BasePage {
  private readonly selectors = {
    welcomeElement: '.Gxwdcd',
    addToEstimateButton: 'c-wiz.SSPGKf span.UywwFc-vQzf8d',
    addEstimationModal: '[aria-label="Add to this estimate"]',
    computeEngineOption: '//h2[text()="Compute Engine"]',
    configurationBlock: 'h2.zv7tnb',
    numberOfInstancesInput: '[aria-label="Number of instances"]',
    incrementButton: '[aria-label="Increment"]',
    totalCostElement: 'span.w6Zsc.D0aEmf',
  };

  constructor(page: Page) {
    super(page, URLS.CALCULATOR);
  }

  get addEstimateButton(): Locator {
    return this.page.locator(this.selectors.addToEstimateButton);
  }

  get addEstimationModal(): Locator {
    return this.page.locator(this.selectors.addEstimationModal);
  }

  get computeEngineOption(): Locator {
    return this.page.locator(this.selectors.computeEngineOption);
  }

  get configurationBlock(): Locator {
    return this.page.locator(this.selectors.configurationBlock);
  }

  get incrementButton(): Locator {
    return this.page.locator(this.selectors.incrementButton).first();
  }

  get totalCostElement(): Locator {
    return this.page.locator(this.selectors.totalCostElement);
  }

  async clickAddEstimate(): Promise<void> {
    await this.addEstimateButton.waitFor({ state: 'visible' });
    await this.addEstimateButton.click();
  }

  async selectComputeEngine(): Promise<void> {
    await this.computeEngineOption.waitFor({ state: 'visible' });
    await this.computeEngineOption.click();
  }

  async incrementInstances(times: number = 1): Promise<void> {
    await this.incrementButton.waitFor({ state: 'visible', timeout: 5000 });

    for (let i = 0; i < times; i++) {
      await this.incrementButton.click();
      await this.incrementButton.waitFor({ state: 'visible' });
    }
  }

  async getTotalCost(): Promise<string> {
    await this.totalCostElement.waitFor({ state: 'visible' });
    const text = await this.totalCostElement.textContent();
    return text || '';
  }

  async verifyAddEstimateButtonIsDisplayed(): Promise<void> {
    await expect(this.addEstimateButton).toBeVisible();
  }

  async verifyEstimationModalIsDisplayed(): Promise<void> {
    await expect(this.addEstimationModal).toBeVisible({ timeout: 5000 });
  }

  async verifyConfigurationBlockIsDisplayed(): Promise<void> {
    await expect(this.configurationBlock).toBeVisible({ timeout: 5000 });
  }

  async verifyTotalCost(expectedCost: string): Promise<void> {
    await expect(this.totalCostElement).toHaveText(expectedCost);
  }

  async verifyCurrentUrl(): Promise<void> {
    const currentUrl = await this.getCurrentUrl();
    expect(currentUrl).toContain('/products/calculator');
  }

  async addComputeEngineEstimate(): Promise<void> {
    await this.clickAddEstimate();
    await this.verifyEstimationModalIsDisplayed();
    await this.selectComputeEngine();
    await this.verifyConfigurationBlockIsDisplayed();
  }
}
