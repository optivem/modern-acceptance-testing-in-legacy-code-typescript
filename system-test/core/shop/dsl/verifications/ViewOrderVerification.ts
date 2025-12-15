import { BaseSuccessVerification, Context } from '@optivem/testing-dsl';
import { GetOrderResponse } from '../../driver/dtos/GetOrderResponse.js';
import { OrderStatus } from '../../driver/dtos/enums/OrderStatus.js';
import { expect } from '@playwright/test';

export class ViewOrderVerification extends BaseSuccessVerification<GetOrderResponse> {
    constructor(response: GetOrderResponse, context: Context) {
        super(response, context);
    }

    orderNumber(orderNumberResultAlias: string): ViewOrderVerification {
        const expectedOrderNumber = this.context.getResultValue(orderNumberResultAlias);
        const actualOrderNumber = this.response.orderNumber;
        expect(actualOrderNumber, `Expected order number to be '${expectedOrderNumber}', but was '${actualOrderNumber}'`)
            .toBe(expectedOrderNumber);
        return this;
    }

    sku(skuParamAlias: string): ViewOrderVerification {
        const expectedSku = this.context.getParamValue(skuParamAlias);
        const actualSku = this.response.sku;
        expect(actualSku, `Expected SKU to be '${expectedSku}', but was '${actualSku}'`)
            .toBe(expectedSku);
        return this;
    }

    quantity(expectedQuantity: number | string): ViewOrderVerification {
        const expected = typeof expectedQuantity === 'string' ? parseInt(expectedQuantity) : expectedQuantity;
        const actualQuantity = this.response.quantity;
        expect(actualQuantity, `Expected quantity to be ${expected}, but was ${actualQuantity}`)
            .toBe(expected);
        return this;
    }

    country(expectedCountry: string): ViewOrderVerification {
        const actualCountry = this.response.country;
        expect(actualCountry, `Expected country to be '${expectedCountry}', but was '${actualCountry}'`)
            .toBe(expectedCountry);
        return this;
    }

    unitPrice(expectedUnitPrice: number | string): ViewOrderVerification {
        const expected = typeof expectedUnitPrice === 'string' ? parseFloat(expectedUnitPrice) : expectedUnitPrice;
        const actualUnitPrice = this.response.unitPrice;
        expect(actualUnitPrice, `Expected unit price to be ${expected}, but was ${actualUnitPrice}`)
            .toBe(expected);
        return this;
    }

    originalPrice(expectedOriginalPrice: number | string): ViewOrderVerification {
        const expected = typeof expectedOriginalPrice === 'string' ? parseFloat(expectedOriginalPrice) : expectedOriginalPrice;
        const actualOriginalPrice = this.response.originalPrice;
        expect(actualOriginalPrice, `Expected original price to be ${expected}, but was ${actualOriginalPrice}`)
            .toBe(expected);
        return this;
    }

    status(expectedStatus: OrderStatus | string): ViewOrderVerification {
        const expected = typeof expectedStatus === 'string' ? OrderStatus[expectedStatus as keyof typeof OrderStatus] : expectedStatus;
        const actualStatus = this.response.status;
        expect(actualStatus, `Expected status to be ${expected}, but was ${actualStatus}`)
            .toBe(expected);
        return this;
    }

    discountRateGreaterThanOrEqualToZero(): ViewOrderVerification {
        const discountRate = this.response.discountRate;
        expect(discountRate, `Discount rate should be non-negative, but was: ${discountRate}`)
            .toBeGreaterThanOrEqual(0);
        return this;
    }

    discountAmountGreaterThanOrEqualToZero(): ViewOrderVerification {
        const discountAmount = this.response.discountAmount;
        expect(discountAmount, `Discount amount should be non-negative, but was: ${discountAmount}`)
            .toBeGreaterThanOrEqual(0);
        return this;
    }

    subtotalPriceGreaterThanZero(): ViewOrderVerification {
        const subtotalPrice = this.response.subtotalPrice;
        expect(subtotalPrice, `Subtotal price should be positive, but was: ${subtotalPrice}`)
            .toBeGreaterThan(0);
        return this;
    }

    taxRateGreaterThanOrEqualToZero(): ViewOrderVerification {
        const taxRate = this.response.taxRate;
        expect(taxRate, `Tax rate should be non-negative, but was: ${taxRate}`)
            .toBeGreaterThanOrEqual(0);
        return this;
    }

    taxAmountGreaterThanOrEqualToZero(): ViewOrderVerification {
        const taxAmount = this.response.taxAmount;
        expect(taxAmount, `Tax amount should be non-negative, but was: ${taxAmount}`)
            .toBeGreaterThanOrEqual(0);
        return this;
    }

    totalPriceGreaterThanZero(): ViewOrderVerification {
        const totalPrice = this.response.totalPrice;
        expect(totalPrice, `Total price should be positive, but was: ${totalPrice}`)
            .toBeGreaterThan(0);
        return this;
    }
}
