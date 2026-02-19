/**
 * V6 e2e: view order negative (matches reference ViewOrderNegativeTest).
 */
import '../../../setup-config.js';
import { Channel } from './fixtures.js';
import { ChannelType } from '@optivem/core/shop/ChannelType.js';

const nonExistentOrderCases = [
    { orderNumber: 'NON-EXISTENT-ORDER-99999', expectedMessage: 'Order NON-EXISTENT-ORDER-99999 does not exist.' },
    { orderNumber: 'NON-EXISTENT-ORDER-88888', expectedMessage: 'Order NON-EXISTENT-ORDER-88888 does not exist.' },
    { orderNumber: 'NON-EXISTENT-ORDER-77777', expectedMessage: 'Order NON-EXISTENT-ORDER-77777 does not exist.' },
];

Channel(ChannelType.UI, ChannelType.API)('should not be able to view non-existent order', async ({ scenario }) => {
    for (const { orderNumber, expectedMessage } of nonExistentOrderCases) {
        const failure = await (await scenario.when().viewOrder()).withOrderNumber(orderNumber).then().shouldFail();
        failure.errorMessage(expectedMessage);
    }
});
