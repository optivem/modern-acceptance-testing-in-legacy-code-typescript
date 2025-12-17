import { SystemConfiguration } from '../../SystemConfiguration.js';
import { Context } from '@optivem/testing-dsl';
import { TaxApiDriver } from '../driver/TaxApiDriver.js';
import { Closer } from '@optivem/lang';
import { GoToTax } from './commands/GoToTax.js';

export class TaxDsl {
    private readonly driver: TaxApiDriver;
    private readonly context: Context;

    constructor(context: Context, configuration: SystemConfiguration) {
        this.driver = this.createDriver(configuration);
        this.context = context;
    }

    private createDriver(configuration: SystemConfiguration): TaxApiDriver {
        return new TaxApiDriver(configuration.getTaxBaseUrl());
    }

    async close(): Promise<void> {
        await Closer.close(this.driver);
    }

    goToTax(): GoToTax {
        return new GoToTax(this.driver, this.context);
    }
}


