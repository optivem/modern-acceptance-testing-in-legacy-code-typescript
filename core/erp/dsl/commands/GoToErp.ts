import { ErpApiDriver } from '../../driver/ErpApiDriver.js';
import { BaseCommand, CommandResult, VoidVerification, Context } from '@optivem/commons/dsl';

export class GoToErp extends BaseCommand<ErpApiDriver, void, VoidVerification> {
    constructor(driver: ErpApiDriver, context: Context) {
        super(driver, context);
    }

    async execute(): Promise<CommandResult<void, VoidVerification>> {
        const result = await this.driver.goToErp();
        return new CommandResult(result, this.context, (response, context) => new VoidVerification(response, context));
    }
}


