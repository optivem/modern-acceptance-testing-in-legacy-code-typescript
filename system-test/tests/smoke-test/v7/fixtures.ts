import { bindChannels, bindTestEach } from '@optivem/optivem-testing';
import { ScenarioDsl } from '@optivem/dsl-core/scenario/ScenarioDsl.js';
import type { AppDsl } from '@optivem/dsl-core/app/AppDsl.js';
import { withApp, withScenario } from '../../../src/index.js';

/**
 * V7 base fixtures: provides app (AppDsl) and scenario (ScenarioDsl).
 * Lifecycle: create app from configuration, scenario = new ScenarioDsl(app); tearDown close(app).
 */
const _test = withScenario(withApp(), (app: AppDsl) => new ScenarioDsl(app));
const test = Object.assign(_test, { each: bindTestEach(_test) });

const { forChannels } = bindChannels(test);

export { test, forChannels };
export { expect } from '@playwright/test';
