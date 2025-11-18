import { TestPageClient } from '../../../commons/TestPageClient';

export class NewOrderPage {
  private static readonly PRODUCT_ID_INPUT_SELECTOR = '[aria-label="Product ID"]';
  private static readonly QUANTITY_INPUT_SELECTOR = '[aria-label="Quantity"]';
  private static readonly COUNTRY_INPUT_SELECTOR = '[aria-label="Country"]';
  private static readonly PLACE_ORDER_BUTTON_SELECTOR = '[aria-label="Place Order"]';
  private static readonly CONFIRMATION_MESSAGE_SELECTOR = '[role="alert"]';
  private static readonly ORDER_NUMBER_REGEX = /Success! Order has been created with Order Number ([\w-]+)/;
  private static readonly ORDER_NUMBER_MATCHER_GROUP = 1;
  private static readonly ORIGINAL_PRICE_REGEX = /Original Price \$(\d+(?:\.\d{2})?)/;
  private static readonly ORIGINAL_PRICE_MATCHER_GROUP = 1;

  private readonly pageClient: TestPageClient;

  constructor(pageClient: TestPageClient) {
    this.pageClient = pageClient;
  }

  async inputProductId(productId: string): Promise<void> {
    await this.pageClient.fill(NewOrderPage.PRODUCT_ID_INPUT_SELECTOR, productId);
  }

  async inputQuantity(quantity: string): Promise<void> {
    await this.pageClient.fill(NewOrderPage.QUANTITY_INPUT_SELECTOR, quantity);
  }

  async inputCountry(country: string): Promise<void> {
    await this.pageClient.fill(NewOrderPage.COUNTRY_INPUT_SELECTOR, country);
  }

  async clickPlaceOrder(): Promise<void> {
    await this.pageClient.click(NewOrderPage.PLACE_ORDER_BUTTON_SELECTOR);
  }

  async readConfirmationMessageText(): Promise<string> {
    return await this.pageClient.readTextContent(NewOrderPage.CONFIRMATION_MESSAGE_SELECTOR);
  }

  async extractOrderNumber(): Promise<string> {
    const confirmationText = await this.readConfirmationMessageText();
    const match = confirmationText.match(NewOrderPage.ORDER_NUMBER_REGEX);
    
    if (!match || match.length < NewOrderPage.ORDER_NUMBER_MATCHER_GROUP + 1) {
      throw new Error(`Order number not found in confirmation message: ${confirmationText}`);
    }
    
    return match[NewOrderPage.ORDER_NUMBER_MATCHER_GROUP];
  }

  async extractOriginalPrice(): Promise<number> {
    const confirmationText = await this.readConfirmationMessageText();
    const match = confirmationText.match(NewOrderPage.ORIGINAL_PRICE_REGEX);
    
    if (!match || match.length < NewOrderPage.ORIGINAL_PRICE_MATCHER_GROUP + 1) {
      throw new Error(`Original price not found in confirmation message: ${confirmationText}`);
    }
    
    return parseFloat(match[NewOrderPage.ORIGINAL_PRICE_MATCHER_GROUP]);
  }
}
