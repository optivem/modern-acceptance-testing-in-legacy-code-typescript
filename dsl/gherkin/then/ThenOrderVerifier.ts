import type { ResponseVerification } from '@optivem/commons/dsl';
import type { SystemDsl } from '../../system/SystemDsl.js';
import type { ExecutionResultContext } from '../ExecutionResultContext.js';
import type { ViewOrderVerification } from '@optivem/core/shop/dsl/usecases/orders/ViewOrderVerification.js';
import type { PlaceOrderVerification } from '@optivem/core/shop/dsl/usecases/orders/PlaceOrderVerification.js';
import { OrderStatus } from '@optivem/core/shop/commons/dtos/orders/OrderStatus.js';
import { GherkinDefaults } from '../GherkinDefaults.js';

export class ThenOrderVerifier<
    TSuccessResponse,
    TSuccessVerification extends ResponseVerification<TSuccessResponse>
> {
    private constructor(
        private readonly app: SystemDsl,
        private readonly executionResult: ExecutionResultContext,
        private readonly orderNumber: string,
        private readonly successVerification: TSuccessVerification | null,
        private readonly orderVerification: ViewOrderVerification
    ) {}

    and(): this {
        return this;
    }

    static async create<TSuccessResponse, TSuccessVerification extends ResponseVerification<TSuccessResponse>>(
        app: SystemDsl,
        executionResult: ExecutionResultContext,
        orderNumber: string,
        successVerification: TSuccessVerification | null
    ): Promise<ThenOrderVerifier<TSuccessResponse, TSuccessVerification>> {
        if (orderNumber == null) {
            throw new Error(
                'Cannot verify order: no order number available from the executed operation'
            );
        }
        const viewOrderResult = await app
            .shop()
            .viewOrder()
            .orderNumber(orderNumber)
            .execute();
        const orderVerification = viewOrderResult.shouldSucceed();
        return new ThenOrderVerifier(
            app,
            executionResult,
            orderNumber,
            successVerification,
            orderVerification
        );
    }

    hasSku(expectedSku: string): this {
        this.orderVerification.sku(expectedSku);
        return this;
    }

    hasQuantity(expectedQuantity: number): this {
        this.orderVerification.quantity(expectedQuantity);
        return this;
    }

    hasCountry(expectedCountry: string): this {
        this.orderVerification.country(expectedCountry);
        return this;
    }

    hasUnitPrice(expectedUnitPrice: number): this {
        this.orderVerification.unitPrice(expectedUnitPrice);
        return this;
    }

    hasBasePrice(expectedBasePrice: number): this;
    hasBasePrice(basePrice: string): this;
    hasBasePrice(basePrice: number | string): this {
        this.orderVerification.basePrice(basePrice);
        return this;
    }

    hasSubtotalPrice(expectedSubtotalPrice: number): this;
    hasSubtotalPrice(expectedSubtotalPrice: string): this;
    hasSubtotalPrice(expectedSubtotalPrice: number | string): this {
        this.orderVerification.subtotalPrice(
            typeof expectedSubtotalPrice === 'string' ? parseFloat(expectedSubtotalPrice) : expectedSubtotalPrice
        );
        return this;
    }

    hasTotalPrice(expectedTotalPrice: number): this;
    hasTotalPrice(expectedTotalPrice: string): this;
    hasTotalPrice(expectedTotalPrice: number | string): this {
        this.orderVerification.totalPrice(expectedTotalPrice);
        return this;
    }

    hasStatus(expectedStatus: OrderStatus): this {
        this.orderVerification.status(expectedStatus);
        return this;
    }

    hasDiscountRateGreaterThanOrEqualToZero(): this {
        this.orderVerification.discountRateGreaterThanOrEqualToZero();
        return this;
    }

    hasDiscountRate(expectedDiscountRate: number): this {
        this.orderVerification.discountRate(expectedDiscountRate);
        return this;
    }

    hasDiscountAmount(expectedDiscountAmount: number): this;
    hasDiscountAmount(expectedDiscountAmount: string): this;
    hasDiscountAmount(expectedDiscountAmount: number | string): this {
        this.orderVerification.discountAmount(expectedDiscountAmount);
        return this;
    }

    hasAppliedCoupon(expectedCouponCode: string | null): this;
    hasAppliedCoupon(): this;
    hasAppliedCoupon(expectedCouponCode?: string | null): this {
        // undefined (no-arg) → use default coupon alias; null → pass through (checks null in response) — mirrors Java
        const resolved = expectedCouponCode === undefined ? GherkinDefaults.DEFAULT_COUPON_CODE : expectedCouponCode;
        this.orderVerification.appliedCouponCode(resolved);
        return this;
    }

    hasDiscountAmountGreaterThanOrEqualToZero(): this {
        this.orderVerification.discountAmountGreaterThanOrEqualToZero();
        return this;
    }

    hasSubtotalPriceGreaterThanZero(): this {
        this.orderVerification.subtotalPriceGreaterThanZero();
        return this;
    }

    hasTaxRate(expectedTaxRate: number): this;
    hasTaxRate(expectedTaxRate: string): this;
    hasTaxRate(expectedTaxRate: number | string): this {
        this.orderVerification.taxRate(expectedTaxRate);
        return this;
    }

    hasTaxRateGreaterThanOrEqualToZero(): this {
        this.orderVerification.taxRateGreaterThanOrEqualToZero();
        return this;
    }

    hasTaxAmount(expectedTaxAmount: number): this;
    hasTaxAmount(expectedTaxAmount: string): this;
    hasTaxAmount(expectedTaxAmount: number | string): this {
        this.orderVerification.taxAmount(expectedTaxAmount);
        return this;
    }

    hasTaxAmountGreaterThanOrEqualToZero(): this {
        this.orderVerification.taxAmountGreaterThanOrEqualToZero();
        return this;
    }

    hasTotalPriceGreaterThanZero(): this {
        this.orderVerification.totalPriceGreaterThanZero();
        return this;
    }

    hasOrderNumberPrefix(expectedPrefix: string): this {
        const sv = this.successVerification;
        if (sv != null) {
            if ('orderNumberStartsWith' in sv && typeof (sv as unknown as PlaceOrderVerification).orderNumberStartsWith === 'function') {
                (sv as unknown as PlaceOrderVerification).orderNumberStartsWith(expectedPrefix);
            }
            if ('orderNumberHasPrefix' in sv && typeof (sv as unknown as ViewOrderVerification).orderNumberHasPrefix === 'function') {
                (sv as unknown as ViewOrderVerification).orderNumberHasPrefix(expectedPrefix);
            }
        }
        this.orderVerification.orderNumberHasPrefix(expectedPrefix);
        return this;
    }
}
