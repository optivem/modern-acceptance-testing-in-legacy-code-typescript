/**
 * V7 smoke test: ScenarioDsl + channel (UI/API).
 * Uses scenario.when().goToShop().then().shouldSucceed() (async, like .NET).
 */
import '../../../../setup-config.js';
import { test } from '../fixtures.js';
import { ChannelContext } from '@optivem/optivem-testing';
import { ChannelType } from '@optivem/core/shop/ChannelType.js';

test.describe('V7 System – Shop', () => {
    for (const channel of [ChannelType.UI, ChannelType.API]) {
        test(`[${channel} Channel] should be able to go to shop`, async ({ scenario }) => {
            ChannelContext.set(channel);
            try {
                (await scenario.when().goToShop().then()).shouldSucceed();
            } finally {
                ChannelContext.clear();
            }
        });
    }
});
