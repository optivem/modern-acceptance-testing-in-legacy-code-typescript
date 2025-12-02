import { test as base } from '../fixtures.js';
import { DriverFactory } from '../../core/drivers/DriverFactory.js';
import { defineShopSmokeTests } from './shop-smoke-tests.js';
import { Closer } from '../../core/drivers/commons/clients/Closer.js';
import { setupResultMatchers } from '../../core/matchers/resultMatchers.js';

setupResultMatchers();

const test = base.extend({
    shopDriver: async ({}, use: any) => {
        const driver = DriverFactory.createShopApiDriver();
        await use(driver);
        await Closer.close(driver);
    },
});

defineShopSmokeTests(test);
