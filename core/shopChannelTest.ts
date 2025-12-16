import { DriverFactory } from './DriverFactory.js';
import { ChannelType } from '../core-shop/ChannelType.js';
import { channelTest } from '@optivem/testing-channels';

// Re-export for convenience
export { channelTest };

/**
 * Type definition for shop test fixtures
 */
export interface ShopFixtures {
    shopDriver: any;
    erpApiDriver: any;
    taxApiDriver: any;
}

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
/**
 * Formats test data as a readable string for test names
 * Example: { country: 'US', quantity: '5' } => "[country: US, quantity: 5]"
 */
function formatTestData(data: any): string {
    const entries = Object.entries(data)
        .filter(([key]) => !key.startsWith('expected'))
        .map(([key, value]) => `${key}: ${JSON.stringify(value)}`);
    return `[${entries.join(', ')}]`;
}

// Overload 1: Simple test without parameterization
export function shopChannelTest(
    channelTypes: string[],
    testName: string,
    testFn: (fixtures: ShopFixtures) => Promise<void>
): void;

// Overload 2: Parameterized test with test name function
export function shopChannelTest<T>(
    channelTypes: string[],
    testData: T[],
    testNameFn: (data: T) => string,
    testFn: (fixtures: ShopFixtures, data: T) => Promise<void>
): void;

// Overload 3: Parameterized test with static test name
export function shopChannelTest<T>(
    channelTypes: string[],
    testData: T[],
    testName: string,
    testFn: (fixtures: ShopFixtures, data: T) => Promise<void>
): void;

// Implementation
export function shopChannelTest<T = never>(
    channelTypes: string[],
    testNameOrData: string | T[],
    testNameFnOrTestFn: string | ((data: T) => string) | ((fixtures: ShopFixtures) => Promise<void>),
    testFn?: (fixtures: ShopFixtures, data: T) => Promise<void>
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
        const baseTestName = testNameFnOrTestFn as string | ((data: T) => string);
        const fn = testFn as (fixtures: any, data: T) => Promise<void>;
        
        testDataArray.forEach((testData) => {
            // If baseTestName is a function, use it; otherwise append formatted data
            const testName = typeof baseTestName === 'function' 
                ? baseTestName(testData)
                : `${baseTestName} ${formatTestData(testData)}`;
                
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
    testFn: (fixtures: ShopFixtures, data: T) => Promise<void>
) {
    for (const data of testData) {
        const formattedName = testName.replace('%s', JSON.stringify(data));
        
        shopChannelTest(channelTypes, formattedName, async (fixtures: ShopFixtures) => {
            await testFn(fixtures, data);
        });
    }
}
