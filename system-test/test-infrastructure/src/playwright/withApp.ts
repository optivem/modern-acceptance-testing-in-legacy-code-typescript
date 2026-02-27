import { test as base } from '@playwright/test';
import type { SystemDsl } from '@optivem/dsl-core/system/SystemDsl.js';
import { getDefaultExternalSystemMode } from '../driver/configurationLoaderRegistry.js';
import { SystemDslFactory } from '../system/SystemDslFactory.js';

/**
 * Creates a Playwright test object with an `app` (SystemDsl) fixture.
 *
 * Usage:
 * ```typescript
 * const test = withApp();
 * test('my test', async ({ app }) => { ... });
 * ```
 */
export function withApp() {
    return base.extend<{ app: SystemDsl }>({
        app: async ({}, use) => {
            const app = SystemDslFactory.create(getDefaultExternalSystemMode());
            await use(app);
            await app.close();
        },
    });
}
