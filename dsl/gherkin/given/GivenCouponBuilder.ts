import { Converter } from '@optivem/commons/util';
import type { SystemDsl } from '../../system/SystemDsl.js';
import { GherkinDefaults } from '../GherkinDefaults.js';
import { BaseGivenBuilder } from './BaseGivenBuilder.js';
import type { GivenClause } from './GivenClause.js';

export class GivenCouponBuilder extends BaseGivenBuilder {
    private couponCodeValue: string;
    private discountRateValue: string;
    private validFromValue: string;
    private validToValue: string;
    private usageLimitValue: string;

    constructor(givenClause: GivenClause) {
        super(givenClause);
        this.withCouponCode(GherkinDefaults.DEFAULT_COUPON_CODE);
        this.withDiscountRate(GherkinDefaults.DEFAULT_DISCOUNT_RATE);
        this.withValidFrom(GherkinDefaults.EMPTY);
        this.withValidTo(GherkinDefaults.EMPTY);
        this.withUsageLimit(GherkinDefaults.EMPTY);
    }

    withCouponCode(couponCode: string): this {
        this.couponCodeValue = couponCode;
        return this;
    }

    withDiscountRate(discountRate: string): this {
        this.discountRateValue = discountRate;
        return this;
    }

    withDiscountRate(discountRate: number): this {
        return this.withDiscountRate(Converter.fromDouble(discountRate));
    }

    withValidFrom(validFrom: string): this {
        this.validFromValue = validFrom;
        return this;
    }

    withValidTo(validTo: string): this {
        this.validToValue = validTo;
        return this;
    }

    withUsageLimit(usageLimit: string): this {
        this.usageLimitValue = usageLimit;
        return this;
    }

    withUsageLimit(usageLimit: number): this {
        return this.withUsageLimit(Converter.fromInteger(usageLimit) ?? '');
    }

    async execute(app: SystemDsl): Promise<void> {
        await app
            .shop()
            .publishCoupon()
            .couponCode(this.couponCodeValue)
            .discountRate(this.discountRateValue)
            .validFrom(this.validFromValue)
            .validTo(this.validToValue)
            .usageLimit(this.usageLimitValue)
            .execute()
            .then((r) => r.shouldSucceed());
    }
}
