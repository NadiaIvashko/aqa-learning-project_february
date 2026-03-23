import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../BasePage';
import { URLS } from '../../../data/urls';

export class LanguageSelectorComponent extends BasePage {
  constructor(page: Page) {
    super(page, URLS.CHANGE_LANGUAGE);
  }

  get languageButton(): Locator {
    return this.page.locator('devsite-header devsite-language-selector button');
  }

  get languageMenu(): Locator {
    return this.page.locator('devsite-header devsite-language-selector ul');
  }

  async selectLanguage(languageName: string): Promise<void> {
    await this.languageButton.click();
    await this.languageMenu.waitFor({ state: 'visible' });
    await this.languageMenu
      .locator('a[role="menuitem"]')
      .filter({ hasText: new RegExp(languageName, 'i') })
      .click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyLanguageSelectorVisible(): Promise<void> {
    await expect(this.languageButton).toBeVisible();
  }
}
