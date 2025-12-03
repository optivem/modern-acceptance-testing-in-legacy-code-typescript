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
 * Example usage for simple tests:
 * ```typescript
 * shopChannelTest([ChannelType.UI, ChannelType.API], 'should be able to go to shop', async ({ shopDriver }) => {
 *     const result = await shopDriver.goToShop();
 *     expect(result).toBeSuccess();
 * });
 * ```
 * 
 * Example usage for parameterized tests:
 * ```typescript
 * shopChannelTest(
 *     [ChannelType.UI, ChannelType.API],
 *     [
 *         { quantity: '5.5', expectedMessage: 'Quantity must be an integer' },
 *         { quantity: 'abc', expectedMessage: 'Quantity must be an integer' }
 *     ],
 *     (data) => `should reject order with non-integer quantity: "${data.quantity}"`,
 *     async ({ shopDriver }, data) => {
 *         const result = await shopDriver.placeOrder('some-sku', data.quantity, 'US');
 *         expect(result).toBeFailureWith(data.expectedMessage);
 *     }
 * );
 * ```
 */
export function shopChannelTest<T = never>(
    channelTypes: string[],
    testNameOrData: string | T[],
    testNameFnOrTestFn: string | ((data: T) => string) | ((fixtures: any) => Promise<void>),
    testFn?: (fixtures: any, data: T) => Promise<void>
) {
    const additionalFixtures = {
        erpApiDriver: () => DriverFactory.createErpApiDriver(),
        taxApiDriver: () => DriverFactory.createTaxApiDriver()
    };
    
    // Case 1: Simple test without parameterization
    if (typeof testNameOrData === 'string') {
        const testName = testNameOrData;
        const fn = testNameFnOrTestFn as (fixtures: any) => Promise<void>;
        channelTest(channelTypes, shopDriverFactory, 'shopDriver', additionalFixtures, testName, fn);
    }
    // Case 2: Parameterized test with data array
    else {
        const testDataArray = testNameOrData as T[];
        const testNameFn = testNameFnOrTestFn as (data: T) => string;
        const fn = testFn as (fixtures: any, data: T) => Promise<void>;
        
        testDataArray.forEach((testData) => {
            const testName = testNameFn(testData);
            channelTest(channelTypes, shopDriverFactory, 'shopDriver', additionalFixtures, testName, async ({ shopDriver, erpApiDriver, taxApiDriver }) => {
                return await fn({ shopDriver, erpApiDriver, taxApiDriver }, testData);
            });
        });
    }
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
