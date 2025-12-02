import { test as base } from './fixtures.js';
import { DriverFactory } from '../core/drivers/DriverFactory.js';

export const test = base.extend({
    erpApiDriver: async ({}, use: any) => {
        const driver = DriverFactory.createErpApiDriver();
        await use(driver);
        await driver.close();
    },

    taxApiDriver: async ({}, use: any) => {
        const driver = DriverFactory.createTaxApiDriver();
        await use(driver);
        await driver.close();
    },
});

export { expect } from '@playwright/test';
