import { ClockDriver } from '../../driver/ClockDriver.js';
import { ReturnsTimeRequest } from '../../driver/dtos/ReturnsTimeRequest.js';
import { BaseClockCommand } from './base/BaseClockCommand.js';
import { ClockUseCaseResult } from './base/ClockUseCaseResult.js';
import { VoidVerification } from '@optivem/commons/dsl';
import { UseCaseContext } from '@optivem/commons/dsl';
import type { Optional } from '@optivem/commons/util';

export class ReturnsTime extends BaseClockCommand<void, VoidVerification> {
    private timeValue: Optional<string>;

    constructor(driver: ClockDriver, context: UseCaseContext) {
        super(driver, context);
    }

    time(value: Optional<string>): ReturnsTime {
        this.timeValue = value;
        return this;
    }

    async execute(): Promise<ClockUseCaseResult<void, VoidVerification>> {
        const request: ReturnsTimeRequest = { time: this.timeValue };
        const result = await this.driver.returnsTime(request);
        return new ClockUseCaseResult<void, VoidVerification>(
            result,
            this.context,
            (response, ctx) => new VoidVerification(response, ctx)
        );
    }
}
