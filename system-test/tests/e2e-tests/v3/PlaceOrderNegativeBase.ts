import { GherkinDefaults } from '@optivem/dsl/gherkin/GherkinDefaults.js';
import type { ShopDriver } from '@optivem/core/shop/driver/ShopDriver.js';
import { emptyArgumentsProvider } from '../../shared/argumentProviders.js';
import { expect, createUniqueSku } from './base/fixtures.js';

type ErpDriver = {
    returnsProduct: (request: { sku: string; price: string }) => Promise<unknown>;
};

const validationError = 'The request contains one or more validation errors';

export async function shouldRejectOrderWithInvalidQuantity(shopDriver: ShopDriver): Promise<void> {
    const result = await shopDriver.orders().placeOrder({
        sku: createUniqueSku(GherkinDefaults.DEFAULT_SKU),
        quantity: 'invalid-quantity',
        country: GherkinDefaults.DEFAULT_COUNTRY,
    });
    expect(result).toHaveErrorMessage(validationError);
    expect(result).toHaveFieldError('Quantity must be an integer');
}

export async function shouldRejectOrderWithNonExistentSku(shopDriver: ShopDriver): Promise<void> {
    const result = await shopDriver.orders().placeOrder({
        sku: 'NON-EXISTENT-SKU-12345',
        quantity: GherkinDefaults.DEFAULT_QUANTITY,
        country: GherkinDefaults.DEFAULT_COUNTRY,
    });
    expect(result).toHaveErrorMessage(validationError);
    expect(result).toHaveFieldError('Product does not exist for SKU: NON-EXISTENT-SKU-12345');
}

export async function shouldRejectOrderWithNegativeQuantity(shopDriver: ShopDriver): Promise<void> {
    const result = await shopDriver.orders().placeOrder({
        sku: createUniqueSku(GherkinDefaults.DEFAULT_SKU),
        quantity: '-10',
        country: GherkinDefaults.DEFAULT_COUNTRY,
    });
    expect(result).toHaveErrorMessage(validationError);
    expect(result).toHaveFieldError('Quantity must be positive');
}

export async function shouldRejectOrderWithZeroQuantity(shopDriver: ShopDriver): Promise<void> {
    const result = await shopDriver.orders().placeOrder({
        sku: 'ANOTHER-SKU-67890',
        quantity: '0',
        country: GherkinDefaults.DEFAULT_COUNTRY,
    });
    expect(result).toHaveErrorMessage(validationError);
    expect(result).toHaveFieldError('Quantity must be positive');
}

export async function shouldRejectOrderWithEmptySku(shopDriver: ShopDriver): Promise<void> {
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

export async function shouldRejectOrderWithEmptyQuantity(shopDriver: ShopDriver): Promise<void> {
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

export async function shouldRejectOrderWithNonIntegerQuantity(shopDriver: ShopDriver): Promise<void> {
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

export async function shouldRejectOrderWithEmptyCountry(shopDriver: ShopDriver): Promise<void> {
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

export async function shouldRejectOrderWithInvalidCountry(shopDriver: ShopDriver, erpDriver: ErpDriver): Promise<void> {
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