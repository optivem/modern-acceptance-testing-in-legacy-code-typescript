/**
 * V4 e2e fixtures: channel-based shop driver + external drivers (ERP/Tax).
 * Mirrors reference V4 driver-level style (no ScenarioDsl).
 */
import { randomUUID } from 'node:crypto';
import { test as base } from '@playwright/test';
import type { ShopDriver } from '@optivem/driver-core/shop/driver/ShopDriver.js';
import { Closer, setupResultMatchers } from '@optivem/commons/util';
import { bindTestEach } from '@optivem/optivem-testing';
import {
    createShopUiDriver,
    createShopApiDriver,
    createErpDriver,
    createTaxApiDriver,
    getExternalSystemMode,
} from '@optivem/test-infrastructure';

setupResultMatchers();

type V3Fixtures = {
    shopUiDriver: ShopDriver;
    shopApiDriver: ShopDriver;
    erpDriver: ReturnType<typeof createErpDriver>;
    taxDriver: ReturnType<typeof createTaxApiDriver>;
};

const testBase = base.extend<{
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

type TestEach = ReturnType<typeof bindTestEach>;
export const test: typeof testBase & { each: TestEach } = Object.assign(testBase, { each: bindTestEach(testBase) });

export { expect } from '@playwright/test';

export function createUniqueSku(baseSku: string): string {
    const suffix = randomUUID().replace(/-/g, '').slice(0, 8);
    return `${baseSku}-${suffix}`;
}
