import '../../../setup-config.js';
import { GherkinDefaults } from '@optivem/dsl-core/scenario/GherkinDefaults.js';
import { emptyArgumentsProvider } from '../../shared/argumentProviders.js';
import { test, expect, createUniqueSku } from './base/fixtures.js';
import { testConfig } from '../../../test.config.js';

const validationError = 'The request contains one or more validation errors';
const shopApiBaseUrl = testConfig.urls.shopApi;
const erpApiBaseUrl = testConfig.urls.erpApi;

function assertValidationError(status: number, body: any, field: string, message: string): void {
    expect(status).toBe(422);
    expect(body.detail).toBe(validationError);

    const found = Array.isArray(body.errors) && body.errors.some(
        (error: any) => error.field === field && error.message === message
    );

    expect(found).toBe(true);
}

test('should reject order with invalid quantity', async () => {
    const placeOrderJson = `{"sku":"${createUniqueSku(GherkinDefaults.DEFAULT_SKU)}","quantity":"invalid-quantity","country":"${GherkinDefaults.DEFAULT_COUNTRY}"}`;

    const response = await fetch(`${shopApiBaseUrl}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: placeOrderJson,
    });

    const body = await response.json();

    assertValidationError(response.status, body, 'quantity', 'Quantity must be an integer');
});

test('should reject order with non-existent SKU', async () => {
    const placeOrderJson = `{"sku":"NON-EXISTENT-SKU-12345","quantity":"${GherkinDefaults.DEFAULT_QUANTITY}","country":"${GherkinDefaults.DEFAULT_COUNTRY}"}`;

    const response = await fetch(`${shopApiBaseUrl}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: placeOrderJson,
    });

    const body = await response.json();

    assertValidationError(response.status, body, 'sku', 'Product does not exist for SKU: NON-EXISTENT-SKU-12345');
});

test('should reject order with negative quantity', async () => {
    const placeOrderJson = `{"sku":"${createUniqueSku(GherkinDefaults.DEFAULT_SKU)}","quantity":"-10","country":"${GherkinDefaults.DEFAULT_COUNTRY}"}`;

    const response = await fetch(`${shopApiBaseUrl}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: placeOrderJson,
    });

    const body = await response.json();

    assertValidationError(response.status, body, 'quantity', 'Quantity must be positive');
});

test('should reject order with zero quantity', async () => {
    const placeOrderJson = `{"sku":"${createUniqueSku(GherkinDefaults.DEFAULT_SKU)}","quantity":"0","country":"${GherkinDefaults.DEFAULT_COUNTRY}"}`;

    const response = await fetch(`${shopApiBaseUrl}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: placeOrderJson,
    });

    const body = await response.json();

    assertValidationError(response.status, body, 'quantity', 'Quantity must be positive');
});

test('should reject order with empty SKU', async () => {
    for (const sku of emptyArgumentsProvider) {
        const placeOrderJson = `{"sku":${sku == null ? 'null' : `"${sku}"`},"quantity":"${GherkinDefaults.DEFAULT_QUANTITY}","country":"${GherkinDefaults.DEFAULT_COUNTRY}"}`;

        const response = await fetch(`${shopApiBaseUrl}/api/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: placeOrderJson,
        });

        const body = await response.json();

        assertValidationError(response.status, body, 'sku', 'SKU must not be empty');
    }
});

test('should reject order with empty quantity', async () => {
    for (const emptyQuantity of emptyArgumentsProvider) {
        const placeOrderJson = `{"sku":"${createUniqueSku(GherkinDefaults.DEFAULT_SKU)}","quantity":${emptyQuantity == null ? 'null' : `"${emptyQuantity}"`},"country":"${GherkinDefaults.DEFAULT_COUNTRY}"}`;

        const response = await fetch(`${shopApiBaseUrl}/api/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: placeOrderJson,
        });

        const body = await response.json();

        assertValidationError(response.status, body, 'quantity', 'Quantity must not be empty');
    }
});

test('should reject order with non-integer quantity', async () => {
    for (const nonIntegerQuantity of ['3.5', 'lala']) {
        const placeOrderJson = `{"sku":"${createUniqueSku(GherkinDefaults.DEFAULT_SKU)}","quantity":"${nonIntegerQuantity}","country":"${GherkinDefaults.DEFAULT_COUNTRY}"}`;

        const response = await fetch(`${shopApiBaseUrl}/api/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: placeOrderJson,
        });

        const body = await response.json();

        assertValidationError(response.status, body, 'quantity', 'Quantity must be an integer');
    }
});

test('should reject order with empty country', async () => {
    for (const emptyCountry of emptyArgumentsProvider) {
        const placeOrderJson = `{"sku":"${createUniqueSku(GherkinDefaults.DEFAULT_SKU)}","quantity":"${GherkinDefaults.DEFAULT_QUANTITY}","country":${emptyCountry == null ? 'null' : `"${emptyCountry}"`}}`;

        const response = await fetch(`${shopApiBaseUrl}/api/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: placeOrderJson,
        });

        const body = await response.json();

        assertValidationError(response.status, body, 'country', 'Country must not be empty');
    }
});

test('should reject order with invalid country', async () => {
    const sku = createUniqueSku(GherkinDefaults.DEFAULT_SKU);

    const createProductJson = `{"id":"${sku}","title":"Test Product","description":"Test Description","category":"Test Category","brand":"Test Brand","price":"20.00"}`;
    const createProductResponse = await fetch(`${erpApiBaseUrl}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: createProductJson,
    });
    expect(createProductResponse.status).toBe(201);

    const placeOrderJson = `{"sku":"${sku}","quantity":"${GherkinDefaults.DEFAULT_QUANTITY}","country":"XX"}`;
    const response = await fetch(`${shopApiBaseUrl}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: placeOrderJson,
    });

    const body = await response.json();

    assertValidationError(response.status, body, 'country', 'Country does not exist: XX');
});

test('should reject order with null quantity', async () => {
    const placeOrderJson = `{"sku":"${createUniqueSku(GherkinDefaults.DEFAULT_SKU)}","quantity":null,"country":"${GherkinDefaults.DEFAULT_COUNTRY}"}`;

    const response = await fetch(`${shopApiBaseUrl}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: placeOrderJson,
    });

    const body = await response.json();

    assertValidationError(response.status, body, 'quantity', 'Quantity must not be empty');
});

test('should reject order with null SKU', async () => {
    const placeOrderJson = `{"sku":null,"quantity":"${GherkinDefaults.DEFAULT_QUANTITY}","country":"${GherkinDefaults.DEFAULT_COUNTRY}"}`;

    const response = await fetch(`${shopApiBaseUrl}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: placeOrderJson,
    });

    const body = await response.json();

    assertValidationError(response.status, body, 'sku', 'SKU must not be empty');
});

test('should reject order with null country', async () => {
    const placeOrderJson = `{"sku":"${createUniqueSku(GherkinDefaults.DEFAULT_SKU)}","quantity":"${GherkinDefaults.DEFAULT_QUANTITY}","country":null}`;

    const response = await fetch(`${shopApiBaseUrl}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: placeOrderJson,
    });

    const body = await response.json();

    assertValidationError(response.status, body, 'country', 'Country must not be empty');
});