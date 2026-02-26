/**
 * V7 acceptance: browse coupons (positive). Migrated from Java BrowseCouponsPositiveTest.
 */
import '../../../../setup-config.js';
import { test, withChannels } from '../base/fixtures.js';
import { ChannelType } from '@optivem/dsl-core/system/shop/ChannelType.js';

withChannels(ChannelType.UI, ChannelType.API)(() => {
    test('should be able to browse coupons', async ({ scenario }) => {
        await scenario
            .when().browseCoupons()
            .then().shouldSucceed();
    });
});
