/**
 * V7 acceptance test fixtures: same as smoke v7 but force STUB external system mode
 * (mirrors Java BaseAcceptanceTest.getFixedExternalSystemMode() = STUB).
 */
process.env.EXTERNAL_SYSTEM_MODE = process.env.EXTERNAL_SYSTEM_MODE ?? 'STUB';

import { test as base } from '@playwright/test';
import type { SystemDsl } from '@optivem/dsl-core/system/SystemDsl.js';
import type { ScenarioDslPort } from '@optivem/dsl-api/scenario/ScenarioDslPort.js';
import { ScenarioDsl } from '@optivem/dsl-core/scenario/ScenarioDsl.js';
import {
    scenarioChannelTest as sharedScenarioChannelTest,
    withChannels as sharedWithChannels,
    type ScenarioChannelFixtures as SharedScenarioChannelFixtures,
} from '@optivem/optivem-testing';
import { SystemDslFactory, getDefaultExternalSystemMode } from '@optivem/test-infrastructure';

export const test = base.extend<{ app: SystemDsl; scenario: ScenarioDslPort }>({
    app: async ({}, use) => {
        const app = SystemDslFactory.create(getDefaultExternalSystemMode());
        await use(app);
        await app.close();
    },
    scenario: async ({ app }, use) => {
        const scenario = new ScenarioDsl(app);
        await use(scenario);
    },
});

export { expect } from '@playwright/test';

export type ScenarioChannelFixtures = SharedScenarioChannelFixtures<ScenarioDslPort>;

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
    sharedScenarioChannelTest<ScenarioDslPort>(
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
        scenarioChannelTest(getDefaultExternalSystemMode(), channelTypes, testName, testFn);
    };
}

/**
 * testEach(rows)(name, fn) - mirrors @DataSource / [ChannelInlineData] per-row test generation.
 * Name template supports $paramName substitution. Each row generates a separate test entry.
 */
export function testEach<T extends Record<string, unknown>>(
    cases: ReadonlyArray<T>
): (name: string, fn: (args: { scenario: ScenarioDslPort } & T) => Promise<void>) => void {
    return (name: string, fn: (args: { scenario: ScenarioDslPort } & T) => Promise<void>) => {
        for (const row of cases) {
            const testName = name.replaceAll(/\$(\w+)/g, (_, key) => {
                const value = row[key];
                if (typeof value === 'string') return value;
                if (typeof value === 'number') return value.toString();
                return '';
            });
            test(testName, async ({ scenario }) => {
                await fn({ scenario, ...row } as { scenario: ScenarioDslPort } & T);
            });
        }
    };
}

/**
 * withChannels(UI, API)(() => { test(...) }) - decorator-style wrapper.
 * Registers a describe block per channel so inner tests are standard test() calls.
 */
export function withChannels(...channelTypes: string[]): (block: () => void) => void {
    return sharedWithChannels(
        {
            describe: (name, callback) => test.describe(name, callback),
            beforeEach: (callback) => test.beforeEach(callback),
            afterEach: (callback) => test.afterEach(callback),
        },
        ...channelTypes
    );
}
