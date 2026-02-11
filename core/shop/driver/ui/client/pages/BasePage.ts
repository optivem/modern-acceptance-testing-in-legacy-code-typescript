import { PageClient } from '@optivem/commons/playwright';

export abstract class BasePage {
    private static readonly NOTIFICATION_SELECTOR = '#notifications .notification';
    private static readonly SUCCESS_NOTIFICATION_SELECTOR = '[role="alert"].success';
    private static readonly ERROR_NOTIFICATION_SELECTOR = '[role="alert"].error';
    private static readonly ERROR_MESSAGE_SELECTOR = '[role="alert"].error .error-message';
    private static readonly FIELD_ERROR_SELECTOR = '[role="alert"].error .field-error';

    protected readonly pageClient: PageClient;

    constructor(pageClient: PageClient) {
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

    async readGeneralErrorMessage(): Promise<string> {
        return await this.pageClient.readTextContent(BasePage.ERROR_MESSAGE_SELECTOR);
    }

    async readFieldErrors(): Promise<string[]> {
        if (!await this.pageClient.exists(BasePage.FIELD_ERROR_SELECTOR)) {
            return [];
        }
        return await this.pageClient.readAllTextContents(BasePage.FIELD_ERROR_SELECTOR);
    }
}


