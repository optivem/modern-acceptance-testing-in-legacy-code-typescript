import { test as base } from '@playwright/test';
import type { ExternalSystemMode } from '@optivem/commons/dsl';
import type { SystemDsl } from '@optivem/dsl/system/SystemDsl.js';
import { ScenarioDsl } from '@optivem/dsl/gherkin/ScenarioDsl.js';
import { ChannelContext } from '@optivem/optivem-testing';
import { SystemDslFactory } from '../../../SystemDslFactory.js';
import { getExternalSystemMode } from '../../../test.config.js';

/**
 * V6 base fixtures: app (SystemDsl) and scenario (ScenarioDsl). Shop uses scenario; external uses app.
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

export interface ScenarioChannelFixtures {
    scenario: ScenarioDsl;
}

/**
 * Run the same scenario-based test for each channel (UI/API).
 */
export function scenarioChannelTest(
    _externalSystemMode: ExternalSystemMode,
    channelTypes: string[],
    testName: string,
    testFn: (fixtures: ScenarioChannelFixtures) => Promise<void>
): void {
    for (const channel of channelTypes) {
        test(`[${channel} Channel] ${testName}`, async ({ scenario }) => {
            try {
                ChannelContext.set(channel);
                await testFn({ scenario });
            } finally {
                ChannelContext.clear();
            }
        });
    }
}

export function Channel(
    ...channelTypes: string[]
): (testName: string, testFn: (fixtures: ScenarioChannelFixtures) => Promise<void>) => void {
    return (testName: string, testFn: (fixtures: ScenarioChannelFixtures) => Promise<void>) => {
        scenarioChannelTest(getExternalSystemMode(), channelTypes, testName, testFn);
    };
}
