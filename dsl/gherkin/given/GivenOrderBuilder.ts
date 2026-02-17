import { Converter } from '@optivem/commons/util';
import type { SystemDsl } from '../../system/SystemDsl.js';
import { OrderStatus } from '../../../core/shop/commons/dtos/orders/OrderStatus.js';
import { GherkinDefaults } from '../GherkinDefaults.js';
import { BaseGivenBuilder } from './BaseGivenBuilder.js';
import type { GivenClause } from './GivenClause.js';

export class GivenOrderBuilder extends BaseGivenBuilder {
    private orderNumberValue: string;
    private skuValue: string;
    private quantityValue: string;
    private countryValue: string;
    private couponCodeValue: string;
    private statusValue: OrderStatus;

    constructor(givenClause: GivenClause) {
        super(givenClause);
        this.withOrderNumber(GherkinDefaults.DEFAULT_ORDER_NUMBER);
        this.withSku(GherkinDefaults.DEFAULT_SKU);
        this.withQuantity(GherkinDefaults.DEFAULT_QUANTITY);
        this.withCountry(GherkinDefaults.DEFAULT_COUNTRY);
        this.withCouponCode(GherkinDefaults.EMPTY);
        this.withStatus(GherkinDefaults.DEFAULT_ORDER_STATUS);
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
        return this.withQuantity(Converter.fromInteger(quantity) ?? '');
    }

    withCountry(country: string): this {
        this.countryValue = country;
        return this;
    }

    withCouponCode(couponCode: string): this {
        this.couponCodeValue = couponCode;
        return this;
    }

    withStatus(status: OrderStatus): this {
        this.statusValue = status;
        return this;
    }

    async execute(app: SystemDsl): Promise<void> {
        await app
            .shop()
            .placeOrder()
            .orderNumber(this.orderNumberValue)
            .sku(this.skuValue)
            .quantity(this.quantityValue)
            .country(this.countryValue)
            .couponCode(this.couponCodeValue)
            .execute()
            .then((r) => r.shouldSucceed());

        if (this.statusValue === OrderStatus.CANCELLED) {
            await app
                .shop()
                .cancelOrder()
                .orderNumber(this.orderNumberValue)
                .execute()
                .then((r) => r.shouldSucceed());
        }
    }
}
