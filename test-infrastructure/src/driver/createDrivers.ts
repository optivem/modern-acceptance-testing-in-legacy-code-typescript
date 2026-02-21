import { ExternalSystemMode } from '@optivem/commons/dsl';
import { ShopUiDriver } from '@optivem/core/shop/driver/ui/ShopUiDriver.js';
import { ShopApiDriver } from '@optivem/core/shop/driver/api/ShopApiDriver.js';
import { ErpRealDriver } from '@optivem/core/erp/driver/ErpRealDriver.js';
import type { TaxDriver } from '@optivem/core/tax/driver/TaxDriver.js';
import { TaxRealDriver } from '@optivem/core/tax/driver/TaxRealDriver.js';
import { getConfiguration } from './configurationLoaderRegistry.js';

export function createShopUiDriver(externalSystemMode?: ExternalSystemMode): ShopUiDriver {
    const config = getConfiguration(externalSystemMode);
    return new ShopUiDriver(config.shopUiBaseUrl);
}

export function createShopApiDriver(externalSystemMode?: ExternalSystemMode): ShopApiDriver {
    const config = getConfiguration(externalSystemMode);
    return new ShopApiDriver(config.shopApiBaseUrl);
}

export function createErpDriver(externalSystemMode?: ExternalSystemMode): ErpRealDriver {
    const config = getConfiguration(externalSystemMode);
    return new ErpRealDriver(config.erpBaseUrl);
}

export function createTaxApiDriver(externalSystemMode?: ExternalSystemMode): TaxDriver {
    const config = getConfiguration(externalSystemMode);
    return new TaxRealDriver(config.taxBaseUrl);
}