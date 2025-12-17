import { SystemConfiguration } from '../../SystemConfiguration.js';
import { Context } from '@optivem/testing-dsl';
import { ErpApiDriver } from '../driver/ErpApiDriver.js';
import { Closer } from '@optivem/lang';
import { GoToErp } from './commands/GoToErp.js';
import { CreateProduct } from './commands/CreateProduct.js';

export class ErpDsl {
    private readonly driver: ErpApiDriver;
    private readonly context: Context;

    constructor(context: Context, configuration: SystemConfiguration) {
        this.driver = this.createDriver(configuration);
        this.context = context;
    }

    private createDriver(configuration: SystemConfiguration): ErpApiDriver {
        return new ErpApiDriver(configuration.getErpBaseUrl());
    }

    async close(): Promise<void> {
        await Closer.close(this.driver);
    }

    goToErp(): GoToErp {
        return new GoToErp(this.driver, this.context);
    }

    createProduct(): CreateProduct {
        return new CreateProduct(this.driver, this.context);
    }
}


