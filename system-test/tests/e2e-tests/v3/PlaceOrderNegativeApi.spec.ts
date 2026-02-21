import '../../../setup-config.js';
import { test } from './base/fixtures.js';
import {
	shouldRejectOrderWithEmptyCountry,
	shouldRejectOrderWithEmptyQuantity,
	shouldRejectOrderWithEmptySku,
	shouldRejectOrderWithInvalidCountry,
	shouldRejectOrderWithInvalidQuantity,
	shouldRejectOrderWithNegativeQuantity,
	shouldRejectOrderWithNonExistentSku,
	shouldRejectOrderWithNonIntegerQuantity,
	shouldRejectOrderWithNullCountry,
	shouldRejectOrderWithNullQuantity,
	shouldRejectOrderWithNullSku,
	shouldRejectOrderWithZeroQuantity,
} from './PlaceOrderNegativeBase.js';

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