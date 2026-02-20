/**
 * V7 acceptance: browse coupons (positive). Migrated from Java BrowseCouponsPositiveTest.
 */
import '../../../../setup-config.js';
import { Channel } from '../base/fixtures.js';
import { ChannelType } from '@optivem/core/shop/ChannelType.js';

Channel(ChannelType.UI, ChannelType.API)('should be able to browse coupons', async ({ scenario }) => {
    await scenario.when().browseCoupons().then().shouldSucceed();
});
