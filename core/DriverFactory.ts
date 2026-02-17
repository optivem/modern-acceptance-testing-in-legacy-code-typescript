import { ExternalSystemMode } from '@optivem/commons/dsl';
import { SystemConfigurationLoader } from '../system-test/SystemConfigurationLoader.js';
import { ShopUiDriver } from './shop/driver/ui/ShopUiDriver.js';
import { ShopApiDriver } from './shop/driver/api/ShopApiDriver.js';
import { ErpRealDriver } from './erp/driver/ErpRealDriver.js';
import type { TaxDriver } from './tax/driver/TaxDriver.js';
import { TaxRealDriver } from './tax/driver/TaxRealDriver.js';

export function getDefaultExternalSystemMode(): ExternalSystemMode {
    return (process.env.EXTERNAL_SYSTEM_MODE?.toUpperCase() as 'STUB' | 'REAL') === 'STUB'
        ? ExternalSystemMode.STUB
        : ExternalSystemMode.REAL;
}

export class DriverFactory {
    private static getConfiguration(externalSystemMode?: ExternalSystemMode) {
        return SystemConfigurationLoader.load(externalSystemMode ?? getDefaultExternalSystemMode());
    }

    static createShopUiDriver(externalSystemMode?: ExternalSystemMode): ShopUiDriver {
        return new ShopUiDriver(this.getConfiguration(externalSystemMode).getShopUiBaseUrl());
    }

    static createShopApiDriver(externalSystemMode?: ExternalSystemMode): ShopApiDriver {
        return new ShopApiDriver(this.getConfiguration(externalSystemMode).getShopApiBaseUrl());
    }

    static createErpDriver(externalSystemMode?: ExternalSystemMode): ErpRealDriver {
        return new ErpRealDriver(this.getConfiguration(externalSystemMode).getErpBaseUrl());
    }

    static createTaxApiDriver(externalSystemMode?: ExternalSystemMode): TaxDriver {
        return new TaxRealDriver(this.getConfiguration(externalSystemMode).getTaxBaseUrl());
    }
}


