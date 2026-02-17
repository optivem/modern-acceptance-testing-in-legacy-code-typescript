/**
 * V7 smoke test: SystemDsl + channel (UI/API).
 * Uses app.shop().goToShop().execute().shouldSucceed() with ChannelContext.
 */
import '../../../../setup-config.js';
import { test } from '../fixtures.js';
import { ChannelContext } from '@optivem/optivem-testing';
import { ChannelType } from '@optivem/core/shop/ChannelType.js';
import { SystemDslFactory } from '../../../../SystemDslFactory.js';
import { getExternalSystemMode } from '../../../../test.config.js';

test.describe('V7 System – Shop', () => {
    for (const channel of [ChannelType.UI, ChannelType.API]) {
        test(`[${channel} Channel] should be able to go to shop`, async () => {
            ChannelContext.set(channel);
            const app = SystemDslFactory.create(getExternalSystemMode());
            try {
                (await app.shop().goToShop().execute()).shouldSucceed();
            } finally {
                ChannelContext.clear();
                await app.close();
            }
        });
    }
});
