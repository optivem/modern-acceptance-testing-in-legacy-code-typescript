import { Converter } from '@optivem/commons/util';
import type { SystemDsl } from '../../system/SystemDsl.js';
import { GherkinDefaults } from '../GherkinDefaults.js';
import { BaseGivenBuilder } from './BaseGivenBuilder.js';
import type { GivenClause } from './GivenClause.js';

export class GivenCouponBuilder extends BaseGivenBuilder {
    private couponCodeValue: string = GherkinDefaults.DEFAULT_COUPON_CODE;
    private discountRateValue: string = GherkinDefaults.DEFAULT_DISCOUNT_RATE;
    private validFromValue: string = GherkinDefaults.EMPTY;
    private validToValue: string = GherkinDefaults.EMPTY;
    private usageLimitValue: string = GherkinDefaults.EMPTY;

    constructor(givenClause: GivenClause) {
        super(givenClause);
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
