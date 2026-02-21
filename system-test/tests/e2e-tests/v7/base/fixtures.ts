/**
 * V7 e2e fixtures: app (SystemDsl) and scenario (ScenarioDsl).
 * Uses getExternalSystemMode() so e2e can run against REAL or STUB.
 */
import { test as base } from '@playwright/test';
import type { SystemDsl } from '@optivem/dsl/system/SystemDsl.js';
import { ScenarioDsl } from '@optivem/dsl/gherkin/ScenarioDsl.js';
import type { ScenarioChannelFixtures as SharedScenarioChannelFixtures } from '@optivem/optivem-testing';
import { SystemDslFactory } from '../../../../SystemDslFactory.js';
import { getExternalSystemMode } from '../../../../test.config.js';
import { createScenarioChannelHelpers } from '../../../shared/scenarioChannelHelpers.js';

export const test = base.extend<{ app: SystemDsl; scenario: ScenarioDsl }>({
    app: async ({}, use) => {
        const app = SystemDslFactory.create(getExternalSystemMode());
        await use(app);
        await app.close();
    },
    scenario: async ({ app }, use) => {
        const scenario = new ScenarioDsl(app);
        await use(scenario);
    },
});

export { expect } from '@playwright/test';

export type ScenarioChannelFixtures = SharedScenarioChannelFixtures<ScenarioDsl>;

const scenarioChannel = createScenarioChannelHelpers<ScenarioDsl>(
    (name, scenarioTestFn) => {
        test(name, async ({ scenario }) => {
            await scenarioTestFn({ scenario });
        });
    },
    getExternalSystemMode
);

export const scenarioChannelTest = scenarioChannel.scenarioChannelTest;
export const Channel = scenarioChannel.Channel;
