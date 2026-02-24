import { ResponseVerification, UseCaseContext } from '@optivem/commons/dsl';
import { ClockErrorResponse } from '@optivem/driver-api/clock/driver/dtos/error/ClockErrorResponse.js';

export class ClockErrorVerification extends ResponseVerification<ClockErrorResponse> {
    constructor(error: ClockErrorResponse, context: UseCaseContext) {
        super(error, context);
    }
}
