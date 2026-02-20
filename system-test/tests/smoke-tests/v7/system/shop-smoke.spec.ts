/**
 * V7 smoke test: Channel(UI, API) mirrors Java's @Channel({ChannelType.UI, ChannelType.API}).
 * Uses scenario.when().goToShop().then().shouldSucceed().
 */
import '../../../../setup-config.js';
import { Channel } from '../fixtures.js';
import { ChannelType } from '@optivem/core/shop/ChannelType.js';

Channel(ChannelType.UI, ChannelType.API)
('should be able to go to shop', async ({ scenario }) => {
    await scenario
        .when().goToShop()
        .then().shouldSucceed();
});
