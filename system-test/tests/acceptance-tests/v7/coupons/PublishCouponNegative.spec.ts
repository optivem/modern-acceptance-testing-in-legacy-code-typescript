/**
 * V7 acceptance: publish coupon (negative). Migrated from Java PublishCouponNegativeTest.
 */
import '../../../../setup-config.js';
import { Channel } from '../fixtures.js';
import { ChannelType } from '@optivem/core/shop/ChannelType.js';

const validationError = 'The request contains one or more validation errors';

Channel(ChannelType.UI, ChannelType.API)(
    'cannot publish coupon with zero or negative discount',
    async ({ scenario }) => {
        for (const discountRate of ['0.0', '-0.01', '-0.15']) {
            const failure = await scenario
                .when()
                .publishCoupon()
                .withCouponCode('INVALID-COUPON')
                .withDiscountRate(discountRate)
                .then()
                .shouldFail();
            failure
                .errorMessage(validationError)
                .fieldErrorMessage('discountRate', 'Discount rate must be greater than 0.00');
        }
    }
);

Channel(ChannelType.UI, ChannelType.API)(
    'cannot publish coupon with discount greater than 100 percent',
    async ({ scenario }) => {
        for (const discountRate of ['1.01', '2.00']) {
            const failure = await scenario
                .when()
                .publishCoupon()
                .withCouponCode('INVALID-COUPON')
                .withDiscountRate(discountRate)
                .then()
                .shouldFail();
            failure
                .errorMessage(validationError)
                .fieldErrorMessage('discountRate', 'Discount rate must be at most 1.00');
        }
    }
);

Channel(ChannelType.UI, ChannelType.API)('cannot publish coupon with duplicate coupon code', async ({ scenario }) => {
    const whenClause = await scenario
        .given()
        .coupon()
        .withCouponCode('EXISTING-COUPON')
        .withDiscountRate(0.1)
        .when();
    const failure = await whenClause
        .publishCoupon()
        .withCouponCode('EXISTING-COUPON')
        .withDiscountRate(0.2)
        .then()
        .shouldFail();
    failure
        .errorMessage(validationError)
        .fieldErrorMessage('couponCode', 'Coupon code EXISTING-COUPON already exists');
});

Channel(ChannelType.UI, ChannelType.API)(
    'cannot publish coupon with zero or negative usage limit',
    async ({ scenario }) => {
        for (const usageLimit of ['0', '-1', '-100']) {
            const failure = await scenario
                .when()
                .publishCoupon()
                .withCouponCode('INVALID-LIMIT')
                .withDiscountRate(0.15)
                .withUsageLimit(usageLimit)
                .then()
                .shouldFail();
            failure
                .errorMessage(validationError)
                .fieldErrorMessage('usageLimit', 'Usage limit must be positive');
        }
    }
);
