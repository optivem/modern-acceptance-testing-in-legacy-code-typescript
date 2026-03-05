import { test as base } from '@playwright/test';
import type { AppDsl } from '@optivem/dsl-core/app/AppDsl.js';
import { getDefaultExternalSystemMode } from '../driver/configurationLoaderRegistry.js';
import { SystemDslFactory } from '../system/SystemDslFactory.js';

/**
 * Creates a Playwright test object with an `app` (AppDsl) fixture.
 *
 * Usage:
 * ```typescript
 * const test = withApp();
 * test('my test', async ({ app }) => { ... });
 * ```
 */
export function withApp() {
    return base.extend<{ app: AppDsl }>({
        app: async ({}, use) => {
            const app = SystemDslFactory.create(getDefaultExternalSystemMode());
            await use(app);
            await app.close();
        },
    });
}
