import type { ResponseVerification } from '@optivem/commons/dsl';
import type { SystemDsl } from '../../system/SystemDsl.js';
import type { ExecutionResult } from '../ExecutionResult.js';
import { ThenSuccessVerifier } from './ThenSuccessVerifier.js';
import { ThenFailureVerifier } from './ThenFailureVerifier.js';

export class ThenClause<
    TSuccessResponse,
    TSuccessVerification extends ResponseVerification<TSuccessResponse>
> {
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
