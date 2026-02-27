/**
 * V7 smoke test: shop (UI and API channels).
 * Uses scenario.when().goToShop().then().shouldSucceed().
 */
import '../../../../setup-config.js';
import { Channel } from '../fixtures.js';
import { ChannelType } from '@optivem/dsl-core/system/shop/ChannelType.js';

Channel(ChannelType.UI, ChannelType.API)
('should be able to go to shop', async ({ scenario }) => {
    await scenario
        .when().goToShop()
        .then().shouldSucceed();
});
