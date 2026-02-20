import type { ResponseVerification } from '@optivem/commons/dsl';
import type { SystemDsl } from '../../system/SystemDsl.js';
import type { ExecutionResult } from '../ExecutionResult.js';
import { ThenSuccessVerifier } from './ThenSuccess.js';
import { ThenFailureVerifier } from './ThenFailure.js';

export interface ThenInternal<
    TSuccessResponse,
    TSuccessVerification extends ResponseVerification<TSuccessResponse>
> {
    shouldSucceed(): ThenSuccessVerifier<TSuccessResponse, TSuccessVerification>;
    shouldFail(): ThenFailureVerifier<TSuccessResponse, TSuccessVerification>;
}

class ThenInternalImpl<
    TSuccessResponse,
    TSuccessVerification extends ResponseVerification<TSuccessResponse>
> implements ThenInternal<TSuccessResponse, TSuccessVerification> {
    constructor(
        private readonly app: SystemDsl,
        private readonly executionResult: ExecutionResult<TSuccessResponse, TSuccessVerification>
    ) {}

    shouldSucceed(): ThenSuccessVerifier<TSuccessResponse, TSuccessVerification> {
        if (this.executionResult == null) {
            throw new Error('Cannot verify success: no operation was executed');
        }
        const successVerification = this.executionResult.getResult().shouldSucceed();
        return new ThenSuccessVerifier(
            this.app,
            this.executionResult.getContext(),
            successVerification
        );
    }

    shouldFail(): ThenFailureVerifier<TSuccessResponse, TSuccessVerification> {
        return new ThenFailureVerifier(
            this.app,
            this.executionResult.getContext(),
            this.executionResult.getResult()
        );
    }
}

export function createThenInternal<
    TSuccessResponse,
    TSuccessVerification extends ResponseVerification<TSuccessResponse>
>(
    app: SystemDsl,
    executionResult: ExecutionResult<TSuccessResponse, TSuccessVerification>
): ThenInternal<TSuccessResponse, TSuccessVerification> {
    return new ThenInternalImpl(app, executionResult);
}

/**
 * Wraps a promise of ThenInternal so callers can chain .shouldSucceed() / .shouldFail()
 * without awaiting first, e.g. await scenario.when().goToShop().then().shouldSucceed().
 */
export class PendingThen<
    TSuccessResponse,
    TSuccessVerification extends ResponseVerification<TSuccessResponse>
> {
    constructor(
        private readonly thenPromise: Promise<ThenInternal<TSuccessResponse, TSuccessVerification>>
    ) {}

    shouldSucceed(): Promise<ThenSuccessVerifier<TSuccessResponse, TSuccessVerification>> {
        return this.thenPromise.then((c) => c.shouldSucceed());
    }

    shouldFail(): Promise<ThenFailureVerifier<TSuccessResponse, TSuccessVerification>> {
        return this.thenPromise.then((c) => c.shouldFail());
    }
}
