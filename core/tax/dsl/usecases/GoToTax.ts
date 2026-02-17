import { VoidVerification, UseCaseContext } from '@optivem/commons/dsl';
import type { TaxDriver } from '../../driver/TaxDriver.js';
import { BaseTaxCommand } from './base/BaseTaxCommand.js';
import { TaxUseCaseResult } from './base/TaxUseCaseResult.js';

export class GoToTax extends BaseTaxCommand<void, VoidVerification> {
    constructor(driver: TaxDriver, context: UseCaseContext) {
        super(driver, context);
    }

    async execute(): Promise<TaxUseCaseResult<void, VoidVerification>> {
        const result = await this.driver.goToTax();
        return new TaxUseCaseResult(result, this.context, (response, ctx) => new VoidVerification(response, ctx));
    }
}
