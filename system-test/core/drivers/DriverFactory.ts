import { TestConfiguration } from '../../TestConfiguration.js';
import { ShopUiDriver } from './system/shop/ui/ShopUiDriver.js';
import { ShopApiDriver } from './system/shop/api/ShopApiDriver.js';
import { ErpApiDriver } from './external/erp/api/ErpApiDriver.js';
import { TaxApiDriver } from './external/tax/api/TaxApiDriver.js';

export class DriverFactory {
    static createShopUiDriver(): ShopUiDriver {
        return new ShopUiDriver(TestConfiguration.getShopUiBaseUrl());
    }

    static createShopApiDriver(): ShopApiDriver {
        return new ShopApiDriver(TestConfiguration.getShopApiBaseUrl());
    }

    static createErpApiDriver(): ErpApiDriver {
        return new ErpApiDriver(TestConfiguration.getErpApiBaseUrl());
    }

    static createTaxApiDriver(): TaxApiDriver {
        return new TaxApiDriver(TestConfiguration.getTaxApiBaseUrl());
    }
}
