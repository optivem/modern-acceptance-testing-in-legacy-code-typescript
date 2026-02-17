import { ShopDriver } from '../../../driver/ShopDriver.js';
import { BaseShopCommand } from '../base/BaseShopCommand.js';
import { ShopUseCaseResult } from '../base/ShopUseCaseResult.js';
import { UseCaseContext } from '@optivem/commons/dsl';
import type { ViewOrderResponse } from '../../../commons/dtos/orders/index.js';
import { ViewOrderVerification } from './ViewOrderVerification.js';

export class ViewOrder extends BaseShopCommand<ViewOrderResponse, ViewOrderVerification> {
    private orderNumberResultAlias?: string;

    constructor(driver: ShopDriver, context: UseCaseContext) {
        super(driver, context);
    }

    orderNumber(orderNumberResultAlias: string): ViewOrder {
        this.orderNumberResultAlias = orderNumberResultAlias;
        return this;
    }

    async execute(): Promise<ShopUseCaseResult<ViewOrderResponse, ViewOrderVerification>> {
        const orderNumber = this.context.getResultValue(this.orderNumberResultAlias!);
        const result = await this.driver.orders().viewOrder(orderNumber);
        return new ShopUseCaseResult(result, this.context, (response, ctx) => new ViewOrderVerification(response, ctx));
    }
}
