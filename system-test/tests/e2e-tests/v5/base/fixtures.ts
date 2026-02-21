/**
 * V5 e2e fixtures: app (SystemDsl).
 * Mirrors reference V5 BaseE2eTest (BaseSystemDslTest with REAL mode).
 */
process.env.EXTERNAL_SYSTEM_MODE = process.env.EXTERNAL_SYSTEM_MODE ?? 'REAL';

import { test as base } from '@playwright/test';
import type { SystemDsl } from '@optivem/dsl/system/SystemDsl.js';
import { ChannelContext } from '@optivem/optivem-testing';
import { SystemDslFactory } from '../../../../SystemDslFactory.js';
import { getExternalSystemMode } from '../../../../test.config.js';

export const test = base.extend<{ app: SystemDsl }>({
    app: async ({}, use) => {
        const app = SystemDslFactory.create(getExternalSystemMode());
        await use(app);
        await app.close();
    },
});

export { expect } from '@playwright/test';

export interface AppChannelFixtures {
    app: SystemDsl;
}

export function channelAppTest(
    channelTypes: string[],
    testName: string,
    testFn: (fixtures: AppChannelFixtures) => Promise<void>
): void {
    const channelEnv = process.env.CHANNEL;
    const channelsToRun =
        channelEnv != null && channelEnv !== ''
            ? channelTypes.filter((c) => c === channelEnv)
            : channelTypes;

    for (const channel of channelsToRun) {
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

export function Channel(
    ...channelTypes: string[]
): (testName: string, testFn: (fixtures: AppChannelFixtures) => Promise<void>) => void {
    return (testName: string, testFn: (fixtures: AppChannelFixtures) => Promise<void>) => {
        channelAppTest(channelTypes, testName, testFn);
    };
}
