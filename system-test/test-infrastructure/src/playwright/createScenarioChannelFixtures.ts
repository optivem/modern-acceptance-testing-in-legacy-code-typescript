import { test as base, expect } from '@playwright/test';
import type { SystemDsl } from '@optivem/dsl-core/system/SystemDsl.js';
import {
    scenarioChannelTest as sharedScenarioChannelTest,
    withChannels as sharedWithChannels,
    type ScenarioChannelFixtures as SharedScenarioChannelFixtures,
} from '@optivem/optivem-testing';
import { getDefaultExternalSystemMode } from '../driver/configurationLoaderRegistry.js';
import { SystemDslFactory } from '../system/SystemDslFactory.js';

export interface ScenarioChannelFixtureBuilderOptions<TScenario> {
    createScenario: (app: SystemDsl) => TScenario;
    enableTestEachAlias?: boolean;
}

export interface ScenarioChannelFixtureBundle<TScenario> {
    test: any;
    expect: typeof expect;
    scenarioChannelTest: (
        _externalSystemMode: unknown,
        channelTypes: string[],
        testName: string,
        testFn: (fixtures: SharedScenarioChannelFixtures<TScenario>) => Promise<void>
    ) => void;
    Channel: (
        ...channelTypes: string[]
    ) => (testName: string, testFn: (fixtures: SharedScenarioChannelFixtures<TScenario>) => Promise<void>) => void;
    withChannels: (...channelTypes: string[]) => (block: () => void) => void;
    testEach: <TCase extends Record<string, unknown>>(
        cases: ReadonlyArray<TCase>
    ) => (name: string, fn: (args: { scenario: TScenario } & TCase) => Promise<void>) => void;
}

export function createScenarioChannelFixtures<TScenario>(
    options: ScenarioChannelFixtureBuilderOptions<TScenario>
): ScenarioChannelFixtureBundle<TScenario> {
    const test = base.extend<{ app: SystemDsl; scenario: TScenario }>({
        app: async ({}, use) => {
            const app = SystemDslFactory.create(getDefaultExternalSystemMode());
            await use(app);
            await app.close();
        },
        scenario: async ({ app }, use) => {
            const scenario = options.createScenario(app);
            await use(scenario);
        },
    });

    const scenarioChannelTest = (
        _externalSystemMode: unknown,
        channelTypes: string[],
        testName: string,
        testFn: (fixtures: SharedScenarioChannelFixtures<TScenario>) => Promise<void>
    ): void => {
        sharedScenarioChannelTest<TScenario>(
            (name, scenarioTestFn) => {
                test(name, async ({ scenario }) => {
                    await scenarioTestFn({ scenario });
                });
            },
            channelTypes,
            testName,
            testFn
        );
    };

    const Channel =
        (...channelTypes: string[]) =>
        (testName: string, testFn: (fixtures: SharedScenarioChannelFixtures<TScenario>) => Promise<void>): void => {
            scenarioChannelTest(getDefaultExternalSystemMode(), channelTypes, testName, testFn);
        };

    const testEach = <TCase extends Record<string, unknown>>(
        cases: ReadonlyArray<TCase>
    ): ((name: string, fn: (args: { scenario: TScenario } & TCase) => Promise<void>) => void) => {
        return (name: string, fn: (args: { scenario: TScenario } & TCase) => Promise<void>): void => {
            for (const row of cases) {
                const testName = name.replaceAll(/\$(\w+)/g, (_, key) => {
                    const value = row[key];
                    if (typeof value === 'string') return value;
                    if (typeof value === 'number') return value.toString();
                    return '';
                });
                test(testName, async ({ scenario }) => {
                    await fn({ scenario, ...row } as { scenario: TScenario } & TCase);
                });
            }
        };
    };

    if (options.enableTestEachAlias) {
        (test as { each?: typeof testEach }).each = testEach;
    }

    const withChannels = (...channelTypes: string[]): ((block: () => void) => void) => {
        return sharedWithChannels(
            {
                describe: (name, callback) => test.describe(name, callback),
                beforeEach: (callback) => test.beforeEach(callback),
                afterEach: (callback) => test.afterEach(callback),
            },
            ...channelTypes
        );
    };

    return {
        test,
        expect,
        scenarioChannelTest,
        Channel,
        withChannels,
        testEach,
    };
}