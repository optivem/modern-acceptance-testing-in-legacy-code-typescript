import { TestPageClient } from '../../../commons/TestPageClient';

export class OrderHistoryPage {
  private static readonly ORDER_NUMBER_INPUT_SELECTOR = '[aria-label="Order Number"]';
  private static readonly SEARCH_BUTTON_SELECTOR = '[aria-label="Search"]';
  private static readonly CANCEL_BUTTON_SELECTOR = '[aria-label="Cancel Order"]';
  private static readonly SKU_OUTPUT_SELECTOR = '[aria-label="SKU Output"]';
  private static readonly QUANTITY_OUTPUT_SELECTOR = '[aria-label="Quantity Output"]';
  private static readonly UNIT_PRICE_OUTPUT_SELECTOR = '[aria-label="Unit Price Output"]';
  private static readonly ORIGINAL_PRICE_OUTPUT_SELECTOR = '[aria-label="Original Price Output"]';
  private static readonly DISCOUNT_RATE_OUTPUT_SELECTOR = '[aria-label="Discount Rate Output"]';
  private static readonly DISCOUNT_AMOUNT_OUTPUT_SELECTOR = '[aria-label="Discount Amount Output"]';
  private static readonly SUBTOTAL_PRICE_OUTPUT_SELECTOR = '[aria-label="Subtotal Price Output"]';
  private static readonly TAX_RATE_OUTPUT_SELECTOR = '[aria-label="Tax Rate Output"]';
  private static readonly TAX_AMOUNT_OUTPUT_SELECTOR = '[aria-label="Tax Amount Output"]';
  private static readonly TOTAL_PRICE_OUTPUT_SELECTOR = '[aria-label="Total Price Output"]';
  private static readonly STATUS_OUTPUT_SELECTOR = '[aria-label="Status Output"]';
  private static readonly COUNTRY_OUTPUT_SELECTOR = '[aria-label="Country Output"]';

  private readonly pageClient: TestPageClient;

  constructor(pageClient: TestPageClient) {
    this.pageClient = pageClient;
  }

  async inputOrderNumber(orderNumber: string): Promise<void> {
    await this.pageClient.fill(OrderHistoryPage.ORDER_NUMBER_INPUT_SELECTOR, orderNumber);
  }

  async clickSearch(): Promise<void> {
    await this.pageClient.click(OrderHistoryPage.SEARCH_BUTTON_SELECTOR);
  }

  async clickCancelOrder(): Promise<void> {
    await this.pageClient.click(OrderHistoryPage.CANCEL_BUTTON_SELECTOR);
  }

  async waitForOrderDetails(): Promise<void> {
    // Wait for the SKU field to be visible as an indicator that order details loaded
    await this.pageClient.getPage().waitForSelector(OrderHistoryPage.SKU_OUTPUT_SELECTOR, {
      state: 'visible',
    });
  }

  async getSku(): Promise<string> {
    return await this.pageClient.readInputValue(OrderHistoryPage.SKU_OUTPUT_SELECTOR);
  }

  async getQuantity(): Promise<string> {
    return await this.pageClient.readInputValue(OrderHistoryPage.QUANTITY_OUTPUT_SELECTOR);
  }

  async getUnitPrice(): Promise<string> {
    return await this.pageClient.readInputValue(OrderHistoryPage.UNIT_PRICE_OUTPUT_SELECTOR);
  }

  async getOriginalPrice(): Promise<string> {
    return await this.pageClient.readInputValue(OrderHistoryPage.ORIGINAL_PRICE_OUTPUT_SELECTOR);
  }

  async getDiscountRate(): Promise<string> {
    return await this.pageClient.readInputValue(OrderHistoryPage.DISCOUNT_RATE_OUTPUT_SELECTOR);
  }

  async getDiscountAmount(): Promise<string> {
    return await this.pageClient.readInputValue(OrderHistoryPage.DISCOUNT_AMOUNT_OUTPUT_SELECTOR);
  }

  async getSubtotalPrice(): Promise<string> {
    return await this.pageClient.readInputValue(OrderHistoryPage.SUBTOTAL_PRICE_OUTPUT_SELECTOR);
  }

  async getTaxRate(): Promise<string> {
    return await this.pageClient.readInputValue(OrderHistoryPage.TAX_RATE_OUTPUT_SELECTOR);
  }

  async getTaxAmount(): Promise<string> {
    return await this.pageClient.readInputValue(OrderHistoryPage.TAX_AMOUNT_OUTPUT_SELECTOR);
  }

  async getTotalPrice(): Promise<string> {
    return await this.pageClient.readInputValue(OrderHistoryPage.TOTAL_PRICE_OUTPUT_SELECTOR);
  }

  async getStatus(): Promise<string> {
    return await this.pageClient.readInputValue(OrderHistoryPage.STATUS_OUTPUT_SELECTOR);
  }

  async getCountry(): Promise<string> {
    return await this.pageClient.readInputValue(OrderHistoryPage.COUNTRY_OUTPUT_SELECTOR);
  }
}
