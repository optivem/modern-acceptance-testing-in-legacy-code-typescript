import { test as base } from '@playwright/test';
import { ShopDriver } from '../../core/shop/driver/ShopDriver.js';
import { ErpApiDriver } from '../../core/erp/driver/ErpApiDriver.js';
import type { TaxDriver } from '../../core/tax/driver/TaxDriver.js';

export type TestFixtures = {
    shopDriver: ShopDriver;
    erpApiDriver: ErpApiDriver;
    taxApiDriver: TaxDriver;
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


