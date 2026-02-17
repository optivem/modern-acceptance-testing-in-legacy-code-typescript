import type { Result } from '@optivem/commons/util';
import { UseCaseResult, UseCaseContext, ResponseVerification } from '@optivem/commons/dsl';
import type { SystemError } from '../../../commons/dtos/errors/SystemError.js';
import { SystemErrorFailureVerification } from './SystemErrorFailureVerification.js';

export class ShopUseCaseResult<
    TSuccessResponse,
    TSuccessVerification extends ResponseVerification<TSuccessResponse>
> extends UseCaseResult<TSuccessResponse, SystemError, TSuccessVerification, SystemErrorFailureVerification> {
    constructor(
        result: Result<TSuccessResponse, SystemError>,
        context: UseCaseContext,
        verificationFactory: (response: TSuccessResponse, context: UseCaseContext) => TSuccessVerification
    ) {
        super(result, context, verificationFactory, (error, ctx) => new SystemErrorFailureVerification(error, ctx));
    }
}


