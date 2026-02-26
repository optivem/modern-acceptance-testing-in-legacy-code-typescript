import { Result } from '@optivem/common/util';
import { UseCaseResult, UseCaseContext, ResponseVerification } from '@optivem/dsl-common/dsl';
import type { TaxErrorResponse } from '@optivem/driver-api/tax/dtos/error/TaxErrorResponse.js';
import { TaxErrorVerification } from './TaxErrorVerification.js';

export class TaxUseCaseResult<
    TSuccessResponse,
    TSuccessVerification extends ResponseVerification<TSuccessResponse>
> extends UseCaseResult<TSuccessResponse, TaxErrorResponse, TSuccessVerification, TaxErrorVerification> {
    constructor(
        result: Result<TSuccessResponse, TaxErrorResponse>,
        context: UseCaseContext,
        verificationFactory: (response: TSuccessResponse, context: UseCaseContext) => TSuccessVerification
    ) {
        super(result, context, verificationFactory, (error, ctx) => new TaxErrorVerification(error, ctx));
    }
}
