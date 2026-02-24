import type { ClockDriver } from '@optivem/driver-api/clock/driver/ClockDriver.js';
import { BaseUseCase, UseCaseContext } from '@optivem/commons/dsl';
import { ClockErrorResponse } from '@optivem/driver-api/clock/driver/dtos/error/ClockErrorResponse.js';
import { ClockErrorVerification } from './ClockErrorVerification.js';

export abstract class BaseClockCommand<TResponse, TVerification> extends BaseUseCase<
    ClockDriver,
    TResponse,
    ClockErrorResponse,
    TVerification,
    ClockErrorVerification
> {
    protected constructor(driver: ClockDriver, context: UseCaseContext) {
        super(driver, context);
    }
}
