import { test as base } from '@playwright/test';
import type { SystemDsl } from '@optivem/dsl-core/system/SystemDsl.js';
import { SystemDslFactory, getDefaultExternalSystemMode } from '@optivem/test-infrastructure';

export const test = base.extend<{ app: SystemDsl }>({
    app: async ({}, use) => {
        const app = SystemDslFactory.create(getDefaultExternalSystemMode());
        await use(app);
        await app.close();
    },
});

export { expect } from '@playwright/test';
