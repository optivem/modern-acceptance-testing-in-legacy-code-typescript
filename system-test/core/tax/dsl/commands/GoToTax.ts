import { TaxApiDriver } from '../../driver/TaxApiDriver.js';
import { BaseCommand, CommandResult, VoidVerification, Context } from '@optivem/testing-dsl';

export class GoToTax extends BaseCommand<TaxApiDriver, void, VoidVerification> {
    constructor(driver: TaxApiDriver, context: Context) {
        super(driver, context);
    }

    async execute(): Promise<CommandResult<void, VoidVerification>> {
        const result = await this.driver.goToTax();
        return new CommandResult(result, this.context, (response, context) => new VoidVerification(response, context));
    }
}
