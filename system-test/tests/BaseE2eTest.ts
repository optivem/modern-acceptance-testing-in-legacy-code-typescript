import { test as base } from '@playwright/test';
import { ShopDriver } from '../core/drivers/system/ShopDriver.js';
import { ErpApiDriver } from '../core/drivers/external/erp/api/ErpApiDriver.js';
import { TaxApiDriver } from '../core/drivers/external/tax/api/TaxApiDriver.js';
import { DriverFactory } from '../core/drivers/DriverFactory.js';

export abstract class BaseE2eTest {
    public shopDriver!: ShopDriver;
    public erpApiDriver!: ErpApiDriver;
    public taxApiDriver!: TaxApiDriver;

    protected abstract createDriver(): ShopDriver;

    async setUp() {
        this.shopDriver = this.createDriver();
        this.erpApiDriver = DriverFactory.createErpApiDriver();
        this.taxApiDriver = DriverFactory.createTaxApiDriver();
    }

    async tearDown() {
        if (this.shopDriver) {
            this.shopDriver.close();
        }
        if (this.erpApiDriver) {
            this.erpApiDriver.close();
        }
        if (this.taxApiDriver) {
            this.taxApiDriver.close();
        }
    }
}
