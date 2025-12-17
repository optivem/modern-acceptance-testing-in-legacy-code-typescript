import { ShopDriver } from '../../driver/ShopDriver.js';
import { BaseCommand, CommandResult, Context } from '@optivem/testing-dsl';
import { GetOrderResponse } from '../../driver/dtos/GetOrderResponse.js';
import { ViewOrderVerification } from '../verifications/ViewOrderVerification.js';

export class ViewOrder extends BaseCommand<ShopDriver, GetOrderResponse, ViewOrderVerification> {
    private orderNumberResultAlias?: string;

    constructor(driver: ShopDriver, context: Context) {
        super(driver, context);
    }

    orderNumber(alias: string): ViewOrder {
        this.orderNumberResultAlias = alias;
        return this;
    }

    async execute(): Promise<CommandResult<GetOrderResponse, ViewOrderVerification>> {
        const orderNumber = this.context.getResultValue(this.orderNumberResultAlias!);
        const result = await this.driver.viewOrder(orderNumber);
        return new CommandResult(result, this.context, (response, context) => new ViewOrderVerification(response, context));
    }
}


