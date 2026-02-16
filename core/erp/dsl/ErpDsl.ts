import { SystemConfiguration } from '../../SystemConfiguration.js';
import { UseCaseContext, ExternalSystemMode } from '@optivem/commons/dsl';
import type { ErpDriver } from '../driver/ErpDriver.js';
import { ErpRealDriver } from '../driver/ErpRealDriver.js';
import { ErpStubDriver } from '../driver/ErpStubDriver.js';
import { GetProduct } from './commands/GetProduct.js';
import { GoToErp } from './commands/GoToErp.js';
import { ReturnsProduct } from './commands/ReturnsProduct.js';

export class ErpDsl {
    private readonly driver: ErpDriver;
    private readonly context: UseCaseContext;

    constructor(context: UseCaseContext, configuration: SystemConfiguration) {
        this.context = context;
        this.driver = this.createDriver(context, configuration);
    }

    private createDriver(context: UseCaseContext, configuration: SystemConfiguration): ErpDriver {
        const mode = context.getExternalSystemMode();
        switch (mode) {
            case ExternalSystemMode.REAL:
                return new ErpRealDriver(configuration.getErpBaseUrl());
            case ExternalSystemMode.STUB:
                return new ErpStubDriver(configuration.getErpBaseUrl());
            default:
                throw new Error(`External system mode '${mode}' is not supported for ErpDsl.`);
        }
    }

    goToErp(): GoToErp {
        return new GoToErp(this.driver, this.context);
    }

    getProduct(): GetProduct {
        return new GetProduct(this.driver, this.context);
    }

    returnsProduct(): ReturnsProduct {
        return new ReturnsProduct(this.driver, this.context);
    }
}


