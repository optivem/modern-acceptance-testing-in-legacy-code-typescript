import { test as base } from '@playwright/test';
import type { SystemDsl } from '@optivem/dsl/system/SystemDsl.js';
import { ChannelContext } from '@optivem/optivem-testing';
import { SystemDslFactory } from '../../../SystemDslFactory.js';
import { getExternalSystemMode } from '../../../test.config.js';

/**
 * V5 base fixtures: provides app (SystemDsl). Same app as V7 but tests use app.shop()/erp()/tax()/clock() directly.
 */
export const test = base.extend<{ app: SystemDsl }>({
    app: async ({}, use) => {
        const app = SystemDslFactory.create(getExternalSystemMode());
        await use(app);
        await app.close();
    },
});

export { expect } from '@playwright/test';

export interface V5AppFixtures {
    app: SystemDsl;
}

/**
 * Run the same app-based test for each channel (UI/API). Sets ChannelContext before the test.
 */
export function channelAppTest(
    channelTypes: string[],
    testName: string,
    testFn: (fixtures: V5AppFixtures) => Promise<void>
): void {
    for (const channel of channelTypes) {
        test(`[${channel} Channel] ${testName}`, async ({ app }) => {
            try {
                ChannelContext.set(channel);
                await testFn({ app });
            } finally {
                ChannelContext.clear();
            }
        });
    }
}
