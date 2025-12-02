import { describe, beforeEach, afterEach } from '@jest/globals';
import { DriverFactory } from '../../core/drivers/DriverFactory.js';
import { defineE2eTests } from './e2e-tests.js';
import { Closer } from '../../core/drivers/commons/clients/Closer.js';
import { ShopDriver } from '../../core/drivers/system/ShopDriver.js';
import { ErpApiDriver } from '../../core/drivers/external/erp/api/ErpApiDriver.js';
import { TaxApiDriver } from '../../core/drivers/external/tax/api/TaxApiDriver.js';

describe('UI E2E', () => {
    let shopDriver: ShopDriver;
    let erpApiDriver: ErpApiDriver;
    let taxApiDriver: TaxApiDriver;

    beforeEach(() => {
        shopDriver = DriverFactory.createShopUiDriver();
        erpApiDriver = DriverFactory.createErpApiDriver();
        taxApiDriver = DriverFactory.createTaxApiDriver();
    });

    afterEach(async () => {
        await Closer.close(shopDriver);
        await Closer.close(erpApiDriver);
        await Closer.close(taxApiDriver);
    });

    defineE2eTests(() => shopDriver, () => erpApiDriver, () => taxApiDriver);
});
