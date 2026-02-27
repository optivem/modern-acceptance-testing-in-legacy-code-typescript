/**
 * V5 e2e fixtures: app (SystemDsl).
 * Mirrors reference V5 BaseE2eTest (BaseSystemDslTest with REAL mode).
 */
process.env.EXTERNAL_SYSTEM_MODE = process.env.EXTERNAL_SYSTEM_MODE ?? 'REAL';

import { createChannelHelpers, createTestEach } from '@optivem/optivem-testing';
import { withApp } from '@optivem/test-infrastructure';

const _test = withApp();
const test = Object.assign(_test, { each: createTestEach(_test) });

const { withChannels } = createChannelHelpers(test);

export { test, withChannels };
export { expect } from '@playwright/test';
