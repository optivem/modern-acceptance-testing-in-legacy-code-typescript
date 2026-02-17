import { ShopDriver } from '../../../driver/ShopDriver.js';
import { BaseShopCommand } from '../base/BaseShopCommand.js';
import { ShopUseCaseResult } from '../base/ShopUseCaseResult.js';
import { UseCaseContext } from '@optivem/commons/dsl';
import { VoidVerification } from '@optivem/commons/dsl';
import type { Optional } from '@optivem/commons/util';
import type { PublishCouponRequest } from '../../../commons/dtos/coupons/index.js';

export class PublishCoupon extends BaseShopCommand<void, VoidVerification> {
    private couponCodeParamAlias: string | null | undefined;
    private discountRateValue: string | null | undefined;
    private validFromValue: string | null | undefined;
    private validToValue: string | null | undefined;
    private usageLimitValue: string | null | undefined;

    constructor(driver: ShopDriver, context: UseCaseContext) {
        super(driver, context);
    }

    couponCode(couponCodeParamAlias: Optional<string>): PublishCoupon {
        this.couponCodeParamAlias = couponCodeParamAlias;
        return this;
    }

    discountRate(discountRate: number): PublishCoupon;
    discountRate(discountRate: string): PublishCoupon;
    discountRate(discountRate: Optional<number | string>): PublishCoupon {
        this.discountRateValue = discountRate === undefined || discountRate === null ? undefined : typeof discountRate === 'number' ? String(discountRate) : discountRate;
        return this;
    }

    validFrom(validFrom: Optional<string>): PublishCoupon {
        this.validFromValue = validFrom;
        return this;
    }

    validTo(validTo: Optional<string>): PublishCoupon {
        this.validToValue = validTo;
        return this;
    }

    usageLimit(usageLimit: Optional<string>): PublishCoupon {
        this.usageLimitValue = usageLimit;
        return this;
    }

    async execute(): Promise<ShopUseCaseResult<void, VoidVerification>> {
        const couponCode = this.context.getParamValue(this.couponCodeParamAlias);
        const request: PublishCouponRequest = {
            code: couponCode,
            discountRate: this.discountRateValue,
            validFrom: this.validFromValue,
            validTo: this.validToValue,
            usageLimit: this.usageLimitValue,
        };
        const result = await this.driver.coupons().publishCoupon(request);
        return new ShopUseCaseResult(result, this.context, (_r, ctx) => new VoidVerification(undefined, ctx));
    }
}
