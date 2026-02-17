import type { ResponseVerification } from '@optivem/commons/dsl';
import type { SystemDsl } from '../../system/SystemDsl.js';
import type { ExecutionResultContext } from '../ExecutionResultContext.js';
import type { ThenOrderVerifier } from './ThenOrderVerifier.js';
import type { ThenCouponVerifier } from './ThenCouponVerifier.js';

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

    order(orderNumber: string): Promise<ThenOrderVerifier<TSuccessResponse, TSuccessVerification>>;
    order(): Promise<ThenOrderVerifier<TSuccessResponse, TSuccessVerification>>;
    async order(
        orderNumber?: string
    ): Promise<ThenOrderVerifier<TSuccessResponse, TSuccessVerification>> {
        const resolved =
            orderNumber ?? this.executionResult.getOrderNumber() ?? (() => {
                throw new Error(
                    'Cannot verify order: no order number available from the executed operation'
                );
            })();
        const { ThenOrderVerifier } = await import('./ThenOrderVerifier.js');
        return ThenOrderVerifier.create(this.app, this.executionResult, resolved, this.successVerification);
    }

    coupon(couponCode: string): Promise<ThenCouponVerifier<TSuccessResponse, TSuccessVerification>>;
    coupon(): Promise<ThenCouponVerifier<TSuccessResponse, TSuccessVerification>>;
    async coupon(
        couponCode?: string
    ): Promise<ThenCouponVerifier<TSuccessResponse, TSuccessVerification>> {
        const resolved =
            couponCode ?? this.executionResult.getCouponCode() ?? (() => {
                throw new Error(
                    'Cannot verify coupon: no coupon code available from the executed operation'
                );
            })();
        const { ThenCouponVerifier } = await import('./ThenCouponVerifier.js');
        return ThenCouponVerifier.create(this.app, this.executionResult, resolved, this.successVerification);
    }
}
