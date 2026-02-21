/**
 * V4 e2e fixtures: channel-based shop driver + external drivers (ERP/Tax).
 * Mirrors reference V4 driver-level style (no ScenarioDsl).
 */
import { randomUUID } from 'node:crypto';
import { test as base } from '@playwright/test';
import type { ShopDriver } from '@optivem/core/shop/driver/ShopDriver.js';
import { ChannelType } from '@optivem/core/shop/ChannelType.js';
import { ChannelContext } from '@optivem/optivem-testing';
import { Closer, setupResultMatchers } from '@optivem/commons/util';
import {
    createShopUiDriver,
    createShopApiDriver,
    createErpDriver,
    createTaxApiDriver,
} from '@optivem/test-infrastructure';
import { getExternalSystemMode } from '../../../../test.config.js';

setupResultMatchers();

export const test = base.extend<{
    erpDriver: ReturnType<typeof createErpDriver>;
    taxDriver: ReturnType<typeof createTaxApiDriver>;
}>({
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

export interface V4ChannelFixtures {
    shopDriver: ShopDriver;
    erpDriver: ReturnType<typeof createErpDriver>;
    taxDriver: ReturnType<typeof createTaxApiDriver>;
}

export function createUniqueSku(baseSku: string): string {
    const suffix = randomUUID().replace(/-/g, '').slice(0, 8);
    return `${baseSku}-${suffix}`;
}

export function channelShopDriverTest(
    channelTypes: string[],
    testName: string,
    testFn: (fixtures: V4ChannelFixtures) => Promise<void>
): void {
    const channelEnv = process.env.CHANNEL;
    const channelsToRun =
        channelEnv != null && channelEnv !== ''
            ? channelTypes.filter((c) => c === channelEnv)
            : channelTypes;

    for (const channel of channelsToRun) {
        test(`[${channel} Channel] ${testName}`, async ({ erpDriver, taxDriver }) => {
            try {
                ChannelContext.set(channel);
                const shopDriver =
                    channel === ChannelType.UI
                        ? createShopUiDriver(getExternalSystemMode())
                        : createShopApiDriver(getExternalSystemMode());
                try {
                    await testFn({ shopDriver, erpDriver, taxDriver });
                } finally {
                    await Closer.close(shopDriver);
                }
            } finally {
                ChannelContext.clear();
            }
        });
    }
}
