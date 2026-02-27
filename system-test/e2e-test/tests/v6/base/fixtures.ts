/**
 * V6 e2e fixtures: app (SystemDsl) and scenario (ScenarioDsl).
 * Uses getExternalSystemMode() so e2e can run against REAL or STUB.
 */
import { ScenarioDsl } from '@optivem/dsl-core/scenario/ScenarioDsl.js';
import {
    createScenarioChannelFixtures,
} from '@optivem/test-infrastructure';
import type { ScenarioChannelFixtures as SharedScenarioChannelFixtures } from '@optivem/optivem-testing';

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
