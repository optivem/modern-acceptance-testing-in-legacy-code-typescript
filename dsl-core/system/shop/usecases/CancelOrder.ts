import { ShopDriver } from '@optivem/driver-core/shop/driver/ShopDriver.js';
import { BaseShopCommand } from './base/BaseShopCommand.js';
import { ShopUseCaseResult } from './base/ShopUseCaseResult.js';
import { UseCaseContext } from '@optivem/dsl-common/dsl';
import { VoidVerification } from '@optivem/dsl-common/dsl';
import type { Optional } from '@optivem/common/util';

export class CancelOrder extends BaseShopCommand<void, VoidVerification> {
    private orderNumberResultAlias: Optional<string>;

    constructor(driver: ShopDriver, context: UseCaseContext) {
        super(driver, context);
    }

    orderNumber(alias: Optional<string>): CancelOrder {
        this.orderNumberResultAlias = alias;
        return this;
    }

    async execute(): Promise<ShopUseCaseResult<void, VoidVerification>> {
        const orderNumber = this.context.getResultValue(this.orderNumberResultAlias!);
        const result = await this.driver.cancelOrder(orderNumber);
        return new ShopUseCaseResult(result, this.context, (_response, ctx) => new VoidVerification(undefined, ctx));
    }
}


