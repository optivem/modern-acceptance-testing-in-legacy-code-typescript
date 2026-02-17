import type { ResponseVerification } from '@optivem/commons/dsl';
import type { ShopUseCaseResult } from '../../core/shop/dsl/usecases/base/ShopUseCaseResult.js';
import { GherkinDefaults } from './GherkinDefaults.js';
import { ExecutionResult } from './ExecutionResult.js';

export class ExecutionResultBuilder<
    TSuccessResponse,
    TSuccessVerification extends ResponseVerification<TSuccessResponse>
> {
    private orderNumberValue: string | undefined;
    private couponCodeValue: string | undefined;

    constructor(private readonly result: ShopUseCaseResult<TSuccessResponse, TSuccessVerification>) {}

    orderNumber(value: string): this {
        this.orderNumberValue = value;
        return this;
    }

    couponCode(value: string): this {
        this.couponCodeValue = value;
        return this;
    }

    build(): ExecutionResult<TSuccessResponse, TSuccessVerification> {
        return new ExecutionResult(
            this.result,
            this.orderNumberValue ?? GherkinDefaults.DEFAULT_ORDER_NUMBER,
            this.couponCodeValue ?? GherkinDefaults.EMPTY
        );
    }
}
