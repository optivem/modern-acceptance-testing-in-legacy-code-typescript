import type { SystemDsl } from '../../system/SystemDsl.js';
import type { GivenClause } from './GivenClause.js';
import type { WhenClause } from '../when/WhenClause.js';

export abstract class BaseGivenBuilder {
    constructor(protected readonly givenClause: GivenClause) {}

    and(): GivenClause {
        return this.givenClause;
    }

    when(): Promise<WhenClause> {
        return this.givenClause.when();
    }

    abstract execute(app: SystemDsl): Promise<void>;
}
