import { Page, Locator } from '@playwright/test';

export class PageGateway {
    private readonly page: Page;
    private readonly baseUrl: string;
    private readonly timeoutMilliseconds: number;

    private static readonly DEFAULT_TIMEOUT_SECONDS = 10;
    private static readonly DEFAULT_TIMEOUT_MILLISECONDS = PageGateway.DEFAULT_TIMEOUT_SECONDS * 1000;

    constructor(page: Page, baseUrl: string, timeoutMilliseconds: number = PageGateway.DEFAULT_TIMEOUT_MILLISECONDS) {
        this.page = page;
        this.baseUrl = baseUrl;
        this.timeoutMilliseconds = timeoutMilliseconds;
    }

    getBaseUrl(): string {
        return this.baseUrl;
    }

    getPage(): Page {
        return this.page;
    }

    async fill(selector: string, text: string | null): Promise<void> {
        const input = this.page.locator(selector);
        await this.wait(input);
        await input.fill(text ?? '');
    }

    async click(selector: string): Promise<void> {
        const button = this.page.locator(selector);
        await this.wait(button);
        await button.click();
    }

    async readTextContent(selector: string): Promise<string> {
        const locator = this.page.locator(selector);
        await this.wait(locator);
        return (await locator.textContent()) || '';
    }

    async exists(selector: string): Promise<boolean> {
        const locator = this.page.locator(selector);
        try {
            await this.wait(locator);
            return (await locator.count()) > 0;
        } catch (error) {
            return false;
        }
    }

    async readInputValue(selector: string): Promise<string> {
        const locator = this.page.locator(selector);
        await this.wait(locator);
        return await locator.inputValue();
    }

    async readInputIntegerValue(selector: string): Promise<number> {
        const inputValue = await this.readInputValue(selector);
        return parseInt(inputValue);
    }

    async readInputCurrencyDecimalValue(selector: string): Promise<number> {
        let inputValue = await this.readInputValue(selector);
        inputValue = inputValue.replace('$', '');
        return parseFloat(inputValue);
    }

    async readInputPercentageDecimalValue(selector: string): Promise<number> {
        let inputValue = await this.readInputValue(selector);
        inputValue = inputValue.replace('%', '');
        return parseFloat(inputValue);
    }

    async isHidden(selector: string): Promise<boolean> {
        const locator = this.page.locator(selector);
        return (await locator.count()) === 0;
    }

    async waitForHidden(selector: string): Promise<void> {
        const locator = this.page.locator(selector);
        await locator.waitFor({ state: 'hidden', timeout: this.timeoutMilliseconds });
    }

    async waitForVisible(selector: string): Promise<void> {
        const locator = this.page.locator(selector);
        await locator.waitFor({ state: 'visible', timeout: this.timeoutMilliseconds });
    }

    private async wait(locator: Locator): Promise<void> {
        await locator.waitFor({ timeout: this.timeoutMilliseconds });
    }
}
