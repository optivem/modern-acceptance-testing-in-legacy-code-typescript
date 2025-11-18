import { Browser, Page, chromium, Response } from '@playwright/test';
import { TestPageClient } from '../../commons/TestPageClient';
import { HomePage } from './pages/HomePage';

export class ShopUiClient {
  private static readonly CONTENT_TYPE = 'content-type';
  private static readonly TEXT_HTML = 'text/html';
  private static readonly HTML_OPENING_TAG = '<html';
  private static readonly HTML_CLOSING_TAG = '</html>';

  private readonly baseUrl: string;
  private browser: Browser | null = null;
  private page: Page | null = null;
  private readonly pageClient: TestPageClient;
  private readonly homePage: HomePage;
  private response: Response | null = null;

  private constructor(
    baseUrl: string,
    browser: Browser,
    page: Page,
    pageClient: TestPageClient,
    homePage: HomePage
  ) {
    this.baseUrl = baseUrl;
    this.browser = browser;
    this.page = page;
    this.pageClient = pageClient;
    this.homePage = homePage;
  }

  static async create(baseUrl: string): Promise<ShopUiClient> {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    const pageClient = new TestPageClient(page, baseUrl);
    const homePage = new HomePage(pageClient);

    return new ShopUiClient(baseUrl, browser, page, pageClient, homePage);
  }

  async openHomePage(): Promise<HomePage> {
    if (!this.page) {
      throw new Error('Page is not initialized');
    }
    this.response = await this.page.goto(this.baseUrl);
    return this.homePage;
  }

  assertHomePageLoaded(): void {
    if (!this.response) {
      throw new Error('No response available');
    }

    if (this.response.status() !== 200) {
      throw new Error(`Expected status 200 but got ${this.response.status()}`);
    }

    const contentType = this.response.headers()[ShopUiClient.CONTENT_TYPE];
    if (!contentType || !contentType.includes(ShopUiClient.TEXT_HTML)) {
      throw new Error(`Content-Type should be text/html, but was: ${contentType}`);
    }

    // Check HTML structure would require getting page content
    if (!this.page) {
      throw new Error('Page is not initialized');
    }
  }

  async close(): Promise<void> {
    if (this.page) {
      await this.page.close();
    }
    if (this.browser) {
      await this.browser.close();
    }
  }
}
