import { test as base } from '@playwright/test';
import type { ShopDriver } from '@optivem/core/shop/driver/ShopDriver.js';
import { Closer } from '@optivem/commons/util';
import {
    createShopUiDriver,
    createShopApiDriver,
    createErpDriver,
    createTaxApiDriver,
} from '@optivem/test-infrastructure';
import { setupResultMatchers } from '@optivem/commons/util';
import { getExternalSystemMode } from '../../../test.config.js';

setupResultMatchers();

export const test = base.extend<{
    shopUiDriver: ShopDriver;
    shopApiDriver: ShopDriver;
    erpDriver: ReturnType<typeof createErpDriver>;
    taxDriver: ReturnType<typeof createTaxApiDriver>;
}>({
    shopUiDriver: async ({}, use) => {
        const driver = createShopUiDriver(getExternalSystemMode());
        await use(driver);
        await Closer.close(driver);
    },
    shopApiDriver: async ({}, use) => {
        const driver = createShopApiDriver(getExternalSystemMode());
        await use(driver);
        await Closer.close(driver);
    },
    erpDriver: async ({}, use) => {
        const driver = createErpDriver(getExternalSystemMode());
        await use(driver);
        await Closer.close(driver);
    },
    taxDriver: async ({}, use) => {
        const driver = createTaxApiDriver(getExternalSystemMode());
        await use(driver);
        await Closer.close(driver);
    },
});

export { expect } from '@playwright/test';
