import { test as base } from '@playwright/test';
import type { SystemDsl } from '../../../../../dsl/system/SystemDsl.js';
import { SystemDslFactory } from '../../../SystemDslFactory.js';
import { getExternalSystemMode } from '../../../test.config.js';

/**
 * V7 base fixtures: provides app (SystemDsl). Lifecycle: create app from configuration, tearDown close(app).
 */
export const test = base.extend<{ app: SystemDsl }>({
    app: async ({}, use) => {
        const app = SystemDslFactory.create(getExternalSystemMode());
        await use(app);
        await app.close();
    },
});

export { expect } from '@playwright/test';
