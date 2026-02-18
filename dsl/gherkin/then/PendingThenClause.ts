import type { ResponseVerification } from '@optivem/commons/dsl';
import type { ThenClause } from './ThenClause.js';
import type { ThenSuccessVerifier } from './ThenSuccessVerifier.js';
import type { ThenFailureVerifier } from './ThenFailureVerifier.js';

/**
 * Wraps a promise of ThenClause so callers can chain .shouldSucceed() / .shouldFail()
 * without awaiting first, e.g. await scenario.when().goToShop().then().shouldSucceed().
 */
export class PendingThenClause<
    TSuccessResponse,
    TSuccessVerification extends ResponseVerification<TSuccessResponse>
> {
    constructor(
        private readonly thenClausePromise: Promise<ThenClause<TSuccessResponse, TSuccessVerification>>
    ) {}

    shouldSucceed(): Promise<ThenSuccessVerifier<TSuccessResponse, TSuccessVerification>> {
        return this.thenClausePromise.then((c) => c.shouldSucceed());
    }

    shouldFail(): Promise<ThenFailureVerifier<TSuccessResponse, TSuccessVerification>> {
        return this.thenClausePromise.then((c) => c.shouldFail());
    }
}
