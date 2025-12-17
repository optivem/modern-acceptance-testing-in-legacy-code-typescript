import { ShopDriver } from '../../driver/ShopDriver.js';
import { BaseCommand, CommandResult, Context } from '@optivem/testing-dsl';
import { PlaceOrderResponse } from '../../driver/dtos/PlaceOrderResponse.js';
import { PlaceOrderVerification } from '../verifications/PlaceOrderVerification.js';

export class PlaceOrder extends BaseCommand<ShopDriver, PlaceOrderResponse, PlaceOrderVerification> {
    private orderNumberResultAlias?: string;
    private skuParamAlias: string = 'DEFAULT-SKU';
    private quantityValue: string = '1';
    private countryValue: string = 'US';

    constructor(driver: ShopDriver, context: Context) {
        super(driver, context);
    }

    orderNumber(alias: string): PlaceOrder {
        this.orderNumberResultAlias = alias;
        return this;
    }

    sku(alias: string): PlaceOrder {
        this.skuParamAlias = alias;
        return this;
    }

    quantity(value: number | string): PlaceOrder {
        this.quantityValue = typeof value === 'number' ? value.toString() : value;
        return this;
    }

    country(value: string): PlaceOrder {
        this.countryValue = value;
        return this;
    }

    async execute(): Promise<CommandResult<PlaceOrderResponse, PlaceOrderVerification>> {
        const sku = this.context.getParamValue(this.skuParamAlias);
        const result = await this.driver.placeOrder(sku, this.quantityValue, this.countryValue);

        if (result.isSuccess() && this.orderNumberResultAlias) {
            const orderNumber = result.getValue().orderNumber;
            this.context.setResultEntry(this.orderNumberResultAlias, orderNumber);
        }

        return new CommandResult(result, this.context, (response, context) => new PlaceOrderVerification(response, context));
    }
}


