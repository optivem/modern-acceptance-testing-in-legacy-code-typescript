/**
 * V7 e2e fixtures: app (SystemDsl) and scenario (ScenarioDsl).
 * Uses getExternalSystemMode() so e2e can run against REAL or STUB.
 */
import { bindChannels, bindTestEach } from '@optivem/optivem-testing';
import { ScenarioDsl } from '@optivem/dsl-core/scenario/ScenarioDsl.js';
import type { SystemDsl } from '@optivem/dsl-core/system/SystemDsl.js';
import { withApp, withScenario } from '@optivem/test-infrastructure';

const _test = withScenario(withApp(), (app: SystemDsl) => new ScenarioDsl(app));
type TestEach = ReturnType<typeof bindTestEach>;
const test: typeof _test & { each: TestEach } = Object.assign(_test, { each: bindTestEach(_test) });

const { forChannels } = bindChannels(test);

export { test, forChannels };
export { expect } from '@playwright/test';
