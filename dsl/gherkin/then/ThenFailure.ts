import type { ResponseVerification } from '@optivem/commons/dsl';
import type { SystemDsl } from '../../system/SystemDsl.js';
import type { SystemErrorFailureVerification } from '@optivem/core/shop/dsl/usecases/base/SystemErrorFailureVerification.js';
import type { ThenClause } from './Then.js';
import { ThenFailureOrderVerifier } from './ThenOrder.js';
import { ThenFailureCouponVerifier } from './ThenCoupon.js';

/**
 * Returned by .shouldFail().and() — bridges to .order() / .coupon() on the failure path.
 */
class ThenFailureAnd<
    TSuccessResponse,
    TSuccessVerification extends ResponseVerification<TSuccessResponse>
> {
    constructor(
        private readonly app: SystemDsl,
        private readonly thenClause: ThenClause<TSuccessResponse, TSuccessVerification>,
        private readonly failureAssertions: Array<(v: SystemErrorFailureVerification) => void>
    ) {}

    order(orderNumber?: string): ThenFailureOrderVerifier<TSuccessResponse, TSuccessVerification> {
        const thenClause = this.thenClause;
        const assertions = this.failureAssertions;
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
        return new ThenFailureOrderVerifier<TSuccessResponse, TSuccessVerification>(thenClause, assertions, orderNumberFactory);
    }

    coupon(couponCode?: string): ThenFailureCouponVerifier<TSuccessResponse, TSuccessVerification> {
        const thenClause = this.thenClause;
        const assertions = this.failureAssertions;
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
        return new ThenFailureCouponVerifier<TSuccessResponse, TSuccessVerification>(thenClause, assertions, couponCodeFactory);
    }
}

/**
 * Deferred failure verifier. Collects ErrorMessage/FieldErrorMessage assertions before
 * awaiting — the same deferred-assertion pattern as .NET's ThenFailureVerifier<T>.
 *
 * .and() returns a bridge to .order() / .coupon() for the failure path, enabling
 * single-chain patterns like:
 *   await ...then().shouldFail().errorMessage('...').and().order().hasStatus(OrderStatus.PLACED);
 */
export class ThenFailureVerifier<
    TSuccessResponse,
    TSuccessVerification extends ResponseVerification<TSuccessResponse>
> implements PromiseLike<void> {

    private readonly assertions: Array<(v: SystemErrorFailureVerification) => void> = [];

    constructor(
        private readonly app: SystemDsl,
        private readonly thenClause: ThenClause<TSuccessResponse, TSuccessVerification>
    ) {}

    errorMessage(expectedMessage: string): this {
        this.assertions.push((v) => v.errorMessage(expectedMessage));
        return this;
    }

    fieldErrorMessage(expectedField: string, expectedMessage: string): this {
        this.assertions.push((v) => v.fieldErrorMessage(expectedField, expectedMessage));
        return this;
    }

    /**
     * Returns a bridge to .order() / .coupon() that carries the collected failure assertions.
     */
    and(): ThenFailureAnd<TSuccessResponse, TSuccessVerification> {
        return new ThenFailureAnd<TSuccessResponse, TSuccessVerification>(this.app, this.thenClause, this.assertions);
    }

    /** Makes the verifier awaitable — runs I/O and applies all collected assertions. */
    then<TResult1 = void, TResult2 = never>(
        onfulfilled?: ((value: void) => TResult1 | PromiseLike<TResult1>) | null,
        onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
    ): PromiseLike<TResult1 | TResult2> {
        return this.executeAssertions().then(onfulfilled, onrejected);
    }

    private async executeAssertions(): Promise<void> {
        const result = await this.thenClause.getExecutionResult();
        const failureVerification = result.getResult().shouldFail();
        for (const assertion of this.assertions) {
            assertion(failureVerification);
        }
    }
}
