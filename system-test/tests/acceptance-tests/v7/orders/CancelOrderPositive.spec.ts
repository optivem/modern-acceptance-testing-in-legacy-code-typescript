/**
 * V7 acceptance: cancel order (positive). Migrated from Java CancelOrderPositiveTest.
 */
import '../../../../setup-config.js';
import { Channel } from '../fixtures.js';
import { ChannelType } from '@optivem/core/shop/ChannelType.js';
import { OrderStatus } from '@optivem/core/shop/commons/dtos/orders/OrderStatus.js';

Channel(ChannelType.UI, ChannelType.API)('should have cancelled status when cancelled', async ({ scenario }) => {
    const whenClause = await scenario.given().order().when();
    const success = await whenClause.cancelOrder().then().shouldSucceed();
    const orderVerifier = await success.order();
    orderVerifier.hasStatus(OrderStatus.CANCELLED);
});
