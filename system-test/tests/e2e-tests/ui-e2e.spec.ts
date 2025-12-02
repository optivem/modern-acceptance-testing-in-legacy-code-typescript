import { test as base } from './e2e-tests.js';
import { DriverFactory } from '../../core/drivers/DriverFactory.js';
import { defineE2eTests } from './e2e-tests.js';
import { Closer } from '../../core/drivers/commons/clients/Closer.js';
import { setupResultMatchers } from '../../core/matchers/resultMatchers.js';

setupResultMatchers();

const test = base.extend({
    shopDriver: async ({}, use: any) => {
        const driver = DriverFactory.createShopUiDriver();
        await use(driver);
        await Closer.close(driver);
    },
});

defineE2eTests(test);
