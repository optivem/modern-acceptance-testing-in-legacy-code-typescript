import '../../../setup-config.js';
import { GherkinDefaults } from '@optivem/dsl/gherkin/GherkinDefaults.js';
import { emptyArgumentsProvider } from '../../shared/argumentProviders.js';
import { test, expect, createUniqueSku } from './base/fixtures.js';
import { placeOrderUsingUiClient } from './base/shopUiClientOrderFlows.js';

const validationError = 'The request contains one or more validation errors';

test('should reject order with invalid quantity', async ({ shopUiClient }) => {
    const result = await placeOrderUsingUiClient(shopUiClient, {
        sku: createUniqueSku(GherkinDefaults.DEFAULT_SKU),
        quantity: 'invalid-quantity',
        country: GherkinDefaults.DEFAULT_COUNTRY,
    });

    expect(result).toHaveErrorMessage(validationError);
    expect(result).toHaveFieldError('Quantity must be an integer');
});

test('should reject order with non-existent SKU', async ({ shopUiClient }) => {
    const result = await placeOrderUsingUiClient(shopUiClient, {
        sku: 'NON-EXISTENT-SKU-12345',
        quantity: GherkinDefaults.DEFAULT_QUANTITY,
        country: GherkinDefaults.DEFAULT_COUNTRY,
    });

    expect(result).toHaveErrorMessage(validationError);
    expect(result).toHaveFieldError('Product does not exist for SKU: NON-EXISTENT-SKU-12345');
});

test('should reject order with negative quantity', async ({ shopUiClient }) => {
    const result = await placeOrderUsingUiClient(shopUiClient, {
        sku: createUniqueSku(GherkinDefaults.DEFAULT_SKU),
        quantity: '-10',
        country: GherkinDefaults.DEFAULT_COUNTRY,
    });

    expect(result).toHaveErrorMessage(validationError);
    expect(result).toHaveFieldError('Quantity must be positive');
});

test('should reject order with zero quantity', async ({ shopUiClient }) => {
    const result = await placeOrderUsingUiClient(shopUiClient, {
        sku: 'ANOTHER-SKU-67890',
        quantity: '0',
        country: GherkinDefaults.DEFAULT_COUNTRY,
    });

    expect(result).toHaveErrorMessage(validationError);
    expect(result).toHaveFieldError('Quantity must be positive');
});

test('should reject order with empty SKU', async ({ shopUiClient }) => {
    for (const sku of emptyArgumentsProvider) {
        const result = await placeOrderUsingUiClient(shopUiClient, {
            sku,
            quantity: GherkinDefaults.DEFAULT_QUANTITY,
            country: GherkinDefaults.DEFAULT_COUNTRY,
        });

        expect(result).toHaveErrorMessage(validationError);
        expect(result).toHaveFieldError('SKU must not be empty');
    }
});

test('should reject order with empty quantity', async ({ shopUiClient }) => {
    for (const emptyQuantity of emptyArgumentsProvider) {
        const result = await placeOrderUsingUiClient(shopUiClient, {
            sku: createUniqueSku(GherkinDefaults.DEFAULT_SKU),
            quantity: emptyQuantity,
            country: GherkinDefaults.DEFAULT_COUNTRY,
        });

        expect(result).toHaveErrorMessage(validationError);
        expect(result).toHaveFieldError('Quantity must not be empty');
    }
});

test('should reject order with non-integer quantity', async ({ shopUiClient }) => {
    for (const nonIntegerQuantity of ['3.5', 'lala']) {
        const result = await placeOrderUsingUiClient(shopUiClient, {
            sku: createUniqueSku(GherkinDefaults.DEFAULT_SKU),
            quantity: nonIntegerQuantity,
            country: GherkinDefaults.DEFAULT_COUNTRY,
        });

        expect(result).toHaveErrorMessage(validationError);
        expect(result).toHaveFieldError('Quantity must be an integer');
    }
});

test('should reject order with empty country', async ({ shopUiClient }) => {
    for (const emptyCountry of emptyArgumentsProvider) {
        const result = await placeOrderUsingUiClient(shopUiClient, {
            sku: createUniqueSku(GherkinDefaults.DEFAULT_SKU),
            quantity: GherkinDefaults.DEFAULT_QUANTITY,
            country: emptyCountry,
        });

        expect(result).toHaveErrorMessage(validationError);
        expect(result).toHaveFieldError('Country must not be empty');
    }
});

test('should reject order with invalid country', async ({ shopUiClient, erpDriver }) => {
    const sku = createUniqueSku(GherkinDefaults.DEFAULT_SKU);
    expect(await erpDriver.returnsProduct({ sku, price: '20.00' })).toBeSuccess();

    const result = await placeOrderUsingUiClient(shopUiClient, {
        sku,
        quantity: GherkinDefaults.DEFAULT_QUANTITY,
        country: 'XX',
    });

    expect(result).toHaveErrorMessage(validationError);
    expect(result).toHaveFieldError('Country does not exist: XX');
});