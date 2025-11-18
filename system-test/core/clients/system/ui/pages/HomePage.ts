import { TestPageClient } from '../../../commons/TestPageClient';

export class HomePage {
  private static readonly SHOP_BUTTON_SELECTOR = "a[href='/shop.html']";
  private static readonly ORDER_HISTORY_BUTTON_SELECTOR = "a[href='/order-history.html']";

  private readonly pageClient: TestPageClient;

  constructor(pageClient: TestPageClient) {
    this.pageClient = pageClient;
  }

  async clickNewOrder(): Promise<import('./NewOrderPage').NewOrderPage> {
    const { NewOrderPage } = await import('./NewOrderPage');
    await this.pageClient.click(HomePage.SHOP_BUTTON_SELECTOR);
    return new NewOrderPage(this.pageClient);
  }

  async clickOrderHistory(): Promise<import('./OrderHistoryPage').OrderHistoryPage> {
    const { OrderHistoryPage } = await import('./OrderHistoryPage');
    await this.pageClient.click(HomePage.ORDER_HISTORY_BUTTON_SELECTOR);
    return new OrderHistoryPage(this.pageClient);
  }
}
