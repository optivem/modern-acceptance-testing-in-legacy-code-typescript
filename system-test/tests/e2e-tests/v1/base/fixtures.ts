/**
 * V1 e2e fixtures: raw-driver style (Shop/ERP/Tax), no ScenarioDsl.
 * Parity with Java/.NET v1 BaseE2eTest: fixed REAL external system mode.
 */
import { randomUUID } from 'node:crypto';
import { test as base } from '@playwright/test';
import type { ShopDriver } from '@optivem/driver-core/shop/driver/ShopDriver.js';
import { Closer, setupResultMatchers } from '@optivem/common/util';
import {
    createShopUiDriver,
    createShopApiDriver,
    createErpDriver,
    createTaxApiDriver,
} from '@optivem/test-infrastructure';

const FIXED_EXTERNAL_SYSTEM_MODE = 'REAL';

setupResultMatchers();

export const test = base.extend<{
    shopUiDriver: ShopDriver;
    shopApiDriver: ShopDriver;
    erpDriver: ReturnType<typeof createErpDriver>;
    taxDriver: ReturnType<typeof createTaxApiDriver>;
}>({
    shopUiDriver: async ({}, use) => {
        const driver = createShopUiDriver(FIXED_EXTERNAL_SYSTEM_MODE);
        await use(driver);
        await Closer.close(driver);
    },
    shopApiDriver: async ({}, use) => {
        const driver = createShopApiDriver(FIXED_EXTERNAL_SYSTEM_MODE);
        await use(driver);
        await Closer.close(driver);
    },
    erpDriver: async ({}, use) => {
        const driver = createErpDriver(FIXED_EXTERNAL_SYSTEM_MODE);
        await use(driver);
        await Closer.close(driver);
    },
    taxDriver: async ({}, use) => {
        const driver = createTaxApiDriver(FIXED_EXTERNAL_SYSTEM_MODE);
        await use(driver);
        await Closer.close(driver);
    },
});

export { expect } from '@playwright/test';

export function createUniqueSku(baseSku: string): string {
    const suffix = randomUUID().replace(/-/g, '').slice(0, 8);
    return `${baseSku}-${suffix}`;
}
