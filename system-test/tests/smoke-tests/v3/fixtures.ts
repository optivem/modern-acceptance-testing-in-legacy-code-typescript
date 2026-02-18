import { test as base } from '@playwright/test';
import type { ShopDriver } from '@optivem/core/shop/driver/ShopDriver.js';
import { Closer } from '@optivem/commons/util';
import { DriverFactory } from '@optivem/test-infrastructure';
import { setupResultMatchers } from '@optivem/commons/util';
import { getExternalSystemMode } from '../../../test.config.js';

setupResultMatchers();

export const test = base.extend<{
    shopUiDriver: ShopDriver;
    shopApiDriver: ShopDriver;
    erpDriver: ReturnType<typeof DriverFactory.createErpDriver>;
    taxDriver: ReturnType<typeof DriverFactory.createTaxApiDriver>;
}>({
    shopUiDriver: async ({}, use) => {
        const driver = DriverFactory.createShopUiDriver(getExternalSystemMode());
        await use(driver);
        await Closer.close(driver);
    },
    shopApiDriver: async ({}, use) => {
        const driver = DriverFactory.createShopApiDriver(getExternalSystemMode());
        await use(driver);
        await Closer.close(driver);
    },
    erpDriver: async ({}, use) => {
        const driver = DriverFactory.createErpDriver(getExternalSystemMode());
        await use(driver);
        await Closer.close(driver);
    },
    taxDriver: async ({}, use) => {
        const driver = DriverFactory.createTaxApiDriver(getExternalSystemMode());
        await use(driver);
        await Closer.close(driver);
    },
});

export { expect } from '@playwright/test';
