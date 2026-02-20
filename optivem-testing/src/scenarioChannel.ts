import { ChannelContext } from './ChannelContext.js';

export interface ScenarioChannelFixtures<TScenario = unknown> {
    scenario: TScenario;
}

type ScenarioChannelTestFn<TScenario> = (fixtures: ScenarioChannelFixtures<TScenario>) => Promise<void>;
type RegisterScenarioTest<TScenario> = (
    testName: string,
    testFn: ScenarioChannelTestFn<TScenario>
) => void;

export function scenarioChannelTest<TScenario>(
    registerTest: RegisterScenarioTest<TScenario>,
    channelTypes: string[],
    testName: string,
    testFn: ScenarioChannelTestFn<TScenario>
): void {
    const channelEnv = process.env.CHANNEL;
    const channelsToRun =
        channelEnv != null && channelEnv !== ''
            ? channelTypes.filter((c) => c === channelEnv)
            : channelTypes;

    for (const channel of channelsToRun) {
        registerTest(`[${channel} Channel] ${testName}`, async (fixtures) => {
            try {
                ChannelContext.set(channel);
                await testFn(fixtures);
            } finally {
                ChannelContext.clear();
            }
        });
    }
}

export function createChannel<TScenario>(
    registerTest: RegisterScenarioTest<TScenario>,
    ...channelTypes: string[]
): (testName: string, testFn: ScenarioChannelTestFn<TScenario>) => void {
    return (testName: string, testFn: ScenarioChannelTestFn<TScenario>) => {
        scenarioChannelTest(registerTest, channelTypes, testName, testFn);
    };
}
