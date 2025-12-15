import { ShopDriver } from '../../driver/ShopDriver.js';
import { BaseCommand, CommandResult, VoidVerification, Context } from '@optivem/testing-dsl';

export class GoToShop extends BaseCommand<ShopDriver, void, VoidVerification> {
    constructor(driver: ShopDriver, context: Context) {
        super(driver, context);
    }

    async execute(): Promise<CommandResult<void, VoidVerification>> {
        const result = await this.driver.goToShop();
        return new CommandResult(result, this.context, (response, context) => new VoidVerification(response, context));
    }
}
