import { ClockDriver } from '../../driver/ClockDriver.js';
import { BaseClockCommand } from './base/BaseClockCommand.js';
import { ClockUseCaseResult } from './base/ClockUseCaseResult.js';
import { VoidVerification } from '@optivem/commons/dsl';
import { UseCaseContext } from '@optivem/commons/dsl';

export class GoToClock extends BaseClockCommand<void, VoidVerification> {
    constructor(driver: ClockDriver, context: UseCaseContext) {
        super(driver, context);
    }

    async execute(): Promise<ClockUseCaseResult<void, VoidVerification>> {
        const result = await this.driver.goToClock();
        return new ClockUseCaseResult<void, VoidVerification>(
            result,
            this.context,
            (response, ctx) => new VoidVerification(response, ctx)
        );
    }
}
