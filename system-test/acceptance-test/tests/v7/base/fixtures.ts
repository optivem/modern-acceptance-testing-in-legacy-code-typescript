/**
 * V7 acceptance test fixtures: same as smoke v7 but force STUB external system mode.
 */
process.env.EXTERNAL_SYSTEM_MODE = process.env.EXTERNAL_SYSTEM_MODE ?? 'STUB';

import type { ScenarioDslPort } from '@optivem/dsl-api/scenario/ScenarioDslPort.js';
import { ScenarioDsl } from '@optivem/dsl-core/scenario/ScenarioDsl.js';
import {
    createScenarioChannelFixtures,
} from '@optivem/test-infrastructure';
import type { ScenarioChannelFixtures as SharedScenarioChannelFixtures } from '@optivem/test-infrastructure';

const fixtures = createScenarioChannelFixtures<ScenarioDslPort>({
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

export type ScenarioChannelFixtures = SharedScenarioChannelFixtures<ScenarioDslPort>;
