import type { Optional } from '@optivem/commons/util';
import type { SystemDsl } from '../../system/SystemDsl.js';
import { GherkinDefaults } from '../GherkinDefaults.js';
import { BaseGivenBuilder } from './BaseGivenBuilder.js';
import type { GivenClause } from './GivenClause.js';

export class GivenClockBuilder extends BaseGivenBuilder {
    private time: Optional<string>;

    constructor(givenClause: GivenClause) {
        super(givenClause);
        this.withTime(GherkinDefaults.DEFAULT_TIME);
    }

    withTime(time: Optional<string>): this {
        this.time = time;
        return this;
    }

    async execute(app: SystemDsl): Promise<void> {
        await app
            .clock()
            .returnsTime()
            .time(this.time)
            .execute()
            .then((r) => r.shouldSucceed());
    }
}
