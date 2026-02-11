import { ShopDriver } from '../../driver/ShopDriver.js';
import { BaseCommand, CommandResult, VoidVerification, Context } from '@optivem/commons/dsl';

export class CancelOrder extends BaseCommand<ShopDriver, void, VoidVerification> {
    private orderNumberResultAlias?: string;

    constructor(driver: ShopDriver, context: Context) {
        super(driver, context);
    }

    orderNumber(alias: string): CancelOrder {
        this.orderNumberResultAlias = alias;
        return this;
    }

    async execute(): Promise<CommandResult<void, VoidVerification>> {
        const orderNumber = this.context.getResultValue(this.orderNumberResultAlias!);
        const result = await this.driver.cancelOrder(orderNumber);
        return new CommandResult(result, this.context, (response, context) => new VoidVerification(response, context));
    }
}


