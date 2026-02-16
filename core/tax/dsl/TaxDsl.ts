import { UseCaseContext } from '@optivem/commons/dsl';
import { TaxApiDriver } from '../driver/TaxApiDriver.js';
import { Closer } from '@optivem/commons/util';
import { GoToTax } from './commands/GoToTax.js';

export class TaxDsl {
    private readonly driver: TaxApiDriver;
    private readonly context: UseCaseContext;

    constructor(baseUrl: string, context: UseCaseContext) {
        this.context = context;
        this.driver = new TaxApiDriver(baseUrl);
    }

    async close(): Promise<void> {
        await Closer.close(this.driver);
    }

    goToTax(): GoToTax {
        return new GoToTax(this.driver, this.context);
    }
}


