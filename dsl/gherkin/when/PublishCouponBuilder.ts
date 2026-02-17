import { VoidVerification } from '@optivem/commons/dsl';
import { Converter } from '@optivem/commons/util';
import type { SystemDsl } from '../../system/SystemDsl.js';
import { ExecutionResult } from '../ExecutionResult.js';
import { ExecutionResultBuilder } from '../ExecutionResultBuilder.js';
import { GherkinDefaults } from '../GherkinDefaults.js';
import { BaseWhenBuilder } from './BaseWhenBuilder.js';

export class PublishCouponBuilder extends BaseWhenBuilder<void, VoidVerification> {
    private couponCodeValue: string;
    private discountRateValue: string;
    private validFromValue: string | undefined;
    private validToValue: string | undefined;
    private usageLimitValue: string | undefined;

    constructor(app: SystemDsl) {
        super(app);
        this.withCouponCode(GherkinDefaults.DEFAULT_COUPON_CODE);
        this.withDiscountRate(GherkinDefaults.DEFAULT_DISCOUNT_RATE);
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
        return this.withUsageLimit(String(usageLimit));
    }

    protected override async execute(
        app: SystemDsl
    ): Promise<ExecutionResult<void, VoidVerification>> {
        const result = await app
            .shop()
            .publishCoupon()
            .couponCode(this.couponCodeValue)
            .discountRate(this.discountRateValue)
            .validFrom(this.validFromValue)
            .validTo(this.validToValue)
            .usageLimit(this.usageLimitValue)
            .execute();

        return new ExecutionResultBuilder(result)
            .couponCode(this.couponCodeValue)
            .build();
    }
}
