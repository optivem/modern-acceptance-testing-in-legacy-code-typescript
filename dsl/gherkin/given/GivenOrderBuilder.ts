import { Converter } from '@optivem/commons/util';
import type { SystemDsl } from '../../system/SystemDsl.js';
import { OrderStatus } from '../../../core/shop/commons/dtos/orders/OrderStatus.js';
import { GherkinDefaults } from '../GherkinDefaults.js';
import { BaseGivenBuilder } from './BaseGivenBuilder.js';
import type { GivenClause } from './GivenClause.js';

export class GivenOrderBuilder extends BaseGivenBuilder {
    private orderNumberValue: string = GherkinDefaults.DEFAULT_ORDER_NUMBER;
    private skuValue: string = GherkinDefaults.DEFAULT_SKU;
    private quantityValue: string = GherkinDefaults.DEFAULT_QUANTITY;
    private countryValue: string = GherkinDefaults.DEFAULT_COUNTRY;
    private couponCodeValue: string = GherkinDefaults.EMPTY;
    private statusValue: OrderStatus = GherkinDefaults.DEFAULT_ORDER_STATUS;

    constructor(givenClause: GivenClause) {
        super(givenClause);
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
