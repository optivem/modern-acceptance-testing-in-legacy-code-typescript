/**
 * V7 acceptance: view order (positive).
 */
import '../../../setup-config.js';
import { test, withChannels } from './base/fixtures.js';
import { ChannelType } from '@optivem/dsl-core/system/shop/ChannelType.js';

withChannels(ChannelType.UI, ChannelType.API)(() => {
    test('should be able to view order', async ({ scenario }) => {
        await scenario
            .given().order()
            .when().viewOrder()
            .then().shouldSucceed();
    });
});
