/**
 * V6 e2e: place order positive (matches reference PlaceOrderPositiveTest).
 */
import '../../../setup-config.js';
import { Channel } from './base/fixtures.js';
import { ChannelType } from '@optivem/core/shop/ChannelType.js';
import { OrderStatus } from '@optivem/core/shop/commons/dtos/orders/OrderStatus.js';

Channel(ChannelType.UI, ChannelType.API)('should place order with correct subtotal price', async ({ scenario }) => {
    await scenario.given().product().withUnitPrice(20.0).when()
        .placeOrder().withQuantity(5).then().shouldSucceed().order()
        .hasSubtotalPrice(100.0);
});

// TODO: VJ: DELETE THIS
Channel(ChannelType.API)('should place order with correct subtotal price - TEMPORARY', async ({ scenario }) => {
    await scenario.given().product().withUnitPrice(20.0).when()
        .placeOrder().withQuantity(5).then().shouldSucceed().order()
        .hasSubtotalPrice(100.0);
});


const subtotalPriceCases = [
    { unitPrice: '20.00', quantity: '5', subtotalPrice: '100.00' },
    { unitPrice: '10.00', quantity: '3', subtotalPrice: '30.00' },
    { unitPrice: '15.50', quantity: '4', subtotalPrice: '62.00' },
    { unitPrice: '99.99', quantity: '1', subtotalPrice: '99.99' },
];

Channel(ChannelType.UI, ChannelType.API)('should place order with correct subtotal price parameterized', async ({ scenario }) => {
    for (const { unitPrice, quantity, subtotalPrice } of subtotalPriceCases) {
        await scenario.given().product().withUnitPrice(unitPrice).when()
            .placeOrder().withQuantity(quantity).then().shouldSucceed().order()
            .hasSubtotalPrice(subtotalPrice);
    }
});

Channel(ChannelType.UI, ChannelType.API)('should place order', async ({ scenario }) => {
    await scenario.given().product().withUnitPrice(20.0).when()
        .placeOrder().withQuantity(5).then().shouldSucceed().order()
        .hasOrderNumberPrefix('ORD-')
        .hasQuantity(5)
        .hasUnitPrice(20.0)
        .hasSubtotalPrice(100.0)
        .hasStatus(OrderStatus.PLACED)
        .hasDiscountRateGreaterThanOrEqualToZero()
        .hasDiscountAmountGreaterThanOrEqualToZero()
        .hasSubtotalPriceGreaterThanZero()
        .hasTaxRateGreaterThanOrEqualToZero()
        .hasTaxAmountGreaterThanOrEqualToZero()
        .hasTotalPriceGreaterThanZero();
});
