import { Page } from '@playwright/test';

export class BasePage {
  readonly page: Page;
  readonly path: string;

  constructor(page: Page, path: string) {
    this.page = page;
    this.path = path;
  }

  async open(): Promise<void> {
    await this.page.goto(this.path);
  }

  async waitForLoadState(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }
}
