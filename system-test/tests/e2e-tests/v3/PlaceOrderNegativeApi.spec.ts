import '../../../setup-config.js';
import { GherkinDefaults } from '@optivem/dsl/gherkin/GherkinDefaults.js';
import { test, expect, createUniqueSku } from './base/fixtures.js';
import { registerPlaceOrderNegativeBaseTests } from './PlaceOrderNegativeBase.js';

const validationError = 'The request contains one or more validation errors';

registerPlaceOrderNegativeBaseTests(test, { shopDriverFixture: 'shopApiDriver' });

test('should reject order with null quantity', async ({ shopApiDriver }) => {
	const result = await shopApiDriver.orders().placeOrder({
		sku: createUniqueSku(GherkinDefaults.DEFAULT_SKU),
		quantity: null,
		country: GherkinDefaults.DEFAULT_COUNTRY,
	});
	expect(result).toHaveErrorMessage(validationError);
	expect(result).toHaveFieldError('Quantity must not be empty');
});

test('should reject order with null SKU', async ({ shopApiDriver }) => {
	const result = await shopApiDriver.orders().placeOrder({
		sku: null,
		quantity: GherkinDefaults.DEFAULT_QUANTITY,
		country: GherkinDefaults.DEFAULT_COUNTRY,
	});
	expect(result).toHaveErrorMessage(validationError);
	expect(result).toHaveFieldError('SKU must not be empty');
});

test('should reject order with null country', async ({ shopApiDriver }) => {
	const result = await shopApiDriver.orders().placeOrder({
		sku: createUniqueSku(GherkinDefaults.DEFAULT_SKU),
		quantity: GherkinDefaults.DEFAULT_QUANTITY,
		country: null,
	});
	expect(result).toHaveErrorMessage(validationError);
	expect(result).toHaveFieldError('Country must not be empty');
});