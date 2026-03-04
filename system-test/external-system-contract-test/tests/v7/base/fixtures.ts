import { ScenarioDsl } from '@optivem/dsl-core/scenario/ScenarioDsl.js';
import type { AppDsl } from '@optivem/dsl-core/app/AppDsl.js';
import { withApp, withScenario } from '@optivem/test-infrastructure';

export const test = withScenario(withApp(), (app: AppDsl) => new ScenarioDsl(app));

export { expect } from '@playwright/test';
