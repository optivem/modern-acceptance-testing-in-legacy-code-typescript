/**
 * V7 acceptance: cancel order (positive). Migrated from Java CancelOrderPositiveTest.
 */
import '../../../../setup-config.js';
import { Channel } from '../base/fixtures.js';
import { ChannelType } from '@optivem/core/shop/ChannelType.js';
import { OrderStatus } from '@optivem/core/shop/commons/dtos/orders/OrderStatus.js';

Channel(ChannelType.UI, ChannelType.API)('should have cancelled status when cancelled', async ({ scenario }) => {
    await scenario.given().order().when()
        .cancelOrder().then().shouldSucceed().order()
        .hasStatus(OrderStatus.CANCELLED);
});
