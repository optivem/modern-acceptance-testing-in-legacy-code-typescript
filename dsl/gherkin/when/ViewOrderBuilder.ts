import type { SystemDsl } from '../../system/SystemDsl.js';
import { ExecutionResult } from '../ExecutionResult.js';
import { ExecutionResultBuilder } from '../ExecutionResultBuilder.js';
import { GherkinDefaults } from '../GherkinDefaults.js';
import { BaseWhenBuilder } from './BaseWhenBuilder.js';
import type { ViewOrderResponse } from '../../../../core/shop/commons/dtos/orders/index.js';
import type { ViewOrderVerification } from '../../../../core/shop/dsl/usecases/orders/ViewOrderVerification.js';

export class ViewOrderBuilder extends BaseWhenBuilder<ViewOrderResponse, ViewOrderVerification> {
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
    ): Promise<ExecutionResult<ViewOrderResponse, ViewOrderVerification>> {
        const result = await app
            .shop()
            .viewOrder()
            .orderNumber(this.orderNumberValue)
            .execute();

        return new ExecutionResultBuilder(result).orderNumber(this.orderNumberValue).build();
    }
}
