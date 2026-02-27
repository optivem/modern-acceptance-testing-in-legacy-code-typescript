/**
 * V7 e2e: place order (positive). Single scenario matching reference v7 e2e.
 * Runs with getExternalSystemMode() (REAL or STUB).
 */
import '../../../setup-config.js';
import { test, withChannels } from './base/fixtures.js';
import { ChannelType } from '@optivem/dsl-core/system/shop/ChannelType.js';

withChannels(ChannelType.UI, ChannelType.API)(() => {
    test('should place order', async ({ scenario }) => {
        await scenario
            .when().placeOrder()
            .then().shouldSucceed();
    });
});
