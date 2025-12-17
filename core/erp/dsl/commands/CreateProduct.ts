import { ErpApiDriver } from '../../driver/ErpApiDriver.js';
import { BaseCommand, CommandResult, VoidVerification, Context } from '@optivem/testing-dsl';

export class CreateProduct extends BaseCommand<ErpApiDriver, void, VoidVerification> {
    private skuParamAlias: string = 'DEFAULT-SKU';
    private unitPriceValue: string = '20.00';

    constructor(driver: ErpApiDriver, context: Context) {
        super(driver, context);
    }

    sku(alias: string): CreateProduct {
        this.skuParamAlias = alias;
        return this;
    }

    unitPrice(value: number | string): CreateProduct {
        this.unitPriceValue = typeof value === 'number' ? value.toString() : value;
        return this;
    }

    async execute(): Promise<CommandResult<void, VoidVerification>> {
        const sku = this.context.getParamValue(this.skuParamAlias);
        const result = await this.driver.createProduct(sku, this.unitPriceValue);
        return new CommandResult(result, this.context, (response, context) => new VoidVerification(response, context));
    }
}


