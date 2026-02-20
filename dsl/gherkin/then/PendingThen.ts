import type { ResponseVerification } from '@optivem/commons/dsl';
import type { ThenClause } from './Then.js';
import type { ThenSuccessVerifier } from './ThenSuccess.js';
import type { ThenFailureVerifier } from './ThenFailure.js';

/**
 * Wraps a promise of ThenClause so callers can chain .shouldSucceed() / .shouldFail()
 * without awaiting first, e.g. await scenario.when().goToShop().then().shouldSucceed().
 */
export class PendingThen<
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