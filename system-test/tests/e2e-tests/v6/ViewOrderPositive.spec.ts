/**
 * V6 e2e: view order positive (matches reference ViewOrderPositiveTest).
 */
import '../../../setup-config.js';
import { Channel } from './base/fixtures.js';
import { ChannelType } from '@optivem/core/shop/ChannelType.js';
import { OrderStatus } from '@optivem/core/shop/commons/dtos/orders/OrderStatus.js';

Channel(ChannelType.UI, ChannelType.API)('should view placed order', async ({ scenario }) => {
    await scenario
        .given().product()
            .withSku('DEFAULT-SKU')
            .withUnitPrice(25.0)
        .and().order()
            .withOrderNumber('DEFAULT-ORDER')
            .withSku('DEFAULT-SKU')
            .withCountry('US')
            .withQuantity(4)
        .when().viewOrder()
            .withOrderNumber('DEFAULT-ORDER')
        .then().shouldSucceed()
        .and().order('DEFAULT-ORDER')
            .hasSku('DEFAULT-SKU')
            .hasQuantity(4)
            .hasCountry('US')
            .hasUnitPrice(25.0)
            .hasSubtotalPrice(100.0)
            .hasStatus(OrderStatus.PLACED)
            .hasDiscountRateGreaterThanOrEqualToZero()
            .hasDiscountAmountGreaterThanOrEqualToZero()
            .hasSubtotalPriceGreaterThanZero()
            .hasTaxRateGreaterThanOrEqualToZero()
            .hasTaxAmountGreaterThanOrEqualToZero()
            .hasTotalPriceGreaterThanZero();
});
