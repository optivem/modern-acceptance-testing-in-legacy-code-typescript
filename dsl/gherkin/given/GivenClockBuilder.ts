import type { SystemDsl } from '../../system/SystemDsl.js';
import { GherkinDefaults } from '../GherkinDefaults.js';
import { BaseGivenBuilder } from './BaseGivenBuilder.js';
import type { GivenClause } from './GivenClause.js';

export class GivenClockBuilder extends BaseGivenBuilder {
    private timeValue: string = GherkinDefaults.DEFAULT_TIME;

    constructor(givenClause: GivenClause) {
        super(givenClause);
    }

    withTime(time: string): this {
        this.timeValue = time;
        return this;
    }

    async execute(app: SystemDsl): Promise<void> {
        await app
            .clock()
            .returnsTime()
            .time(this.timeValue)
            .execute()
            .then((r) => r.shouldSucceed());
    }
}
