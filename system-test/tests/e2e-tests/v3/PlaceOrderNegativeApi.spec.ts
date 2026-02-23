import '../../../setup-config.js';
import { GherkinDefaults } from '@optivem/dsl/gherkin/GherkinDefaults.js';
import type { ShopDriver } from '@optivem/core/shop/driver/ShopDriver.js';
import { test, expect, createUniqueSku } from './base/fixtures.js';
import {
	shouldRejectOrderWithEmptyCountry,
	shouldRejectOrderWithEmptyQuantity,
	shouldRejectOrderWithEmptySku,
	shouldRejectOrderWithInvalidCountry,
	shouldRejectOrderWithInvalidQuantity,
	shouldRejectOrderWithNegativeQuantity,
	shouldRejectOrderWithNonExistentSku,
	shouldRejectOrderWithNonIntegerQuantity,
	shouldRejectOrderWithZeroQuantity,
} from './PlaceOrderNegativeBase.js';

const validationError = 'The request contains one or more validation errors';

async function shouldRejectOrderWithNullQuantity(shopDriver: ShopDriver): Promise<void> {
	const result = await shopDriver.orders().placeOrder({
		sku: createUniqueSku(GherkinDefaults.DEFAULT_SKU),
		quantity: null,
		country: GherkinDefaults.DEFAULT_COUNTRY,
	});
	expect(result).toHaveErrorMessage(validationError);
	expect(result).toHaveFieldError('Quantity must not be empty');
}

async function shouldRejectOrderWithNullSku(shopDriver: ShopDriver): Promise<void> {
	const result = await shopDriver.orders().placeOrder({
		sku: null,
		quantity: GherkinDefaults.DEFAULT_QUANTITY,
		country: GherkinDefaults.DEFAULT_COUNTRY,
	});
	expect(result).toHaveErrorMessage(validationError);
	expect(result).toHaveFieldError('SKU must not be empty');
}

async function shouldRejectOrderWithNullCountry(shopDriver: ShopDriver): Promise<void> {
	const result = await shopDriver.orders().placeOrder({
		sku: createUniqueSku(GherkinDefaults.DEFAULT_SKU),
		quantity: GherkinDefaults.DEFAULT_QUANTITY,
		country: null,
	});
	expect(result).toHaveErrorMessage(validationError);
	expect(result).toHaveFieldError('Country must not be empty');
}

test('should reject order with invalid quantity', async ({ shopApiDriver }) => {
	await shouldRejectOrderWithInvalidQuantity(shopApiDriver);
});

test('should reject order with non-existent SKU', async ({ shopApiDriver }) => {
	await shouldRejectOrderWithNonExistentSku(shopApiDriver);
});

test('should reject order with negative quantity', async ({ shopApiDriver }) => {
	await shouldRejectOrderWithNegativeQuantity(shopApiDriver);
});

test('should reject order with zero quantity', async ({ shopApiDriver }) => {
	await shouldRejectOrderWithZeroQuantity(shopApiDriver);
});

test('should reject order with empty SKU', async ({ shopApiDriver }) => {
	await shouldRejectOrderWithEmptySku(shopApiDriver);
});

test('should reject order with empty quantity', async ({ shopApiDriver }) => {
	await shouldRejectOrderWithEmptyQuantity(shopApiDriver);
});

test('should reject order with non-integer quantity', async ({ shopApiDriver }) => {
	await shouldRejectOrderWithNonIntegerQuantity(shopApiDriver);
});

test('should reject order with empty country', async ({ shopApiDriver }) => {
	await shouldRejectOrderWithEmptyCountry(shopApiDriver);
});

test('should reject order with invalid country', async ({ shopApiDriver, erpDriver }) => {
	await shouldRejectOrderWithInvalidCountry(shopApiDriver, erpDriver);
});

test('should reject order with null quantity', async ({ shopApiDriver }) => {
	await shouldRejectOrderWithNullQuantity(shopApiDriver);
});

test('should reject order with null SKU', async ({ shopApiDriver }) => {
	await shouldRejectOrderWithNullSku(shopApiDriver);
});

test('should reject order with null country', async ({ shopApiDriver }) => {
	await shouldRejectOrderWithNullCountry(shopApiDriver);
});