/**
 * V7 smoke test: shop (UI and API channels).
 * Uses scenario.when().goToShop().then().shouldSucceed().
 */
import '../../../../setup-config.js';
import { test, forChannels } from '../fixtures.js';
import { ChannelType } from '@optivem/dsl-core/system/shop/ChannelType.js';

forChannels(ChannelType.UI, ChannelType.API)(() => {
    test('should be able to go to shop', async ({ scenario }) => {
        await scenario
            .when().goToShop()
            .then().shouldSucceed();
    });
});
