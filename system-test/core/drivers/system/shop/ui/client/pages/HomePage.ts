import { BasePage } from './BasePage.js';
import { PageGateway } from '../../../../../../../playwright/PageGateway.js';
import { NewOrderPage } from './NewOrderPage.js';
import { OrderHistoryPage } from './OrderHistoryPage.js';

export class HomePage extends BasePage {
    private static readonly SHOP_BUTTON_SELECTOR = 'a[href="/shop.html"]';
    private static readonly ORDER_HISTORY_BUTTON_SELECTOR = 'a[href="/order-history.html"]';

    constructor(pageClient: PageGateway) {
        super(pageClient);
    }

    async clickNewOrder(): Promise<NewOrderPage> {
        await this.pageClient.click(HomePage.SHOP_BUTTON_SELECTOR);
        return new NewOrderPage(this.pageClient);
    }

    async clickOrderHistory(): Promise<OrderHistoryPage> {
        await this.pageClient.click(HomePage.ORDER_HISTORY_BUTTON_SELECTOR);
        return new OrderHistoryPage(this.pageClient);
    }
}
