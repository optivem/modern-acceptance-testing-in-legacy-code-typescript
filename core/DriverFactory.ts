import { SystemConfigurationLoader } from '../system-test/SystemConfigurationLoader.js';
import { ShopUiDriver } from './shop/driver/ui/ShopUiDriver.js';
import { ShopApiDriver } from './shop/driver/api/ShopApiDriver.js';
import { ErpRealDriver } from './erp/driver/ErpRealDriver.js';
import { TaxApiDriver } from './tax/driver/TaxApiDriver.js';

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

    static createErpDriver(): ErpRealDriver {
        return new ErpRealDriver(this.getConfiguration().getErpBaseUrl());
    }

    static createTaxApiDriver(): TaxApiDriver {
        return new TaxApiDriver(this.getConfiguration().getTaxBaseUrl());
    }
}


