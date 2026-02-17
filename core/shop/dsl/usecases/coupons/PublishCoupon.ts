import { ShopDriver } from '../../../driver/ShopDriver.js';
import { BaseShopCommand } from '../base/BaseShopCommand.js';
import { ShopUseCaseResult } from '../base/ShopUseCaseResult.js';
import { UseCaseContext } from '@optivem/commons/dsl';
import { VoidVerification } from '@optivem/commons/dsl';
import type { PublishCouponRequest } from '../../../commons/dtos/coupons/index.js';

export class PublishCoupon extends BaseShopCommand<void, VoidVerification> {
    private couponCodeParamAlias?: string;
    private discountRateValue?: string;
    private validFromValue?: string;
    private validToValue?: string;
    private usageLimitValue?: string;

    constructor(driver: ShopDriver, context: UseCaseContext) {
        super(driver, context);
    }

    couponCode(couponCodeParamAlias: string): PublishCoupon {
        this.couponCodeParamAlias = couponCodeParamAlias;
        return this;
    }

    discountRate(discountRate: number): PublishCoupon;
    discountRate(discountRate: string): PublishCoupon;
    discountRate(discountRate: number | string): PublishCoupon {
        this.discountRateValue = typeof discountRate === 'number' ? String(discountRate) : discountRate;
        return this;
    }

    validFrom(validFrom: string): PublishCoupon {
        this.validFromValue = validFrom;
        return this;
    }

    validTo(validTo: string): PublishCoupon {
        this.validToValue = validTo;
        return this;
    }

    usageLimit(usageLimit: string): PublishCoupon {
        this.usageLimitValue = usageLimit;
        return this;
    }

    async execute(): Promise<ShopUseCaseResult<void, VoidVerification>> {
        const couponCode = this.context.getParamValue(this.couponCodeParamAlias!);
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
