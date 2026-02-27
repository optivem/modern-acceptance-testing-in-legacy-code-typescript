/**
 * V7 acceptance: view order (negative).
 */
import '../../../setup-config.js';
import { test, withChannels } from './base/fixtures.js';
import { ChannelType } from '@optivem/dsl-core/system/shop/ChannelType.js';

const nonExistentOrderCases = [
    { orderNumber: 'NON-EXISTENT-ORDER-99999', message: 'Order NON-EXISTENT-ORDER-99999 does not exist.' },
    { orderNumber: 'NON-EXISTENT-ORDER-88888', message: 'Order NON-EXISTENT-ORDER-88888 does not exist.' },
    { orderNumber: 'NON-EXISTENT-ORDER-77777', message: 'Order NON-EXISTENT-ORDER-77777 does not exist.' },
];

withChannels(ChannelType.UI, ChannelType.API)(() => {
    for (const { orderNumber, message } of nonExistentOrderCases) {
        test(`should not be able to view non-existent order (orderNumber=${orderNumber})`, async ({ scenario }) => {
            await scenario
                .when().viewOrder()
                    .withOrderNumber(orderNumber)
                .then().shouldFail()
                    .errorMessage(message);
        });
    }
});
