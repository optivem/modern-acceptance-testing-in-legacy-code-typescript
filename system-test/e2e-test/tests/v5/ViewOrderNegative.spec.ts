import '../../../setup-config.js';
import { test, withChannels } from './base/fixtures.js';
import { ChannelType } from '@optivem/dsl-core/system/shop/ChannelType.js';

const nonExistentOrderCases = [
    { orderNumber: 'NON-EXISTENT-ORDER-99999', expectedMessage: 'Order NON-EXISTENT-ORDER-99999 does not exist.' },
    { orderNumber: 'NON-EXISTENT-ORDER-88888', expectedMessage: 'Order NON-EXISTENT-ORDER-88888 does not exist.' },
    { orderNumber: 'NON-EXISTENT-ORDER-77777', expectedMessage: 'Order NON-EXISTENT-ORDER-77777 does not exist.' },
];

withChannels(ChannelType.UI, ChannelType.API)(() => {
    test.each(nonExistentOrderCases)(
        'should not be able to view non-existent order (orderNumber=$orderNumber)',
        async ({ app, orderNumber, expectedMessage }) => {
            (await app.shop().viewOrder()
                .orderNumber(orderNumber)
                .execute())
                .shouldFail()
                .errorMessage(expectedMessage);
        }
    );
});
