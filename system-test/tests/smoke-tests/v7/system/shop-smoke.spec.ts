/**
 * V7 smoke test: scenario + channelTest-style header (like shopChannelTest).
 * Uses scenario.when().goToShop().then().shouldSucceed().
 */
import '../../../../setup-config.js';
import { scenarioChannelTest } from '../fixtures.js';
import { ChannelType } from '@optivem/core/shop/ChannelType.js';
import { getExternalSystemMode } from '../../../../test.config.js';

scenarioChannelTest(getExternalSystemMode(), [ChannelType.UI, ChannelType.API], 'should be able to go to shop', async ({ scenario }) => {
    await scenario.when().goToShop().then().shouldSucceed();
});
