import type { ResponseVerification } from '@optivem/commons/dsl';
import { VoidVerification } from '@optivem/commons/dsl';
import type { SystemDsl } from '../../system/SystemDsl.js';
import type { ExecutionResultContext } from '../ExecutionResultContext.js';
import type { ShopUseCaseResult } from '../../../../core/shop/dsl/usecases/base/ShopUseCaseResult.js';
import type { SystemErrorFailureVerification } from '../../../../core/shop/dsl/usecases/base/SystemErrorFailureVerification.js';
import { BaseThenVerifier } from './BaseThenVerifier.js';

export class ThenFailureVerifier<
    TSuccessResponse,
    TSuccessVerification extends ResponseVerification<TSuccessResponse>
> extends BaseThenVerifier<unknown, VoidVerification> {
    private readonly failureVerification: SystemErrorFailureVerification;

    constructor(
        app: SystemDsl,
        executionResult: ExecutionResultContext,
        result: ShopUseCaseResult<TSuccessResponse, TSuccessVerification>
    ) {
        super(app, executionResult, null);
        if (result == null) {
            throw new Error('Cannot verify failure: no operation was executed');
        }
        this.failureVerification = result.shouldFail();
    }

    errorMessage(expectedMessage: string): this {
        this.failureVerification.errorMessage(expectedMessage);
        return this;
    }

    fieldErrorMessage(expectedField: string, expectedMessage: string): this {
        this.failureVerification.fieldErrorMessage(expectedField, expectedMessage);
        return this;
    }
}
