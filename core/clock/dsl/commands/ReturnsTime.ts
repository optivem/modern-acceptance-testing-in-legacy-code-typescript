import { ClockDriver } from '../../driver/ClockDriver.js';
import { ReturnsTimeRequest } from '../../driver/dtos/ReturnsTimeRequest.js';
import { BaseClockCommand } from './base/BaseClockCommand.js';
import { ClockUseCaseResult } from './base/ClockUseCaseResult.js';
import { VoidVerification } from '@optivem/commons/dsl';
import { UseCaseContext } from '@optivem/commons/dsl';

export class ReturnsTime extends BaseClockCommand<void, VoidVerification> {
    private _time: string | undefined;

    constructor(driver: ClockDriver, context: UseCaseContext) {
        super(driver, context);
    }

    time(time: string | undefined): ReturnsTime {
        this._time = time;
        return this;
    }

    async execute(): Promise<ClockUseCaseResult<void, VoidVerification>> {
        const request: ReturnsTimeRequest = { time: this._time };
        const result = await this.driver.returnsTime(request);
        return new ClockUseCaseResult<void, VoidVerification>(
            result,
            this.context,
            (response, ctx) => new VoidVerification(response, ctx)
        );
    }
}
