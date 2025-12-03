import { test as base, expect } from '@playwright/test';
import { DriverFactory } from '../../core/drivers/DriverFactory.js';
import { Closer } from '../../core/drivers/commons/clients/Closer.js';
import { setupResultMatchers } from '../../core/matchers/resultMatchers.js';

setupResultMatchers();

// Channel types - similar to .NET's ChannelType enum
const ChannelType = {
    API: 'API',
    UI: 'UI'
} as const;

// Helper function that mimics @Channel annotation from .NET/Java
function channelTest(
    channelTypes: string[],
    testName: string,
    testFn: (driver: any) => Promise<void>
) {
    const channelFactories = {
        [ChannelType.API]: () => DriverFactory.createShopApiDriver(),
        [ChannelType.UI]: () => DriverFactory.createShopUiDriver()
    };

    for (const channelType of channelTypes) {
        base.describe(`[${channelType} Channel]`, () => {
            let shopDriver: any;

            base.afterEach(async () => {
                await Closer.close(shopDriver);
            });

            base(testName, async () => {
                shopDriver = channelFactories[channelType as keyof typeof channelFactories]();
                await testFn(shopDriver);
            });
        });
    }
}

// @Channel(UI, API) - TypeScript equivalent using helper function
channelTest([ChannelType.UI, ChannelType.API], 'should be able to go to shop', async (shopDriver) => {
    const result = await shopDriver.goToShop();
    expect(result).toBeSuccess();
});
