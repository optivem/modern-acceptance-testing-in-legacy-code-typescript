import { BasePage } from './BasePage.js';
import type { PageClient } from '@optivem/commons/playwright';
import { Decimal } from '@optivem/commons/util';
import type { Optional } from '@optivem/commons/util';
import type { OrderStatus } from '../../../commons/dtos/orders/OrderStatus.js';

/** Order details view (same DOM as order history details section; used for view/cancel flow). */
export class OrderDetailsPage extends BasePage {
    private static readonly ORDER_NUMBER_OUTPUT_SELECTOR = '[aria-label="Display Order Number"]';
    private static readonly ORDER_TIMESTAMP_OUTPUT_SELECTOR = '[aria-label="Display Order Timestamp"]';
    private static readonly SKU_OUTPUT_SELECTOR = '[aria-label="Display SKU"]';
    private static readonly COUNTRY_OUTPUT_SELECTOR = '[aria-label="Display Country"]';
    private static readonly QUANTITY_OUTPUT_SELECTOR = '[aria-label="Display Quantity"]';
    private static readonly UNIT_PRICE_OUTPUT_SELECTOR = '[aria-label="Display Unit Price"]';
    private static readonly BASE_PRICE_OUTPUT_SELECTOR = '[aria-label="Display Base Price"]';
    private static readonly SUBTOTAL_PRICE_OUTPUT_SELECTOR = '[aria-label="Display Subtotal Price"]';
    private static readonly DISCOUNT_RATE_OUTPUT_SELECTOR = '[aria-label="Display Discount Rate"]';
    private static readonly DISCOUNT_AMOUNT_OUTPUT_SELECTOR = '[aria-label="Display Discount Amount"]';
    private static readonly TAX_RATE_OUTPUT_SELECTOR = '[aria-label="Display Tax Rate"]';
    private static readonly TAX_AMOUNT_OUTPUT_SELECTOR = '[aria-label="Display Tax Amount"]';
    private static readonly TOTAL_PRICE_OUTPUT_SELECTOR = '[aria-label="Display Total Price"]';
    private static readonly STATUS_OUTPUT_SELECTOR = '[aria-label="Display Status"]';
    private static readonly APPLIED_COUPON_OUTPUT_SELECTOR = '[aria-label="Display Applied Coupon"]';
    private static readonly CANCEL_ORDER_OUTPUT_SELECTOR = '[aria-label="Cancel Order"]';

    private static readonly TEXT_NONE = 'None';

    constructor(pageClient: PageClient) {
        super(pageClient);
    }

    async isLoadedSuccessfully(): Promise<boolean> {
        return await this.pageClient.isVisibleAsync(OrderDetailsPage.ORDER_NUMBER_OUTPUT_SELECTOR);
    }

    async getOrderNumber(): Promise<string> {
        return await this.pageClient.readTextContentAsync(OrderDetailsPage.ORDER_NUMBER_OUTPUT_SELECTOR);
    }

    async getOrderTimestamp(): Promise<Date> {
        const textContent = await this.pageClient.readTextContentAsync(
            OrderDetailsPage.ORDER_TIMESTAMP_OUTPUT_SELECTOR
        );
        return new Date(textContent);
    }

    async getSku(): Promise<string> {
        return await this.pageClient.readTextContentAsync(OrderDetailsPage.SKU_OUTPUT_SELECTOR);
    }

    async getCountry(): Promise<string> {
        return await this.pageClient.readTextContentAsync(OrderDetailsPage.COUNTRY_OUTPUT_SELECTOR);
    }

    async getQuantity(): Promise<number> {
        const textContent = await this.pageClient.readTextContentAsync(
            OrderDetailsPage.QUANTITY_OUTPUT_SELECTOR
        );
        return parseInt(textContent, 10);
    }

    async getUnitPrice(): Promise<Decimal> {
        return (await this.pageClient.readInputCurrencyDecimalValueAsync(
            OrderDetailsPage.UNIT_PRICE_OUTPUT_SELECTOR
        )) as Decimal;
    }

    async getBasePrice(): Promise<Decimal> {
        return (await this.pageClient.readInputCurrencyDecimalValueAsync(
            OrderDetailsPage.BASE_PRICE_OUTPUT_SELECTOR
        )) as Decimal;
    }

    async getDiscountRate(): Promise<Decimal> {
        return (await this.pageClient.readInputPercentageDecimalValueAsync(
            OrderDetailsPage.DISCOUNT_RATE_OUTPUT_SELECTOR
        )) as Decimal;
    }

    async getDiscountAmount(): Promise<Decimal> {
        return (await this.pageClient.readInputCurrencyDecimalValueAsync(
            OrderDetailsPage.DISCOUNT_AMOUNT_OUTPUT_SELECTOR
        )) as Decimal;
    }

    async getSubtotalPrice(): Promise<Decimal> {
        return (await this.pageClient.readInputCurrencyDecimalValueAsync(
            OrderDetailsPage.SUBTOTAL_PRICE_OUTPUT_SELECTOR
        )) as Decimal;
    }

    async getTaxRate(): Promise<Decimal> {
        return (await this.pageClient.readInputPercentageDecimalValueAsync(
            OrderDetailsPage.TAX_RATE_OUTPUT_SELECTOR
        )) as Decimal;
    }

    async getTaxAmount(): Promise<Decimal> {
        return (await this.pageClient.readInputCurrencyDecimalValueAsync(
            OrderDetailsPage.TAX_AMOUNT_OUTPUT_SELECTOR
        )) as Decimal;
    }

    async getTotalPrice(): Promise<Decimal> {
        return (await this.pageClient.readInputCurrencyDecimalValueAsync(
            OrderDetailsPage.TOTAL_PRICE_OUTPUT_SELECTOR
        )) as Decimal;
    }

    async getStatus(): Promise<OrderStatus> {
        const status = await this.pageClient.readTextContentAsync(OrderDetailsPage.STATUS_OUTPUT_SELECTOR);
        return status as OrderStatus;
    }

    async getAppliedCoupon(): Promise<Optional<string>> {
        const coupon = await this.pageClient.readTextContentAsync(
            OrderDetailsPage.APPLIED_COUPON_OUTPUT_SELECTOR
        );
        return coupon === OrderDetailsPage.TEXT_NONE || coupon === '' ? undefined : coupon;
    }

    async clickCancelOrder(): Promise<void> {
        await this.pageClient.clickAsync(OrderDetailsPage.CANCEL_ORDER_OUTPUT_SELECTOR);
    }

    async isCancelButtonHidden(): Promise<boolean> {
        return await this.pageClient.isHiddenAsync(OrderDetailsPage.CANCEL_ORDER_OUTPUT_SELECTOR);
    }
}
