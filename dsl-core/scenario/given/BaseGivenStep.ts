import type { AppDsl } from '../../app/AppDsl.js';
import type { ThenGivenStagePort } from '@optivem/dsl-port/scenario/ScenarioDslPort.js';
import type { GivenClause } from './Given.js';
import type { WhenClause } from '../when/When.js';

export abstract class BaseGivenBuilder {
    constructor(protected readonly givenClause: GivenClause) {}

    and(): GivenClause {
        return this.givenClause;
    }

    when(): WhenClause {
        return this.givenClause.when();
    }

    then(): ThenGivenStagePort {
        return this.givenClause.then();
    }

    abstract execute(app: AppDsl): Promise<void>;
}
