import type { ResponseVerification } from '@optivem/commons/dsl';
import type { SystemDsl } from '../../system/SystemDsl.js';
import type { ExecutionResultContext } from '../ExecutionResultContext.js';
import { BaseThenVerifier } from './BaseThenVerifier.js';

export class ThenSuccessVerifier<
    TSuccessResponse,
    TSuccessVerification extends ResponseVerification<TSuccessResponse>
> extends BaseThenVerifier<TSuccessResponse, TSuccessVerification> {
    constructor(
        app: SystemDsl,
        executionResult: ExecutionResultContext,
        successVerification: TSuccessVerification
    ) {
        super(app, executionResult, successVerification);
    }
}
