import '../../../setup-config.js';
import { GherkinDefaults } from '@optivem/dsl-core/gherkin/GherkinDefaults.js';
import { emptyArgumentsProvider } from '../../shared/argumentProviders.js';
import { test, expect, createUniqueSku } from './base/fixtures.js';

const validationError = 'The request contains one or more validation errors';

function assertValidationError(result: any, field: string, message: string): void {
    expect(result.isFailure()).toBe(true);
    const error = result.getError();
    expect(error.detail).toBe(validationError);
    expect(error.errors?.some((item: any) => item.field === field && item.message === message)).toBe(true);
}

test('should reject order with invalid quantity', async ({ shopApiClient }) => {
    const result = await shopApiClient.placeOrder({
        sku: createUniqueSku(GherkinDefaults.DEFAULT_SKU),
        quantity: 'invalid-quantity',
        country: GherkinDefaults.DEFAULT_COUNTRY,
    });

    assertValidationError(result, 'quantity', 'Quantity must be an integer');
});

test('should reject order with non-existent SKU', async ({ shopApiClient }) => {
    const result = await shopApiClient.placeOrder({
        sku: 'NON-EXISTENT-SKU-12345',
        quantity: GherkinDefaults.DEFAULT_QUANTITY,
        country: GherkinDefaults.DEFAULT_COUNTRY,
    });

    assertValidationError(result, 'sku', 'Product does not exist for SKU: NON-EXISTENT-SKU-12345');
});

test('should reject order with negative quantity', async ({ shopApiClient }) => {
    const result = await shopApiClient.placeOrder({
        sku: createUniqueSku(GherkinDefaults.DEFAULT_SKU),
        quantity: '-10',
        country: GherkinDefaults.DEFAULT_COUNTRY,
    });

    assertValidationError(result, 'quantity', 'Quantity must be positive');
});

test('should reject order with zero quantity', async ({ shopApiClient }) => {
    const result = await shopApiClient.placeOrder({
        sku: createUniqueSku(GherkinDefaults.DEFAULT_SKU),
        quantity: '0',
        country: GherkinDefaults.DEFAULT_COUNTRY,
    });

    assertValidationError(result, 'quantity', 'Quantity must be positive');
});

test('should reject order with empty SKU', async ({ shopApiClient }) => {
    for (const sku of emptyArgumentsProvider) {
        const result = await shopApiClient.placeOrder({
            sku,
            quantity: GherkinDefaults.DEFAULT_QUANTITY,
            country: GherkinDefaults.DEFAULT_COUNTRY,
        });

        assertValidationError(result, 'sku', 'SKU must not be empty');
    }
});

test('should reject order with empty quantity', async ({ shopApiClient }) => {
    for (const emptyQuantity of emptyArgumentsProvider) {
        const result = await shopApiClient.placeOrder({
            sku: createUniqueSku(GherkinDefaults.DEFAULT_SKU),
            quantity: emptyQuantity,
            country: GherkinDefaults.DEFAULT_COUNTRY,
        });

        assertValidationError(result, 'quantity', 'Quantity must not be empty');
    }
});

test('should reject order with non-integer quantity', async ({ shopApiClient }) => {
    for (const nonIntegerQuantity of ['3.5', 'lala']) {
        const result = await shopApiClient.placeOrder({
            sku: createUniqueSku(GherkinDefaults.DEFAULT_SKU),
            quantity: nonIntegerQuantity,
            country: GherkinDefaults.DEFAULT_COUNTRY,
        });

        assertValidationError(result, 'quantity', 'Quantity must be an integer');
    }
});

test('should reject order with empty country', async ({ shopApiClient }) => {
    for (const emptyCountry of emptyArgumentsProvider) {
        const result = await shopApiClient.placeOrder({
            sku: createUniqueSku(GherkinDefaults.DEFAULT_SKU),
            quantity: GherkinDefaults.DEFAULT_QUANTITY,
            country: emptyCountry,
        });

        assertValidationError(result, 'country', 'Country must not be empty');
    }
});

test('should reject order with invalid country', async ({ shopApiClient, erpClient }) => {
    const sku = createUniqueSku(GherkinDefaults.DEFAULT_SKU);
    expect(await erpClient.createProduct({ id: sku, price: '20.00' })).toBeSuccess();

    const result = await shopApiClient.placeOrder({
        sku,
        quantity: GherkinDefaults.DEFAULT_QUANTITY,
        country: 'XX',
    });

    assertValidationError(result, 'country', 'Country does not exist: XX');
});

test('should reject order with null quantity', async ({ shopApiClient }) => {
    const result = await shopApiClient.placeOrder({
        sku: createUniqueSku(GherkinDefaults.DEFAULT_SKU),
        quantity: null,
        country: GherkinDefaults.DEFAULT_COUNTRY,
    });

    assertValidationError(result, 'quantity', 'Quantity must not be empty');
});

test('should reject order with null SKU', async ({ shopApiClient }) => {
    const result = await shopApiClient.placeOrder({
        sku: null,
        quantity: GherkinDefaults.DEFAULT_QUANTITY,
        country: GherkinDefaults.DEFAULT_COUNTRY,
    });

    assertValidationError(result, 'sku', 'SKU must not be empty');
});

test('should reject order with null country', async ({ shopApiClient }) => {
    const result = await shopApiClient.placeOrder({
        sku: createUniqueSku(GherkinDefaults.DEFAULT_SKU),
        quantity: GherkinDefaults.DEFAULT_QUANTITY,
        country: null,
    });

    assertValidationError(result, 'country', 'Country must not be empty');
});
