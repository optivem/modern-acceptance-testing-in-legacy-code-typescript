import { BasePage } from './BasePage.js';
import { PageGateway } from '@optivem/playwright';
import { OrderStatus } from '../../../../commons/enums/OrderStatus.js';
import { expect } from '@playwright/test';

export class OrderHistoryPage extends BasePage {
    private static readonly ORDER_NUMBER_INPUT_SELECTOR = '[aria-label="Order Number"]';
    private static readonly SEARCH_BUTTON_SELECTOR = '[aria-label="Search"]';

    private static readonly ORDER_DETAILS_CONTAINER_SELECTOR = '#orderDetails';
    private static readonly ORDER_NUMBER_OUTPUT_SELECTOR = '[aria-label="Display Order Number"]';
    private static readonly SKU_OUTPUT_SELECTOR = '[aria-label="Display SKU"]';
    private static readonly COUNTRY_OUTPUT_SELECTOR = '[aria-label="Display Country"]';
    private static readonly QUANTITY_OUTPUT_SELECTOR = '[aria-label="Display Quantity"]';
    private static readonly UNIT_PRICE_OUTPUT_SELECTOR = '[aria-label="Display Unit Price"]';
    private static readonly ORIGINAL_PRICE_OUTPUT_SELECTOR = '[aria-label="Display Original Price"]';
    private static readonly DISCOUNT_RATE_OUTPUT_SELECTOR = '[aria-label="Display Discount Rate"]';
    private static readonly DISCOUNT_AMOUNT_OUTPUT_SELECTOR = '[aria-label="Display Discount Amount"]';
    private static readonly SUBTOTAL_PRICE_OUTPUT_SELECTOR = '[aria-label="Display Subtotal Price"]';
    private static readonly TAX_RATE_OUTPUT_SELECTOR = '[aria-label="Display Tax Rate"]';
    private static readonly TAX_AMOUNT_OUTPUT_SELECTOR = '[aria-label="Display Tax Amount"]';
    private static readonly TOTAL_PRICE_OUTPUT_SELECTOR = '[aria-label="Display Total Price"]';
    private static readonly STATUS_OUTPUT_SELECTOR = '[aria-label="Display Status"]';
    private static readonly CANCEL_ORDER_BUTTON_SELECTOR = '[aria-label="Cancel Order"]';

    private static readonly ORDER_DETAILS_HEADING_TEXT = 'Order Details';

    constructor(pageClient: PageGateway) {
        super(pageClient);
    }

    async inputOrderNumber(orderNumber: string): Promise<void> {
        await this.pageClient.fill(OrderHistoryPage.ORDER_NUMBER_INPUT_SELECTOR, orderNumber);
    }

    async clickSearch(): Promise<void> {
        await this.pageClient.click(OrderHistoryPage.SEARCH_BUTTON_SELECTOR);
    }

    async waitForOrderDetails(): Promise<void> {
        const orderDetailsText = await this.pageClient.readTextContent(OrderHistoryPage.ORDER_DETAILS_CONTAINER_SELECTOR);
        expect(orderDetailsText).toContain(OrderHistoryPage.ORDER_DETAILS_HEADING_TEXT);
    }

    async hasOrderDetails(): Promise<boolean> {
        try {
            await this.waitForOrderDetails();
            return true;
        } catch (error) {
            return false;
        }
    }

    async getOrderNumber(): Promise<string> {
        return await this.pageClient.readInputValue(OrderHistoryPage.ORDER_NUMBER_OUTPUT_SELECTOR);
    }

    async getSku(): Promise<string> {
        return await this.pageClient.readInputValue(OrderHistoryPage.SKU_OUTPUT_SELECTOR);
    }

    async getCountry(): Promise<string> {
        return await this.pageClient.readInputValue(OrderHistoryPage.COUNTRY_OUTPUT_SELECTOR);
    }

    async getQuantity(): Promise<number> {
        return await this.pageClient.readInputIntegerValue(OrderHistoryPage.QUANTITY_OUTPUT_SELECTOR);
    }

    async getUnitPrice(): Promise<number> {
        return await this.pageClient.readInputCurrencyDecimalValue(OrderHistoryPage.UNIT_PRICE_OUTPUT_SELECTOR);
    }

    async getOriginalPrice(): Promise<number> {
        return await this.pageClient.readInputCurrencyDecimalValue(OrderHistoryPage.ORIGINAL_PRICE_OUTPUT_SELECTOR);
    }

    async getDiscountRate(): Promise<number> {
        return await this.pageClient.readInputPercentageDecimalValue(OrderHistoryPage.DISCOUNT_RATE_OUTPUT_SELECTOR);
    }

    async getDiscountAmount(): Promise<number> {
        return await this.pageClient.readInputCurrencyDecimalValue(OrderHistoryPage.DISCOUNT_AMOUNT_OUTPUT_SELECTOR);
    }

    async getSubtotalPrice(): Promise<number> {
        return await this.pageClient.readInputCurrencyDecimalValue(OrderHistoryPage.SUBTOTAL_PRICE_OUTPUT_SELECTOR);
    }

    async getTaxRate(): Promise<number> {
        return await this.pageClient.readInputPercentageDecimalValue(OrderHistoryPage.TAX_RATE_OUTPUT_SELECTOR);
    }

    async getTaxAmount(): Promise<number> {
        return await this.pageClient.readInputCurrencyDecimalValue(OrderHistoryPage.TAX_AMOUNT_OUTPUT_SELECTOR);
    }

    async getTotalPrice(): Promise<number> {
        return await this.pageClient.readInputCurrencyDecimalValue(OrderHistoryPage.TOTAL_PRICE_OUTPUT_SELECTOR);
    }

    async getStatus(): Promise<OrderStatus> {
        const status = await this.pageClient.readInputValue(OrderHistoryPage.STATUS_OUTPUT_SELECTOR);
        return status as OrderStatus;
    }

    async clickCancelOrder(): Promise<void> {
        await this.pageClient.click(OrderHistoryPage.CANCEL_ORDER_BUTTON_SELECTOR);
        await this.pageClient.waitForHidden(OrderHistoryPage.CANCEL_ORDER_BUTTON_SELECTOR);
    }

    async isCancelButtonHidden(): Promise<boolean> {
        return await this.pageClient.isHidden(OrderHistoryPage.CANCEL_ORDER_BUTTON_SELECTOR);
    }
}
