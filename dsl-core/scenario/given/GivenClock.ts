import type { Optional } from '@optivem/commons';
import type { AppDsl } from '../../app/AppDsl.js';
import { GherkinDefaults } from '../GherkinDefaults.js';
import { BaseGivenBuilder } from './BaseGivenStep.js';
import type { GivenClause } from './Given.js';

export class GivenClockBuilder extends BaseGivenBuilder {
    private time: Optional<string>;

    constructor(givenClause: GivenClause) {
        super(givenClause);
        this.time = GherkinDefaults.DEFAULT_TIME;
    }

    withTime(time: Optional<string>): this {
        this.time = time;
        return this;
    }

    async execute(app: AppDsl): Promise<void> {
        await app
            .clock()
            .returnsTime()
            .time(this.time)
            .execute()
            .then((r) => r.shouldSucceed());
    }
}
