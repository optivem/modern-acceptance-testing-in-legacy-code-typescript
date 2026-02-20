/**
 * V7 acceptance: cancel order (negative, isolated). Migrated from Java CancelOrderNegativeIsolatedTest.
 * Verifies that cancellation is blocked during the December 31st 22:00–23:00 blackout period.
 * Isolated tests run sequentially (serial mode) to avoid clock state conflicts.
 */
import '../../../../setup-config.js';
import { test, Channel } from '../base/fixtures.js';
import { ChannelType } from '@optivem/core/shop/ChannelType.js';
import { OrderStatus } from '@optivem/core/shop/commons/dtos/orders/OrderStatus.js';

test.describe.configure({ mode: 'serial' });

const times = [
    '2024-12-31T22:00:00Z', // Start of blackout period
    '2026-12-31T22:00:01Z', // Just after start
    '2025-12-31T22:15:00Z', // Middle of blackout period
    '2028-12-31T22:29:59Z', // Just before end
    '2021-12-31T22:30:00Z', // End of blackout period
];

const BLACKOUT_ERROR = 'Order cancellation is not allowed on December 31st between 22:00 and 23:00';

test.describe('@isolated', () => {
    for (const time of times) {
        Channel(ChannelType.UI, ChannelType.API)(
            `cannot cancel an order on 31st Dec between 22:00 and 22:30 (${time})`,
            async ({ scenario }) => {
                await scenario
                    .given().clock()
                        .withTime(time)
                        .and().order()
                        .withStatus(OrderStatus.PLACED)
                    .when().cancelOrder()
                    .then().shouldFail()
                        .errorMessage(BLACKOUT_ERROR)
                        .and().order()
                        .hasStatus(OrderStatus.PLACED);
            }
        );
    }
});
