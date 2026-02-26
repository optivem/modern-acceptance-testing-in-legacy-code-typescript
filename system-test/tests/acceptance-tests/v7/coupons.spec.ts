/**
 * V7 acceptance: coupons. Merged from BrowseCouponsPositiveTest,
 * PublishCouponPositiveTest, PublishCouponNegativeTest.
 */
import '../../../setup-config.js';
import { test, withChannels } from './base/fixtures.js';
import { ChannelType } from '@optivem/dsl-core/system/shop/ChannelType.js';

// ── Browse Coupons ────────────────────────────────────────────────────────────

withChannels(ChannelType.UI, ChannelType.API)(() => {
    test('should be able to browse coupons', async ({ scenario }) => {
        await scenario
            .when().browseCoupons()
            .then().shouldSucceed();
    });
});

// ── Publish Coupon ────────────────────────────────────────────────────────────

withChannels(ChannelType.UI, ChannelType.API)(() => {
    test('should be able to publish valid coupon', async ({ scenario }) => {
        await scenario
            .when().publishCoupon()
                .withCouponCode('SUMMER2025')
                .withDiscountRate(0.15)
                .withValidFrom('2024-06-01T00:00:00Z')
                .withValidTo('2024-08-31T23:59:59Z')
                .withUsageLimit(100)
            .then().shouldSucceed();
    });

    test('should be able to publish coupon with empty optional fields', async ({ scenario }) => {
        await scenario
            .when().publishCoupon()
                .withCouponCode('SUMMER2025')
                .withDiscountRate(0.15)
                .withValidFrom('')
                .withValidTo('')
                .withUsageLimit('')
            .then().shouldSucceed();
    });

    test('should be able to correctly save coupon', async ({ scenario }) => {
        await scenario
            .when().publishCoupon()
                .withCouponCode('SUMMER2025')
                .withDiscountRate(0.15)
                .withValidFrom('2024-06-01T00:00:00Z')
                .withValidTo('2024-08-31T23:59:00Z')
                .withUsageLimit(100)
            .then().shouldSucceed().coupon('SUMMER2025')
                .hasDiscountRate(0.15)
                .isValidFrom('2024-06-01T00:00:00Z')
                .isValidTo('2024-08-31T23:59:00Z')
                .hasUsageLimit(100)
                .hasUsedCount(0);
    });

    const validationError = 'The request contains one or more validation errors';

    for (const discountRate of ['0.0', '-0.01', '-0.15']) {
        test(`cannot publish coupon with zero or negative discount (discountRate=${discountRate})`, async ({ scenario }) => {
            await scenario
                .when().publishCoupon()
                    .withCouponCode('INVALID-COUPON')
                    .withDiscountRate(discountRate)
                .then().shouldFail()
                    .errorMessage(validationError)
                    .fieldErrorMessage('discountRate', 'Discount rate must be greater than 0.00');
        });
    }

    for (const discountRate of ['1.01', '2.00']) {
        test(`cannot publish coupon with discount greater than 100 percent (discountRate=${discountRate})`, async ({ scenario }) => {
            await scenario
                .when().publishCoupon()
                    .withCouponCode('INVALID-COUPON')
                    .withDiscountRate(discountRate)
                .then().shouldFail()
                    .errorMessage(validationError)
                    .fieldErrorMessage('discountRate', 'Discount rate must be at most 1.00');
        });
    }

    test('cannot publish coupon with duplicate coupon code', async ({ scenario }) => {
        await scenario
            .given().coupon()
                .withCouponCode('EXISTING-COUPON')
                .withDiscountRate(0.1)
            .when().publishCoupon()
                .withCouponCode('EXISTING-COUPON')
                .withDiscountRate(0.2)
            .then().shouldFail()
                .errorMessage(validationError)
                .fieldErrorMessage('couponCode', 'Coupon code EXISTING-COUPON already exists');
    });

    for (const usageLimit of ['0', '-1', '-100']) {
        test(`cannot publish coupon with zero or negative usage limit (usageLimit=${usageLimit})`, async ({ scenario }) => {
            await scenario
                .when().publishCoupon()
                    .withCouponCode('INVALID-LIMIT')
                    .withDiscountRate(0.15)
                    .withUsageLimit(usageLimit)
                .then().shouldFail()
                    .errorMessage(validationError)
                    .fieldErrorMessage('usageLimit', 'Usage limit must be positive');
        });
    }
});
