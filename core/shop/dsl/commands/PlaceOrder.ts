import { ShopDriver } from '../../driver/ShopDriver.js';
import { BaseShopCommand } from './base/BaseShopCommand.js';
import { ShopUseCaseResult } from './base/ShopUseCaseResult.js';
import { UseCaseContext } from '@optivem/commons/dsl';
import type { PlaceOrderRequest, PlaceOrderResponse } from '../../commons/dtos/orders/index.js';
import { PlaceOrderVerification } from '../verifications/PlaceOrderVerification.js';

export class PlaceOrder extends BaseShopCommand<PlaceOrderResponse, PlaceOrderVerification> {
    private orderNumberResultAlias?: string;
    private skuParamAlias = 'DEFAULT-SKU';
    private quantityValue = '1';
    private countryAlias = 'US';
    private couponCodeAlias?: string;

    constructor(driver: ShopDriver, context: UseCaseContext) {
        super(driver, context);
    }

    orderNumber(orderNumberResultAlias: string): PlaceOrder {
        this.orderNumberResultAlias = orderNumberResultAlias;
        return this;
    }

    sku(skuParamAlias: string): PlaceOrder {
        this.skuParamAlias = skuParamAlias;
        return this;
    }

    quantity(value: string): PlaceOrder;
    quantity(value: number): PlaceOrder;
    quantity(value: string | number): PlaceOrder {
        this.quantityValue = typeof value === 'number' ? String(value) : value;
        return this;
    }

    country(countryAlias: string): PlaceOrder {
        this.countryAlias = countryAlias;
        return this;
    }

    couponCode(couponCodeAlias: string): PlaceOrder {
        this.couponCodeAlias = couponCodeAlias;
        return this;
    }

    async execute(): Promise<ShopUseCaseResult<PlaceOrderResponse, PlaceOrderVerification>> {
        const sku = this.context.getParamValue(this.skuParamAlias);
        const country = this.context.getParamValueOrLiteral(this.countryAlias);
        const couponCode = this.couponCodeAlias != null ? this.context.getParamValue(this.couponCodeAlias) : undefined;
        const request: PlaceOrderRequest = { sku, quantity: this.quantityValue, country, couponCode };
        const result = await this.driver.orders().placeOrder(request);
        if (this.orderNumberResultAlias != null) {
            if (result.isSuccess()) {
                this.context.setResultEntry(this.orderNumberResultAlias, result.getValue().orderNumber);
            } else {
                this.context.setResultEntryFailed(this.orderNumberResultAlias, result.getError().message);
            }
        }
        return new ShopUseCaseResult(result, this.context, (response, ctx) => new PlaceOrderVerification(response, ctx));
    }
}
