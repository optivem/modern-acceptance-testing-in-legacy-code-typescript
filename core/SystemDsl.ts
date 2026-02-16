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

    private shopDsl?: ShopDsl;
    private erpDsl?: ErpDsl;
    private taxDsl?: TaxDsl;
    private clockDsl?: ClockDsl;

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
        await Closer.close(this.shopDsl as Parameters<typeof Closer.close>[0]);
        await Closer.close(this.erpDsl as Parameters<typeof Closer.close>[0]);
        await Closer.close(this.taxDsl as Parameters<typeof Closer.close>[0]);
        await Closer.close(this.clockDsl as Parameters<typeof Closer.close>[0]);
    }

    shop(): ShopDsl {
        return this.getOrCreate(
            this.shopDsl,
            () =>
                (this.shopDsl = new ShopDsl(
                    this.configuration.getShopUiBaseUrl(),
                    this.configuration.getShopApiBaseUrl(),
                    this.context
                ))
        );
    }

    erp(): ErpDsl {
        return this.getOrCreate(
            this.erpDsl,
            () => (this.erpDsl = new ErpDsl(this.configuration.getErpBaseUrl(), this.context))
        );
    }

    tax(): TaxDsl {
        return this.getOrCreate(
            this.taxDsl,
            () => (this.taxDsl = new TaxDsl(this.configuration.getTaxBaseUrl(), this.context))
        );
    }

    clock(): ClockDsl {
        return this.getOrCreate(
            this.clockDsl,
            () => (this.clockDsl = new ClockDsl(this.configuration.getClockBaseUrl(), this.context))
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


