import { test as base } from '../e2e-tests.js';
import { DriverFactory } from '../../core/drivers/DriverFactory.js';
import { defineE2eTests } from '../e2e-tests.js';

const test = base.extend({
    shopDriver: async ({}, use: any) => {
        const driver = DriverFactory.createShopApiDriver();
        await use(driver);
        await driver.close();
    },
});

defineE2eTests(test);
