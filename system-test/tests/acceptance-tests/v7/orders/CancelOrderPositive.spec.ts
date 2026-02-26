/**
 * V7 acceptance: cancel order (positive). Migrated from Java CancelOrderPositiveTest.
 */
import '../../../../setup-config.js';
import { test, withChannels } from '../base/fixtures.js';
import { ChannelType } from '@optivem/dsl-core/system/shop/ChannelType.js';
import { OrderStatus } from '@optivem/driver-api/shop/dtos/OrderStatus.js';

withChannels(ChannelType.UI, ChannelType.API)(() => {
    test('should have cancelled status when cancelled', async ({ scenario }) => {
        await scenario
            .given().order()
            .when().cancelOrder()
            .then().shouldSucceed()
            .and().order()
                .hasStatus(OrderStatus.CANCELLED);
    });
});
