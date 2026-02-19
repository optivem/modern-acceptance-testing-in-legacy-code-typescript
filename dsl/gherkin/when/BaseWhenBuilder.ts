import type { ResponseVerification } from '@optivem/commons/dsl';
import type { SystemDsl } from '../../system/SystemDsl.js';
import type { ExecutionResult } from '../ExecutionResult.js';
import { ThenClause } from '../then/ThenClause.js';
import { PendingThenClause } from '../then/PendingThenClause.js';

export abstract class BaseWhenBuilder<
    TSuccessResponse,
    TSuccessVerification extends ResponseVerification<TSuccessResponse>
> {
    constructor(protected readonly app: SystemDsl, private readonly setup?: () => Promise<void>) {}

    then(): PendingThenClause<TSuccessResponse, TSuccessVerification> {
        const thenClausePromise = (this.setup ? this.setup() : Promise.resolve())
            .then(() => this.execute(this.app))
            .then((result) => new ThenClause(this.app, result));
        return new PendingThenClause(thenClausePromise);
    }

    protected abstract execute(app: SystemDsl): Promise<ExecutionResult<TSuccessResponse, TSuccessVerification>>;
}
