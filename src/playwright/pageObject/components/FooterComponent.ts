import { Page, Locator, expect } from '@playwright/test';

export class FooterComponent {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  private get footer(): Locator {
    return this.page.getByRole('contentinfo');
  }

  private footerLink(text: string): Locator {
    return this.footer.getByRole('link', { name: text, exact: true });
  }

  async waitForFooter(): Promise<void> {
    await this.footer.waitFor({ state: 'visible', timeout: 10000 });
  }

  async scrollToFooter(): Promise<void> {
    await this.footer.scrollIntoViewIfNeeded();
    await this.waitForFooter();
  }

  async verifyFooterContainsText(expectedText: string): Promise<void> {
    await this.scrollToFooter();
    await expect(
      this.footerLink(expectedText),
      `Footer should contain link with text: "${expectedText}"`
    ).toBeVisible({ timeout: 5000 });
  }

  async verifyTranslations(expectedTexts: Record<string, string>): Promise<void> {
    await this.scrollToFooter();

    for (const [key, expectedValue] of Object.entries(expectedTexts)) {
      await expect(
        this.footerLink(expectedValue),
        `Footer "${key}" should contain text "${expectedValue}"`
      ).toBeVisible({ timeout: 5000 });
    }
  }
}
