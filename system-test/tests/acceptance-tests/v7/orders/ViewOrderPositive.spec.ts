/**
 * V7 acceptance: view order (positive). Migrated from Java ViewOrderPositiveTest.
 */
import '../../../../setup-config.js';
import { Channel } from '../fixtures.js';
import { ChannelType } from '@optivem/core/shop/ChannelType.js';

Channel(ChannelType.UI, ChannelType.API)('should be able to view order', async ({ scenario }) => {
    const whenClause = await scenario.given().order().when();
    await whenClause.viewOrder().then().shouldSucceed();
});
