import { test as base } from '../fixtures.js';
import { DriverFactory } from '../../core/drivers/DriverFactory.js';
import { expect } from '@playwright/test';

const test = base.extend({
    shopDriver: async ({}, use) => {
        const driver = DriverFactory.createShopUiDriver();
        await use(driver);
        await driver.close();
    },
});

test.describe('UI Smoke Tests', () => {
    test('should be able to go to shop', async ({ shopDriver }) => {
        const result = await shopDriver.goToShop();
        expect(result.isSuccess()).toBe(true);
    });
});
