/**
 * V7 acceptance: place order (negative). Migrated from Java PlaceOrderNegativeTest.
 */
import '../../../../setup-config.js';
import { Channel } from '../fixtures.js';
import { ChannelType } from '@optivem/core/shop/ChannelType.js';

const validationError = 'The request contains one or more validation errors';

Channel(ChannelType.UI, ChannelType.API)('should reject order with invalid quantity', async ({ scenario }) => {
    const failure = await (await scenario.when().placeOrder()).withQuantity('invalid-quantity').then().shouldFail();
    failure.errorMessage(validationError).fieldErrorMessage('quantity', 'Quantity must be an integer');
});

Channel(ChannelType.UI, ChannelType.API)('should reject order with non-existent sku', async ({ scenario }) => {
    const failure = await (await scenario.when().placeOrder()).withSku('NON-EXISTENT-SKU-12345').then().shouldFail();
    failure.errorMessage(validationError).fieldErrorMessage('sku', 'Product does not exist for SKU: NON-EXISTENT-SKU-12345');
});

Channel(ChannelType.UI, ChannelType.API)('should reject order with negative quantity', async ({ scenario }) => {
    const failure = await (await scenario.when().placeOrder()).withQuantity(-10).then().shouldFail();
    failure.errorMessage(validationError).fieldErrorMessage('quantity', 'Quantity must be positive');
});

Channel(ChannelType.UI, ChannelType.API)('should reject order with zero quantity', async ({ scenario }) => {
    const failure = await (await scenario.when().placeOrder()).withQuantity(0).then().shouldFail();
    failure.errorMessage(validationError).fieldErrorMessage('quantity', 'Quantity must be positive');
});

Channel(ChannelType.UI, ChannelType.API)('should reject order with empty sku', async ({ scenario }) => {
    for (const sku of ['', null]) {
        const failure = await (await scenario.when().placeOrder()).withSku(sku as string).then().shouldFail();
        failure.errorMessage(validationError).fieldErrorMessage('sku', 'SKU must not be empty');
    }
});

Channel(ChannelType.UI, ChannelType.API)('should reject order with empty quantity', async ({ scenario }) => {
    for (const emptyQuantity of ['', null]) {
        const failure = await (await scenario.when().placeOrder()).withQuantity(emptyQuantity as string).then().shouldFail();
        failure.errorMessage(validationError).fieldErrorMessage('quantity', 'Quantity must not be empty');
    }
});

Channel(ChannelType.UI, ChannelType.API)('should reject order with non-integer quantity', async ({ scenario }) => {
    for (const nonInteger of ['3.5', 'lala']) {
        const failure = await (await scenario.when().placeOrder()).withQuantity(nonInteger).then().shouldFail();
        failure.errorMessage(validationError).fieldErrorMessage('quantity', 'Quantity must be an integer');
    }
});

Channel(ChannelType.UI, ChannelType.API)('should reject order with empty country', async ({ scenario }) => {
    for (const emptyCountry of ['', null]) {
        const failure = await (await scenario.when().placeOrder()).withCountry(emptyCountry as string).then().shouldFail();
        failure.errorMessage(validationError).fieldErrorMessage('country', 'Country must not be empty');
    }
});

Channel(ChannelType.UI, ChannelType.API)('should reject order with invalid country', async ({ scenario }) => {
    const failure = await (await scenario.when().placeOrder()).withCountry('XX').then().shouldFail();
    failure.errorMessage(validationError).fieldErrorMessage('country', 'Country does not exist: XX');
});

Channel(ChannelType.API)('should reject order with null quantity', async ({ scenario }) => {
    const failure = await (await scenario.when().placeOrder()).withQuantity(null as unknown as string).then().shouldFail();
    failure.errorMessage(validationError).fieldErrorMessage('quantity', 'Quantity must not be empty');
});

Channel(ChannelType.API)('should reject order with null sku', async ({ scenario }) => {
    const failure = await (await scenario.when().placeOrder()).withSku(null as unknown as string).then().shouldFail();
    failure.errorMessage(validationError).fieldErrorMessage('sku', 'SKU must not be empty');
});

Channel(ChannelType.API)('should reject order with null country', async ({ scenario }) => {
    const failure = await (await scenario.when().placeOrder()).withCountry(null as unknown as string).then().shouldFail();
    failure.errorMessage(validationError).fieldErrorMessage('country', 'Country must not be empty');
});

Channel(ChannelType.UI, ChannelType.API)('cannot place order with non-existent coupon', async ({ scenario }) => {
    const failure = await (await scenario.when().placeOrder()).withCouponCode('INVALIDCOUPON').then().shouldFail();
    failure
        .errorMessage(validationError)
        .fieldErrorMessage('couponCode', 'Coupon code INVALIDCOUPON does not exist');
});

Channel(ChannelType.UI, ChannelType.API)(
    'cannot place order with coupon that has exceeded usage limit',
    async ({ scenario }) => {
        const whenClause = await scenario
            .given()
            .coupon()
            .withCouponCode('LIMITED2024')
            .withUsageLimit(2)
            .and()
            .order()
            .withOrderNumber('ORD-1')
            .withCouponCode('LIMITED2024')
            .and()
            .order()
            .withOrderNumber('ORD-2')
            .withCouponCode('LIMITED2024')
            .when();
        const failure = await (await whenClause.placeOrder()).withOrderNumber('ORD-3').withCouponCode('LIMITED2024').then().shouldFail();
        failure
            .errorMessage(validationError)
            .fieldErrorMessage('couponCode', 'Coupon code LIMITED2024 has exceeded its usage limit');
    }
);
