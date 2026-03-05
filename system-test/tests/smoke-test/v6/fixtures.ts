import { bindChannels, bindTestEach } from '@optivem/optivem-testing';
import { ScenarioDsl } from '@optivem/dsl-core/scenario/ScenarioDsl.js';
import type { AppDsl } from '@optivem/dsl-core/app/AppDsl.js';
import { withApp, withScenario } from '../../../src/index.js';

/**
 * V6 base fixtures: app (AppDsl) and scenario (ScenarioDsl). Shop uses scenario; external uses app.
 */
const _test = withScenario(withApp(), (app: AppDsl) => new ScenarioDsl(app));
const test = Object.assign(_test, { each: bindTestEach(_test) });

const { forChannels } = bindChannels(test);

export { test, forChannels };
export { expect } from '@playwright/test';
