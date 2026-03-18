import { CalculatorPage } from '../../../pageObject/wdio/calculator_page';


describe('Cloud Calculator', () => {
  const calculatorPage = new CalculatorPage();
  const INSTANCES_TO_ADD : number = 2;
  const EXPECTED_TOTAL_COST : string = '$201.03'

  beforeEach(async () => {
    await calculatorPage.open();
    await browser.pause(2000);
  });

  it('Should be able to add new entities into the calculator', async () => {
    await calculatorPage.verifyCurrentUrl();
    await calculatorPage.verifyAddEstimateButtonIsDisplayed();
    await calculatorPage.addComputeEngineEstimate();
  });

  it('Should be able to add two new instances', async () => {
    await calculatorPage.verifyCurrentUrl();
    await calculatorPage.verifyAddEstimateButtonIsDisplayed();
    await calculatorPage.addComputeEngineEstimate();
    await browser.pause(1000);
    await calculatorPage.incrementInstances(INSTANCES_TO_ADD);
    await calculatorPage.verifyTotalCost(EXPECTED_TOTAL_COST);
  });
});