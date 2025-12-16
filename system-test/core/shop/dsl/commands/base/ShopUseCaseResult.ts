import { Result } from '@optivem/lang';
import { UseCaseResult, UseCaseContext, ResponseVerification } from '@optivem/testing-dsl';
import { Error } from '../../../../commons/error/index.js';
import { ErrorFailureVerification } from '../../../../commons/dsl/index.js';

export class ShopUseCaseResult<
    TSuccessResponse,
    TSuccessVerification extends ResponseVerification<TSuccessResponse, UseCaseContext>
> extends UseCaseResult<TSuccessResponse, Error, UseCaseContext, TSuccessVerification, ErrorFailureVerification> {
    
    constructor(
        result: Result<TSuccessResponse, Error>,
        context: UseCaseContext,
        verificationFactory: (response: TSuccessResponse, context: UseCaseContext) => TSuccessVerification
    ) {
        super(result, context, verificationFactory, (error, ctx) => new ErrorFailureVerification(error, ctx));
    }
}
