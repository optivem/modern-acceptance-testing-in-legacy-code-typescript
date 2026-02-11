import { BasePage } from './BasePage.js';
import { PageClient } from '@optivem/commons/playwright';

export class NewOrderPage extends BasePage {
    private static readonly SKU_INPUT_SELECTOR = '[aria-label="SKU"]';
    private static readonly QUANTITY_INPUT_SELECTOR = '[aria-label="Quantity"]';
    private static readonly COUNTRY_INPUT_SELECTOR = '[aria-label="Country"]';
    private static readonly PLACE_ORDER_BUTTON_SELECTOR = '[aria-label="Place Order"]';
    private static readonly ORDER_NUMBER_REGEX = /Success! Order has been created with Order Number ([\w-]+)/;
    private static readonly ORDER_NUMBER_MATCHER_GROUP = 1;

    constructor(pageClient: PageClient) {
        super(pageClient);
    }

    async inputSku(sku: string): Promise<void> {
        await this.pageClient.fillAsync(NewOrderPage.SKU_INPUT_SELECTOR, sku);
    }

    async inputQuantity(quantity: string): Promise<void> {
        await this.pageClient.fillAsync(NewOrderPage.QUANTITY_INPUT_SELECTOR, quantity);
    }

    async inputCountry(country: string): Promise<void> {
        await this.pageClient.fillAsync(NewOrderPage.COUNTRY_INPUT_SELECTOR, country);
    }

    async clickPlaceOrder(): Promise<void> {
        await this.pageClient.clickAsync(NewOrderPage.PLACE_ORDER_BUTTON_SELECTOR);
    }

    async getOrderNumber(): Promise<string> {
        const confirmationMessageText = await this.readSuccessNotification();

        const match = confirmationMessageText.match(NewOrderPage.ORDER_NUMBER_REGEX);

        if (!match) {
            throw new Error('Could not find order number');
        }

        return match[NewOrderPage.ORDER_NUMBER_MATCHER_GROUP];
    }
}


