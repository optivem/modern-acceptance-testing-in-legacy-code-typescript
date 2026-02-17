import { VoidVerification } from '@optivem/commons/dsl';
import type { SystemDsl } from '../../system/SystemDsl.js';
import { ExecutionResult } from '../ExecutionResult.js';
import { ExecutionResultBuilder } from '../ExecutionResultBuilder.js';
import { GherkinDefaults } from '../GherkinDefaults.js';
import { BaseWhenBuilder } from './BaseWhenBuilder.js';

export class CancelOrderBuilder extends BaseWhenBuilder<void, VoidVerification> {
    private orderNumberValue: string;

    constructor(app: SystemDsl) {
        super(app);
        this.withOrderNumber(GherkinDefaults.DEFAULT_ORDER_NUMBER);
    }

    withOrderNumber(orderNumber: string): this {
        this.orderNumberValue = orderNumber;
        return this;
    }

    protected override async execute(
        app: SystemDsl
    ): Promise<ExecutionResult<void, VoidVerification>> {
        const result = await app
            .shop()
            .cancelOrder()
            .orderNumber(this.orderNumberValue)
            .execute();

        return new ExecutionResultBuilder(result)
            .orderNumber(this.orderNumberValue)
            .build();
    }
}
