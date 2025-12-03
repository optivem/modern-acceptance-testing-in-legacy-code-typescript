import { test as base } from '@playwright/test';
import { DriverFactory } from '../drivers/DriverFactory.js';
import { Closer } from '../drivers/commons/clients/Closer.js';
import { ChannelType } from './ChannelType.js';

/**
 * Helper function that mimics @Channel annotation from .NET/Java
 * 
 * Supports both simple smoke tests and E2E tests with multiple fixtures.
 * 
 * Example usage for smoke tests:
 * ```typescript
 * channelTest([ChannelType.UI, ChannelType.API], 'should be able to go to shop', async ({ shopDriver }) => {
 *     const result = await shopDriver.goToShop();
 *     expect(result).toBeSuccess();
 * });
 * ```
 * 
 * Example usage for E2E tests:
 * ```typescript
 * channelTest([ChannelType.UI, ChannelType.API], 'should place order', async ({ shopDriver, erpApiDriver }) => {
 *     await erpApiDriver.createProduct('SKU-123', '20.00');
 *     const result = await shopDriver.placeOrder('SKU-123', '5', 'US');
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
    testFn: (fixtures: any) => Promise<void>
) {
    const channelFactories = {
        [ChannelType.API]: () => DriverFactory.createShopApiDriver(),
        [ChannelType.UI]: () => DriverFactory.createShopUiDriver()
    };

    // Base test with all fixtures (ERP and Tax drivers)
    const testBase = base.extend<any>({
        erpApiDriver: async ({}, use: any) => {
            const driver = DriverFactory.createErpApiDriver();
            await use(driver);
            await Closer.close(driver);
        },
        taxApiDriver: async ({}, use: any) => {
            const driver = DriverFactory.createTaxApiDriver();
            await use(driver);
            await Closer.close(driver);
        },
    });

    for (const channelType of channelTypes) {
        const testWithChannel = testBase.extend<any>({
            shopDriver: async ({}, use: any) => {
                const driver = channelFactories[channelType as keyof typeof channelFactories]();
                await use(driver);
                await Closer.close(driver);
            },
        });

        testWithChannel.describe(`[${channelType} Channel]`, () => {
            testWithChannel(testName, testFn);
        });
    }
}
