import { bindChannels, bindTestEach } from '@optivem/optivem-testing';
import { ScenarioDsl } from '@optivem/dsl-core/scenario/ScenarioDsl.js';
import type { SystemDsl } from '@optivem/dsl-core/system/SystemDsl.js';
import { withApp, withScenario } from '@optivem/test-infrastructure';

/**
 * V6 base fixtures: app (SystemDsl) and scenario (ScenarioDsl). Shop uses scenario; external uses app.
 */
const _test = withScenario(withApp(), (app: SystemDsl) => new ScenarioDsl(app));
const test = Object.assign(_test, { each: bindTestEach(_test) });

const { forChannels } = bindChannels(test);

export { test, forChannels };
export { expect } from '@playwright/test';
