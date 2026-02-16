import { ResponseVerification, UseCaseContext } from '@optivem/commons/dsl';
import type { BrowseCouponsResponse, CouponDto } from '../../commons/dtos/coupons/index.js';
import { expect } from '@playwright/test';

export class BrowseCouponsVerification extends ResponseVerification<BrowseCouponsResponse> {
    constructor(response: BrowseCouponsResponse, context: UseCaseContext) {
        super(response, context);
    }

    hasCouponWithCode(couponCodeAlias: string): BrowseCouponsVerification {
        this.findCouponByCode(couponCodeAlias);
        return this;
    }

    couponHasDiscountRate(couponCodeAlias: string, expectedDiscountRate: number): BrowseCouponsVerification {
        const coupon = this.findCouponByCode(couponCodeAlias);
        expect(
            coupon.discountRate,
            `Discount rate for coupon '${couponCodeAlias}'`
        ).toBe(expectedDiscountRate);
        return this;
    }

    couponHasUsageLimit(couponCodeAlias: string, expectedUsageLimit: number): BrowseCouponsVerification {
        const coupon = this.findCouponByCode(couponCodeAlias);
        const actual = coupon.usageLimit?.toNumber();
        expect(actual, `Usage limit for coupon '${couponCodeAlias}'`).toBe(expectedUsageLimit);
        return this;
    }

    couponHasUsedCount(couponCodeAlias: string, expectedUsedCount: number): BrowseCouponsVerification {
        const coupon = this.findCouponByCode(couponCodeAlias);
        const actual = coupon.usedCount?.toNumber();
        expect(actual, `Used count for coupon '${couponCodeAlias}'`).toBe(expectedUsedCount);
        return this;
    }

    private findCouponByCode(couponCodeAlias: string): CouponDto {
        const couponCode = this.context.getParamValue(couponCodeAlias);
        const coupons = this.response.coupons ?? [];
        const coupon = coupons.find((c) => c.code === couponCode);
        expect(
            coupon,
            `Coupon with code '${couponCode}' not found. Available coupons: ${coupons.map((c) => c.code).join(', ')}`
        ).toBeDefined();
        return coupon!;
    }
}
