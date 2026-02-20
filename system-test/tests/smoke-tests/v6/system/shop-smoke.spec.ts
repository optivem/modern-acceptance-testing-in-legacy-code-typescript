/**
 * V6 smoke test: scenario-based shop (BaseScenarioDslTest); one test per channel.
 */
import '../../../../setup-config.js';
import { Channel } from '../fixtures.js';
import { ChannelType } from '@optivem/core/shop/ChannelType.js';

Channel(ChannelType.UI, ChannelType.API)('should be able to go to shop', async ({ scenario }) => {
    await scenario
        .when().goToShop()
        .then().shouldSucceed();
});
