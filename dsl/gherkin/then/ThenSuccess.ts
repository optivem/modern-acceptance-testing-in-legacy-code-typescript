import type { ResponseVerification } from '@optivem/commons/dsl';
import type { SystemDsl } from '../../system/SystemDsl.js';
import type { ThenClause } from './Then.js';
import { ThenSuccessOrderVerifier } from './ThenOrder.js';
import { ThenSuccessCouponVerifier } from './ThenCoupon.js';

/**
 * Deferred success verifier.  Awaiting it runs shouldSucceed().
 *
 * .order() and .coupon() return deferred verifiers that also call shouldSucceed()
 * internally, so the entire chain resolves with a single await:
 *
 *   await scenario...then().shouldSucceed();                          // just verify success
 *   await scenario...then().shouldSucceed().order().hasBasePrice(100); // verify success + order
 */
export class ThenSuccessVerifier<
    TSuccessResponse,
    TSuccessVerification extends ResponseVerification<TSuccessResponse>
> implements PromiseLike<void> {

    constructor(
        private readonly app: SystemDsl,
        private readonly thenClause: ThenClause<TSuccessResponse, TSuccessVerification>
    ) {}

    and(): this {
        return this;
    }

    /**
     * Returns a deferred order verifier (success path).
     * The returned verifier collects has*() calls and executes everything on await.
     */
    order(orderNumber?: string): ThenSuccessOrderVerifier<TSuccessResponse, TSuccessVerification> {
        const thenClause = this.thenClause;
        const orderNumberFactory = async (): Promise<string> => {
            if (orderNumber != null) return orderNumber;
            const result = await thenClause.getExecutionResult();
            const context = result.getContext();
            const resolved = context.getOrderNumber();
            if (resolved == null) {
                throw new Error('Cannot verify order: no order number available from the executed operation');
            }
            return resolved;
        };
        return new ThenSuccessOrderVerifier<TSuccessResponse, TSuccessVerification>(this.thenClause, orderNumberFactory);
    }

    /**
     * Returns a deferred coupon verifier (success path).
     */
    coupon(couponCode?: string): ThenSuccessCouponVerifier<TSuccessResponse, TSuccessVerification> {
        const thenClause = this.thenClause;
        const couponCodeFactory = async (): Promise<string> => {
            if (couponCode != null) return couponCode;
            const result = await thenClause.getExecutionResult();
            const context = result.getContext();
            const resolved = context.getCouponCode();
            if (resolved == null) {
                throw new Error('Cannot verify coupon: no coupon code available from the executed operation');
            }
            return resolved;
        };
        return new ThenSuccessCouponVerifier<TSuccessResponse, TSuccessVerification>(this.thenClause, couponCodeFactory);
    }

    /** Makes the verifier awaitable — runs I/O and verifies success. Resolves to void. */
    then<TResult1 = void, TResult2 = never>(
        onfulfilled?: ((value: void) => TResult1 | PromiseLike<TResult1>) | null,
        onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
    ): PromiseLike<TResult1 | TResult2> {
        return this.executeSuccess().then(onfulfilled, onrejected);
    }

    private async executeSuccess(): Promise<void> {
        const result = await this.thenClause.getExecutionResult();
        result.getResult().shouldSucceed();
    }
}
