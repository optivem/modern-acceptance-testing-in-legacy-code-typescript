import { VoidVerification, UseCaseContext } from '@optivem/commons/dsl';
import type { ErpDriver } from '../../driver/ErpDriver.js';
import { BaseErpCommand } from './base/BaseErpCommand.js';
import { ErpUseCaseResult } from './base/ErpUseCaseResult.js';

export class GoToErp extends BaseErpCommand<void, VoidVerification> {
    constructor(driver: ErpDriver, context: UseCaseContext) {
        super(driver, context);
    }

    async execute(): Promise<ErpUseCaseResult<void, VoidVerification>> {
        const result = await this.driver.goToErp();
        return new ErpUseCaseResult<void, VoidVerification>(
            result,
            this.context,
            (response, ctx) => new VoidVerification(response, ctx)
        );
    }
}


