import { Context, UseCaseContext } from '@optivem/commons/dsl';
import { SystemConfiguration } from './SystemConfiguration.js';
import { ShopDsl } from './shop/dsl/ShopDsl.js';
import { ErpDsl } from './erp/dsl/ErpDsl.js';
import { TaxDsl } from './tax/dsl/TaxDsl.js';
import { Closer } from '@optivem/commons/util';

export class SystemDsl {
    private readonly context: Context;
    private readonly configuration: SystemConfiguration;

    private _shop?: ShopDsl;
    private _erp?: ErpDsl;
    private _tax?: TaxDsl;

    constructor(context: Context, configuration: SystemConfiguration);
    constructor(configuration: SystemConfiguration);
    constructor(contextOrConfiguration: Context | SystemConfiguration, configuration?: SystemConfiguration) {
        if (contextOrConfiguration instanceof Context) {
            this.context = contextOrConfiguration;
            this.configuration = configuration!;
        } else {
            // TODO (backward compatibility): two-arg constructor (configuration only) creates context with mode from config.
            this.configuration = contextOrConfiguration;
            this.context = new UseCaseContext(this.configuration.getExternalSystemMode());
        }
    }

    async close(): Promise<void> {
        await Closer.close(this._shop);
        await Closer.close(this._erp);
        await Closer.close(this._tax);
    }

    shop(): ShopDsl {
        return this.getOrCreate(
            this._shop,
            () => (this._shop = new ShopDsl(this.context, this.configuration))
        );
    }

    erp(): ErpDsl {
        return this.getOrCreate(
            this._erp,
            () => (this._erp = new ErpDsl(this.context, this.configuration))
        );
    }

    tax(): TaxDsl {
        return this.getOrCreate(
            this._tax,
            () => (this._tax = new TaxDsl(this.context, this.configuration))
        );
    }

    getShop(): ShopDsl {
        return this.shop();
    }

    getErp(): ErpDsl {
        return this.erp();
    }

    getTax(): TaxDsl {
        return this.tax();
    }

    private getOrCreate<T>(instance: T | undefined, supplier: () => T): T {
        return instance !== undefined ? instance : supplier();
    }
}


