import { ScenarioDsl } from '@optivem/dsl-core/scenario/ScenarioDsl.js';
import {
    createScenarioChannelFixtures,
} from '@optivem/test-infrastructure';
import type { ScenarioChannelFixtures as SharedScenarioChannelFixtures } from '@optivem/test-infrastructure';

/**
 * V6 base fixtures: app (SystemDsl) and scenario (ScenarioDsl). Shop uses scenario; external uses app.
 */
const fixtures = createScenarioChannelFixtures<ScenarioDsl>({
    createScenario: (app) => new ScenarioDsl(app),
});

export const {
    test,
    expect,
    scenarioChannelTest,
    Channel,
    withChannels,
    testEach,
} = fixtures;

export type ScenarioChannelFixtures = SharedScenarioChannelFixtures<ScenarioDsl>;
