export class BasePage {
  constructor(protected readonly path: string) {}

  async open(): Promise<void> {
    await browser.url(this.path);
  }
}