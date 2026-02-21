import '../../../setup-config.js';
import { Channel } from './base/fixtures.js';
import { ChannelType } from '@optivem/core/shop/ChannelType.js';

const nonExistentOrderCases = [
    { orderNumber: 'NON-EXISTENT-ORDER-99999', expectedMessage: 'Order NON-EXISTENT-ORDER-99999 does not exist.' },
    { orderNumber: 'NON-EXISTENT-ORDER-88888', expectedMessage: 'Order NON-EXISTENT-ORDER-88888 does not exist.' },
    { orderNumber: 'NON-EXISTENT-ORDER-77777', expectedMessage: 'Order NON-EXISTENT-ORDER-77777 does not exist.' },
];

Channel(ChannelType.UI, ChannelType.API)('should not be able to view non-existent order', async ({ app }) => {
    for (const { orderNumber, expectedMessage } of nonExistentOrderCases) {
        (await app.shop().viewOrder()
            .orderNumber(orderNumber)
            .execute())
            .shouldFail()
            .errorMessage(expectedMessage);
    }
});
