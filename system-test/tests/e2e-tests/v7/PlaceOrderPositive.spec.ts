/**
 * V7 e2e: place order (positive). Single scenario matching reference v7 e2e.
 * Runs with getExternalSystemMode() (REAL or STUB).
 */
import '../../../setup-config.js';
import { Channel } from './base/fixtures.js';
import { ChannelType } from '@optivem/core/shop/ChannelType.js';

Channel(ChannelType.UI, ChannelType.API)('should place order', async ({ scenario }) => {
    await scenario.when().placeOrder().then().shouldSucceed();
});
