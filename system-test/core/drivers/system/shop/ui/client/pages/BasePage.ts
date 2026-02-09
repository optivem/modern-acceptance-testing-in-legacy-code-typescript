import { TestPageClient } from '@optivem/commons-playwright';

export abstract class BasePage {
    private static readonly NOTIFICATION_SELECTOR = '#notifications .notification';
    private static readonly SUCCESS_NOTIFICATION_SELECTOR = '[role="alert"].success';
    private static readonly ERROR_NOTIFICATION_SELECTOR = '[role="alert"].error';

    protected readonly pageClient: TestPageClient;

    constructor(pageClient: TestPageClient) {
        this.pageClient = pageClient;
    }

    async hasSuccessNotification(): Promise<boolean> {
        await this.pageClient.waitForVisible(BasePage.NOTIFICATION_SELECTOR);

        if (await this.pageClient.exists(BasePage.SUCCESS_NOTIFICATION_SELECTOR)) {
            return true;
        }

        if (await this.pageClient.exists(BasePage.ERROR_NOTIFICATION_SELECTOR)) {
            return false;
        }

        throw new Error('Notification is neither success nor error');
    }

    async readSuccessNotification(): Promise<string> {
        return await this.pageClient.readTextContent(BasePage.SUCCESS_NOTIFICATION_SELECTOR);
    }

    async readErrorNotification(): Promise<string[]> {
        const text = await this.pageClient.readTextContent(BasePage.ERROR_NOTIFICATION_SELECTOR);
        return text.split('\n').filter((line: string) => line.trim() !== '');
    }
}
