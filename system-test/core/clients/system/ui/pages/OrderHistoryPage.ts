import { TestPageClient } from '../../../commons/TestPageClient';
import { expect } from '@playwright/test';

export class OrderHistoryPage {
  private static readonly ORDER_NUMBER_INPUT_SELECTOR = '[aria-label="Order Number"]';
  private static readonly SEARCH_BUTTON_SELECTOR = '[aria-label="Search"]';
  private static readonly CONFIRMATION_MESSAGE_SELECTOR = '[role="alert"]';
  private static readonly ORDER_NUMBER_OUTPUT_SELECTOR = '#detailOrderNumber';
  private static readonly PRODUCT_ID_OUTPUT_SELECTOR = '#detailSku';
  private static readonly COUNTRY_OUTPUT_SELECTOR = '#detailCountry';
  private static readonly QUANTITY_OUTPUT_SELECTOR = '#detailQuantity';
  private static readonly UNIT_PRICE_OUTPUT_SELECTOR = '#detailUnitPrice';
  private static readonly ORIGINAL_PRICE_OUTPUT_SELECTOR = '#detailOriginalPrice';
  private static readonly DISCOUNT_RATE_OUTPUT_SELECTOR = '[aria-label="Display Discount Rate"]';
  private static readonly DISCOUNT_AMOUNT_OUTPUT_SELECTOR = '[aria-label="Display Discount Amount"]';
  private static readonly SUBTOTAL_PRICE_OUTPUT_SELECTOR = '[aria-label="Display Subtotal Price"]';
  private static readonly TAX_RATE_OUTPUT_SELECTOR = '[aria-label="Display Tax Rate"]';
  private static readonly TAX_AMOUNT_OUTPUT_SELECTOR = '[aria-label="Display Tax Amount"]';
  private static readonly TOTAL_PRICE_OUTPUT_SELECTOR = '[aria-label="Display Total Price"]';
  private static readonly STATUS_OUTPUT_SELECTOR = '#detailStatus .status';
  private static readonly CANCEL_ORDER_OUTPUT_SELECTOR = '[aria-label="Cancel Order"]';

  private static readonly ORDER_DETAILS_HEADING_TEXT = 'Order Details';

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

  async waitForOrderDetails(): Promise<void> {
    const orderDetailsText = await this.pageClient.readTextContent(OrderHistoryPage.CONFIRMATION_MESSAGE_SELECTOR);
    expect(orderDetailsText).toContain(OrderHistoryPage.ORDER_DETAILS_HEADING_TEXT);
  }

  async readConfirmationMessageText(): Promise<string> {
    return await this.pageClient.readTextContent(OrderHistoryPage.CONFIRMATION_MESSAGE_SELECTOR);
  }

  async getOrderNumber(): Promise<string> {
    return await this.pageClient.readTextContent(OrderHistoryPage.ORDER_NUMBER_OUTPUT_SELECTOR);
  }

  async getProductId(): Promise<string> {
    return await this.pageClient.readTextContent(OrderHistoryPage.PRODUCT_ID_OUTPUT_SELECTOR);
  }

  async getCountry(): Promise<string> {
    return await this.pageClient.readTextContent(OrderHistoryPage.COUNTRY_OUTPUT_SELECTOR);
  }

  async getQuantity(): Promise<string> {
    return await this.pageClient.readTextContent(OrderHistoryPage.QUANTITY_OUTPUT_SELECTOR);
  }

  async getUnitPrice(): Promise<string> {
    return await this.pageClient.readTextContent(OrderHistoryPage.UNIT_PRICE_OUTPUT_SELECTOR);
  }

  async getOriginalPrice(): Promise<string> {
    return await this.pageClient.readTextContent(OrderHistoryPage.ORIGINAL_PRICE_OUTPUT_SELECTOR);
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
    return await this.pageClient.readTextContent(OrderHistoryPage.STATUS_OUTPUT_SELECTOR);
  }

  async clickCancelOrder(): Promise<void> {
    this.pageClient.getPage().on('dialog', dialog => {
      console.log('Dialog appeared:', dialog.message());
      dialog.accept();
    });

    await this.pageClient.click(OrderHistoryPage.CANCEL_ORDER_OUTPUT_SELECTOR);
    await this.pageClient.waitForHidden(OrderHistoryPage.CANCEL_ORDER_OUTPUT_SELECTOR);
  }

  async assertCancelButtonNotVisible(): Promise<void> {
    const isHidden = await this.pageClient.isHidden(OrderHistoryPage.CANCEL_ORDER_OUTPUT_SELECTOR);
    expect(isHidden).toBe(true);
  }
}
