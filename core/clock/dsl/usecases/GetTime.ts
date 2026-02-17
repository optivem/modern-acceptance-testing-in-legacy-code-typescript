import { ClockDriver } from '../../driver/ClockDriver.js';
import { GetTimeResponse } from '../../driver/dtos/GetTimeResponse.js';
import { BaseClockCommand } from './base/BaseClockCommand.js';
import { ClockUseCaseResult } from './base/ClockUseCaseResult.js';
import { GetTimeVerification } from './GetTimeVerification.js';
import { UseCaseContext } from '@optivem/commons/dsl';

export class GetTime extends BaseClockCommand<GetTimeResponse, GetTimeVerification> {
    constructor(driver: ClockDriver, context: UseCaseContext) {
        super(driver, context);
    }

    async execute(): Promise<ClockUseCaseResult<GetTimeResponse, GetTimeVerification>> {
        const result = await this.driver.getTime();
        return new ClockUseCaseResult<GetTimeResponse, GetTimeVerification>(
            result,
            this.context,
            (response, ctx) => new GetTimeVerification(response, ctx)
        );
    }
}
