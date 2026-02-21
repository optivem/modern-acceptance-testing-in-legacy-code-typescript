/**
 * V4 e2e: view order negative (driver-level style).
 */
import '../../../setup-config.js';
import { ChannelType } from '@optivem/core/shop/ChannelType.js';
import { channelShopDriverTest, expect } from './base/fixtures.js';

const nonExistentOrderCases = [
    { orderNumber: 'NON-EXISTENT-ORDER-99999', expectedMessage: 'Order NON-EXISTENT-ORDER-99999 does not exist.' },
    { orderNumber: 'NON-EXISTENT-ORDER-88888', expectedMessage: 'Order NON-EXISTENT-ORDER-88888 does not exist.' },
    { orderNumber: 'NON-EXISTENT-ORDER-77777', expectedMessage: 'Order NON-EXISTENT-ORDER-77777 does not exist.' },
];

channelShopDriverTest([ChannelType.UI, ChannelType.API], 'should not be able to view non-existent order', async ({ shopDriver }) => {
    for (const { orderNumber, expectedMessage } of nonExistentOrderCases) {
        const result = await shopDriver.orders().viewOrder(orderNumber);
        expect(result).toBeFailureWith(expectedMessage);
    }
});
