import type { SystemDsl } from '../system/SystemDsl.js';
import { GivenClause } from './given/GivenClause.js';
import { WhenClause } from './when/WhenClause.js';

export class ScenarioDsl {
    private executed = false;

    constructor(private readonly app: SystemDsl) {}

    given(): GivenClause {
        this.ensureNotExecuted();
        return new GivenClause(this.app);
    }

    when(): WhenClause {
        this.ensureNotExecuted();
        return new WhenClause(this.app);
    }

    markAsExecuted(): void {
        this.executed = true;
    }

    private ensureNotExecuted(): void {
        if (this.executed) {
            throw new Error(
                'Scenario has already been executed. ' +
                    'Each test method should contain only ONE scenario execution (Given-When-Then). ' +
                    'Split multiple scenarios into separate test methods.'
            );
        }
    }
}
