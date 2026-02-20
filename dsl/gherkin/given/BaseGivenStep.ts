import type { SystemDsl } from '../../system/SystemDsl.js';
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

    abstract execute(app: SystemDsl): Promise<void>;
}
