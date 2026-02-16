import { BasePage } from './BasePage.js';
import type { PageClient } from '@optivem/commons/playwright';
import { OrderDetailsPage } from './OrderDetailsPage.js';

export class OrderHistoryPage extends BasePage {
    private static readonly ORDER_NUMBER_INPUT_SELECTOR = '[aria-label="Order Number"]';
    private static readonly SEARCH_BUTTON_SELECTOR = '[aria-label="Refresh Order List"]';
    private static readonly ROW_SELECTOR_TEMPLATE = "//tr[contains(., '%s')]";
    private static readonly VIEW_DETAILS_LINK_SELECTOR_TEMPLATE = "%s//a[contains(text(), 'View Details')]";

    constructor(pageClient: PageClient) {
        super(pageClient);
    }

    async inputOrderNumber(orderNumber: string): Promise<void> {
        await this.pageClient.fillAsync(OrderHistoryPage.ORDER_NUMBER_INPUT_SELECTOR, orderNumber);
    }

    async clickSearch(): Promise<void> {
        await this.pageClient.clickAsync(OrderHistoryPage.SEARCH_BUTTON_SELECTOR);
    }

    async isOrderListed(orderNumber: string): Promise<boolean> {
        const rowSelector = OrderHistoryPage.getRowSelector(orderNumber);
        return await this.pageClient.isVisibleAsync(rowSelector);
    }

    async clickViewOrderDetails(orderNumber: string): Promise<OrderDetailsPage> {
        const rowSelector = OrderHistoryPage.getRowSelector(orderNumber);
        const viewDetailsLinkSelector = OrderHistoryPage.VIEW_DETAILS_LINK_SELECTOR_TEMPLATE.replace(
            '%s',
            rowSelector
        );
        await this.pageClient.clickAsync(viewDetailsLinkSelector);
        return new OrderDetailsPage(this.pageClient);
    }

    private static getRowSelector(orderNumber: string): string {
        return OrderHistoryPage.ROW_SELECTOR_TEMPLATE.replace('%s', orderNumber);
    }
}
