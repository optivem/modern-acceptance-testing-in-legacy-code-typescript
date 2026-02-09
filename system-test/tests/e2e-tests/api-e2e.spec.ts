import { test as base } from './e2e-tests.js';
import { DriverFactory } from '../../core/drivers/DriverFactory.js';
import { defineE2eTests } from './e2e-tests.js';
import { defineApiE2eTests } from './api-e2e-tests.js';
import { Closer } from '@optivem/commons-util';
import { setupResultMatchers } from '@optivem/commons-testing-assertions';

setupResultMatchers();

const test = base.extend({
    shopDriver: async ({}, use: any) => {
        const driver = DriverFactory.createShopApiDriver();
        await use(driver);
        await Closer.close(driver);
    },
});

defineE2eTests(test);
defineApiE2eTests(test);
