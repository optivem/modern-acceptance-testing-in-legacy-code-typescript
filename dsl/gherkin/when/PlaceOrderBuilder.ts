import { Converter } from '@optivem/commons/util';
import type { SystemDsl } from '../../system/SystemDsl.js';
import { ExecutionResult } from '../ExecutionResult.js';
import { ExecutionResultBuilder } from '../ExecutionResultBuilder.js';
import { GherkinDefaults } from '../GherkinDefaults.js';
import { BaseWhenBuilder } from './BaseWhenBuilder.js';
import type { PlaceOrderResponse } from '../../../../core/shop/commons/dtos/orders/index.js';
import type { PlaceOrderVerification } from '../../../../core/shop/dsl/usecases/orders/PlaceOrderVerification.js';

export class PlaceOrderBuilder extends BaseWhenBuilder<PlaceOrderResponse, PlaceOrderVerification> {
    private orderNumberValue: string = GherkinDefaults.DEFAULT_ORDER_NUMBER;
    private skuValue: string = GherkinDefaults.DEFAULT_SKU;
    private quantityValue: string = GherkinDefaults.DEFAULT_QUANTITY;
    private countryValue: string = GherkinDefaults.DEFAULT_COUNTRY;
    private couponCodeValue: string = GherkinDefaults.EMPTY;

    constructor(app: SystemDsl) {
        super(app);
    }

    withOrderNumber(orderNumber: string): this {
        this.orderNumberValue = orderNumber;
        return this;
    }

    withSku(sku: string): this {
        this.skuValue = sku;
        return this;
    }

    withQuantity(quantity: string): this {
        this.quantityValue = quantity;
        return this;
    }

    withQuantity(quantity: number): this {
        return this.withQuantity(Converter.fromInteger(quantity));
    }

    withCountry(country: string): this {
        this.countryValue = country;
        return this;
    }

    withCouponCode(couponCode: string): this {
        this.couponCodeValue = couponCode;
        return this;
    }

    withCouponCode(): this {
        return this.withCouponCode(GherkinDefaults.DEFAULT_COUPON_CODE);
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
