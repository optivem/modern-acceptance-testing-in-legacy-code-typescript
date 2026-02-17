import type { ResponseVerification } from '@optivem/commons/dsl';
import type { ShopUseCaseResult } from '../../core/shop/dsl/usecases/base/ShopUseCaseResult.js';
import { ExecutionResultContext } from './ExecutionResultContext.js';

export class ExecutionResult<
    TSuccessResponse,
    TSuccessVerification extends ResponseVerification<TSuccessResponse>
> {
    constructor(
        private readonly result: ShopUseCaseResult<TSuccessResponse, TSuccessVerification>,
        orderNumber: string,
        couponCode: string
    ) {
        if (result == null) {
            throw new Error('Result cannot be null');
        }
        this.context = new ExecutionResultContext(orderNumber, couponCode);
    }

    private readonly context: ExecutionResultContext;

    getResult(): ShopUseCaseResult<TSuccessResponse, TSuccessVerification> {
        return this.result;
    }

    getContext(): ExecutionResultContext {
        return this.context;
    }
}
