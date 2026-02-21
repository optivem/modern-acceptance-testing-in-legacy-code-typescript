import { test as base } from '@playwright/test';
import type { SystemDsl } from '@optivem/dsl/system/SystemDsl.js';
import { ScenarioDsl } from '@optivem/dsl/gherkin/ScenarioDsl.js';
import {
    scenarioChannelTest as sharedScenarioChannelTest,
    type ScenarioChannelFixtures as SharedScenarioChannelFixtures,
} from '@optivem/optivem-testing';
import { SystemDslFactory } from '../../../SystemDslFactory.js';
import { getExternalSystemMode } from '../../../test.config.js';

/**
 * V7 base fixtures: provides app (SystemDsl) and scenario (ScenarioDsl).
 * Lifecycle: create app from configuration, scenario = new ScenarioDsl(app); tearDown close(app).
 */
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

/** Fixtures passed to scenarioChannelTest / Channel callback. */
export type ScenarioChannelFixtures = SharedScenarioChannelFixtures<ScenarioDsl>;

/**
 * Run the same scenario-based test for each channel (UI/API). Same header style as shopChannelTest.
 * Sets ChannelContext before the test and clears it in finally.
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
 * Curried helper that mirrors Java's @Channel(ChannelType.UI, ChannelType.API) on the test method.
 * Usage: Channel(ChannelType.UI, ChannelType.API)('should be able to go to shop', async ({ scenario }) => { ... });
 * Registers one test per channel; uses getExternalSystemMode() and scenario fixtures.
 */
export function Channel(
    ...channelTypes: string[]
): (testName: string, testFn: (fixtures: ScenarioChannelFixtures) => Promise<void>) => void {
    return (testName: string, testFn: (fixtures: ScenarioChannelFixtures) => Promise<void>) => {
        scenarioChannelTest(getExternalSystemMode(), channelTypes, testName, testFn);
    };
}
