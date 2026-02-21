import { GherkinDefaults } from '@optivem/dsl/gherkin/GherkinDefaults.js';
import { emptyArgumentsProvider } from '../../shared/argumentProviders.js';
import { expect, createUniqueSku } from './base/fixtures.js';

const validationError = 'The request contains one or more validation errors';

export async function shouldRejectOrderWithInvalidQuantity(shopDriver: any): Promise<void> {
    const result = await shopDriver.orders().placeOrder({
        sku: createUniqueSku(GherkinDefaults.DEFAULT_SKU),
        quantity: 'invalid-quantity',
        country: GherkinDefaults.DEFAULT_COUNTRY,
    });
    expect(result).toHaveErrorMessage(validationError);
    expect(result).toHaveFieldError('Quantity must be an integer');
}

export async function shouldRejectOrderWithNonExistentSku(shopDriver: any): Promise<void> {
    const result = await shopDriver.orders().placeOrder({
        sku: 'NON-EXISTENT-SKU-12345',
        quantity: GherkinDefaults.DEFAULT_QUANTITY,
        country: GherkinDefaults.DEFAULT_COUNTRY,
    });
    expect(result).toHaveErrorMessage(validationError);
    expect(result).toHaveFieldError('Product does not exist for SKU: NON-EXISTENT-SKU-12345');
}

export async function shouldRejectOrderWithNegativeQuantity(shopDriver: any): Promise<void> {
    const result = await shopDriver.orders().placeOrder({
        sku: createUniqueSku(GherkinDefaults.DEFAULT_SKU),
        quantity: '-10',
        country: GherkinDefaults.DEFAULT_COUNTRY,
    });
    expect(result).toHaveErrorMessage(validationError);
    expect(result).toHaveFieldError('Quantity must be positive');
}

export async function shouldRejectOrderWithZeroQuantity(shopDriver: any): Promise<void> {
    const result = await shopDriver.orders().placeOrder({
        sku: 'ANOTHER-SKU-67890',
        quantity: '0',
        country: GherkinDefaults.DEFAULT_COUNTRY,
    });
    expect(result).toHaveErrorMessage(validationError);
    expect(result).toHaveFieldError('Quantity must be positive');
}

export async function shouldRejectOrderWithEmptySku(shopDriver: any): Promise<void> {
    for (const sku of emptyArgumentsProvider) {
        const result = await shopDriver.orders().placeOrder({
            sku,
            quantity: GherkinDefaults.DEFAULT_QUANTITY,
            country: GherkinDefaults.DEFAULT_COUNTRY,
        });
        expect(result).toHaveErrorMessage(validationError);
        expect(result).toHaveFieldError('SKU must not be empty');
    }
}

export async function shouldRejectOrderWithEmptyQuantity(shopDriver: any): Promise<void> {
    for (const emptyQuantity of emptyArgumentsProvider) {
        const result = await shopDriver.orders().placeOrder({
            sku: createUniqueSku(GherkinDefaults.DEFAULT_SKU),
            quantity: emptyQuantity,
            country: GherkinDefaults.DEFAULT_COUNTRY,
        });
        expect(result).toHaveErrorMessage(validationError);
        expect(result).toHaveFieldError('Quantity must not be empty');
    }
}

export async function shouldRejectOrderWithNonIntegerQuantity(shopDriver: any): Promise<void> {
    for (const nonIntegerQuantity of ['3.5', 'lala']) {
        const result = await shopDriver.orders().placeOrder({
            sku: createUniqueSku(GherkinDefaults.DEFAULT_SKU),
            quantity: nonIntegerQuantity,
            country: GherkinDefaults.DEFAULT_COUNTRY,
        });
        expect(result).toHaveErrorMessage(validationError);
        expect(result).toHaveFieldError('Quantity must be an integer');
    }
}

export async function shouldRejectOrderWithEmptyCountry(shopDriver: any): Promise<void> {
    for (const emptyCountry of emptyArgumentsProvider) {
        const result = await shopDriver.orders().placeOrder({
            sku: createUniqueSku(GherkinDefaults.DEFAULT_SKU),
            quantity: GherkinDefaults.DEFAULT_QUANTITY,
            country: emptyCountry,
        });
        expect(result).toHaveErrorMessage(validationError);
        expect(result).toHaveFieldError('Country must not be empty');
    }
}

export async function shouldRejectOrderWithInvalidCountry(shopDriver: any, erpDriver: any): Promise<void> {
    const sku = createUniqueSku(GherkinDefaults.DEFAULT_SKU);
    expect(await erpDriver.returnsProduct({ sku, price: '20.00' })).toBeSuccess();
    const result = await shopDriver.orders().placeOrder({
        sku,
        quantity: GherkinDefaults.DEFAULT_QUANTITY,
        country: 'XX',
    });
    expect(result).toHaveErrorMessage(validationError);
    expect(result).toHaveFieldError('Country does not exist: XX');
}

export async function shouldRejectOrderWithNullQuantity(shopDriver: any): Promise<void> {
    const result = await shopDriver.orders().placeOrder({
        sku: createUniqueSku(GherkinDefaults.DEFAULT_SKU),
        quantity: null,
        country: GherkinDefaults.DEFAULT_COUNTRY,
    });
    expect(result).toHaveErrorMessage(validationError);
    expect(result).toHaveFieldError('Quantity must not be empty');
}

export async function shouldRejectOrderWithNullSku(shopDriver: any): Promise<void> {
    const result = await shopDriver.orders().placeOrder({
        sku: null,
        quantity: GherkinDefaults.DEFAULT_QUANTITY,
        country: GherkinDefaults.DEFAULT_COUNTRY,
    });
    expect(result).toHaveErrorMessage(validationError);
    expect(result).toHaveFieldError('SKU must not be empty');
}

export async function shouldRejectOrderWithNullCountry(shopDriver: any): Promise<void> {
    const result = await shopDriver.orders().placeOrder({
        sku: createUniqueSku(GherkinDefaults.DEFAULT_SKU),
        quantity: GherkinDefaults.DEFAULT_QUANTITY,
        country: null,
    });
    expect(result).toHaveErrorMessage(validationError);
    expect(result).toHaveFieldError('Country must not be empty');
}