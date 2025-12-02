import { test as base } from '@playwright/test';
import { ShopDriver } from '../core/drivers/system/ShopDriver.js';
import { ErpApiDriver } from '../core/drivers/external/erp/api/ErpApiDriver.js';
import { TaxApiDriver } from '../core/drivers/external/tax/api/TaxApiDriver.js';

export type TestFixtures = {
    shopDriver: ShopDriver;
    erpApiDriver: ErpApiDriver;
    taxApiDriver: TaxApiDriver;
};

export const test = base.extend<TestFixtures>({
    shopDriver: async ({}, use) => {
        const driver = null as any; // Will be overridden in concrete tests
        await use(driver);
        if (driver) {
            await driver.close();
        }
    },

    erpApiDriver: async ({}, use) => {
        const driver = null as any; // Will be overridden in concrete tests
        await use(driver);
        if (driver) {
            await driver.close();
        }
    },

    taxApiDriver: async ({}, use) => {
        const driver = null as any; // Will be overridden in concrete tests
        await use(driver);
        if (driver) {
            await driver.close();
        }
    },
});

export { expect } from '@playwright/test';
