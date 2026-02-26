import { Result } from '@optivem/common/util';
import { UseCaseResult, UseCaseContext, ResponseVerification } from '@optivem/dsl-common/dsl';
import { ClockErrorResponse } from '@optivem/driver-api/clock/dtos/error/ClockErrorResponse.js';
import { ClockErrorVerification } from './ClockErrorVerification.js';

export class ClockUseCaseResult<
    TSuccessResponse,
    TSuccessVerification extends ResponseVerification<TSuccessResponse>
> extends UseCaseResult<TSuccessResponse, ClockErrorResponse, TSuccessVerification, ClockErrorVerification> {
    constructor(
        result: Result<TSuccessResponse, ClockErrorResponse>,
        context: UseCaseContext,
        verificationFactory: (response: TSuccessResponse, context: UseCaseContext) => TSuccessVerification
    ) {
        super(result, context, verificationFactory, (error, ctx) => new ClockErrorVerification(error, ctx));
    }
}
