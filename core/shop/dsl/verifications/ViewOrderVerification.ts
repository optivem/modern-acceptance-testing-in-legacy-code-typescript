import { ResponseVerification, UseCaseContext } from '@optivem/commons/dsl';
import type { Decimal } from '@optivem/commons/util';
import type { ViewOrderResponse } from '../../commons/dtos/orders/index.js';
import { OrderStatus } from '../../commons/dtos/orders/OrderStatus.js';
import { expect } from '@playwright/test';

function toNum(v: number | Decimal): number {
    return typeof v === 'number' ? v : (v as Decimal).toNumber();
}

export class ViewOrderVerification extends ResponseVerification<ViewOrderResponse> {
    constructor(response: ViewOrderResponse, context: UseCaseContext) {
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
        const actualQuantity = this.response.quantity.toNumber();
        expect(actualQuantity, `Expected quantity to be ${expected}, but was ${actualQuantity}`).toBe(expected);
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
        const actualUnitPrice = toNum(this.response.unitPrice);
        expect(actualUnitPrice, `Expected unit price to be ${expected}, but was ${actualUnitPrice}`).toBe(expected);
        return this;
    }

    subtotalPrice(expectedSubtotalPrice: number | string): ViewOrderVerification {
        const expected =
            typeof expectedSubtotalPrice === 'string' ? parseFloat(expectedSubtotalPrice) : expectedSubtotalPrice;
        const actualSubtotalPrice = toNum(this.response.subtotalPrice);
        expect(actualSubtotalPrice, `Expected subtotal price to be ${expected}, but was ${actualSubtotalPrice}`).toBe(
            expected
        );
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
        const discountRate = toNum(this.response.discountRate);
        expect(discountRate, `Discount rate should be non-negative, but was: ${discountRate}`).toBeGreaterThanOrEqual(0);
        return this;
    }

    discountAmountGreaterThanOrEqualToZero(): ViewOrderVerification {
        const discountAmount = toNum(this.response.discountAmount);
        expect(discountAmount, `Discount amount should be non-negative, but was: ${discountAmount}`).toBeGreaterThanOrEqual(
            0
        );
        return this;
    }

    preTaxTotalGreaterThanZero(): ViewOrderVerification {
        const preTaxTotal = this.response.preTaxTotal != null ? toNum(this.response.preTaxTotal) : 0;
        expect(preTaxTotal, `Pre-tax total should be positive, but was: ${preTaxTotal}`).toBeGreaterThan(0);
        return this;
    }

    taxRateGreaterThanOrEqualToZero(): ViewOrderVerification {
        const taxRate = toNum(this.response.taxRate);
        expect(taxRate, `Tax rate should be non-negative, but was: ${taxRate}`).toBeGreaterThanOrEqual(0);
        return this;
    }

    taxAmountGreaterThanOrEqualToZero(): ViewOrderVerification {
        const taxAmount = toNum(this.response.taxAmount);
        expect(taxAmount, `Tax amount should be non-negative, but was: ${taxAmount}`).toBeGreaterThanOrEqual(0);
        return this;
    }

    totalPriceGreaterThanZero(): ViewOrderVerification {
        const totalPrice = toNum(this.response.totalPrice);
        expect(totalPrice, `Total price should be positive, but was: ${totalPrice}`).toBeGreaterThan(0);
        return this;
    }
}


