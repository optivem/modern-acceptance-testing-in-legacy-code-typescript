import { ShopDriver } from '../../driver/ShopDriver.js';
import { BaseShopCommand } from './base/BaseShopCommand.js';
import { ShopUseCaseResult } from './base/ShopUseCaseResult.js';
import { UseCaseContext } from '@optivem/commons/dsl';
import { VoidVerification } from '@optivem/commons/dsl';

export class CancelOrder extends BaseShopCommand<void, VoidVerification> {
    private orderNumberResultAlias?: string;

    constructor(driver: ShopDriver, context: UseCaseContext) {
        super(driver, context);
    }

    orderNumber(alias: string): CancelOrder {
        this.orderNumberResultAlias = alias;
        return this;
    }

    async execute(): Promise<ShopUseCaseResult<void, VoidVerification>> {
        const orderNumber = this.context.getResultValue(this.orderNumberResultAlias!);
        const result = await this.driver.orders().cancelOrder(orderNumber);
        return new ShopUseCaseResult(result, this.context, (_response, ctx) => new VoidVerification(undefined, ctx));
    }
}
