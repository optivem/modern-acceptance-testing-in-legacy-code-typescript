import { SystemConfigurationLoader } from '../system-test/SystemConfigurationLoader.js';
import { ShopUiDriver } from '../core-shop/driver/ui/ShopUiDriver.js';
import { ShopApiDriver } from '../core-shop/driver/api/ShopApiDriver.js';
import { ErpApiDriver } from '../core-erp/driver/ErpApiDriver.js';
import { TaxApiDriver } from '../core-tax/driver/TaxApiDriver.js';

export class DriverFactory {
    private static getConfiguration() {
        return SystemConfigurationLoader.load();
    }

    static createShopUiDriver(): ShopUiDriver {
        return new ShopUiDriver(this.getConfiguration().getShopUiBaseUrl());
    }

    static createShopApiDriver(): ShopApiDriver {
        return new ShopApiDriver(this.getConfiguration().getShopApiBaseUrl());
    }

    static createErpApiDriver(): ErpApiDriver {
        return new ErpApiDriver(this.getConfiguration().getErpBaseUrl());
    }

    static createTaxApiDriver(): TaxApiDriver {
        return new TaxApiDriver(this.getConfiguration().getTaxBaseUrl());
    }
}
