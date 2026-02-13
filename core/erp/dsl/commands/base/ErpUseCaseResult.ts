import { Result } from '@optivem/commons/util';
import { UseCaseResult, UseCaseContext, ResponseVerification } from '@optivem/commons/dsl';
import type { ErpErrorResponse } from '../../../driver/dtos/error/ErpErrorResponse.js';
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


