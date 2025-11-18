import { TestPageClient } from '../../../commons/TestPageClient';
import { expect } from '@playwright/test';

export class OrderHistoryPage {
  private static readonly ORDER_NUMBER_INPUT_SELECTOR = '[aria-label="Order Number"]';
  private static readonly SEARCH_BUTTON_SELECTOR = '[aria-label="Search"]';
  private static readonly VIEW_ORDER_BUTTON_SELECTOR = 'button[type="submit"]';
  private static readonly CANCEL_BUTTON_SELECTOR = '[aria-label="Cancel Order"]';
  private static readonly ORDER_NUMBER_DISPLAY_SELECTOR = '#detailOrderNumber';
  private static readonly SKU_OUTPUT_SELECTOR = '[aria-label="SKU Output"]';
  private static readonly SKU_DISPLAY_SELECTOR = '#detailSku';
  private static readonly QUANTITY_OUTPUT_SELECTOR = '[aria-label="Quantity Output"]';
  private static readonly QUANTITY_DISPLAY_SELECTOR = '#detailQuantity';
  private static readonly COUNTRY_DISPLAY_SELECTOR = '#detailCountry';
  private static readonly UNIT_PRICE_OUTPUT_SELECTOR = '[aria-label="Unit Price Output"]';
  private static readonly UNIT_PRICE_DISPLAY_SELECTOR = '#detailUnitPrice';
  private static readonly ORIGINAL_PRICE_OUTPUT_SELECTOR = '[aria-label="Original Price Output"]';
  private static readonly ORIGINAL_PRICE_DISPLAY_SELECTOR = '#detailOriginalPrice';
  private static readonly DISCOUNT_RATE_OUTPUT_SELECTOR = '[aria-label="Discount Rate Output"]';
  private static readonly DISCOUNT_AMOUNT_OUTPUT_SELECTOR = '[aria-label="Discount Amount Output"]';
  private static readonly SUBTOTAL_PRICE_OUTPUT_SELECTOR = '[aria-label="Subtotal Price Output"]';
  private static readonly TAX_RATE_OUTPUT_SELECTOR = '[aria-label="Tax Rate Output"]';
  private static readonly TAX_AMOUNT_OUTPUT_SELECTOR = '[aria-label="Tax Amount Output"]';
  private static readonly TOTAL_PRICE_OUTPUT_SELECTOR = '[aria-label="Total Price Output"]';
  private static readonly STATUS_OUTPUT_SELECTOR = '[aria-label="Status Output"]';
  private static readonly STATUS_DISPLAY_SELECTOR = '#detailStatus .status';
  private static readonly COUNTRY_OUTPUT_SELECTOR = '[aria-label="Country Output"]';
  private static readonly SUCCESS_MESSAGE_SELECTOR = '#message .success';
  private static readonly ERROR_MESSAGE_SELECTOR = '#message .error';

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

  async clickViewOrder(): Promise<void> {
    await this.pageClient.click(OrderHistoryPage.VIEW_ORDER_BUTTON_SELECTOR);
  }

  async clickCancelOrder(): Promise<void> {
    this.pageClient.getPage().on('dialog', dialog => dialog.accept());
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

  async assertOrderNumber(expectedOrderNumber: string): Promise<void> {
    await expect(this.pageClient.getPage().locator(OrderHistoryPage.ORDER_NUMBER_DISPLAY_SELECTOR)).toContainText(expectedOrderNumber);
  }

  async assertOrderDetails(details: Partial<{
    sku?: string;
    quantity?: string;
    country?: string;
    unitPrice?: string;
    originalPrice?: string;
    status?: string;
  }>): Promise<void> {
    if (details.sku) {
      await expect(this.pageClient.getPage().locator(OrderHistoryPage.SKU_DISPLAY_SELECTOR)).toContainText(details.sku);
    }
    if (details.quantity) {
      await expect(this.pageClient.getPage().locator(OrderHistoryPage.QUANTITY_DISPLAY_SELECTOR)).toContainText(details.quantity);
    }
    if (details.country) {
      await expect(this.pageClient.getPage().locator(OrderHistoryPage.COUNTRY_DISPLAY_SELECTOR)).toContainText(details.country);
    }
    if (details.unitPrice) {
      await expect(this.pageClient.getPage().locator(OrderHistoryPage.UNIT_PRICE_DISPLAY_SELECTOR)).toContainText(details.unitPrice);
    }
    if (details.originalPrice) {
      await expect(this.pageClient.getPage().locator(OrderHistoryPage.ORIGINAL_PRICE_DISPLAY_SELECTOR)).toContainText(details.originalPrice);
    }
    if (details.status) {
      await expect(this.pageClient.getPage().locator(OrderHistoryPage.STATUS_DISPLAY_SELECTOR)).toContainText(details.status);
    }
  }

  async assertCancellationSuccess(): Promise<void> {
    await expect(this.pageClient.getPage().locator(OrderHistoryPage.SUCCESS_MESSAGE_SELECTOR)).toContainText('Order cancelled successfully');
  }

  async assertOrderNotFound(): Promise<void> {
    await expect(this.pageClient.getPage().locator(OrderHistoryPage.ERROR_MESSAGE_SELECTOR)).toContainText('Order not found');
  }
}
