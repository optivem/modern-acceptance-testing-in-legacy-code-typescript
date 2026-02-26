import { Result } from '@optivem/common/util';
import { UseCaseResult, UseCaseContext, ResponseVerification } from '@optivem/dsl-common/dsl';
import type { ErpErrorResponse } from '@optivem/driver-api/erp/dtos/error/ErpErrorResponse.js';
import { ErpErrorVerification } from './ErpErrorVerification.js';

export class ErpUseCaseResult<
    TSuccessResponse,
    TSuccessVerification extends ResponseVerification<TSuccessResponse>
> extends UseCaseResult<TSuccessResponse, ErpErrorResponse, TSuccessVerification, ErpErrorVerification> {
    constructor(
        result: Result<TSuccessResponse, ErpErrorResponse>,
        context: UseCaseContext,
        verificationFactory: (response: TSuccessResponse, context: UseCaseContext) => TSuccessVerification
    ) {
        super(result, context, verificationFactory, (error, ctx) => new ErpErrorVerification(error, ctx));
    }
}


