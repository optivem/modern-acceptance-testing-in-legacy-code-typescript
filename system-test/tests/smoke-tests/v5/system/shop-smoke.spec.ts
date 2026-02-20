/**
 * V5 smoke test: SystemDsl shop; one test per channel (UI/API).
 */
import '../../../../setup-config.js';
import { test, channelAppTest } from '../fixtures.js';
import { ChannelType } from '@optivem/core/shop/ChannelType.js';

test.describe('V5 Shop Smoke Tests', () => {
    channelAppTest(
        [ChannelType.UI, ChannelType.API],
        'should be able to go to shop',
        async ({ app }) => {
            (await app.shop().goToShop()
                .execute())
                .shouldSucceed();
        }
    );
});
