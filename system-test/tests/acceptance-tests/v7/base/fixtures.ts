/**
 * V7 acceptance test fixtures: same as smoke v7 but force STUB external system mode
 * (mirrors Java BaseAcceptanceTest.getFixedExternalSystemMode() = STUB).
 */
process.env.EXTERNAL_SYSTEM_MODE = process.env.EXTERNAL_SYSTEM_MODE ?? 'STUB';

import { test as base } from '@playwright/test';
import type { SystemDsl } from '@optivem/dsl/system/SystemDsl.js';
import { ScenarioDsl } from '@optivem/dsl/gherkin/ScenarioDsl.js';
import {
    scenarioChannelTest as sharedScenarioChannelTest,
    type ScenarioChannelFixtures as SharedScenarioChannelFixtures,
} from '@optivem/optivem-testing';
import { SystemDslFactory } from '../../../../SystemDslFactory.js';
import { getExternalSystemMode } from '../../../../test.config.js';

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

/**
 * When CHANNEL env is set (e.g. API or UI), only that channel is run.
 * When CHANNEL is not set or empty (cleared), run for all channels.
 * Matches reference: dotnet test -e CHANNEL=API so only API channel tests execute.
 */
export function scenarioChannelTest(
    _externalSystemMode: unknown,
    channelTypes: string[],
    testName: string,
    testFn: (fixtures: ScenarioChannelFixtures) => Promise<void>
): void {
    sharedScenarioChannelTest<ScenarioDsl>(
        (name, scenarioTestFn) => {
            test(name, async ({ scenario }) => {
                await scenarioTestFn({ scenario });
            });
        },
        channelTypes,
        testName,
        testFn
    );
}

/**
 * Channel(UI, API) - mirrors Java @Channel({ChannelType.UI, ChannelType.API}).
 */
export function Channel(
    ...channelTypes: string[]
): (testName: string, testFn: (fixtures: ScenarioChannelFixtures) => Promise<void>) => void {
    return (testName: string, testFn: (fixtures: ScenarioChannelFixtures) => Promise<void>) => {
        scenarioChannelTest(getExternalSystemMode(), channelTypes, testName, testFn);
    };
}
