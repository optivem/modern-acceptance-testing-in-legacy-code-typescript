import type { ResponseVerification } from '@optivem/commons/dsl';
import type { SystemDsl } from '../../system/SystemDsl.js';
import type { ExecutionResultContext } from '../ExecutionResultContext.js';
import type { ViewOrderVerification } from '../../../../core/shop/dsl/usecases/orders/ViewOrderVerification.js';
import type { PlaceOrderVerification } from '../../../../core/shop/dsl/usecases/orders/PlaceOrderVerification.js';
import { OrderStatus } from '../../../../core/shop/commons/dtos/orders/OrderStatus.js';
import { GherkinDefaults } from '../GherkinDefaults.js';
import { BaseThenVerifier } from './BaseThenVerifier.js';

export class ThenOrderVerifier<
    TSuccessResponse,
    TSuccessVerification extends ResponseVerification<TSuccessResponse>
> extends BaseThenVerifier<TSuccessResponse, TSuccessVerification> {
    private constructor(
        app: SystemDsl,
        executionResult: ExecutionResultContext,
        orderNumber: string,
        successVerification: TSuccessVerification | null,
        private readonly orderVerification: ViewOrderVerification
    ) {
        super(app, executionResult, successVerification);
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

    hasBasePrice(expectedBasePrice: number): this {
        this.orderVerification.basePrice(expectedBasePrice);
        return this;
    }

    hasBasePrice(basePrice: string): this {
        this.orderVerification.basePrice(basePrice);
        return this;
    }

    hasSubtotalPrice(expectedSubtotalPrice: number): this {
        this.orderVerification.subtotalPrice(expectedSubtotalPrice);
        return this;
    }

    hasSubtotalPrice(expectedSubtotalPrice: string): this {
        this.orderVerification.subtotalPrice(parseFloat(expectedSubtotalPrice));
        return this;
    }

    hasTotalPrice(expectedTotalPrice: number): this {
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

    hasDiscountAmount(expectedDiscountAmount: number): this {
        this.orderVerification.discountAmount(expectedDiscountAmount);
        return this;
    }

    hasDiscountAmount(expectedDiscountAmount: string): this {
        this.orderVerification.discountAmount(expectedDiscountAmount);
        return this;
    }

    hasAppliedCoupon(expectedCouponCode: string): this {
        this.orderVerification.appliedCouponCode(expectedCouponCode);
        return this;
    }

    hasAppliedCoupon(): this {
        return this.hasAppliedCoupon(GherkinDefaults.DEFAULT_COUPON_CODE);
    }

    hasDiscountAmountGreaterThanOrEqualToZero(): this {
        this.orderVerification.discountAmountGreaterThanOrEqualToZero();
        return this;
    }

    hasSubtotalPriceGreaterThanZero(): this {
        this.orderVerification.subtotalPriceGreaterThanZero();
        return this;
    }

    hasTaxRate(expectedTaxRate: number): this {
        this.orderVerification.taxRate(expectedTaxRate);
        return this;
    }

    hasTaxRate(expectedTaxRate: string): this {
        this.orderVerification.taxRate(expectedTaxRate);
        return this;
    }

    hasTaxRateGreaterThanOrEqualToZero(): this {
        this.orderVerification.taxRateGreaterThanOrEqualToZero();
        return this;
    }

    hasTaxAmount(expectedTaxAmount: string): this {
        this.orderVerification.taxAmount(expectedTaxAmount);
        return this;
    }

    hasTaxAmountGreaterThanOrEqualToZero(): this {
        this.orderVerification.taxAmountGreaterThanOrEqualToZero();
        return this;
    }

    hasTotalPrice(expectedTotalPrice: string): this {
        this.orderVerification.totalPrice(expectedTotalPrice);
        return this;
    }

    hasTotalPriceGreaterThanZero(): this {
        this.orderVerification.totalPriceGreaterThanZero();
        return this;
    }

    hasOrderNumberPrefix(expectedPrefix: string): this {
        const sv = this.successVerification;
        if (sv != null) {
            if ('orderNumberStartsWith' in sv && typeof (sv as PlaceOrderVerification).orderNumberStartsWith === 'function') {
                (sv as PlaceOrderVerification).orderNumberStartsWith(expectedPrefix);
            }
            if ('orderNumberHasPrefix' in sv && typeof (sv as ViewOrderVerification).orderNumberHasPrefix === 'function') {
                (sv as ViewOrderVerification).orderNumberHasPrefix(expectedPrefix);
            }
        }
        this.orderVerification.orderNumberHasPrefix(expectedPrefix);
        return this;
    }
}
