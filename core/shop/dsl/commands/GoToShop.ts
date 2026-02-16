import { ShopDriver } from '../../driver/ShopDriver.js';
import { BaseShopCommand } from './base/BaseShopCommand.js';
import { ShopUseCaseResult } from './base/ShopUseCaseResult.js';
import { UseCaseContext } from '@optivem/commons/dsl';
import { VoidVerification } from '@optivem/commons/dsl';

export class GoToShop extends BaseShopCommand<void, VoidVerification> {
    constructor(driver: ShopDriver, context: UseCaseContext) {
        super(driver, context);
    }

    async execute(): Promise<ShopUseCaseResult<void, VoidVerification>> {
        const result = await this.driver.goToShop();
        return new ShopUseCaseResult(result, this.context, (_r, ctx) => new VoidVerification(undefined, ctx));
    }
}
