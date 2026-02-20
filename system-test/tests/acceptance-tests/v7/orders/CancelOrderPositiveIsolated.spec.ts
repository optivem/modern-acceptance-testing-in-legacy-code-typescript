/**
 * V7 acceptance: cancel order (positive, isolated). Migrated from Java CancelOrderPositiveIsolatedTest.
 * Verifies that cancellation is allowed outside the December 31st 22:00–23:00 blackout period.
 * Isolated tests run sequentially (serial mode) to avoid clock state conflicts.
 */
import '../../../../setup-config.js';
import { test, Channel } from '../base/fixtures.js';
import { ChannelType } from '@optivem/core/shop/ChannelType.js';
import { OrderStatus } from '@optivem/core/shop/commons/dtos/orders/OrderStatus.js';

test.describe.configure({ mode: 'serial' });

const times = [
    '2024-12-31T21:59:59Z', // 1 second before blackout period starts
    '2024-12-31T22:30:01Z', // 1 second after blackout period ends
    '2024-12-31T10:00:00Z', // Another time on blackout day but outside blackout period
    '2025-01-01T22:15:00Z', // Another day entirely (same time but different day)
];

test.describe('@isolated', () => {
    for (const time of times) {
        Channel(ChannelType.UI, ChannelType.API)(
            `should be able to cancel order outside of blackout period 31st Dec between 22:00 and 22:30 (${time})`,
            async ({ scenario }) => {
                await scenario
                    .given().clock().withTime(time).and().order().withStatus(OrderStatus.PLACED)
                    .when().cancelOrder()
                    .then().shouldSucceed();
            }
        );
    }
});
