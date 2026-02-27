/**
 * V4 e2e fixtures: channel-based shop driver + external drivers (ERP/Tax).
 * Mirrors reference V4 driver-level style (no ScenarioDsl).
 */
import { randomUUID } from 'node:crypto';
import { test as base } from '@playwright/test';
import type { ShopDriver } from '@optivem/driver-core/shop/driver/ShopDriver.js';
import { ChannelType } from '@optivem/dsl-core/system/shop/ChannelType.js';
import { bindTestEach, ChannelContext, forChannels as sharedForChannels } from '@optivem/optivem-testing';
import { Closer, setupResultMatchers } from '@optivem/commons/util';
import {
    createShopUiDriver,
    createShopApiDriver,
    createErpDriver,
    createTaxApiDriver,
    getExternalSystemMode,
} from '@optivem/test-infrastructure';

setupResultMatchers();

const testBase = base.extend<{
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

type TestEach = ReturnType<typeof bindTestEach>;
export const test: typeof testBase & { each: TestEach } = Object.assign(testBase, { each: bindTestEach(testBase) });

export { expect } from '@playwright/test';

export interface V4ChannelFixtures {
    shopDriver: ShopDriver;
    erpDriver: ReturnType<typeof createErpDriver>;
    taxDriver: ReturnType<typeof createTaxApiDriver>;
}

export function createShopDriverForChannel(channel: string): ShopDriver {
    const externalSystemMode = getExternalSystemMode(undefined);
    return channel === ChannelType.UI
        ? createShopUiDriver(externalSystemMode)
        : createShopApiDriver(externalSystemMode);
}

export async function withChannelShopDriver<T>(
    testFn: (shopDriver: ShopDriver) => Promise<T>,
    channel?: string
): Promise<T> {
    const resolvedChannel = channel ?? ChannelContext.get();
    if (resolvedChannel == null || resolvedChannel === '') {
        throw new Error('Channel is not set. Use forChannels(...) or pass channel explicitly to withChannelShopDriver.');
    }

    const manageContext = channel != null && channel !== '';
    const shopDriver = createShopDriverForChannel(resolvedChannel);
    try {
        if (manageContext) {
            ChannelContext.set(resolvedChannel);
        }
        return await testFn(shopDriver);
    } finally {
        await Closer.close(shopDriver);
        if (manageContext) {
            ChannelContext.clear();
        }
    }
}

export function forChannels(...channelTypes: string[]): (block: () => void) => void {
    return sharedForChannels(
        {
            describe: (name, callback) => test.describe(name, callback),
            beforeEach: (callback) => test.beforeEach(callback),
            afterEach: (callback) => test.afterEach(callback),
        },
        ...channelTypes
    );
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
                const shopDriver = createShopDriverForChannel(channel);
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
