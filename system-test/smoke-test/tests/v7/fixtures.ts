import { ScenarioDsl } from '@optivem/dsl-core/scenario/ScenarioDsl.js';
import {
    createScenarioChannelFixtures,
} from '@optivem/test-infrastructure';
import type { ScenarioChannelFixtures as SharedScenarioChannelFixtures } from '@optivem/test-infrastructure';

/**
 * V7 base fixtures: provides app (SystemDsl) and scenario (ScenarioDsl).
 * Lifecycle: create app from configuration, scenario = new ScenarioDsl(app); tearDown close(app).
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

/** Fixtures passed to scenarioChannelTest / Channel callback. */
export type ScenarioChannelFixtures = SharedScenarioChannelFixtures<ScenarioDsl>;
