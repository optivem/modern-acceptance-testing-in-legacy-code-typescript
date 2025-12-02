import { test as base } from '../fixtures.js';
import { DriverFactory } from '../../core/drivers/DriverFactory.js';
import { defineShopSmokeTests } from '../shop-smoke-tests.js';

const test = base.extend({
    shopDriver: async ({}, use: any) => {
        const driver = DriverFactory.createShopUiDriver();
        await use(driver);
        await driver.close();
    },
});

defineShopSmokeTests(test);
