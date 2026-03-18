import { BasePage } from './BasePage';

export class CalculatorPage extends BasePage {
  private readonly welcomeElementSelector = '.Gxwdcd';
  private readonly addToEstimateButtonSelector = 'c-wiz.SSPGKf span.UywwFc-vQzf8d';
  private readonly addEstimationModalSelector = '[aria-label="Add to this estimate"]';
  private readonly computeEngineOptionSelector = '//h2[text()="Compute Engine"]';
  private readonly configurationBlockSelector = 'h2.zv7tnb';
  private readonly numberOfInstancesInputSelector = '[aria-label="Number of instances"]';
  private readonly incrementButtonSelector = '[aria-label="Increment"]';
  private readonly totalCostElementSelector = 'span.w6Zsc.D0aEmf';

  constructor() {
    super('/products/calculator');
  }

  // Getters
  get welcomeElement() {
    return $$(this.welcomeElementSelector);
  }

  get addEstimateButton() {
    return $(this.addToEstimateButtonSelector);
  }

  get addEstimationModal() {
    return $(this.addEstimationModalSelector);
  }

  get computeEngineOption() {
    return $(this.computeEngineOptionSelector);
  }

  get configurationBlock() {
    return $(this.configurationBlockSelector);
  }

  get numberOfInstancesInput() {
    return $(this.numberOfInstancesInputSelector);
  }

  get incrementButton() {
    return $(this.incrementButtonSelector);
  }

  get totalCostElement() {
    return $(this.totalCostElementSelector);
  }

  // Actions
  async clickAddEstimate(): Promise<void> {
    const button = await this.addEstimateButton;
    await button.waitForDisplayed();
    await button.click();
  }

  async selectComputeEngine(): Promise<void> {
    const option = await this.computeEngineOption;
    await option.waitForDisplayed();
    await option.click();
  }

  async incrementInstances(times: number = 1): Promise<void> {
    const button = await this.incrementButton;
    await button.waitForDisplayed({ timeout: 5000 });
    await button.waitForClickable({ timeout: 5000 });

    for (let i = 0; i < times; i++) {
      await button.click();
      await browser.pause(500);
    }
  }

  async getTotalCost(): Promise<string> {
    const element = await this.totalCostElement;
    await element.waitForDisplayed();
    return await element.getText();
  }

  // Verifications
  async verifyAddEstimateButtonIsDisplayed(): Promise<void> {
    const button = await this.addEstimateButton;
    await expect(button).toBeDisplayed();
  }

  async verifyEstimationModalIsDisplayed(): Promise<void> {
    const modal = await this.addEstimationModal;
    await modal.waitForDisplayed({ timeout: 5000 });
    await expect(modal).toBeDisplayed();
  }

  async verifyConfigurationBlockIsDisplayed(): Promise<void> {
    const block = await this.configurationBlock;
    await block.waitForDisplayed({ timeout: 5000 });
    await expect(block).toBeDisplayed();
  }

  async verifyTotalCost(expectedCost: string): Promise<void> {
    const element = await this.totalCostElement;
    await expect(element).toHaveText(expectedCost);
  }

  async verifyCurrentUrl(): Promise<void> {
    const currentUrl = await browser.getUrl();
    expect(currentUrl).toBe(`${browser.config.baseUrl}/products/calculator`);
  }

  // Complex workflows
  async openAndVerifyPage(): Promise<void> {
    await this.open();
    await browser.pause(2000);
    await this.verifyCurrentUrl();
  }

  async addComputeEngineEstimate(): Promise<void> {
    await this.clickAddEstimate();
    await browser.pause(1000);
    await this.verifyEstimationModalIsDisplayed();
    await this.selectComputeEngine();
    await this.verifyConfigurationBlockIsDisplayed();
  }
}
