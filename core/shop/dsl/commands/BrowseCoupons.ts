import { ShopDriver } from '../../driver/ShopDriver.js';
import { BaseShopCommand } from './base/BaseShopCommand.js';
import { ShopUseCaseResult } from './base/ShopUseCaseResult.js';
import { UseCaseContext } from '@optivem/commons/dsl';
import type { BrowseCouponsResponse } from '../../commons/dtos/coupons/index.js';
import { BrowseCouponsVerification } from '../verifications/BrowseCouponsVerification.js';

export class BrowseCoupons extends BaseShopCommand<BrowseCouponsResponse, BrowseCouponsVerification> {
    constructor(driver: ShopDriver, context: UseCaseContext) {
        super(driver, context);
    }

    async execute(): Promise<ShopUseCaseResult<BrowseCouponsResponse, BrowseCouponsVerification>> {
        const result = await this.driver.coupons().browseCoupons();
        return new ShopUseCaseResult(
            result,
            this.context,
            (response, ctx) => new BrowseCouponsVerification(response, ctx)
        );
    }
}
