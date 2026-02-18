/**
 * V7 acceptance: view order (negative). Migrated from Java ViewOrderNegativeTest.
 */
import '../../../../setup-config.js';
import { Channel } from '../fixtures.js';
import { ChannelType } from '@optivem/core/shop/ChannelType.js';

const nonExistentOrderCases = [
    { orderNumber: 'NON-EXISTENT-ORDER-99999', message: 'Order NON-EXISTENT-ORDER-99999 does not exist.' },
    { orderNumber: 'NON-EXISTENT-ORDER-88888', message: 'Order NON-EXISTENT-ORDER-88888 does not exist.' },
    { orderNumber: 'NON-EXISTENT-ORDER-77777', message: 'Order NON-EXISTENT-ORDER-77777 does not exist.' },
];

Channel(ChannelType.UI, ChannelType.API)('should not be able to view non-existent order', async ({ scenario }) => {
    for (const { orderNumber, message } of nonExistentOrderCases) {
        const failure = await (await scenario.when().viewOrder()).withOrderNumber(orderNumber).then().shouldFail();
        failure.errorMessage(message);
    }
});
