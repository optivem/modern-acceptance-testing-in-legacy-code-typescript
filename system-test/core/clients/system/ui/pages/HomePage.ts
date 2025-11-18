import { TestPageClient } from '../../../commons/TestPageClient';
import { NewOrderPage } from './NewOrderPage';
import { OrderHistoryPage } from './OrderHistoryPage';

export class HomePage {
  private static readonly SHOP_BUTTON_SELECTOR = "a[href='/shop.html']";
  private static readonly ORDER_HISTORY_BUTTON_SELECTOR = "a[href='/order-history.html']";

  private readonly pageClient: TestPageClient;

  constructor(pageClient: TestPageClient) {
    this.pageClient = pageClient;
  }

  async clickShop(): Promise<NewOrderPage> {
    await this.pageClient.click(HomePage.SHOP_BUTTON_SELECTOR);
    return new NewOrderPage(this.pageClient);
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
