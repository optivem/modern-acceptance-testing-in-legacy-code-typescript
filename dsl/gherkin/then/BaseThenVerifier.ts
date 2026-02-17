import type { ResponseVerification } from '@optivem/commons/dsl';
import type { SystemDsl } from '../../system/SystemDsl.js';
import type { ExecutionResultContext } from '../ExecutionResultContext.js';
import { ThenOrderVerifier } from './ThenOrderVerifier.js';
import { ThenCouponVerifier } from './ThenCouponVerifier.js';

export abstract class BaseThenVerifier<
    TSuccessResponse,
    TSuccessVerification extends ResponseVerification<TSuccessResponse>
> {
    constructor(
        protected readonly app: SystemDsl,
        protected readonly executionResult: ExecutionResultContext,
        protected readonly successVerification: TSuccessVerification | null
    ) {}

    and(): this {
        return this;
    }

    async order(orderNumber: string): Promise<ThenOrderVerifier<TSuccessResponse, TSuccessVerification>> {
        return ThenOrderVerifier.create(
            this.app,
            this.executionResult,
            orderNumber,
            this.successVerification
        );
    }

    async order(): Promise<ThenOrderVerifier<TSuccessResponse, TSuccessVerification>> {
        const orderNumber = this.executionResult.getOrderNumber();
        if (orderNumber == null) {
            throw new Error(
                'Cannot verify order: no order number available from the executed operation'
            );
        }
        return this.order(orderNumber);
    }

    async coupon(
        couponCode: string
    ): Promise<ThenCouponVerifier<TSuccessResponse, TSuccessVerification>> {
        return ThenCouponVerifier.create(
            this.app,
            this.executionResult,
            couponCode,
            this.successVerification
        );
    }

    async coupon(): Promise<ThenCouponVerifier<TSuccessResponse, TSuccessVerification>> {
        const couponCode = this.executionResult.getCouponCode();
        if (couponCode == null) {
            throw new Error(
                'Cannot verify coupon: no coupon code available from the executed operation'
            );
        }
        return this.coupon(couponCode);
    }
}
