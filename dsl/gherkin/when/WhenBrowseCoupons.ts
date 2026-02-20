import type { SystemDsl } from '../../system/SystemDsl.js';
import { ExecutionResult } from '../ExecutionResult.js';
import { ExecutionResultBuilder } from '../ExecutionResultBuilder.js';
import { BaseWhenBuilder } from './BaseWhenStep.js';
import type { BrowseCouponsResponse } from '@optivem/core/shop/commons/dtos/coupons/index.js';
import type { BrowseCouponsVerification } from '@optivem/core/shop/dsl/usecases/coupons/BrowseCouponsVerification.js';

export class BrowseCouponsBuilder extends BaseWhenBuilder<BrowseCouponsResponse, BrowseCouponsVerification> {
    constructor(app: SystemDsl) {
        super(app);
    }

    protected override async execute(
        app: SystemDsl
    ): Promise<ExecutionResult<BrowseCouponsResponse, BrowseCouponsVerification>> {
        const result = await app
            .shop()
            .browseCoupons()
            .execute();

        return new ExecutionResultBuilder(result).build();
    }
}
