import type { ResponseVerification } from '@optivem/commons/dsl';
import type { SystemDsl } from '../../system/SystemDsl.js';
import type { ExecutionResult } from '../ExecutionResult.js';
import { ThenClause } from '../then/Then.js';
import { PendingThen } from '../then/PendingThen.js';

export abstract class BaseWhenBuilder<
    TSuccessResponse,
    TSuccessVerification extends ResponseVerification<TSuccessResponse>
> {
    constructor(protected readonly app: SystemDsl, private readonly setup?: () => Promise<void>) {}

    then(): PendingThen<TSuccessResponse, TSuccessVerification> {
        const thenClausePromise = (this.setup ? this.setup() : Promise.resolve())
            .then(() => this.execute(this.app))
            .then((result) => new ThenClause(this.app, result));
        return new PendingThen(thenClausePromise);
    }

    protected abstract execute(app: SystemDsl): Promise<ExecutionResult<TSuccessResponse, TSuccessVerification>>;
}
