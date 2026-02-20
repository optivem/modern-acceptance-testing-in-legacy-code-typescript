import { Converter } from '@optivem/commons/util';
import type { Optional } from '@optivem/commons/util';
import type { SystemDsl } from '../../system/SystemDsl.js';
import { GherkinDefaults } from '../GherkinDefaults.js';
import { BaseGivenBuilder } from './BaseGivenStep.js';
import type { GivenClause } from './Given.js';

export class GivenCouponBuilder extends BaseGivenBuilder {
    private couponCode: Optional<string>;
    private discountRate: Optional<string>;
    private validFrom: Optional<string>;
    private validTo: Optional<string>;
    private usageLimit: Optional<string>;

    constructor(givenClause: GivenClause) {
        super(givenClause);
        this.withCouponCode(GherkinDefaults.DEFAULT_COUPON_CODE);
        this.withDiscountRate(GherkinDefaults.DEFAULT_DISCOUNT_RATE);
        this.withValidFrom(GherkinDefaults.EMPTY);
        this.withValidTo(GherkinDefaults.EMPTY);
        this.withUsageLimit(GherkinDefaults.EMPTY);
    }

    withCouponCode(couponCode: Optional<string>): this {
        this.couponCode = couponCode;
        return this;
    }

    withDiscountRate(discountRate: Optional<string>): this;
    withDiscountRate(discountRate: number): this;
    withDiscountRate(discountRate: Optional<string> | number): this {
        this.discountRate = typeof discountRate === 'number' ? Converter.fromDouble(discountRate) : discountRate;
        return this;
    }

    withValidFrom(validFrom: Optional<string>): this {
        this.validFrom = validFrom;
        return this;
    }

    withValidTo(validTo: Optional<string>): this {
        this.validTo = validTo;
        return this;
    }

    withUsageLimit(usageLimit: Optional<string>): this;
    withUsageLimit(usageLimit: number): this;
    withUsageLimit(usageLimit: Optional<string> | number): this {
        this.usageLimit = typeof usageLimit === 'number' ? (Converter.fromInteger(usageLimit) ?? undefined) : usageLimit;
        return this;
    }

    async execute(app: SystemDsl): Promise<void> {
        await app.shop()
            .publishCoupon()
            .couponCode(this.couponCode)
            .discountRate(this.discountRate)
            .validFrom(this.validFrom)
            .validTo(this.validTo)
            .usageLimit(this.usageLimit)
            .execute()
            .then((r) => r.shouldSucceed());
    }
}
