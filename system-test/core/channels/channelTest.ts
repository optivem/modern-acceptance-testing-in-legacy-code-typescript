import { test as base } from '@playwright/test';
import { DriverFactory } from '../drivers/DriverFactory.js';
import { Closer } from '../drivers/commons/clients/Closer.js';
import { ChannelType } from './ChannelType.js';

/**
 * Helper function that mimics @Channel annotation from .NET/Java
 * 
 * Example usage:
 * ```typescript
 * channelTest([ChannelType.UI, ChannelType.API], 'should be able to go to shop', async (shopDriver) => {
 *     const result = await shopDriver.goToShop();
 *     expect(result).toBeSuccess();
 * });
 * ```
 * 
 * This is equivalent to .NET's:
 * ```csharp
 * [Theory]
 * [ChannelData(ChannelType.UI, ChannelType.API)]
 * public void ShouldBeAbleToGoToShop(Channel channel)
 * ```
 */
export function channelTest(
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
