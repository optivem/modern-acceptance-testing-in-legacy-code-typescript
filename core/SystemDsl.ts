import { UseCaseContext } from '@optivem/commons/dsl';
import { SystemConfiguration } from './SystemConfiguration.js';
import { ShopDsl } from './shop/dsl/ShopDsl.js';
import { ErpDsl } from './erp/dsl/ErpDsl.js';
import { TaxDsl } from './tax/dsl/TaxDsl.js';
import { ClockDsl } from './clock/dsl/ClockDsl.js';
import { Closer } from '@optivem/commons/util';

export class SystemDsl {
    private readonly context: UseCaseContext;
    private readonly configuration: SystemConfiguration;

    private _shop?: ShopDsl;
    private _erp?: ErpDsl;
    private _tax?: TaxDsl;
    private _clock?: ClockDsl;

    constructor(context: UseCaseContext, configuration: SystemConfiguration);
    constructor(configuration: SystemConfiguration);
    constructor(contextOrConfiguration: UseCaseContext | SystemConfiguration, configuration?: SystemConfiguration) {
        if (configuration !== undefined) {
            this.context = contextOrConfiguration as UseCaseContext;
            this.configuration = configuration;
        } else {
            this.configuration = contextOrConfiguration as SystemConfiguration;
            this.context = new UseCaseContext(this.configuration.getExternalSystemMode());
        }
    }

    async close(): Promise<void> {
        await Closer.close(this._shop as Parameters<typeof Closer.close>[0]);
        await Closer.close(this._erp as Parameters<typeof Closer.close>[0]);
        await Closer.close(this._tax as Parameters<typeof Closer.close>[0]);
        await Closer.close(this._clock as Parameters<typeof Closer.close>[0]);
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

    clock(): ClockDsl {
        return this.getOrCreate(
            this._clock,
            () => (this._clock = new ClockDsl(this.context, this.configuration))
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

    getClock(): ClockDsl {
        return this.clock();
    }

    private getOrCreate<T>(instance: T | undefined, supplier: () => T): T {
        return instance !== undefined ? instance : supplier();
    }
}


