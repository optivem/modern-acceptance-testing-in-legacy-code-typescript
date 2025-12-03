import { DriverFactory } from '../drivers/DriverFactory.js';
import { ChannelType } from './ChannelType.js';
import { channelTest } from './library/channelTest.js';

/**
 * Factory function that creates the appropriate shop driver based on channel type
 */
function shopDriverFactory(channelType: string): any {
    const factories = {
        [ChannelType.API]: () => DriverFactory.createShopApiDriver(),
        [ChannelType.UI]: () => DriverFactory.createShopUiDriver()
    };
    return factories[channelType as keyof typeof factories]();
}

/**
 * Shop-specific wrapper for channelTest that provides shopDriver fixture
 * 
 * Example usage for smoke tests:
 * ```typescript
 * shopChannelTest([ChannelType.UI, ChannelType.API], 'should be able to go to shop', async ({ shopDriver }) => {
 *     const result = await shopDriver.goToShop();
 *     expect(result).toBeSuccess();
 * });
 * ```
 * 
 * Example usage for E2E tests:
 * ```typescript
 * shopChannelTest([ChannelType.UI, ChannelType.API], 'should place order', async ({ shopDriver, erpApiDriver }) => {
 *     await erpApiDriver.createProduct('SKU-123', '20.00');
 *     const result = await shopDriver.placeOrder('SKU-123', '5', 'US');
 *     expect(result).toBeSuccess();
 * });
 * ```
 */
export function shopChannelTest(
    channelTypes: string[],
    testName: string,
    testFn: (fixtures: any) => Promise<void>
) {
    const additionalFixtures = {
        erpApiDriver: () => DriverFactory.createErpApiDriver(),
        taxApiDriver: () => DriverFactory.createTaxApiDriver()
    };
    
    channelTest(channelTypes, shopDriverFactory, 'shopDriver', additionalFixtures, testName, testFn);
}

/**
 * Parameterized version of shopChannelTest - runs the same test with different input values
 * 
 * Example usage:
 * ```typescript
 * shopChannelTestEach(
 *     [ChannelType.UI, ChannelType.API],
 *     'should reject order with empty SKU: %s',
 *     ['', '   '],
 *     async ({ shopDriver }, emptySku) => {
 *         const result = await shopDriver.placeOrder(emptySku, '5', 'US');
 *         expect(result).toBeFailureWith('SKU must not be empty');
 *     }
 * );
 * ```
 * 
 * This is equivalent to .NET's:
 * ```csharp
 * [Theory]
 * [ChannelData(ChannelType.UI, ChannelType.API)]
 * [InlineData("")]
 * [InlineData("   ")]
 * public void ShouldRejectOrderWithEmptySKU(Channel channel, string emptySku)
 * ```
 */
export function shopChannelTestEach<T>(
    channelTypes: string[],
    testName: string,
    testData: T[],
    testFn: (fixtures: any, data: T) => Promise<void>
) {
    for (const data of testData) {
        const formattedName = testName.replace('%s', JSON.stringify(data));
        
        shopChannelTest(channelTypes, formattedName, async (fixtures: any) => {
            await testFn(fixtures, data);
        });
    }
}
