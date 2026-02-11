import { Result } from '@optivem/commons/util';
import { UseCaseResult, UseCaseContext, ResponseVerification } from '@optivem/commons/dsl';
import { ClockErrorResponse } from '../../../driver/dtos/error/ClockErrorResponse.js';
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
        super(
            result,
            context,
            verificationFactory,
            (error: ClockErrorResponse, ctx: UseCaseContext) => new ClockErrorVerification(error, ctx)
        );
    }
}
