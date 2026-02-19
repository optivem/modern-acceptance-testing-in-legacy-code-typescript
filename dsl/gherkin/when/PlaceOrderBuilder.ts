import { Converter } from '@optivem/commons/util';
import type { Optional } from '@optivem/commons/util';
import type { SystemDsl } from '../../system/SystemDsl.js';
import { ExecutionResult } from '../ExecutionResult.js';
import { ExecutionResultBuilder } from '../ExecutionResultBuilder.js';
import { GherkinDefaults } from '../GherkinDefaults.js';
import { BaseWhenBuilder } from './BaseWhenBuilder.js';
import type { PlaceOrderResponse } from '@optivem/core/shop/commons/dtos/orders/index.js';
import type { PlaceOrderVerification } from '@optivem/core/shop/dsl/usecases/orders/PlaceOrderVerification.js';

export class PlaceOrderBuilder extends BaseWhenBuilder<PlaceOrderResponse, PlaceOrderVerification> {
    private orderNumberValue: Optional<string>;
    private skuValue: Optional<string>;
    private quantityValue: Optional<string>;
    private countryValue: Optional<string>;
    private couponCodeValue: Optional<string>;

    constructor(app: SystemDsl, setup?: () => Promise<void>) {
        super(app, setup);
        this.withOrderNumber(GherkinDefaults.DEFAULT_ORDER_NUMBER);
        this.withSku(GherkinDefaults.DEFAULT_SKU);
        this.withQuantity(GherkinDefaults.DEFAULT_QUANTITY);
        this.withCountry(GherkinDefaults.DEFAULT_COUNTRY);
        this.withCouponCode(GherkinDefaults.EMPTY);
    }

    withOrderNumber(orderNumber: Optional<string>): this {
        this.orderNumberValue = orderNumber;
        return this;
    }

    withSku(sku: Optional<string>): this {
        this.skuValue = sku;
        return this;
    }

    withQuantity(quantity: Optional<string>): this;
    withQuantity(quantity: number): this;
    withQuantity(quantity: Optional<string> | number): this {
        this.quantityValue = typeof quantity === 'number' ? String(quantity) : quantity;
        return this;
    }

    withCountry(country: Optional<string>): this {
        this.countryValue = country;
        return this;
    }

    withCouponCode(couponCode: Optional<string>): this;
    withCouponCode(): this;
    withCouponCode(couponCode?: Optional<string>): this {
        this.couponCodeValue = couponCode ?? GherkinDefaults.DEFAULT_COUPON_CODE;
        return this;
    }

    protected override async execute(
        app: SystemDsl
    ): Promise<ExecutionResult<PlaceOrderResponse, PlaceOrderVerification>> {
        const result = await app
            .shop()
            .placeOrder()
            .orderNumber(this.orderNumberValue)
            .sku(this.skuValue)
            .quantity(this.quantityValue)
            .country(this.countryValue)
            .couponCode(this.couponCodeValue)
            .execute();

        return new ExecutionResultBuilder(result)
            .orderNumber(this.orderNumberValue)
            .couponCode(this.couponCodeValue)
            .build();
    }
}
