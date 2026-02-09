import { test as base } from '../fixtures.js';
import { DriverFactory } from '../../core/drivers/DriverFactory.js';
import { defineShopSmokeTests } from './shop-smoke-tests.js';
import { Closer } from '@optivem/util';
import { setupResultMatchers } from '@optivem/testing-assertions';

setupResultMatchers();

const test = base.extend({
    shopDriver: async ({}, use: any) => {
        const driver = DriverFactory.createShopUiDriver();
        await use(driver);
        await Closer.close(driver);
    },
});

defineShopSmokeTests(test);
