/**
 * V4 e2e: place order negative (driver-level style).
 */
import '../../../setup-config.js';
import { ChannelType } from '@optivem/core/shop/ChannelType.js';
import { GherkinDefaults } from '@optivem/dsl/gherkin/GherkinDefaults.js';
import { emptyArgumentsProvider } from '../../shared/argumentProviders.js';
import { channelShopDriverTest, createUniqueSku, expect } from './base/fixtures.js';

const validationError = 'The request contains one or more validation errors';

channelShopDriverTest([ChannelType.UI, ChannelType.API], 'should reject order with invalid quantity', async ({ shopDriver }) => {
    const result = await shopDriver.orders().placeOrder({
        sku: createUniqueSku(GherkinDefaults.DEFAULT_SKU),
        quantity: 'invalid-quantity',
        country: GherkinDefaults.DEFAULT_COUNTRY,
    });

    expect(result).toHaveErrorMessage(validationError);
    expect(result).toHaveFieldError('Quantity must be an integer');
});

channelShopDriverTest([ChannelType.UI, ChannelType.API], 'should reject order with non-existent SKU', async ({ shopDriver }) => {
    const result = await shopDriver.orders().placeOrder({
        sku: 'NON-EXISTENT-SKU-12345',
        quantity: GherkinDefaults.DEFAULT_QUANTITY,
        country: GherkinDefaults.DEFAULT_COUNTRY,
    });

    expect(result).toHaveErrorMessage(validationError);
    expect(result).toHaveFieldError('Product does not exist for SKU: NON-EXISTENT-SKU-12345');
});

channelShopDriverTest([ChannelType.UI, ChannelType.API], 'should reject order with negative quantity', async ({ shopDriver }) => {
    const result = await shopDriver.orders().placeOrder({
        sku: createUniqueSku(GherkinDefaults.DEFAULT_SKU),
        quantity: '-10',
        country: GherkinDefaults.DEFAULT_COUNTRY,
    });

    expect(result).toHaveErrorMessage(validationError);
    expect(result).toHaveFieldError('Quantity must be positive');
});

channelShopDriverTest([ChannelType.UI, ChannelType.API], 'should reject order with zero quantity', async ({ shopDriver }) => {
    const result = await shopDriver.orders().placeOrder({
        sku: 'ANOTHER-SKU-67890',
        quantity: '0',
        country: GherkinDefaults.DEFAULT_COUNTRY,
    });

    expect(result).toHaveErrorMessage(validationError);
    expect(result).toHaveFieldError('Quantity must be positive');
});

channelShopDriverTest([ChannelType.UI, ChannelType.API], 'should reject order with empty SKU', async ({ shopDriver }) => {
    for (const sku of emptyArgumentsProvider) {
        const result = await shopDriver.orders().placeOrder({
            sku,
            quantity: GherkinDefaults.DEFAULT_QUANTITY,
            country: GherkinDefaults.DEFAULT_COUNTRY,
        });

        expect(result).toHaveErrorMessage(validationError);
        expect(result).toHaveFieldError('SKU must not be empty');
    }
});

channelShopDriverTest([ChannelType.UI, ChannelType.API], 'should reject order with empty quantity', async ({ shopDriver }) => {
    for (const emptyQuantity of emptyArgumentsProvider) {
        const result = await shopDriver.orders().placeOrder({
            sku: createUniqueSku(GherkinDefaults.DEFAULT_SKU),
            quantity: emptyQuantity,
            country: GherkinDefaults.DEFAULT_COUNTRY,
        });

        expect(result).toHaveErrorMessage(validationError);
        expect(result).toHaveFieldError('Quantity must not be empty');
    }
});

channelShopDriverTest([ChannelType.UI, ChannelType.API], 'should reject order with non-integer quantity', async ({ shopDriver }) => {
    for (const nonIntegerQuantity of ['3.5', 'lala']) {
        const result = await shopDriver.orders().placeOrder({
            sku: createUniqueSku(GherkinDefaults.DEFAULT_SKU),
            quantity: nonIntegerQuantity,
            country: GherkinDefaults.DEFAULT_COUNTRY,
        });

        expect(result).toHaveErrorMessage(validationError);
        expect(result).toHaveFieldError('Quantity must be an integer');
    }
});

channelShopDriverTest([ChannelType.UI, ChannelType.API], 'should reject order with empty country', async ({ shopDriver }) => {
    for (const emptyCountry of emptyArgumentsProvider) {
        const result = await shopDriver.orders().placeOrder({
            sku: createUniqueSku(GherkinDefaults.DEFAULT_SKU),
            quantity: GherkinDefaults.DEFAULT_QUANTITY,
            country: emptyCountry,
        });

        expect(result).toHaveErrorMessage(validationError);
        expect(result).toHaveFieldError('Country must not be empty');
    }
});

channelShopDriverTest([ChannelType.UI, ChannelType.API], 'should reject order with invalid country', async ({ shopDriver, erpDriver }) => {
    const sku = createUniqueSku(GherkinDefaults.DEFAULT_SKU);
    expect(await erpDriver.returnsProduct({ sku, price: '20.00' })).toBeSuccess();

    const result = await shopDriver.orders().placeOrder({
        sku,
        quantity: GherkinDefaults.DEFAULT_QUANTITY,
        country: 'XX',
    });

    expect(result).toHaveErrorMessage(validationError);
    expect(result).toHaveFieldError('Country does not exist: XX');
});

channelShopDriverTest([ChannelType.API], 'should reject order with null quantity', async ({ shopDriver }) => {
    const result = await shopDriver.orders().placeOrder({
        sku: createUniqueSku(GherkinDefaults.DEFAULT_SKU),
        quantity: null,
        country: GherkinDefaults.DEFAULT_COUNTRY,
    });

    expect(result).toHaveErrorMessage(validationError);
    expect(result).toHaveFieldError('Quantity must not be empty');
});

channelShopDriverTest([ChannelType.API], 'should reject order with null SKU', async ({ shopDriver }) => {
    const result = await shopDriver.orders().placeOrder({
        sku: null,
        quantity: GherkinDefaults.DEFAULT_QUANTITY,
        country: GherkinDefaults.DEFAULT_COUNTRY,
    });

    expect(result).toHaveErrorMessage(validationError);
    expect(result).toHaveFieldError('SKU must not be empty');
});

channelShopDriverTest([ChannelType.API], 'should reject order with null country', async ({ shopDriver }) => {
    const result = await shopDriver.orders().placeOrder({
        sku: createUniqueSku(GherkinDefaults.DEFAULT_SKU),
        quantity: GherkinDefaults.DEFAULT_QUANTITY,
        country: null,
    });

    expect(result).toHaveErrorMessage(validationError);
    expect(result).toHaveFieldError('Country must not be empty');
});
