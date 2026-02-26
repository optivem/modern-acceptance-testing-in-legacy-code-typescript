import { ResponseVerification, UseCaseContext } from '@optivem/dsl-common/dsl';
import { ClockErrorResponse } from '@optivem/driver-api/clock/dtos/error/ClockErrorResponse.js';

export class ClockErrorVerification extends ResponseVerification<ClockErrorResponse> {
    constructor(error: ClockErrorResponse, context: UseCaseContext) {
        super(error, context);
    }
}
