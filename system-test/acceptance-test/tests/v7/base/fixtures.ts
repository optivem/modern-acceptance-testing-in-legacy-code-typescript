/**
 * V7 acceptance test fixtures: same as smoke v7 but force STUB external system mode
 * (mirrors Java BaseAcceptanceTest.getFixedExternalSystemMode() = STUB).
 */
process.env.EXTERNAL_SYSTEM_MODE = process.env.EXTERNAL_SYSTEM_MODE ?? 'STUB';

import type { ScenarioDslPort } from '@optivem/dsl-api/scenario/ScenarioDslPort.js';
import { ScenarioDsl } from '@optivem/dsl-core/scenario/ScenarioDsl.js';
import {
    createScenarioChannelFixtures,
} from '@optivem/test-infrastructure';
import type { ScenarioChannelFixtures as SharedScenarioChannelFixtures } from '@optivem/optivem-testing';

const fixtures = createScenarioChannelFixtures<ScenarioDslPort>({
    createScenario: (app) => new ScenarioDsl(app),
    enableTestEachAlias: true,
});

export const {
    test,
    expect,
    scenarioChannelTest,
    Channel,
    withChannels,
    testEach,
} = fixtures;

export type ScenarioChannelFixtures = SharedScenarioChannelFixtures<ScenarioDslPort>;
