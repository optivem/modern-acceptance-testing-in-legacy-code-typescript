/**
 * V7 acceptance: place order (negative, isolated). Migrated from Java PlaceOrderNegativeIsolatedTest.
 * Uses clock stubbing to simulate time-dependent expiry logic.
 * Isolated tests run sequentially (serial mode) to avoid clock state conflicts.
 */
import '../../../../setup-config.js';
import { test, Channel } from '../fixtures.js';
import { ChannelType } from '@optivem/core/shop/ChannelType.js';

test.describe.configure({ mode: 'serial' });

test.describe('@isolated', () => {
    Channel(ChannelType.UI, ChannelType.API)('cannot place order with expired coupon code', async ({ scenario }) => {
        const whenClause = await scenario
            .given()
            .clock().withTime('2023-09-01T12:00:00Z')
            .and().coupon().withCouponCode('SUMMER2023').withValidFrom('2023-06-01T00:00:00Z').withValidTo('2023-08-31T23:59:59Z')
            .when();
        const failure = await whenClause.placeOrder().withCouponCode('SUMMER2023').then().shouldFail();
        failure
            .errorMessage('The request contains one or more validation errors')
            .fieldErrorMessage('couponCode', 'Coupon code SUMMER2023 has expired');
    });
});
