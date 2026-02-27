/**
 * V7 acceptance: cancel order (positive).
 */
import '../../../setup-config.js';
import { test, forChannels } from './base/fixtures.js';
import { ChannelType } from '@optivem/dsl-core/system/shop/ChannelType.js';
import { OrderStatus } from '@optivem/driver-api/shop/dtos/OrderStatus.js';

forChannels(ChannelType.UI, ChannelType.API)(() => {
    test('should have cancelled status when cancelled', async ({ scenario }) => {
        await scenario
            .given().order()
            .when().cancelOrder()
            .then().shouldSucceed()
            .and().order()
                .hasStatus(OrderStatus.CANCELLED);
    });
});
