/**
 * V7 acceptance: orders. Merged from PlaceOrderPositiveTest, PlaceOrderNegativeTest,
 * PlaceOrderNegativeIsolatedTest, ViewOrderPositiveTest, ViewOrderNegativeTest,
 * CancelOrderPositiveTest, CancelOrderNegativeTest, CancelOrderPositiveIsolatedTest,
 * CancelOrderNegativeIsolatedTest.
 */
import '../../../setup-config.js';
import { test, withChannels } from './base/fixtures.js';
import { ChannelType } from '@optivem/dsl-core/system/shop/ChannelType.js';
import { OrderStatus } from '@optivem/driver-api/shop/dtos/OrderStatus.js';
import { emptyArgumentsProvider } from '../../shared/argumentProviders.js';

// ── Place Order ───────────────────────────────────────────────────────────────

const basePriceCases = [
    { unitPrice: '20.00', quantity: '5', basePrice: '100.00' },
    { unitPrice: '10.00', quantity: '3', basePrice: '30.00' },
    { unitPrice: '15.50', quantity: '4', basePrice: '62.00' },
    { unitPrice: '99.99', quantity: '1', basePrice: '99.99' },
];

const taxRateCases = [
    { country: 'UK', taxRate: '0.09' },
    { country: 'US', taxRate: '0.20' },
];

const totalPriceCases = [
    { country: 'UK', taxRate: '0.09', subtotalPrice: '50.00', expectedTaxAmount: '4.50', expectedTotalPrice: '54.50' },
    { country: 'US', taxRate: '0.20', subtotalPrice: '100.00', expectedTaxAmount: '20.00', expectedTotalPrice: '120.00' },
];

withChannels(ChannelType.UI, ChannelType.API)(() => {
    test('should be able to place order for valid input', async ({ scenario }) => {
        await scenario
            .given().product()
                .withSku('ABC')
                .withUnitPrice(20)
            .and().country()
                .withCode('US')
                .withTaxRate(0.1)
            .when().placeOrder()
                .withSku('ABC')
                .withQuantity(5)
                .withCountry('US')
            .then().shouldSucceed();
    });

    test('order status should be placed after placing order', async ({ scenario }) => {
        await scenario
            .when().placeOrder()
            .then().shouldSucceed()
            .and().order()
                .hasStatus(OrderStatus.PLACED);
    });

    test('should calculate base price as product of unit price and quantity', async ({ scenario }) => {
        await scenario
            .given().product()
                .withUnitPrice(20)
            .when().placeOrder()
                .withQuantity(5)
            .then().shouldSucceed()
            .and().order()
                .hasBasePrice(100);
    });

    for (const { unitPrice, quantity, basePrice } of basePriceCases) {
        test(`should place order with correct base price parameterized (unitPrice=${unitPrice}, quantity=${quantity}, basePrice=${basePrice})`, async ({ scenario }) => {
            await scenario
                .given().product()
                    .withUnitPrice(unitPrice)
                .when().placeOrder()
                    .withQuantity(quantity)
                .then().shouldSucceed()
                .and().order()
                    .hasBasePrice(basePrice);
        });
    }

    test('order prefix should be ORD', async ({ scenario }) => {
        await scenario
            .when().placeOrder()
            .then().shouldSucceed()
            .and().order()
                .hasOrderNumberPrefix('ORD-');
    });

    test('discount rate should be applied for coupon', async ({ scenario }) => {
        await scenario
            .given().coupon()
                .withCouponCode('SUMMER2025')
                .withDiscountRate(0.15)
            .when().placeOrder()
                .withCouponCode('SUMMER2025')
            .then().shouldSucceed()
            .and().order()
                .hasAppliedCoupon('SUMMER2025')
                .hasDiscountRate(0.15);
    });

    test('discount rate should not be applied when there is no coupon', async ({ scenario }) => {
        await scenario
            .when().placeOrder()
                .withCouponCode(null)
            .then().shouldSucceed()
            .and().order()
                .hasStatus(OrderStatus.PLACED)
                .hasAppliedCoupon(null)
                .hasDiscountRate(0)
                .hasDiscountAmount(0);
    });

    test('subtotal price should be calculated as the base price minus discount amount when we have coupon', async ({ scenario }) => {
        await scenario
            .given().coupon()
                .withDiscountRate(0.15)
            .and().product()
                .withUnitPrice(20)
            .when().placeOrder()
                .withCouponCode()
                .withQuantity(5)
            .then().shouldSucceed()
            .and().order()
                .hasAppliedCoupon()
                .hasDiscountRate(0.15)
                .hasBasePrice(100)
                .hasDiscountAmount(15)
                .hasSubtotalPrice(85);
    });

    test('subtotal price should be same as base price when no coupon', async ({ scenario }) => {
        await scenario
            .given().product()
                .withUnitPrice(20)
            .when().placeOrder()
                .withQuantity(5)
            .then().shouldSucceed()
            .and().order()
                .hasBasePrice(100)
                .hasDiscountAmount(0)
                .hasSubtotalPrice(100);
    });

    for (const { country, taxRate } of taxRateCases) {
        test(`correct tax rate should be used based on country (country=${country}, taxRate=${taxRate})`, async ({ scenario }) => {
            await scenario
                .given().country()
                    .withCode(country)
                    .withTaxRate(taxRate)
                .when().placeOrder()
                    .withCountry(country)
                .then().shouldSucceed()
                .and().order()
                    .hasTaxRate(taxRate);
        });
    }

    for (const { country, taxRate, subtotalPrice, expectedTaxAmount, expectedTotalPrice } of totalPriceCases) {
        test(`total price should be subtotal price plus tax amount (country=${country}, taxRate=${taxRate}, subtotalPrice=${subtotalPrice}, expectedTaxAmount=${expectedTaxAmount}, expectedTotalPrice=${expectedTotalPrice})`, async ({ scenario }) => {
            await scenario
                .given().country()
                    .withCode(country)
                    .withTaxRate(taxRate)
                .and().product()
                    .withUnitPrice(subtotalPrice)
                .when().placeOrder()
                    .withCountry(country)
                    .withQuantity(1)
                .then().shouldSucceed()
                .and().order()
                    .hasTaxRate(taxRate)
                    .hasSubtotalPrice(subtotalPrice)
                    .hasTaxAmount(expectedTaxAmount)
                    .hasTotalPrice(expectedTotalPrice);
        });
    }

    test('coupon usage count has been incremented after its been used', async ({ scenario }) => {
        await scenario
            .given().coupon()
                .withCouponCode('SUMMER2025')
            .when().placeOrder()
                .withCouponCode('SUMMER2025')
            .then().shouldSucceed()
            .coupon('SUMMER2025')
                .hasUsedCount(1);
    });
});

const validationError = 'The request contains one or more validation errors';

withChannels(ChannelType.UI, ChannelType.API)(() => {
    test('should reject order with invalid quantity', async ({ scenario }) => {
        await scenario
            .when().placeOrder()
                .withQuantity('invalid-quantity')
            .then().shouldFail()
                .errorMessage(validationError)
                .fieldErrorMessage('quantity', 'Quantity must be an integer');
    });

    test('should reject order with non-existent SKU', async ({ scenario }) => {
        await scenario
            .when().placeOrder()
                .withSku('NON-EXISTENT-SKU-12345')
            .then().shouldFail()
                .errorMessage(validationError)
                .fieldErrorMessage('sku', 'Product does not exist for SKU: NON-EXISTENT-SKU-12345');
    });

    test('should reject order with negative quantity', async ({ scenario }) => {
        await scenario
            .when().placeOrder()
                .withQuantity(-10)
            .then().shouldFail()
                .errorMessage(validationError)
                .fieldErrorMessage('quantity', 'Quantity must be positive');
    });

    test('should reject order with zero quantity', async ({ scenario }) => {
        await scenario
            .when().placeOrder()
                .withQuantity(0)
            .then().shouldFail()
                .errorMessage(validationError)
                .fieldErrorMessage('quantity', 'Quantity must be positive');
    });

    for (const sku of emptyArgumentsProvider) {
        test(`should reject order with empty SKU (sku=${JSON.stringify(sku)})`, async ({ scenario }) => {
            await scenario
                .when().placeOrder()
                    .withSku(sku)
                .then().shouldFail()
                    .errorMessage(validationError)
                    .fieldErrorMessage('sku', 'SKU must not be empty');
        });
    }

    for (const quantity of emptyArgumentsProvider) {
        test(`should reject order with empty quantity (quantity=${JSON.stringify(quantity)})`, async ({ scenario }) => {
            await scenario
                .when().placeOrder()
                    .withQuantity(quantity)
                .then().shouldFail()
                    .errorMessage(validationError)
                    .fieldErrorMessage('quantity', 'Quantity must not be empty');
        });
    }

    for (const nonInteger of ['3.5', 'lala']) {
        test(`should reject order with non-integer quantity (quantity=${nonInteger})`, async ({ scenario }) => {
            await scenario
                .when().placeOrder()
                    .withQuantity(nonInteger)
                .then().shouldFail()
                    .errorMessage(validationError)
                    .fieldErrorMessage('quantity', 'Quantity must be an integer');
        });
    }

    for (const country of emptyArgumentsProvider) {
        test(`should reject order with empty country (country=${JSON.stringify(country)})`, async ({ scenario }) => {
            await scenario
                .when().placeOrder()
                    .withCountry(country)
                .then().shouldFail()
                    .errorMessage(validationError)
                    .fieldErrorMessage('country', 'Country must not be empty');
        });
    }

    test('should reject order with invalid country', async ({ scenario }) => {
        await scenario
            .given().product()
            .when().placeOrder()
                .withCountry('XX')
            .then().shouldFail()
                .errorMessage(validationError)
                .fieldErrorMessage('country', 'Country does not exist: XX');
    });

    test('cannot place order with non-existent coupon', async ({ scenario }) => {
        await scenario
            .when().placeOrder()
                .withCouponCode('INVALIDCOUPON')
            .then().shouldFail()
                .errorMessage(validationError)
                .fieldErrorMessage('couponCode', 'Coupon code INVALIDCOUPON does not exist');
    });

    test('cannot place order with coupon that has exceeded usage limit', async ({ scenario }) => {
        await scenario
            .given().coupon()
                .withCouponCode('LIMITED2024')
                .withUsageLimit(2)
            .and().order()
                .withOrderNumber('ORD-1')
                .withCouponCode('LIMITED2024')
            .and().order()
                .withOrderNumber('ORD-2')
                .withCouponCode('LIMITED2024')
            .when().placeOrder()
                .withOrderNumber('ORD-3')
                .withCouponCode('LIMITED2024')
            .then().shouldFail()
                .errorMessage(validationError)
                .fieldErrorMessage('couponCode', 'Coupon code LIMITED2024 has exceeded its usage limit');
    });
});

withChannels(ChannelType.API)(() => {
    test('should reject order with null quantity', async ({ scenario }) => {
        await scenario
            .when().placeOrder()
                .withQuantity(null)
            .then().shouldFail()
                .errorMessage(validationError)
                .fieldErrorMessage('quantity', 'Quantity must not be empty');
    });

    test('should reject order with null SKU', async ({ scenario }) => {
        await scenario
            .when().placeOrder()
                .withSku(null)
            .then().shouldFail()
                .errorMessage(validationError)
                .fieldErrorMessage('sku', 'SKU must not be empty');
    });

    test('should reject order with null country', async ({ scenario }) => {
        await scenario
            .when().placeOrder()
                .withCountry(null)
            .then().shouldFail()
                .errorMessage(validationError)
                .fieldErrorMessage('country', 'Country must not be empty');
    });
});

test.describe('@isolated', () => {
    test.describe.configure({ mode: 'serial' });

    withChannels(ChannelType.UI, ChannelType.API)(() => {
        test('cannot place order with expired coupon', async ({ scenario }) => {
            await scenario
                .given().clock()
                    .withTime('2023-09-01T12:00:00Z')
                .and().coupon()
                    .withCouponCode('SUMMER2023')
                    .withValidFrom('2023-06-01T00:00:00Z')
                    .withValidTo('2023-08-31T23:59:59Z')
                .when().placeOrder()
                    .withCouponCode('SUMMER2023')
                .then().shouldFail()
                    .errorMessage(validationError)
                    .fieldErrorMessage('couponCode', 'Coupon code SUMMER2023 has expired');
        });
    });
});

// ── View Order ────────────────────────────────────────────────────────────────

const nonExistentOrderCases = [
    { orderNumber: 'NON-EXISTENT-ORDER-99999', message: 'Order NON-EXISTENT-ORDER-99999 does not exist.' },
    { orderNumber: 'NON-EXISTENT-ORDER-88888', message: 'Order NON-EXISTENT-ORDER-88888 does not exist.' },
    { orderNumber: 'NON-EXISTENT-ORDER-77777', message: 'Order NON-EXISTENT-ORDER-77777 does not exist.' },
];

withChannels(ChannelType.UI, ChannelType.API)(() => {
    test('should be able to view order', async ({ scenario }) => {
        await scenario
            .given().order()
            .when().viewOrder()
            .then().shouldSucceed();
    });

    for (const { orderNumber, message } of nonExistentOrderCases) {
        test(`should not be able to view non-existent order (orderNumber=${orderNumber})`, async ({ scenario }) => {
            await scenario
                .when().viewOrder()
                    .withOrderNumber(orderNumber)
                .then().shouldFail()
                    .errorMessage(message);
        });
    }
});

// ── Cancel Order ──────────────────────────────────────────────────────────────

withChannels(ChannelType.UI, ChannelType.API)(() => {
    test('should have cancelled status when cancelled', async ({ scenario }) => {
        await scenario
            .given().order()
            .when().cancelOrder()
            .then().shouldSucceed()
            .and().order()
                .hasStatus(OrderStatus.CANCELLED);
    });
});

withChannels(ChannelType.API)(() => {
    for (const { orderNumber, message } of nonExistentOrderCases) {
        test(`should not cancel non-existent order (orderNumber=${orderNumber})`, async ({ scenario }) => {
            await scenario
                .when().cancelOrder()
                    .withOrderNumber(orderNumber)
                .then().shouldFail()
                    .errorMessage(message);
        });
    }

    test('should not cancel already cancelled order', async ({ scenario }) => {
        await scenario
            .given().order()
                .withStatus(OrderStatus.CANCELLED)
            .when().cancelOrder()
            .then().shouldFail()
                .errorMessage('Order has already been cancelled');
    });

    test('cannot cancel non-existent order', async ({ scenario }) => {
        await scenario
            .when().cancelOrder()
                .withOrderNumber('non-existent-order-12345')
            .then().shouldFail()
                .errorMessage('Order non-existent-order-12345 does not exist.');
    });
});

const cancelPositiveTimes = [
    '2024-12-31T21:59:59Z', // 1 second before blackout period starts
    '2024-12-31T22:30:01Z', // 1 second after blackout period ends
    '2024-12-31T10:00:00Z', // Another time on blackout day but outside blackout period
    '2025-01-01T22:15:00Z', // Another day entirely (same time but different day)
];

test.describe('@isolated', () => {
    test.describe.configure({ mode: 'serial' });

    withChannels(ChannelType.UI, ChannelType.API)(() => {
        for (const time of cancelPositiveTimes) {
            test(`should be able to cancel order outside of blackout period 31st Dec between 22:00 and 22:30 (${time})`, async ({ scenario }) => {
                await scenario
                    .given().clock()
                        .withTime(time)
                    .and().order()
                        .withStatus(OrderStatus.PLACED)
                    .when().cancelOrder()
                    .then().shouldSucceed();
            });
        }
    });
});

const BLACKOUT_ERROR = 'Order cancellation is not allowed on December 31st between 22:00 and 23:00';

const cancelNegativeTimes = [
    '2024-12-31T22:00:00Z', // Start of blackout period
    '2026-12-31T22:00:01Z', // Just after start
    '2025-12-31T22:15:00Z', // Middle of blackout period
    '2028-12-31T22:29:59Z', // Just before end
    '2021-12-31T22:30:00Z', // End of blackout period
];

test.describe('@isolated', () => {
    test.describe.configure({ mode: 'serial' });

    withChannels(ChannelType.UI, ChannelType.API)(() => {
        for (const time of cancelNegativeTimes) {
            test(`cannot cancel an order on 31st Dec between 22:00 and 22:30 (${time})`, async ({ scenario }) => {
                await scenario
                    .given().clock()
                        .withTime(time)
                    .and().order()
                        .withStatus(OrderStatus.PLACED)
                    .when().cancelOrder()
                    .then().shouldFail()
                        .errorMessage(BLACKOUT_ERROR)
                    .and().order()
                        .hasStatus(OrderStatus.PLACED);
            });
        }
    });
});
