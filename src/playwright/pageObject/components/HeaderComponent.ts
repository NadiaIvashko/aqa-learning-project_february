import { Page, Locator, expect } from '@playwright/test';

export class HeaderComponent {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  private get banner(): Locator {
    return this.page.locator('devsite-header');
  }

  async waitForHeader(): Promise<void> {
    await this.banner.waitFor({ state: 'visible' });
  }

  private get mainNav(): Locator {
    return this.banner.getByRole('navigation').first();
  }

  get overviewLink(): Locator {
    return this.page.locator('div.devsite-top-logo-row-middle tab:nth-of-type(1) > a');
  }

  get additionalTabSecondLink(): Locator {
    return this.page.locator('cloudx-additional-tabs > tab:nth-of-type(2) > a');
  }

  get supportLink(): Locator {
    return this.mainNav.getByRole('link').nth(6);
  }

  get startFreeLink(): Locator {
    return this.banner
      .getByRole('link', { name: /start free|empezar gratis|無料で利用開始/i })
      .first();
  }

  get contactUsLink(): Locator {
    return this.banner
      .getByRole('link', { name: /contact us|contacta con nosotros|お問い合わせ/i })
      .first();
  }

  private async getLinkText(locator: Locator): Promise<string> {
    try {
      await locator.waitFor({ state: 'visible', timeout: 5000 });
      return (await locator.textContent())?.trim() ?? '';
    } catch {
      return '';
    }
  }

  async verifyNavLinkText(
    linkLocator: Locator,
    expectedText: string,
    label: string
  ): Promise<void> {
    const actual = await this.getLinkText(linkLocator);
    expect(actual, `Header "${label}" should be "${expectedText}"`).toBe(expectedText);
  }

  async verifyTranslations(expectedTexts: Record<string, string>): Promise<void> {
    await this.waitForHeader();

    const navLinkMap: Record<string, Locator> = {
      overview: this.overviewLink,
      additionalTabSecond: this.additionalTabSecondLink,
      support: this.supportLink,
      startFree: this.startFreeLink,
      contactUs: this.contactUsLink,
    };

    for (const [key, expectedValue] of Object.entries(expectedTexts)) {
      const locator = navLinkMap[key];
      if (locator) {
        await this.verifyNavLinkText(locator, expectedValue, key);
      }
    }
  }
}
