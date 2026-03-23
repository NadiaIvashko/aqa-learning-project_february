import { test } from '@playwright/test';
import { HeaderComponent } from '../../pageObject/components/HeaderComponent';
import { FooterComponent } from '../../pageObject/components/FooterComponent';
import { LanguageSelectorComponent } from '../../pageObject/components/LanguageSelectorComponent';
import { SUPPORTED_LANGUAGES } from '../../../data/localization';
import { URLS } from '../../../data/urls';

for (const language of SUPPORTED_LANGUAGES) {
  test.describe(`Localization - ${language.name} (${language.code})`, () => {
    let headerComponent: HeaderComponent;
    let footerComponent: FooterComponent;
    let languageSelector: LanguageSelectorComponent;

    test.beforeEach(async ({ page }) => {
      headerComponent = new HeaderComponent(page);
      footerComponent = new FooterComponent(page);
      languageSelector = new LanguageSelectorComponent(page);
      await page.goto(URLS.CHANGE_LANGUAGE, { waitUntil: 'domcontentloaded' });
      await languageSelector.selectLanguage(language.selectorLabel);
    });

    test('TRY', async () => {
      await languageSelector.selectLanguage(language.selectorLabel);
    });

    test(`Header navigation should be translated to ${language.name} @localization`, async () => {
      await headerComponent.verifyTranslations(language.header);
    });

    test(`Footer links should be translated to ${language.name} @localization`, async () => {
      await footerComponent.verifyTranslations(language.footer);
    });

    test(`Language selector should be visible and functional @localization`, async () => {
      await languageSelector.verifyLanguageSelectorVisible();
    });
  });
}

test.describe('Localization - Language selector availability', () => {
  test('Language selector should display all supported languages @localization', async ({
    page,
  }) => {
    await page.goto(URLS.CALCULATOR);
    await page.waitForLoadState('domcontentloaded');

    const languageSelector = new LanguageSelectorComponent(page);
    await languageSelector.languageButton.click();
  });
});
