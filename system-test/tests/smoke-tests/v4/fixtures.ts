import { test as base } from '@playwright/test';
import type { ShopDriver } from '@optivem/core/shop/driver/ShopDriver.js';
import { ChannelType } from '@optivem/core/shop/ChannelType.js';
import { ChannelContext } from '@optivem/optivem-testing';
import { Closer } from '@optivem/commons/util';
import { DriverFactory } from '@optivem/test-infrastructure';
import { setupResultMatchers } from '@optivem/commons/util';
import { getExternalSystemMode } from '../../../test.config.js';

setupResultMatchers();

export const test = base.extend<{
    erpDriver: ReturnType<typeof DriverFactory.createErpDriver>;
    taxDriver: ReturnType<typeof DriverFactory.createTaxApiDriver>;
}>({
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

export interface V4ChannelFixtures {
    shopDriver: ShopDriver;
    erpDriver: ReturnType<typeof DriverFactory.createErpDriver>;
    taxDriver: ReturnType<typeof DriverFactory.createTaxApiDriver>;
}

/**
 * Run the same shop driver test for each channel (UI/API). Sets ChannelContext and creates shopDriver per channel.
 */
export function channelShopDriverTest(
    channelTypes: string[],
    testName: string,
    testFn: (fixtures: V4ChannelFixtures) => Promise<void>
): void {
    for (const channel of channelTypes) {
        test(`[${channel} Channel] ${testName}`, async ({ erpDriver, taxDriver }) => {
            try {
                ChannelContext.set(channel);
                const shopDriver =
                    channel === ChannelType.UI
                        ? DriverFactory.createShopUiDriver(getExternalSystemMode())
                        : DriverFactory.createShopApiDriver(getExternalSystemMode());
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
