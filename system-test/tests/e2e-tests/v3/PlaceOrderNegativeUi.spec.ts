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
	shouldRejectOrderWithZeroQuantity,
} from './PlaceOrderNegativeBase.js';

test('should reject order with invalid quantity', async ({ shopUiDriver }) => {
	await shouldRejectOrderWithInvalidQuantity(shopUiDriver);
});

test('should reject order with non-existent SKU', async ({ shopUiDriver }) => {
	await shouldRejectOrderWithNonExistentSku(shopUiDriver);
});

test('should reject order with negative quantity', async ({ shopUiDriver }) => {
	await shouldRejectOrderWithNegativeQuantity(shopUiDriver);
});

test('should reject order with zero quantity', async ({ shopUiDriver }) => {
	await shouldRejectOrderWithZeroQuantity(shopUiDriver);
});

test('should reject order with empty SKU', async ({ shopUiDriver }) => {
	await shouldRejectOrderWithEmptySku(shopUiDriver);
});

test('should reject order with empty quantity', async ({ shopUiDriver }) => {
	await shouldRejectOrderWithEmptyQuantity(shopUiDriver);
});

test('should reject order with non-integer quantity', async ({ shopUiDriver }) => {
	await shouldRejectOrderWithNonIntegerQuantity(shopUiDriver);
});

test('should reject order with empty country', async ({ shopUiDriver }) => {
	await shouldRejectOrderWithEmptyCountry(shopUiDriver);
});

test('should reject order with invalid country', async ({ shopUiDriver, erpDriver }) => {
	await shouldRejectOrderWithInvalidCountry(shopUiDriver, erpDriver);
});