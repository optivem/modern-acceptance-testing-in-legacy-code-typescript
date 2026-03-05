import { bindChannels } from '@optivem/optivem-testing';
import { withApp } from '../../../src/index.js';

/**
 * V5 base fixtures: provides app (AppDsl). Same app as V7 but tests use app.shop()/erp()/tax()/clock() directly.
 */
const test = withApp();

const { forChannels } = bindChannels(test);

export { test, forChannels };
export { expect } from '@playwright/test';
