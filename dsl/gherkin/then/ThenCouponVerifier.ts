import type { ResponseVerification } from '@optivem/commons/dsl';
import type { SystemDsl } from '../../system/SystemDsl.js';
import type { ExecutionResultContext } from '../ExecutionResultContext.js';
import type { BrowseCouponsVerification } from '@optivem/core/shop/dsl/usecases/coupons/BrowseCouponsVerification.js';

export class ThenCouponVerifier<
    TSuccessResponse,
    TSuccessVerification extends ResponseVerification<TSuccessResponse>
> {
    private constructor(
        private readonly app: SystemDsl,
        private readonly executionResult: ExecutionResultContext,
        private readonly couponCode: string,
        private readonly successVerification: TSuccessVerification | null,
        private readonly verification: BrowseCouponsVerification
    ) {}

    and(): this {
        return this;
    }

    static async create<TSuccessResponse, TSuccessVerification extends ResponseVerification<TSuccessResponse>>(
        app: SystemDsl,
        executionResult: ExecutionResultContext,
        couponCode: string,
        successVerification: TSuccessVerification | null
    ): Promise<ThenCouponVerifier<TSuccessResponse, TSuccessVerification>> {
        const browseResult = await app
            .shop()
            .browseCoupons()
            .execute();
        const verification = browseResult.shouldSucceed();
        verification.hasCouponWithCode(couponCode);
        return new ThenCouponVerifier(
            app,
            executionResult,
            couponCode,
            successVerification,
            verification
        );
    }

    hasDiscountRate(discountRate: number): this {
        this.verification.couponHasDiscountRate(this.couponCode, discountRate);
        return this;
    }

    isValidFrom(validFrom: string): this {
        this.verification.couponHasValidFrom(this.couponCode, validFrom);
        return this;
    }

    isValidTo(validTo: string): this {
        this.verification.couponHasValidTo(this.couponCode, validTo);
        return this;
    }

    hasUsageLimit(usageLimit: number): this {
        this.verification.couponHasUsageLimit(this.couponCode, usageLimit);
        return this;
    }

    hasUsedCount(expectedUsedCount: number): this {
        this.verification.couponHasUsedCount(this.couponCode, expectedUsedCount);
        return this;
    }
}
