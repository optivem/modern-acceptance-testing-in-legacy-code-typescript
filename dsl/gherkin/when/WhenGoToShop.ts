import { VoidVerification } from '@optivem/commons/dsl';
import type { SystemDsl } from '../../system/SystemDsl.js';
import { ExecutionResult } from '../ExecutionResult.js';
import { ExecutionResultBuilder } from '../ExecutionResultBuilder.js';
import { BaseWhenBuilder } from './BaseWhenStep.js';

/** When-builder for go-to-shop. */
export class GoToShopBuilder extends BaseWhenBuilder<void, VoidVerification> {
    constructor(app: SystemDsl) {
        super(app);
    }

    protected override async execute(
        app: SystemDsl
    ): Promise<ExecutionResult<void, VoidVerification>> {
        const result = await app.shop().goToShop().execute();
        return new ExecutionResultBuilder(result).build();
    }
}
