/**
 * V7 acceptance: cancel order (negative). Migrated from Java CancelOrderNegativeTest.
 */
import '../../../../setup-config.js';
import { Channel } from '../base/fixtures.js';
import { ChannelType } from '@optivem/core/shop/ChannelType.js';
import { OrderStatus } from '@optivem/core/shop/commons/dtos/orders/OrderStatus.js';

const nonExistentOrderCases = [
    { orderNumber: 'NON-EXISTENT-ORDER-99999', message: 'Order NON-EXISTENT-ORDER-99999 does not exist.' },
    { orderNumber: 'NON-EXISTENT-ORDER-88888', message: 'Order NON-EXISTENT-ORDER-88888 does not exist.' },
    { orderNumber: 'NON-EXISTENT-ORDER-77777', message: 'Order NON-EXISTENT-ORDER-77777 does not exist.' },
];

Channel(ChannelType.API)('should not cancel non-existent order', async ({ scenario }) => {
    for (const { orderNumber, message } of nonExistentOrderCases) {
        await scenario.when().cancelOrder().withOrderNumber(orderNumber).then()
            .shouldFail()
            .errorMessage(message);
    }
});

Channel(ChannelType.API)('should not cancel already cancelled order', async ({ scenario }) => {
    const whenClause = scenario.given().order().withStatus(OrderStatus.CANCELLED).when();
    await whenClause.cancelOrder().then()
        .shouldFail()
        .errorMessage('Order has already been cancelled');
});

Channel(ChannelType.API)('cannot cancel non-existent order', async ({ scenario }) => {
    await scenario.when().cancelOrder().withOrderNumber('non-existent-order-12345').then()
        .shouldFail()
        .errorMessage('Order non-existent-order-12345 does not exist.');
});
