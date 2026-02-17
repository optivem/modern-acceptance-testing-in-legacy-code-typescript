import type { SystemDsl } from '../../system/SystemDsl.js';
import { GherkinDefaults } from '../GherkinDefaults.js';
import { BaseGivenBuilder } from './BaseGivenBuilder.js';
import type { GivenClause } from './GivenClause.js';

export class GivenClockBuilder extends BaseGivenBuilder {
    private time: string | null | undefined;

    constructor(givenClause: GivenClause) {
        super(givenClause);
        this.withTime(GherkinDefaults.DEFAULT_TIME);
    }

    withTime(time: string | null | undefined): this {
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
