import {
    scenarioChannelTest as sharedScenarioChannelTest,
    type ScenarioChannelFixtures as SharedScenarioChannelFixtures,
} from '@optivem/optivem-testing';

type RegisterScenarioTest<TScenario> = (
    testName: string,
    testFn: (fixtures: SharedScenarioChannelFixtures<TScenario>) => Promise<void>
) => void;

export function createScenarioChannelHelpers<TScenario>(
    registerTest: RegisterScenarioTest<TScenario>,
    getExternalSystemMode: () => unknown
): {
    scenarioChannelTest: (
        _externalSystemMode: unknown,
        channelTypes: string[],
        testName: string,
        testFn: (fixtures: SharedScenarioChannelFixtures<TScenario>) => Promise<void>
    ) => void;
    Channel: (
        ...channelTypes: string[]
    ) => (testName: string, testFn: (fixtures: SharedScenarioChannelFixtures<TScenario>) => Promise<void>) => void;
} {
    const scenarioChannelTest = (
        _externalSystemMode: unknown,
        channelTypes: string[],
        testName: string,
        testFn: (fixtures: SharedScenarioChannelFixtures<TScenario>) => Promise<void>
    ): void => {
        sharedScenarioChannelTest<TScenario>(registerTest, channelTypes, testName, testFn);
    };

    const Channel =
        (...channelTypes: string[]) =>
        (testName: string, testFn: (fixtures: SharedScenarioChannelFixtures<TScenario>) => Promise<void>): void => {
            scenarioChannelTest(getExternalSystemMode(), channelTypes, testName, testFn);
        };

    return { scenarioChannelTest, Channel };
}